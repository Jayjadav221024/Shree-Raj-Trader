import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser';
import RolePermission from '../models/RolePermission';
import MenuMaster from '../models/MenuMaster';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    roleId: string;
    roleName: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.', data: null, meta: null });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string; roleId: string };
    
    const user = await AdminUser.findById(decoded.id).populate('roleId');
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User is inactive or does not exist.', data: null, meta: null });
      return;
    }

    const role = user.roleId as any;
    if (!role || !role.isActive) {
      res.status(401).json({ success: false, message: 'User role is inactive or does not exist.', data: null, meta: null });
      return;
    }

    req.user = {
      id: user.id,
      roleId: role.id,
      roleName: role.name
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.', data: null, meta: null });
  }
};

export const checkPermission = (menuRoute: string, action: 'canView' | 'canCreate' | 'canEdit' | 'canDelete') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized.', data: null, meta: null });
        return;
      }

      if (req.user.roleName === 'Super Admin') {
        next();
        return;
      }

      const menu = await MenuMaster.findOne({ route: menuRoute, isActive: true });
      if (!menu) {
        res.status(403).json({ success: false, message: 'Access Denied: Menu item not found.', data: null, meta: null });
        return;
      }

      const rolePerm = await RolePermission.findOne({
        roleId: req.user.roleId,
        'permissions.menuId': menu._id
      });

      if (!rolePerm) {
        res.status(403).json({ success: false, message: 'Access Denied: No permission assigned.', data: null, meta: null });
        return;
      }

      const userPermission = rolePerm.permissions.find(
        (p) => p.menuId.toString() === menu._id.toString()
      );

      if (!userPermission || !userPermission[action]) {
        res.status(403).json({ success: false, message: `Access Denied: You do not have permission to perform this action.`, data: null, meta: null });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
