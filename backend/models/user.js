import mongoose from 'mongoose';

// Password validation function
const passwordValidator = function(password) {
  // At least 6 characters
  if (password.length < 6) {
    return false;
  }
  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  // At least one number
  if (!/[0-9]/.test(password)) {
    return false;
  }
  // At least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }
  return true;
};

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    validate: {
      validator: passwordValidator,
      message: 'Password must contain at least one uppercase letter, one number, and one special character'
    }
  },
  profilePhoto: {
    type: String,  // Cloudinary URL
    default: null
  },
  cloudinaryId: {
    type: String,  // For deleting from Cloudinary
    default: null
  }
}, {
  timestamps: true
});

export const User = mongoose.model("User", userSchema);