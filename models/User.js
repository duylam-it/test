const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema(
  {
    name: { type: 'String', required: 'Name is required!' },
    email: { type: String, required: 'Email is required!' },
    birthday: { type: String, required: 'Birthday is required!' },
    gender: { type: String, required: 'Gender is required!' },
    password: { type: String, required: 'Password is required!' },
    picURL: {
      type: String,
      default:
        'https://scontent.fvca1-4.fna.fbcdn.net/v/t39.30808-6/248544582_556494242104137_53162130235150270_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=825194&_nc_ohc=fFlS5J_t9BgAX82IZDa&tn=2_4-5-1awGD-68GI&_nc_ht=scontent.fvca1-4.fna&oh=6b7094bd88f0d901c142d0b1fa970218&oe=61A5E9A4',
    },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
