import React from 'react';
import { LogIn, Mail, Apple } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/apple`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to AI Linear Algebra Tutor
          </h2>
          <p className="text-gray-600">
            Sign in to continue your learning journey
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Mail className="h-5 w-5 mr-3 text-red-500" />
            Continue with Google
          </button>

          <button
            onClick={handleAppleLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <Apple className="h-5 w-5 mr-3" />
            Continue with Apple
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
