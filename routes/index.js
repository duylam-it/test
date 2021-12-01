const errorHandlers = require('../handlers/errorHandlers')

function routes(app) {
  app.use('/room', require('./room'))
  app.use('/otp', require('./otp'))
  app.use('/user', require('./user'))
  app.use('/', require('./site'))

  // Setup Error Handlers
  app.use(errorHandlers.notFound)
  app.use(errorHandlers.mongoseErrors)
  if (process.env.ENV === 'DEVELOPMENT') {
    app.use(errorHandlers.developmentErrors)
  } else {
    app.use(errorHandlers.productionErrors)
  }
}

module.exports = routes
