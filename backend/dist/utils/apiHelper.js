"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePagedRequest = void 0;
const handlePagedRequest = async (res, model, query, searchFields, populateFields = [], customFilter = {}) => {
    try {
        const page = parseInt(query.page || '1', 10);
        const limit = parseInt(query.limit || '25', 10);
        const search = query.search || '';
        const sortBy = query.sortBy || 'createdAt';
        const order = query.order === 'asc' ? 1 : -1;
        const isActiveFilter = query.isActive;
        const filter = { ...customFilter };
        if (isActiveFilter === 'true') {
            filter.isActive = true;
        }
        else if (isActiveFilter === 'false') {
            filter.isActive = false;
        }
        if (search && searchFields.length > 0) {
            filter.$or = searchFields.map((field) => ({
                [field]: { $regex: search, $options: 'i' }
            }));
        }
        const total = await model.countDocuments(filter);
        let dbQuery = model.find(filter)
            .sort({ [sortBy]: order })
            .skip((page - 1) * limit)
            .limit(limit);
        if (populateFields.length > 0) {
            populateFields.forEach((field) => {
                dbQuery = dbQuery.populate(field);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error',
            data: null,
            meta: null
        });
    }
};
exports.handlePagedRequest = handlePagedRequest;
