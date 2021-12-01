const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { checkOTP } = require('./otpController')

exports.index = async (req, res) => {
  const user = await User.findOne({ _id: req.payload._id });
  const { password, ...data } = await user.toJSON();
  res.json(data);
}

exports.register = async (req, res) => {
  const { email, name, birthday, gender, password } = req.body

  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/

  if (!emailRegex.test(email))
    throw new Error('Email is not supported from your domain.')

  if (password.length < 6)
    throw new Error('Password must be atleast 6 characters long.')

  const userExists = await User.findOne({ email })

  if (userExists) throw new Error('User with same email already exits.')

  await checkOTP(req, res);

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const user = new User({
    name,
    email,
    birthday,
    gender,
    password: hashedPassword,
  })

  const result = await user.save()

  const token = jwt.sign({ _id: result._id }, process.env.SECRET)

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
  })

  res.json({ message: 'User [' + name + '] registered successfully!' })
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) throw new Error('Email did not match.')

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error('Incorrect password!')
  }

  const token = jwt.sign({ _id: user._id }, process.env.SECRET)

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
  })

  res.json({ message: 'User logged in successfully!' })
}

exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 })
  res.json({ message: 'User logged out successfully' })
}
