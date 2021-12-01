const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const app = require('./app')

const PORT = Number(process.env.PORT) || 8000
const server = app.listen(PORT)

// ==========================================================================================================================
const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

io.use((socket, next) => {
  try {
    const token = socket.handshake.query.token
    const payload = jwt.verify(token, process.env.SECRET)
    socket.userId = payload._id
    next()
  } catch (err) {}
})

const ioController = require('./controllers/ioController')(io)

const onConnection = (socket) => {
  // eslint-disable-next-line no-console
  console.log('Connected:', socket.userId)

  // Join Room
  ioController.userData(socket.userId).then((user) => {
    user.rooms.forEach((room) => socket.join(room._id.toString()))
  })

  // Emit
  ioController.userData(socket.userId).then((user) => {
    socket.emit('server: sentUserData', user)
  })

  // On
  socket.on('disconnect', ioController.disconnect)
  socket.on('client: getRoom', ioController.getRoom)
  socket.on('client: sendMessage', ioController.sendMessage)
}

io.on('connection', onConnection)
