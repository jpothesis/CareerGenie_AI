// User authentication controller for signup and login
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// allowed email domain
const allowedDomain = 'igdtuw.ac.in';

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const emailDomain = email.split('@')[1];
    if (emailDomain !== allowedDomain) {
      return res.status(403).json({ msg: `Only @${allowedDomain} emails are allowed to sign up` });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already registered' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ msg: 'Signup failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const emailDomain = email.split('@')[1];
    if (emailDomain !== allowedDomain) {
      return res.status(403).json({ msg: `Only @${allowedDomain} emails are allowed to login` });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' });

    const token = generateToken(user);
    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};