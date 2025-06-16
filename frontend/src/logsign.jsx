import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Github, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Styles object (in a real app, this would be imported from a separate CSS file)
const styles = {
  authContainer: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f5f7fa'
  },
  
  authSidebar: {
    flex: 1,
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 40px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  },
  
  authSidebarContent: {
    textAlign: 'center',
    zIndex: 2,
    maxWidth: '400px'
  },
  
  authLogo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '40px'
  },
  
  logoIcon: {
    width: '50px',
    height: '50px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)'
  },
  
  logoText: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0
  },
  
  authTitle: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '20px',
    lineHeight: '1.2'
  },
  
  authSubtitle: {
    fontSize: '18px',
    opacity: 0.9,
    lineHeight: '1.6',
    marginBottom: '40px'
  },
  
  featureList: {
    textAlign: 'left',
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '15px',
    fontSize: '16px',
    opacity: 0.9
  },
  
  featureIcon: {
    width: '20px',
    height: '20px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  
  authBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    zIndex: 1
  },
  
  authFormContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 40px',
    backgroundColor: 'white',
    minWidth: '500px'
  },
  
  authForm: {
    width: '100%',
    maxWidth: '400px'
  },
  
  formHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  
  formTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '10px'
  },
  
  formSubtitle: {
    fontSize: '16px',
    color: '#7f8c8d',
    margin: 0
  },
  
  formGroup: {
    marginBottom: '25px',
    position: 'relative'
  },
  
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px'
  },
  
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  
  formInput: {
    width: '100%',
    padding: '15px 20px',
    paddingLeft: '50px',
    border: '2px solid #ecf0f1',
    borderRadius: '12px',
    fontSize: '16px',
    color: '#2c3e50',
    backgroundColor: '#f8f9fa',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },
  
  formInputFocused: {
    borderColor: '#3498db',
    backgroundColor: 'white',
    boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)'
  },
  
  inputIcon: {
    position: 'absolute',
    left: '18px',
    color: '#7f8c8d',
    zIndex: 2
  },
  
  passwordToggle: {
    position: 'absolute',
    right: '18px',
    background: 'none',
    border: 'none',
    color: '#7f8c8d',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '4px',
    transition: 'color 0.3s ease'
  },
  
  formError: {
    color: '#e74c3c',
    fontSize: '14px',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  
  rememberForgot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#3498db'
  },
  
  checkboxLabel: {
    fontSize: '14px',
    color: '#2c3e50',
    cursor: 'pointer'
  },
  
  forgotLink: {
    fontSize: '14px',
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s ease'
  },
  
  submitButton: {
    width: '100%',
    padding: '16px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '25px',
    position: 'relative',
    overflow: 'hidden'
  },
  
  submitButtonHover: {
    backgroundColor: '#2980b9',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(52, 152, 219, 0.3)'
  },
  
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none'
  },
  
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '30px 0',
    color: '#7f8c8d',
    fontSize: '14px'
  },
  
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#ecf0f1'
  },
  
  dividerText: {
    padding: '0 20px',
    backgroundColor: 'white'
  },
  
  socialButtons: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px'
  },
  
  socialButton: {
    flex: 1,
    padding: '12px 20px',
    border: '2px solid #ecf0f1',
    borderRadius: '12px',
    backgroundColor: 'white',
    color: '#2c3e50',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  
  socialButtonHover: {
    borderColor: '#3498db',
    backgroundColor: '#f8f9fa'
  },
  
  authSwitch: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#7f8c8d'
  },
  
  authSwitchLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '600',
    marginLeft: '5px',
    transition: 'color 0.3s ease'
  },
  
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTop: '2px solid currentColor',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  '@media (max-width: 1024px)': {
    authContainer: {
      flexDirection: 'column'
    },
    authSidebar: {
      padding: '50px 30px',
      minHeight: '300px'
    },
    authFormContainer: {
      padding: '50px 30px',
      minWidth: 'auto',
      width: '100%'
    },
    formTitle: {
      fontSize: '30px'
    },
    authTitle: {
      fontSize: '30px'
    }
  },

  '@media (max-width: 768px)': {
    authSidebar: {
      padding: '40px 20px'
    },
    authFormContainer: {
      padding: '40px 20px'
    },
    formTitle: {
      fontSize: '28px'
    },
    authTitle: {
      fontSize: '28px'
    }
  },

  '@media (max-width: 480px)': {
    authSidebarContent: {
      maxWidth: '100%'
    },
    authForm: {
      maxWidth: '100%'
    },
    formInput: {
      paddingLeft: '40px'
    }
  }
};

// Add CSS animation for spinner
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}


