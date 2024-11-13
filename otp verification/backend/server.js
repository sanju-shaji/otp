const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://sanju:Abc1234@cluster0.g9obo.mongodb.net/otpdb?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// OTP Schema
const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 }, // OTP expires in 5 minutes
});

const Otp = mongoose.model('otp', otpSchema);

// Email transport configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ictotptest@gmail.com',
    pass: 'gueh zkfu phlo xomb',
  },
});

// Endpoint to send OTP
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();

  // Save OTP to DB
  await Otp.create({ email, otp });

  // Send OTP email
  try {
    await transporter.sendMail({
      from: 'ictotptest@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    });
    res.json({ success: true });
  } catch (error) {
    console.log('Error sending email:', error);
    res.json({ success: false, error: error.message });
  }
});

// Endpoint to verify OTP
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const validOtp = await Otp.findOne({ email, otp });

  if (validOtp) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
