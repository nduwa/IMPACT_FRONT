import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import banner_img from '../images/banner_login.jpg';
import { useLoginMutation } from '../hooks/useLoginMutation'; 

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const loginMutation = useLoginMutation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    setIsDarkMode(newMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };
  return (
    
    <div className="flex flex-col items-center lg:flex-row justify-center bg-white dark:bg-gray-900 lg:justify-between h-screen text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* <Toaster position="top-center" /> */}
      {/* Toggle Theme Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-10 bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-white px-4 py-1 rounded shadow"
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* Left: Form Section */}
      <div className="flex flex-col w-full lg:w-auto items-center lg:py-8 ">
        <div className="w-full ">
          <div
            className="flex flex-col items-center lg:items-start p-6 sm:p-8 rounded-3xl lg:ml-24 lg:space-y-10 dark:bg-gray-800 w-full max-w-md"
            style={{
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)' // custom heavy shadow
            }}
          >
            {/* Logo and Title */}


            <h2 className="text-4xl font-bold text-[#8B593E] dark:text-white mb-6">
              Sign in to platform
            </h2>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-6 w-full">
              <div>
                <label htmlFor="username" className="block mb-2 text-lg font-medium">
                  Your username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:text-white sm:text-sm rounded-lg focus:ring-[#8B593E] focus:border-[#8B593E] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="e.g. johndoe@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-lg font-medium">
                  Your password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:text-white sm:text-sm rounded-lg focus:ring-[#8B593E] focus:border-[#8B593E] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  required
                />
              </div>

              <div className="flex items-center justify-between">

                <Link
                  to="/forgot-password"
                  className="text-sm text-[#8B593E] hover:underline dark:text-primary-300"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full px-5 py-3 mb-6 text-base font-medium text-center text-white bg-[#8B593E] rounded-lg hover:bg-[#73452F] focus:ring-4 focus:ring-[#8B593E]/50"
              >
                {loginMutation.isLoading ? 'Logging in…' : 'Login to your account'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right: Image Section */}
      <div className="hidden lg:flex flex-col w-1/2">
        <img
          src={banner_img}
          alt="banner"
          className="object-cover object-center w-full h-full rounded-l-3xl"
        />
      </div>
    </div>
  );
}

export default LoginForm;
