import { AnimatePresence, motion } from 'framer-motion';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser, FaCamera } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

export const InputForm = ({ setIsOpen }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' })
  const navigate = useNavigate();

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    let checks = {
      length: pwd.length >= 6,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };

    if (checks.length) score++;
    if (checks.uppercase) score++;
    if (checks.lowercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    if (score <= 2) {
      return { score: 1, text: 'Weak', color: 'bg-red-500' };
    } else if (score === 3 || score === 4) {
      return { score: 2, text: 'Medium', color: 'bg-yellow-500' };
    } else {
      return { score: 3, text: 'Strong', color: 'bg-green-500' };
    }
  };

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation (strong password)
  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignUp ? "signUp" : "login";

      // For signup with photo, use FormData
      let response;

      if (isSignUp) {
        // Always use FormData for signup (with or without photo)
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        if (photo) {
          formData.append('photo', photo);
        }

        response = await axios.post(
          `http://localhost:5000/${endpoint}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // For login, use JSON
        response = await axios.post(
          `http://localhost:5000/${endpoint}`,
          {
            email,
            password
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // localStorage এ save করুন
      localStorage.setItem('token', response?.data?.token);
      localStorage.setItem('user', JSON.stringify(response?.data?.user));

      // Modal close করুন
      setIsOpen(false);

      // Navigate করুন - Navbar auto refresh হবে
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title */}
      <motion.div
        className="text-center mb-8"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-gray-600">
          {isSignUp ? "Join our food community" : "Login to share recipes"}
        </p>
      </motion.div>

      <AnimatePresence>
        {isSignUp && (
          <>
            {/* Profile Photo Upload */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="flex flex-col items-center mb-6"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Profile Photo (Optional)
              </label>

              <div className="relative">
                <motion.div
                  className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 cursor-pointer hover:border-emerald-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('photo-input').click()}
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaUser size={40} />
                    </div>
                  )}
                </motion.div>

                <motion.div
                  className="absolute bottom-0 right-0 bg-emerald-500 text-white p-3 rounded-full cursor-pointer hover:bg-emerald-600 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => document.getElementById('photo-input').click()}
                >
                  <FaCamera size={16} />
                </motion.div>
              </div>

              <input
                id="photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              <p className="text-xs text-gray-500 mt-2">
                Max 5MB • JPG, PNG, GIF, WebP
              </p>
            </motion.div>

            {/* Name Field */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className={`transition-colors ${focusedField === 'name' ? 'text-emerald-500' : 'text-gray-400'}`} />
                </div>
                <motion.input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Enter your name"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Email Field */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaEnvelope className={`transition-colors ${focusedField === 'email' ? 'text-emerald-500' : 'text-gray-400'}`} />
          </div>
          <motion.input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            placeholder="Enter your email"
            required
            whileFocus={{ scale: 1.01 }}
          />
        </div>
      </motion.div>

      {/* Password Field */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Password
          {isSignUp && (
            <span className="text-xs text-gray-500 font-normal ml-2">
              (min 6 chars, 1 uppercase, 1 number, 1 symbol)
            </span>
          )}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaLock className={`transition-colors ${focusedField === 'password' ? 'text-emerald-500' : 'text-gray-400'}`} />
          </div>
          <motion.input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (isSignUp && e.target.value) {
                setPasswordStrength(calculatePasswordStrength(e.target.value));
              }
            }}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            placeholder="Enter your password"
            required
            minLength={6}
            whileFocus={{ scale: 1.01 }}
          />
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </motion.button>
        </div>

        {/* Password Strength Indicator */}
        {isSignUp && password && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(passwordStrength.score / 3) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-semibold ${
                passwordStrength.score === 1 ? 'text-red-500' :
                  passwordStrength.score === 2 ? 'text-yellow-500' :
                    'text-green-500'
              }`}>
                {passwordStrength.text}
              </span>
            </div>

            {/* Password Requirements Checklist */}
            <div className="mt-2 space-y-1 text-xs">
              <div className={`flex items-center gap-1 ${password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                <span>{password.length >= 6 ? '✓' : '○'}</span>
                <span>At least 6 characters</span>
              </div>
              <div className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
                <span>One uppercase letter</span>
              </div>
              <div className={`flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                <span>{/[0-9]/.test(password) ? '✓' : '○'}</span>
                <span>One number</span>
              </div>
              <div className={`flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                <span>{/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○'}</span>
                <span>One special character</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        variants={itemVariants}
        whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Login")}
      </motion.button>

      {/* Toggle Sign Up/Login */}
      <motion.div
        className="text-center pt-4"
        variants={itemVariants}
      >
        <p className="text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          {" "}
          <motion.button
            type="button"
            onClick={() => {
              setIsSignUp(prev => !prev);
              setError('');
              setPhoto(null);
              setPhotoPreview(null);
            }}
            className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </motion.button>
        </p>
      </motion.div>
    </motion.form>
  )
}