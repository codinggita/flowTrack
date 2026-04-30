export const validate = (schema, prop = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[prop], { abortEarly:false, stripUnknown:true });
  if (error) return res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors:  error.details.map(d => d.message.replace(/['"]/g,'')),
  });
  req[prop] = value;
  next();
};
