const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: 'String', required: 'Message is required!' },
    seen: { type: 'Array', default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Message', messageSchema)
