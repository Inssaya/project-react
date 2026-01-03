
/**
 * Role-based access control middleware factory.
 * Usage: allowRoles('admin','teacher')
 */
export const allowRoles = (...allowed) => (req, res, next) => {
  const user = req.user;
  if (!user) {
    const err = new Error('Unauthorized');
    err.status = 401;
    return next(err);
  }
  if (!allowed.includes(user.role)) {
    const err = new Error('Forbidden: insufficient role');
    err.status = 403;
    return next(err);
  }
  return next();
};

export default allowRoles;
