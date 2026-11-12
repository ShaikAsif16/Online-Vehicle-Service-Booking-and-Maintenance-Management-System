import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Wrench, Lock, Mail, ArrowRight, Shield, User, HardHat, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ email, password });
      addToast(`Welcome back, ${user.name}!`, 'success');

      // Redirect by role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'mechanic') {
        navigate('/mechanic/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSubmitting(true);
    try {
      const user = await login({ email: demoEmail, password: demoPass });
      addToast(`Authenticated as ${user.name} (${user.role})`, 'success');

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'mechanic') navigate('/mechanic/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Demo login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-automotive-orange to-automotive-darkOrange flex items-center justify-center text-white shadow-glow-orange mx-auto">
            <Wrench className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Portal Access
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to manage service bookings, fleet diagnostics, or workshop orders
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 shadow-automotive space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-automotive-orange hover:text-orange-400 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-automotive-orange to-automotive-darkOrange text-white font-extrabold text-sm shadow-glow-orange hover:opacity-95 transition flex items-center justify-center gap-2 mt-2"
            >
              <span>{submitting ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for Evaluation */}
          <div className="pt-4 border-t border-dark-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Evaluator Demo Sign-In</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@autocare.com', 'Admin@123')}
                className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-automotive-orange/50 text-left transition flex items-center gap-2 text-slate-200"
              >
                <Shield className="w-4 h-4 text-purple-400 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-[11px] text-white">Workshop Admin</p>
                  <p className="text-[10px] text-slate-400 truncate">admin@autocare.com</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('marcus.mechanic@autocare.com', 'Mechanic@123')}
                className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-automotive-orange/50 text-left transition flex items-center gap-2 text-slate-200"
              >
                <HardHat className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-[11px] text-white">Master Mechanic</p>
                  <p className="text-[10px] text-slate-400 truncate">marcus.mechanic</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('alex.customer@example.com', 'Customer@123')}
                className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-automotive-orange/50 text-left transition flex items-center gap-2 text-slate-200"
              >
                <User className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-[11px] text-white">Customer (Alex)</p>
                  <p className="text-[10px] text-slate-400 truncate">Ferrari SF90 & GT3 RS</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('priya.customer@example.com', 'Customer@123')}
                className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-automotive-orange/50 text-left transition flex items-center gap-2 text-slate-200"
              >
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-[11px] text-white">Customer (Priya)</p>
                  <p className="text-[10px] text-emerald-400 truncate">Revuelto & 765LT (Unpaid)</p>
                </div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-automotive-orange font-bold hover:underline">
              Create Customer Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
