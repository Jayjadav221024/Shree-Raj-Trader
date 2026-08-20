import { Response } from 'express';
import { Model, Document, FilterQuery } from 'mongoose';

export interface QueryContract {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  isActive?: string;
}

export const handlePagedRequest = async <T extends Document>(
  res: Response,
  model: Model<T>,
  query: QueryContract,
  searchFields: string[],
  populateFields: string[] = [],
  customFilter: FilterQuery<T> = {}
) => {
  try {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '25', 10);
    const search = query.search || '';
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order === 'asc' ? 1 : -1;
    const isActiveFilter = query.isActive;

    const filter: FilterQuery<T> = { ...customFilter };

    if (isActiveFilter === 'true') {
      (filter as any).isActive = true;
    } else if (isActiveFilter === 'false') {
      (filter as any).isActive = false;
    }

    if (search && searchFields.length > 0) {
      filter.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' }
      })) as any;
    }

    const total = await model.countDocuments(filter);
    
    let dbQuery = model.find(filter)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    if (populateFields.length > 0) {
      populateFields.forEach((field) => {
        dbQuery = dbQuery.populate(field) as any;
      });
    }

    const data = await dbQuery.exec();

    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data,
      meta: {
        page,
        limit,
        total
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
      data: null,
      meta: null
    });
  }
};
