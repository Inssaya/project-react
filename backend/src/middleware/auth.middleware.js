import { supabase } from '../config/supabaseClient.js'

export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const { data, error } = await supabase.auth.getUser(token)

  if (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  req.user = data.user
  next()
}
