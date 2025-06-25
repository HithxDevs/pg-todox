import  { useState, useRef } from 'react';
import { User, Mail, Lock, Sun, Moon, CheckCircle, ArrowRight, Zap, Shield, Clock } from 'lucide-react';

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const api = "https://pg-todox.onrender.com"


  const SignInModal = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isSignUp, setIsSignUp] = useState(false);

    type FormData = {
      email: string | '';
      username: string;
      password: string;
    };

    const handleSignUp = async (formData: FormData) => {
      const response = await fetch(api+'/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.message);
      
    };

    const handleSignIn = async (formData: FormData) => {
      const response = await fetch(api+'/api/v1/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if(data.message === 'Login successful') {
        localStorage.setItem('token', data.token);
        alert('Login successful');
        window.location.href = '/todos';
      }else{
        alert('Invalid username or password');
      }
      console.log('Data:', data);
    };


    const handleSubmit = () => {
      if (isSignUp) {
        // For sign up, send all fields
        const formData = {
          email: emailRef.current?.value || '',
          username: usernameRef.current?.value || '',
          password: passwordRef.current?.value || ''
        };
        console.log('Sign up form data:', formData);
        handleSignUp(formData);
      } else {
        // For sign in, only send username and password
        const formData = {
          email: '',
          username: usernameRef.current?.value || '',
          password: passwordRef.current?.value || ''
        };
        console.log('Sign in form data:', formData);
        handleSignIn(formData);
      }
      setShowSignIn(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 sm:p-8 w-full max-w-md shadow-xl`}>
          <div className="text-center mb-6">
            <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              {isSignUp ? 'Join us today' : 'Welcome back'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  ref={usernameRef}
                  type="text"
                  placeholder="Username"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="Email address"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Password"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium text-white transition-colors duration-200"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 text-center space-y-4">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
            
            <button
              onClick={() => setShowSignIn(false)}
              className={`block w-full text-sm transition-colors ${
                isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className={`shadow-sm transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              TaskFlow
            </div>
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-yellow-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Sign In Button */}
              <button 
                onClick={() => setShowSignIn(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transition-colors ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Organize Your Tasks,{' '}
            <span className="text-blue-600">Amplify Your Productivity</span>
          </h1>
          <p className={`text-lg sm:text-xl mb-8 sm:mb-12 px-4 max-w-2xl mx-auto transition-colors ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Transform chaos into clarity with TaskFlow. The intelligent task management platform that adapts to your workflow and helps you achieve more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={() => setShowSignIn(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 flex items-center justify-center group"
            >
              Start Free Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className={`px-8 py-4 rounded-lg text-lg font-medium transition-colors border-2 ${
              isDark 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
              Watch Demo
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-white'} transition-colors`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Why Choose TaskFlow?
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Built for modern teams and individuals who demand excellence in task management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className={`p-8 rounded-xl shadow-sm border transition-colors ${
              isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className={`text-xl font-semibold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Lightning Fast
              </h3>
              <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Blazing fast performance with instant sync across all your devices. No more waiting.
              </p>
            </div>
            
            <div className={`p-8 rounded-xl shadow-sm border transition-colors ${
              isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className={`text-xl font-semibold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Smart Organization
              </h3>
              <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                AI-powered categorization and priority management that learns from your habits.
              </p>
            </div>
            
            <div className={`p-8 rounded-xl shadow-sm border transition-colors ${
              isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className={`text-xl font-semibold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Bank-Level Security
              </h3>
              <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                End-to-end encryption ensures your sensitive data stays private and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <Clock className="w-12 h-12 text-white mr-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Transform Your Productivity?
            </h2>
          </div>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join over 50,000+ professionals who've already supercharged their workflow with TaskFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => setShowSignIn(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center group"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-blue-100 text-sm">
              ✨ No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t transition-colors ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <p className={`text-sm sm:text-base transition-colors ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              © 2025 TaskFlow. Built with ❤️ by{' '}
              <button 
                onClick={() => window.open('https://github.com/hithxdevs', '_blank')}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                HithxDevs
              </button>
            </p>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      {showSignIn && <SignInModal />}
    </div>
  );
}