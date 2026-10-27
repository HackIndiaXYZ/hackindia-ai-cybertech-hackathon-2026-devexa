import { ApiError } from '../utils/ApiError.js';

const run = (schema, source, target) => (req, res, next) => {
  const r = schema.safeParse(req[source]);
  if (!r.success) {
    const details = r.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    return next(new ApiError(400, 'VALIDATION_ERROR', details[0]?.message || 'Invalid request.', details));
  }
  req[target] = r.data;
  next();
};

export const validateBody = (schema) => run(schema, 'body', 'body');
export const validateQuery = (schema) => run(schema, 'query', 'validatedQuery');