const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const response = await fetch(`http://localhost:5000/api/auth/${isLogin ? 'login' : 'register'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        isLogin
          ? { email: formData.email, password: formData.password }
          : {
              fullName: formData.fullName,
              email: formData.email,
              password: formData.password,
              phone: formData.phone
            }
      )
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data);

    localStorage.setItem('token', data.token);

    // 🔁 Redirect to /dash/<token>
    navigate(`/dash/${data.token}`);

  } catch (err) {
    alert(err.message);
  } finally {
    setIsLoading(false);
  }
};

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Handle social login
  };

  const renderFormInput = (field, type, icon, placeholder, label) => (
    <div style={styles.formGroup}>
      <label style={styles.formLabel}>{label}</label>
      <div style={styles.inputContainer}>
        <div style={styles.inputIcon}>
          {icon}
        </div>
        <input
          type={type === 'password' && field === 'password' && showPassword ? 'text' : 
                type === 'password' && field === 'confirmPassword' && showConfirmPassword ? 'text' : type}
          placeholder={placeholder}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          onFocus={() => setFocusedInput(field)}
          onBlur={() => setFocusedInput('')}
          style={{
            ...styles.formInput,
            ...(focusedInput === field ? styles.formInputFocused : {}),
            ...(errors[field] ? { borderColor: '#e74c3c' } : {})
          }}
        />
        {type === 'password' && (
          <button
            type="button"
            style={styles.passwordToggle}
            onClick={() => {
              if (field === 'password') {
                setShowPassword(!showPassword);
              } else {
                setShowConfirmPassword(!showConfirmPassword);
              }
            }}
          >
            {(field === 'password' && showPassword) || (field === 'confirmPassword' && showConfirmPassword) ? 
              <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errors[field] && (
        <div style={styles.formError}>
          ⚠ {errors[field]}
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.authContainer}>
      {/* Left Sidebar */}
      <div style={styles.authSidebar}>
        <div style={styles.authBackground}></div>
        <div style={styles.authSidebarContent}>
          <div style={styles.authLogo}>
            <div style={styles.logoIcon}>
              <MessageCircle size={24} />
            </div>
            <h1 style={styles.logoText}>ChatApp</h1>
          </div>
          
          <h2 style={styles.authTitle}>
            {isLogin ? 'Welcome Back!' : 'Join Our Community'}
          </h2>
          <p style={styles.authSubtitle}>
            {isLogin 
              ? 'Connect with friends and colleagues in real-time. Your conversations are waiting for you.'
              : 'Start meaningful conversations and build lasting connections with people around the world.'
            }
          </p>
          
          <ul style={styles.featureList}>
            <li style={styles.featureItem}>
              <div style={styles.featureIcon}>✨</div>
              Real-time messaging
            </li>
            <li style={styles.featureItem}>
              <div style={styles.featureIcon}>🔒</div>
              Secure & encrypted
            </li>
            <li style={styles.featureItem}>
              <div style={styles.featureIcon}>👥</div>
              Group conversations
            </li>
            <li style={styles.featureItem}>
              <div style={styles.featureIcon}>📱</div>
              Cross-platform support
            </li>
          </ul>
        </div>
      </div>

      {/* Right Form Container */}
      <div style={styles.authFormContainer}>
        <div style={styles.authForm}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p style={styles.formSubtitle}>
              {isLogin 
                ? 'Enter your credentials to access your account'
                : 'Fill in your information to get started'
              }
            </p>
          </div>

          {!isLogin && renderFormInput('fullName', 'text', <User size={18} />, 'Enter your full name', 'Full Name')}
          
          {renderFormInput('email', 'email', <Mail size={18} />, 'Enter your email address', 'Email Address')}
          
          {!isLogin && renderFormInput('phone', 'tel', <Phone size={18} />, 'Enter your phone number', 'Phone Number')}
          
          {renderFormInput('password', 'password', <Lock size={18} />, 'Enter your password', 'Password')}
          
          {!isLogin && renderFormInput('confirmPassword', 'password', <Lock size={18} />, 'Confirm your password', 'Confirm Password')}

          {isLogin && (
            <div style={styles.rememberForgot}>
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  style={styles.checkbox}
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                />
                <label htmlFor="rememberMe" style={styles.checkboxLabel}>
                  Remember me
                </label>
              </div>
              <a href="#" style={styles.forgotLink}>
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            style={{
              ...styles.submitButton,
              ...(isLoading ? styles.submitButtonDisabled : {})
            }}
          >
            {isLoading ? (
              <>
                <div style={styles.loadingSpinner}></div>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>or continue with</span>
            <div style={styles.dividerLine}></div>
          </div>

          <div style={styles.socialButtons}>
            <button
              type="button"
              style={styles.socialButton}
              onClick={() => handleSocialLogin('google')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              style={styles.socialButton}
              onClick={() => handleSocialLogin('github')}
            >
              <Github size={18} />
              GitHub
            </button>
          </div>

          <div style={styles.authSwitch}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <a
              href="#"
              style={styles.authSwitchLink}
              onClick={(e) => {
                e.preventDefault();
                setIsLogin(!isLogin);
                setErrors({});
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  fullName: '',
                  phone: '',
                  rememberMe: false
                });
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;