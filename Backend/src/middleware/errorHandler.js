export const errorHandler = (err, req, res, next) => {
  console.error('❌', err.message);
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success:false, message:`${field} already exists` });
  }
  if (err.name === 'ValidationError')
    return res.status(422).json({ success:false, message: Object.values(err.errors).map(e=>e.message).join(', ') });
  if (err.name === 'CastError')
    return res.status(400).json({ success:false, message:'Invalid ID format' });
  res.status(err.statusCode || 500).json({ success:false, message: err.message || 'Internal server error' });
};
