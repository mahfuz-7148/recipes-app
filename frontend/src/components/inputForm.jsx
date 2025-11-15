import {AnimatePresence, motion} from 'framer-motion';
import {FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser} from 'react-icons/fa';
import {useState} from 'react';
import axios from 'axios';

export const InputForm = ({ setIsOpen, setToken, setUser }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignUp ? "signUp" : "login";

      const response = await axios.post(`http://localhost:5000/${endpoint}`, {
        ...(isSignUp && { name }),
        email,
        password
      });

      // localStorage এ save করুন - এটা যোগ করেছি
      localStorage.setItem('token', response?.data?.token);
      localStorage.setItem('user', JSON.stringify(response?.data?.user));

      // State update করুন
      if (setToken) setToken(response?.data?.token);
      if (setUser) setUser(response?.data?.user);

      // Custom event dispatch করুন
      window.dispatchEvent(new Event('auth-change'));

      // Modal close করুন
      setIsOpen(false);

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
                required={isSignUp}
                whileFocus={{ scale: 1.01 }}
              />
            </div>
          </motion.div>
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
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaLock className={`transition-colors ${focusedField === 'password' ? 'text-emerald-500' : 'text-gray-400'}`} />
          </div>
          <motion.input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            placeholder="Enter your password"
            required
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
            onClick={() => setIsSignUp(prev => !prev)}
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