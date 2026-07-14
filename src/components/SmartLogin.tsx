import React, { useState, useEffect } from 'react';
import { AppUser } from '../types';
import { ShieldCheck, User, Lock, Eye, EyeOff, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import FBMLogo from './FBMLogo';
import { motion, AnimatePresence } from 'motion/react';

interface SmartLoginProps {
  users: AppUser[];
  onLoginSuccess: (user: AppUser) => void;
}

export default function SmartLogin({ users, onLoginSuccess }: SmartLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Lock countdown timer
  useEffect(() => {
    if (lockTimer > 0) {
      const t = setTimeout(() => setLockTimer(lt => lt - 1), 1000);
      return () => clearTimeout(t);
    } else if (isLocked && lockTimer === 0) {
      setIsLocked(false);
      setLoginAttempts(0);
    }
  }, [lockTimer, isLocked]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = (username || '').trim().toLowerCase();
      const prefixToSearch = trimmedUser.includes('@') ? trimmedUser.split('@')[0] : trimmedUser;

      const foundUser = users.find(u => {
        const userEmail = (u.email || '').toLowerCase();
        const userPrefix = userEmail.includes('@') ? userEmail.split('@')[0] : userEmail;
        return userPrefix === prefixToSearch;
      });

      if (!foundUser) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTimer(30);
          setError('🔒 تم حظر تسجيل الدخول مؤقتاً. حاول مجدداً بعد 30 ثانية.');
        } else {
          setError(`❌ اسم المستخدم غير صحيح. (${5 - newAttempts} محاولات متبقية)`);
        }
        setIsLoading(false);
        return;
      }

      if (!foundUser.isActive) {
        setError('⚠️ هذا الحساب معطل من قبل الإدارة. تواصل مع المشرف.');
        setIsLoading(false);
        return;
      }

      const expectedPassword = foundUser.password || (foundUser.role === 'admin' ? 'admin123' : '123456');
      if (password !== expectedPassword) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTimer(30);
          setError('🔒 تم حظر تسجيل الدخول مؤقتاً. حاول مجدداً بعد 30 ثانية.');
        } else {
          setError(`❌ كلمة المرور غير صحيحة. (${5 - newAttempts} محاولات متبقية)`);
        }
        setIsLoading(false);
        return;
      }

      setLoginAttempts(0);
      setIsLoading(false);
      onLoginSuccess(foundUser);
    }, 800);
  };

  const getRoleIcon = () => {
    if (!username) return null;
    const prefix = username.trim().toLowerCase().includes('@')
      ? username.trim().toLowerCase().split('@')[0]
      : username.trim().toLowerCase();
    const found = users.find(u => {
      const up = (u.email || '').toLowerCase().split('@')[0];
      return up === prefix;
    });
    if (!found) return null;
    return found.role === 'admin'
      ? <span className="text-[10px] text-purple-400 font-black mt-0.5 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> مدير النظام</span>
      : <span className="text-[10px] text-[#76BC21] font-black mt-0.5 flex items-center gap-1"><Smartphone className="w-3 h-3" /> موظف ميداني</span>;
  };

  return (
    <div className="min-h-screen bg-[#000839] flex flex-col items-center justify-center p-4 select-none relative overflow-hidden" dir="rtl">
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#76BC21]/10 rounded-full blur-[120px] animate-pulse" style={{animationDuration:'4s'}} />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{animationDuration:'6s'}} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px] animate-pulse" style={{animationDuration:'3s'}} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(118,188,33,1) 1px, transparent 1px), linear-gradient(90deg, rgba(118,188,33,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      {/* Online Status Bar */}
      <div className={`fixed top-0 left-0 right-0 flex items-center justify-center gap-2 py-1 text-[10px] font-bold transition-all duration-300 z-50 ${
        isOnline ? 'bg-[#76BC21]/20 text-[#76BC21]' : 'bg-red-900/30 text-red-400'
      }`}>
        {isOnline
          ? <><Wifi className="w-3 h-3" /> متصل بالشبكة</>
          : <><WifiOff className="w-3 h-3" /> لا يوجد اتصال بالإنترنت</>}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10 mt-4"
      >
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FBMLogo size="lg" className="mb-3" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white tracking-tight">FBM <span className="text-[#76BC21]">ERP</span></h1>
            <p className="text-slate-400 text-xs mt-1 font-medium">نظام الإدارة المتكامل — LES FRÈRES BENAMAR</p>
          </div>

          <div className="mt-3 flex items-center gap-2 bg-[#76BC21]/10 border border-[#76BC21]/20 px-3 py-1.5 rounded-full">
            <div className="online-dot" />
            <span className="text-[#76BC21] text-[10px] font-black">البوابة الأمنية المشفرة</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-800/80 bg-[#050E46]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          
          {/* Device indicator pills */}
          <div className="flex items-center gap-2 mb-5 p-2.5 bg-slate-900/50 rounded-xl border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold flex-1 justify-center">
              <Monitor className="w-3.5 h-3.5" />
              <span>لوحة الإدارة</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-1.5 text-[#76BC21] text-[11px] font-black flex-1 justify-center">
              <Smartphone className="w-3.5 h-3.5 animate-pulse" />
              <span>التطبيق الميداني</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-300">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  placeholder="مثال: yacine أو ali"
                  dir="ltr"
                  autoComplete="username"
                  className="input-fbm w-full rounded-xl pr-11 pl-4 py-3 text-sm font-bold text-right"
                  required
                  disabled={isLocked}
                />
              </div>
              {/* Role hint */}
              <AnimatePresence>
                {username && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex justify-end pr-1">
                      {getRoleIcon()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-300">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="أدخل كلمة المرور"
                  dir="ltr"
                  autoComplete="current-password"
                  className="input-fbm w-full rounded-xl pr-11 pl-12 py-3 text-sm"
                  required
                  disabled={isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#76BC21] transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Locked Timer */}
            {isLocked && lockTimer > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-2"
              >
                <div className="inline-flex items-center gap-2 bg-red-950/40 border border-red-900/40 px-4 py-2 rounded-xl">
                  <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center text-red-400 text-xs font-black">
                    {lockTimer}
                  </div>
                  <span className="text-red-300 text-xs font-bold">ثانية قبل إعادة المحاولة</span>
                </div>
              </motion.div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-red-950/40 border border-red-800/50 text-red-200 px-4 py-3 rounded-xl text-xs font-bold text-right flex items-start gap-2"
                >
                  <span className="leading-relaxed">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || isLocked}
              whileTap={{ scale: 0.97 }}
              className="w-full relative overflow-hidden bg-[#76BC21] hover:bg-[#62a118] disabled:opacity-50 disabled:cursor-not-allowed text-[#000839] font-black py-3.5 rounded-xl shadow-lg shadow-[#76BC21]/20 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#000839] border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ التحقق...</span>
                </>
              ) : isLocked ? (
                <span>🔒 محظور مؤقتاً</span>
              ) : (
                <span>الدخول الآمن للنظام 🚀</span>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-600">
            <span>FBM ERP v2.0</span>
            <span>LES FRÈRES BENAMAR © 2026</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
