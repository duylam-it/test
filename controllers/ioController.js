/* eslint-disable no-console */
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Room = mongoose.model('Room')
const Message = mongoose.model('Message')

module.exports = (io) => {
  const disconnect = function (payload) {
    const socket = this
    console.log('Disconnected:', socket.userId)
  }

  const userData = async function (payload) {
    const user = await User.findById(payload).populate('rooms')
    const { password, ...data } = await user.toJSON()
    return data
  }

  async function _getRoom(_id) {
    const room = await Room.findById(_id)
      .populate('messages')
      .populate({
        path: 'messages',
        populate: { path: 'uid', select: 'picURL' },
      })

    return room
  }

  const getRoom = async function (payload) {
    const socket = this
    const room = await _getRoom(payload)
    socket.emit('server: sentRoom', room)
  }

  const sendMessage = async function (payload) {
    const { _id, uid, message } = payload
    let room = await Room.findById(_id)

    if (room) {
      const _message = new Message({
        uid,
        message,
      })

      const result = await _message.save()

      room.messages.push(result._id)

      await room.save()

      room = await _getRoom(_id)

      io.in(_id).emit('server: sentRoom', room)
    }
  }

  return {
    disconnect,
    userData,
    getRoom,
    sendMessage,
  }
}
