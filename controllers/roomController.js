const validUrl = require('valid-url')
const mongoose = require('mongoose')
const Room = mongoose.model('Room')
const Message = mongoose.model('Message')

exports.create = async (req, res) => {
  const { name, picURL, type, users } = req.body

  const nameRegex = /^[A-Za-z\s]+$/
  if (!nameRegex.test(name))
    throw new Error('Chatroom name can contain only alphabets.')

  if (!validUrl.isUri(picURL)) throw new Error('Invalid URL!')

  const room = new Room({
    name,
    picURL,
    type,
    users,
  })

  await room.save()

  res.json({ message: 'Create a successful room!' })
}

exports.read = async (req, res) => {
  const { _id } = req.body

  const room = await Room.findById(_id).populate('messages')
  if (!room) throw new Error('Room does not exist!')

  res.json(room)
}

exports.updateName = async (req, res) => {
  const { _id, name } = req.body

  const room = await Room.findById(_id)
  if (!room) throw new Error('Room does not exist!')

  const nameRegex = /^[A-Za-z\s]+$/
  if (!nameRegex.test(name))
    throw new Error('Chatroom name can contain only alphabets.')

  room.name = name
  await room.save()

  res.json({ message: 'Name has been updated successfully!' })
}

exports.updatePicURL = async (req, res) => {
  const { _id, picURL } = req.body

  const room = await Room.findById(_id)
  if (!room) throw new Error('Room does not exist!')

  if (!validUrl.isUri(picURL)) throw new Error('Invalid URL!')

  room.picURL = picURL
  await room.save()

  res.json({ message: 'PicURL has been updated successfully!' })
}

exports.addUser = async (req, res) => {
  const { _id, user } = req.body

  const room = await Room.findById(_id)
  if (!room) throw new Error('Room does not exist!')

  room.users.push(user)
  await room.save()

  res.json({ message: 'User added successfully!' })
}

exports.removeUser = async (req, res) => {
  const { _id, user } = req.body

  const room = await Room.findById(_id)
  if (!room) throw new Error('Room does not exist!')

  room.users = room.users.filter((item) => item !== user)
  await room.save()

  res.json({ message: 'User deleted successfully!' })
}

exports.addMessage = async (req, res) => {
  const { _id, uid, message } = req.body
  const room = await Room.findById(_id)

  if (!room) throw new Error('Room does not exist!')

  const _message = new Message({
    uid,
    message,
  })

  const result = await _message.save()

  room.messages.push(result._id)

  room.save()

  res.json({ message: 'Message added successfully!' })
}

exports.removeMessage = async (req, res) => {
  const { _id, _idMessage } = req.body;

  const room = await Room.findById(_id)
  if (!room) throw new Error('Room does not exist!')

  const message = Message.findById(_idMessage);
  if(!message) throw new Error('Message does not exist!')

  room.messages = room.messages.filter((item) => item !== _idMessage)
  await room.save()
  await message.delete()

  res.json({ message: 'Message deleted successfully!' })
}

exports.delete = async (req, res) => {
  const { _id } = req.body
  const room = await Room.findById(_id)

  if (!room) throw new Error('Room does not exist!')
  else room.delete()

  res.json({ message: 'Delete a successful room!' })
}
