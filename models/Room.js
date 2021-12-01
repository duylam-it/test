const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
  {
    name: { type: 'String', required: 'Name is required!' },
    picURL: { type: 'String', required: 'Pic URL is required!' },
    published: { type: 'Boolean', default: false },
    type: { type: 'String', default: 'single' },
    users: { type: 'Object', required: 'Users is required!' },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Room', roomSchema)
