import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, Building2, Users, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import useSettingsStore from '../../store/settingsStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ROLES } from '../../utils/constants';

const QUICK_LOGIN = [
  { role: ROLES.SUPER_ADMIN, labelKey: 'superAdmin', icon: Shield, color: '#6366f1', desc: 'Rajesh Kumar' },
  { role: ROLES.ADMIN, labelKey: 'admin', icon: Building2, color: '#06d6e0', desc: 'Priya Sharma' },
  { role: ROLES.RESIDENT, labelKey: 'resident', icon: Users, color: '#10b981', desc: 'Amit Patel' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginAsRole, isLoading, isAuthenticated } = useAuthStore();
  const { t, language, setLanguage, theme, toggleTheme } = useSettingsStore();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success(t('welcomeBack'));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(t('invalidCredentials'));
    }
  };

  const handleQuickLogin = async (role) => {
    try {
      await loginAsRole(role);
      toast.success(t('loggedIn'));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated aurora background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Large orbs */}
        <div style={{
          position: 'absolute', top: '-15%', right: '-5%',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 214, 224, 0.12) 0%, transparent 60%)',
          animation: 'auroraDrift 20s ease-in-out infinite',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 60%)',
          animation: 'auroraDrift 25s ease-in-out infinite reverse',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', top: '35%', left: '50%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 60%)',
          animation: 'auroraDrift 18s ease-in-out infinite 2s',
          filter: 'blur(70px)',
        }} />
        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Top-right settings */}
      <div style={{
        position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)',
        display: 'flex', gap: 'var(--space-2)', zIndex: 2,
      }}>
        {/* Language switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          {[{ v: 'en', l: 'EN' }, { v: 'hi', l: 'हि' }, { v: 'te', l: 'తె' }].map(({ v, l }) => (
            <button key={v} onClick={() => setLanguage(v)} style={{
              padding: '6px 10px', fontSize: 'var(--font-size-xs)', fontWeight: 600,
              color: language === v ? '#fff' : 'var(--color-text-tertiary)',
              background: language === v ? 'var(--gradient-accent)' : 'transparent',
              transition: 'all var(--transition-fast)',
              boxShadow: language === v ? '0 2px 8px rgba(6, 214, 224, 0.2)' : 'none',
            }}>{l}</button>
          ))}
        </div>
        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{
          width: 36, height: 36, borderRadius: 'var(--radius-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--color-surface-border)',
          color: 'var(--color-text-tertiary)',
        }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }} className="anim-slide-up">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--radius-2xl)',
            background: 'var(--gradient-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-4)',
            fontSize: 32, fontWeight: 800, color: '#fff',
            boxShadow: '0 8px 32px rgba(6, 214, 224, 0.35), 0 0 60px rgba(6, 214, 224, 0.15)',
            animation: 'glowPulse 4s ease-in-out infinite',
          }}>A</div>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, marginBottom: 'var(--space-2)', letterSpacing: '-0.03em' }}>
            {t('appName')}
          </h1>
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
            {t('appTagline')}
          </p>
        </div>

        {/* Login card – glass */}
        <div style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-8)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top highlight line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(6, 214, 224, 0.3), transparent)',
            pointerEvents: 'none',
          }} />

          <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-6)' }}>
            {t('signInTitle')}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label={t('email')}
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <Input
              label={t('password')}
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />
            <Button type="submit" variant="primary" size="lg" loading={isLoading} style={{ width: '100%', marginTop: 'var(--space-2)' }}>
              {t('login')}
            </Button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', margin: 'var(--space-6) 0' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, var(--color-surface-border), transparent)' }} />
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{t('orDemoAccess')}</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, var(--color-surface-border), transparent)' }} />
          </div>

          {/* Quick login */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {QUICK_LOGIN.map(({ role, labelKey, icon: Icon, color, desc }) => (
              <button
                key={role}
                onClick={() => handleQuickLogin(role)}
                disabled={isLoading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  textAlign: 'left',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  width: '100%',
                }}
                className="quick-login-btn"
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}18`, color, flexShrink: 0,
                  boxShadow: `0 0 12px ${color}25`,
                }}>
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {t(labelKey)}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{desc}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Zap size={14} style={{ color: 'var(--color-text-muted)' }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .quick-login-btn:hover:not(:disabled) {
          border-color: var(--color-surface-border-glow) !important;
          background: rgba(6, 214, 224, 0.06) !important;
          box-shadow: 0 0 20px rgba(6, 214, 224, 0.08) !important;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
