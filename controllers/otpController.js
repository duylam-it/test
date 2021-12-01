const mongoose = require('mongoose');
const Otp = mongoose.model('Otp');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { random } = require('../utils/random');
const OAuth2 = google.auth.OAuth2;

const clientId = "398558364461-hkh4b2dg420gfdtf1lfchvu0kugsmsbu.apps.googleusercontent.com";
const clientSecret = "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";
const refreshToken = "1//04xAP4EJckfx5CgYIARAAGAQSNwF-L9IrbbMIJF4K-L_s5R2cN6HfE_Jqp_W73liU5mcvWuYk3HczSeH37MeXOZzs9gIwuNzb4mc";

const OAuth2Client = new OAuth2(clientId, clientSecret);
OAuth2Client.setCredentials({refresh_token: refreshToken});

async function setOtp(email) {
  await Otp.findOneAndDelete({email})
  const otp = new Otp({
    email,
    code: random(999999)
  });

  await otp.save();

  return otp.code;
}

exports.sendOTP = async (req, res) => {
  const accessToken = OAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: 'OAuth2',
      user: "dl.duylam.2000@gmail.com",
      clientId,
      clientSecret,
      refreshToken,
      accessToken
    }
  });

  const otp = await setOtp(req.body.email);

  const options = {
    from: "GCHAT <dl.duylam.2000@gmail.com>",
    to: req.body.email,
    subject: "OTP GCHAT",
    text: "Mã OTP của bạn là: " + otp + "\n***Lưu ý: Trong trường hợp bạn nhận được nhiều mã OTP hãy chọn mã OTP gần nhất."
  };

  transporter.sendMail(options, (err, info) => {
    if(err){
      res.json(err)
    } else {
      res.json(info)
    }
    transporter.close()
  })
}

exports.checkOTP = async (req, res) => {
  const { email, code } = req.body
  const find = await Otp.findOneAndDelete({email, code})

  if(!find) throw new Error('Wrong code!!!');

  return find
}
