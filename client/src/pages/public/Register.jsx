import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Wrench, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500081',
  });
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      addToast('Please fill out all required fields.', 'warning');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
      });

      addToast(`Account created successfully! Welcome to AutoCare Pro, ${user.name}.`, 'success');
      navigate('/customer/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-automotive-orange to-automotive-darkOrange flex items-center justify-center text-white shadow-glow-orange mx-auto">
            <Wrench className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Create Customer Account
          </h2>
          <p className="text-xs text-slate-400">
            Join AutoCare Pro to register your vehicles, schedule bay appointments, and track diagnostics
          </p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 sm:p-10 shadow-automotive">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Turner"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-dark-800">
              <label className="text-xs font-semibold text-slate-300">Street Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. 42 Greenwood Residency, Jubilee Hills"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Pincode</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-automotive-orange to-automotive-darkOrange text-white font-extrabold text-sm shadow-glow-orange hover:opacity-95 transition flex items-center justify-center gap-2 mt-4"
            >
              <span>{submitting ? 'Creating Your Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-5 text-xs text-slate-400 border-t border-dark-800 mt-5">
            Already have an existing profile?{' '}
            <Link to="/login" className="text-automotive-orange font-bold hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
