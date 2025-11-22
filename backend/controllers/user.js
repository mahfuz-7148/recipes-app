import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from '../models/user.js';
import multer from 'multer';
import path from 'path';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

// Multer configuration for profile photo
const storage = multer.memoryStorage();

export const uploadPhoto = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation (strong password requirements)
const validatePassword = (password) => {
  if (password.length < 6) {
    return {
      valid: false,
      message: 'Password must be at least 6 characters'
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter (A-Z)'
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number (0-9)'
    };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one special character (!@#$%^&*...)'
    };
  }

  return { valid: true };
};

export const userSignUp = async (req, res) => {
  try {
    console.log('=== Sign Up Started ===');
    console.log('Body:', req.body);
    console.log('File:', req.file ? 'Uploaded' : 'No file');

    // Get data from req.body (multer parses FormData)
    const { name, email, password } = req.body;

    console.log('Parsed data:', { name, email, password: '***' });

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address"
      });
    }

    // Validate password
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({
        error: passwordCheck.message
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    // Upload profile photo to Cloudinary (optional)
    let profilePhoto = null;
    let cloudinaryId = null;

    if (req.file) {
      console.log('Uploading profile photo to Cloudinary...');
      const cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        'user-profiles'
      );
      profilePhoto = cloudinaryResult.secure_url;
      cloudinaryId = cloudinaryResult.public_id;
      console.log('Profile photo uploaded:', profilePhoto);
    }

    // Hash password
    const hashPwd = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name: name || '',
      email: email.toLowerCase(),
      password: hashPwd,
      profilePhoto,
      cloudinaryId
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        email: newUser.email,
        id: newUser._id
      },
      process.env.SECRET_KEY,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profilePhoto: newUser.profilePhoto
    };

    console.log('Sign up successful for:', email);

    res.status(201).json({
      token,
      user: userResponse,
      message: 'Signup successful'
    });

  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({
      error: error.message || 'Something went wrong during signup'
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    console.log('=== Login Started ===');
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address"
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id
      },
      process.env.SECRET_KEY,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto
    };

    console.log('Login successful for:', email);

    res.status(200).json({
      token,
      user: userResponse,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: error.message || 'Something went wrong during login'
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch user'
    });
  }
};

// Optional: Update profile photo
export const updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    // Delete old photo from Cloudinary
    if (user.cloudinaryId) {
      await deleteFromCloudinary(user.cloudinaryId);
    }

    // Upload new photo
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      'user-profiles'
    );

    // Update user
    user.profilePhoto = cloudinaryResult.secure_url;
    user.cloudinaryId = cloudinaryResult.public_id;
    await user.save();

    res.json({
      message: 'Profile photo updated successfully',
      profilePhoto: user.profilePhoto
    });

  } catch (error) {
    console.error('Update photo error:', error);
    res.status(500).json({ error: error.message });
  }
};