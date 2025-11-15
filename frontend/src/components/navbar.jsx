import React, { useState, useEffect } from 'react';
import {NavLink, useNavigate} from 'react-router';
import { Menu, X, ChefHat, Heart, BookOpen, LogIn, LogOut, User } from 'lucide-react';
import { InputForm } from './inputForm.jsx';
import { Modal } from './modal.jsx';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });
  const navigate = useNavigate();

  const isLogin = !!token;

  // Auth change listener - এটা আছে কিনা check করুন
  useEffect(() => {
    const handleAuthChange = () => {
      const newToken = localStorage.getItem('token');
      const newUserStr = localStorage.getItem('user');
      const newUser = newUserStr ? JSON.parse(newUserStr) : null;

      console.log('Auth changed!', { newToken, newUser }); // Debug log

      setToken(newToken);
      setUser(newUser);
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const checkLogin = () => {
    if (isLogin) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);

      window.dispatchEvent(new Event('auth-change'));
      navigate('/');
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Food Blog
              </span>
            </NavLink>

            <ul className="hidden md:flex items-center gap-1">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <BookOpen className="w-4 h-4" />
                  Home
                </NavLink>
              </li>

              <li onClick={() => !isLogin && setIsOpen(true)}>
                <NavLink
                  to={isLogin ? "/myRecipe" : "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive && isLogin ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <ChefHat className="w-4 h-4" />
                  My Recipe
                </NavLink>
              </li>

              <li onClick={() => !isLogin && setIsOpen(true)}>
                <NavLink
                  to={isLogin ? "/favRecipe" : "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive && isLogin ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <Heart className="w-4 h-4" />
                  Favourites
                </NavLink>
              </li>
            </ul>

            <div className="hidden md:flex items-center gap-3">
              {user?.email && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700 font-medium">{user.email}</span>
                </div>
              )}
              <button
                onClick={checkLogin}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                  isLogin
                    ? 'bg-red-500 text-white shadow-lg hover:shadow-xl hover:bg-red-600'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isLogin ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {isLogin ? "Logout" : "Login"}
              </button>
            </div>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <ul className="space-y-2">
                <li>
                  <NavLink
                    to="/"
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    <BookOpen className="w-5 h-5" />
                    Home
                  </NavLink>
                </li>

                <li onClick={() => {
                  if (!isLogin) setIsOpen(true);
                  setMobileMenu(false);
                }}>
                  <NavLink
                    to={isLogin ? "/myRecipe" : "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive && isLogin ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    <ChefHat className="w-5 h-5" />
                    My Recipe
                  </NavLink>
                </li>

                <li onClick={() => {
                  if (!isLogin) setIsOpen(true);
                  setMobileMenu(false);
                }}>
                  <NavLink
                    to={isLogin ? "/favRecipe" : "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive && isLogin ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    <Heart className="w-5 h-5" />
                    Favourites
                  </NavLink>
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                {user?.email && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700 font-medium">{user.email}</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    checkLogin();
                    setMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${
                    isLogin
                      ? 'bg-red-500 text-white shadow-lg hover:bg-red-600'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  }`}
                >
                  {isLogin ? <LogOut className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {isLogin ? "Logout" : "Login"}
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      <div className="h-16"></div>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  );
};