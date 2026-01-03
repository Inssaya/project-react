import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import supabase from '../config/supabase.js';

/**
 * Auth middleware verifies JWT and attaches user to request.
 */
export const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      const err = new Error('Authorization token missing');
      err.status = 401;
      throw err;
    }
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, env.JWT_SECRET);

    // Fetch user from Supabase to ensure still active
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.sub)
      .limit(1)
      .single();
    if (error || !data) {
      const err = new Error('User not found');
      err.status = 401;
      throw err;
    }

    req.user = data;
    next();
  } catch (err) {
    return next(err);
  }
};

export default authenticate;
