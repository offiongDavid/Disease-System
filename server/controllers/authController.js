import bcrypt from 'bcrypt';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';

// ======================================
// REGISTER USER
// ======================================

export const registerUser = async (req, res) => {
  try {
    // Get Data From Request Body
    const { name, email, password } = req.body || {};

    // Validate Inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // // Generate 6-Digit Verification Code
    // const verificationCode = Math.floor(
    //   100000 + Math.random() * 900000
    // ).toString();

    // Create New User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // try {
    //   await sendEmail(email, verificationCode);
    // } catch (err) {
    //   console.log(err);
    // }

    res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    console.log('REGISTER ERROR:', error);

    res.status(500).json({
      message: 'Server Error',
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    // Find User
    const user = await User.findOne({ email });

    console.log('USER FOUND:', user);

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log('PASSWORD MATCH:', isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    // Generate Token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.status(200).json({
      message: 'Login successful',

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log('LOGIN ERROR:', error);

    res.status(500).json({
      message: 'Server Error',
    });
  }
};
