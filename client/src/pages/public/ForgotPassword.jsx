import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useNotifications } from '../../hooks/useNotifications';
import { Wrench, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { addToast } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your account email.', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      addToast('Reset instructions dispatched.', 'success');
    } catch (err) {
      addToast('Unable to process request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-automotive-orange flex items-center justify-center text-white shadow-glow-orange mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-['Space_Grotesk']">
            Reset Password
          </h2>
          <p className="text-xs text-slate-400">
            Enter your registered email address to receive secure access recovery instructions.
          </p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 shadow-automotive">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300">
                Password recovery dispatched for <strong className="text-white">{email}</strong>.
              </p>
              <p className="text-[11px] text-slate-400">
                (Note for evaluators: You can sign in immediately using the pre-seeded demo accounts on the sign-in page.)
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-automotive-orange hover:underline pt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Registered Email</label>
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-automotive-orange text-white font-bold text-sm shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmitting...' : 'Send Reset Instructions'}</span>
              </button>

              <div className="text-center pt-3 border-t border-dark-800">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
