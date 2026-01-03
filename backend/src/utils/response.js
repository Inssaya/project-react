/**
 * Standard API response helpers
 */
export const success = (res, data = null, message = 'OK', status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

export const error = (res, message = 'Error', status = 500, details = null) => {
  return res.status(status).json({ success: false, message, details });
};

export default { success, error };
export const successResponse = (res, data, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = 'Error', status = 400) => {
  res.status(status).json({
    success: false,
    message,
  });
};
