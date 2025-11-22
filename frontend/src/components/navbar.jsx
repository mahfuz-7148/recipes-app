import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Menu, X, ChefHat, Heart, BookOpen, LogIn, LogOut, Settings } from 'lucide-react';
import { InputForm } from './inputForm.jsx';
import { Modal } from './modal.jsx';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileProfileMenuOpen, setMobileProfileMenuOpen] = useState(false); // Separate state for mobile
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // সরাসরি localStorage থেকে পড়ুন
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isLogin = !!token;

  // Close dropdown when clicking outside (Desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenu(false);
        setMobileProfileMenuOpen(false); // Also close mobile dropdown
      }
    };

    if (mobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenu]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowProfileMenu(false);
    navigate('/');
    window.location.reload(); // Refresh to update state
  };

  const checkLogin = () => {
    if (isLogin) {
      handleLogout();
    } else {
      setIsOpen(true);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Food Blog
              </span>
            </NavLink>

            {/* Desktop Menu */}
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

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {isLogin ? (
                <div
                  className="relative"
                  ref={profileMenuRef}
                  onMouseEnter={() => setShowProfileMenu(true)}
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  {/* Profile Button - Desktop: Simple Hover */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group cursor-pointer">
                    {/* Profile Photo or Avatar */}
                    <div className="relative">
                      {user?.profilePhoto ? (
                        <img
                          src={user.profilePhoto}
                          alt={user.name || 'User'}
                          className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 group-hover:border-emerald-600 transition-colors"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-emerald-500 group-hover:border-emerald-600 transition-colors">
                          {getUserInitials()}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    {/* User Info */}
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {user?.email?.length > 20 ? user.email.substring(0, 20) + '...' : user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          {user?.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name || 'User'}
                              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                              {getUserInitials()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            // Add profile settings route if needed
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenu && (
            <div ref={mobileMenuRef} className="md:hidden py-4 border-t border-gray-200">
              <ul className="space-y-2">
                <li>
                  <NavLink
                    to="/"
                    onClick={() => {
                      setMobileMenu(false);
                      setMobileProfileMenuOpen(false);
                    }}
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
                  if (!isLogin) {
                    setIsOpen(true);
                    setMobileMenu(false);
                    setMobileProfileMenuOpen(false);
                  }
                }}>
                  <NavLink
                    to={isLogin ? "/myRecipe" : "/"}
                    onClick={() => {
                      if (isLogin) {
                        setMobileMenu(false);
                        setMobileProfileMenuOpen(false);
                      }
                    }}
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
                  if (!isLogin) {
                    setIsOpen(true);
                    setMobileMenu(false);
                    setMobileProfileMenuOpen(false);
                  }
                }}>
                  <NavLink
                    to={isLogin ? "/favRecipe" : "/"}
                    onClick={() => {
                      if (isLogin) {
                        setMobileMenu(false);
                        setMobileProfileMenuOpen(false);
                      }
                    }}
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

              {/* Mobile Auth Section */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                {isLogin ? (
                  <>
                    {/* Mobile Profile Button with Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          console.log('Mobile arrow clicked! Current:', mobileProfileMenuOpen);
                          setMobileProfileMenuOpen(!mobileProfileMenuOpen);
                          console.log('Mobile new state:', !mobileProfileMenuOpen);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg hover:from-emerald-100 hover:to-teal-100 transition-all"
                      >
                        {user?.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={user.name || 'User'}
                            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                            {getUserInitials()}
                          </div>
                        )}
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${mobileProfileMenuOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Mobile Dropdown Menu */}
                      {mobileProfileMenuOpen && (
                        <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <button
                            onClick={() => {
                              // Add settings route
                              setMobileProfileMenuOpen(false);
                              setMobileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </button>

                          <button
                            onClick={() => {
                              handleLogout();
                              setMobileMenu(false);
                              setMobileProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setMobileMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <div className="h-16"></div>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={setIsOpen} />
        </Modal>
      )}
    </>
  );
};