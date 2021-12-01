exports.catchErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

exports.mongoseErrors = (err, req, res, next) => {
  if (!err.errors) return next(err)
  const errorKeys = Object.keys(err.errors)
  let message = ''
  errorKeys.forEach((key) => (message += err.errors[key].message + ', '))

  message = message.substr(0, message.length - 2)

  res.status(400).json({
    message,
  })
}

exports.developmentErrors = (err, req, res, next) => {
  // err.stack = err.stack || ''
  const error = {
    status: err.status || 500,
    message: err.message,
    // stack: err.stack,
  }

  res.status(err.status || 500).json(error)
}

exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: 'Internal Server Error',
  })
}

exports.notFound = (req, res, next) => {
  const err = new Error('404 Not Found')
  err.status = 404
  next(err)
}
