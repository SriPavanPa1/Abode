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
  { role: ROLES.SUPER_ADMIN, labelKey: 'superAdmin', icon: Shield, color: 'var(--color-info)', desc: 'Rajesh Kumar' },
  { role: ROLES.ADMIN, labelKey: 'admin', icon: Building2, color: 'var(--color-accent)', desc: 'Priya Sharma' },
  { role: ROLES.RESIDENT, labelKey: 'resident', icon: Users, color: 'var(--color-success)', desc: 'Amit Patel' },
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
      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top-right settings */}
      <div style={{
        position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)',
        display: 'flex', gap: 'var(--space-2)', zIndex: 2,
      }}>
        {/* Language switcher */}
        <div style={{
          display: 'flex', background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-md)', overflow: 'hidden',
        }}>
          {[{ v: 'en', l: 'EN' }, { v: 'hi', l: 'हि' }, { v: 'te', l: 'తె' }].map(({ v, l }) => (
            <button key={v} onClick={() => setLanguage(v)} style={{
              padding: '6px 10px', fontSize: 'var(--font-size-xs)', fontWeight: 600,
              color: language === v ? '#fff' : 'var(--color-text-tertiary)',
              background: language === v ? 'var(--color-accent)' : 'transparent',
              transition: 'all var(--transition-fast)',
            }}>{l}</button>
          ))}
        </div>
        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{
          width: 36, height: 36, borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--color-bg-secondary)', border: '1px solid var(--color-surface-border)',
          color: 'var(--color-text-tertiary)',
        }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }} className="anim-slide-up">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 'var(--radius-xl)',
            background: 'var(--gradient-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-4)',
            fontSize: 28, fontWeight: 800, color: '#fff',
            boxShadow: 'var(--shadow-glow-lg)',
          }}>A</div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
            {t('appName')}
          </h1>
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
            {t('appTagline')}
          </p>
        </div>

        {/* Login card */}
        <div className="card">
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
            <div style={{ flex: 1, height: 1, background: 'var(--color-surface-border)' }} />
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{t('orDemoAccess')}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-surface-border)' }} />
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
                  background: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'left',
                }}
                className="quick-login-btn"
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}18`, color, flexShrink: 0,
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
          border-color: var(--color-accent) !important;
          background: var(--color-accent-subtle) !important;
        }
      `}</style>
    </div>
  );
}
