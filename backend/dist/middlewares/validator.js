"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((err) => `${err.path.join('.')} is invalid: ${err.message}`).join(', ');
                res.status(400).json({
                    success: false,
                    message: `Validation Error: ${errorMessages}`,
                    data: null,
                    meta: null
                });
                return;
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
