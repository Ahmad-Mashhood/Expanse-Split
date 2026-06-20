import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.register(formData);
      const { token, user } = response.data;
      login(user, token);
      navigate('/dashboard');
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Registration failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row-reverse">
      {/* Right side - Form (but visually on the left due to row-reverse) */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white z-10 shadow-2xl">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/30">
              💰
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">ExpenseSplit</span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Start splitting expenses with your friends today.
            </p>
          </div>

          <div className="mt-8">
            {alert && (
              <div className="mb-6">
                <Alert 
                  type={alert.type} 
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Sign in instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left side - Image/Graphic */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-tr from-indigo-900 via-blue-800 to-blue-600 flex flex-col justify-center items-center p-12 text-white">
          <div className="max-w-lg text-center">
            <div className="mb-12 inline-block p-4 rounded-full bg-white/10 backdrop-blur-md">
              <span className="text-6xl">✨</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-6">Join the revolution of shared expenses.</h2>
            <p className="text-lg text-blue-100 mb-12">Stop arguing over who paid for what. Keep track of all shared expenses seamlessly and securely.</p>
            
            <ul className="text-left space-y-4 max-w-sm mx-auto">
              <li className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-indigo-900 text-sm font-bold">✓</div>
                <span>Create unlimited groups</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-indigo-900 text-sm font-bold">✓</div>
                <span>Smart debt simplification</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-indigo-900 text-sm font-bold">✓</div>
                <span>Detailed analytics & reports</span>
              </li>
            </ul>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
