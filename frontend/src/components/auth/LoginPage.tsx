import React, { useState } from 'react';
import { Shirt, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const { login, signup } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = isLogin 
        ? await login(formData.email, formData.password)
        : await signup(formData.name, formData.email, formData.password);
      
      if (success) {
        localStorage.setItem("userId",success.id);
      } else {
        alert('Authentication failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 bg-gradient-to-br from-purple-300 via-pink-100 to-white to-purple-50 flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 border border-gray-100 flex flex-col">
    
    {/* Logo and Header */}
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-3 shadow-lg">
        <Shirt className="w-7 h-7 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Virtual Wardrobe</h1>
      <p className="text-gray-600 text-sm">Your Virtual Wardrobe Assistant</p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 flex-1">
      {!isLogin && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm"
            placeholder="Enter your full name"
            required={!isLogin}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm"
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLogin ? 'Sign In' : 'Create Account'}
      </button>
    </form>

    <div className="mt-4 text-center">
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
      >
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </div>
  </div>
  </div>

  );
}