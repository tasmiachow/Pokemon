import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import '../styles/Login.css'; // Ensure this is correct

const Login = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false); // Desktop toggle
  const [isSignIn, setIsSignIn] = useState(true); // Mobile toggle
  const [isMobile, setIsMobile] = useState(false); // Track screen size

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignUpClick = () => {
    if (isMobile) {
      setIsSignIn(false);
    } else {
      setIsRightPanelActive(true);
    }
  };

  const handleSignInClick = () => {
    if (isMobile) {
      setIsSignIn(true);
    } else {
      setIsRightPanelActive(false);
    }
  };

  // Sign In Logic
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully!');
    } catch (err) {
      console.error('Error:', err.message);
      setError('Invalid credentials. Please try again.');
    }
  };

  // Sign Up Logic
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date(), 
        wins:0,
        losses:0
      });

      console.log('User account created!');
    } catch (err) {
      console.error('Error:', err.message);
      setError('Failed to create an account.');
    }
  };

  return (
    <>
      {isMobile ? (
        // Mobile Layout
        <div className="mobile-container">
          {isSignIn ? (
            <div className="form-container sign-in-container">
              <form onSubmit={handleSignIn}>
                <h1>Sign In</h1>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <a href="#">Forgot your password?</a>
                <button type="submit">Sign In</button>
                <p>
                  Don’t have an account?{' '}
                  <span className="toggle-link" onClick={handleSignUpClick}>
                    Create Account
                  </span>
                </p>
              </form>
            </div>
          ) : (
            <div className="form-container sign-up-container">
              <form onSubmit={handleSignUp}>
                <h1>Create Account</h1>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Sign Up</button>
                <p>
                  Already have an account?{' '}
                  <span className="toggle-link" onClick={handleSignInClick}>
                    Sign In
                  </span>
                </p>
              </form>
            </div>
          )}
        </div>
      ) : (
        // Desktop Layout
        <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
          <div className="form-container sign-up-container">
            <form onSubmit={handleSignUp}>
              <h1>Create Account</h1>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button type="submit">Sign Up</button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form onSubmit={handleSignIn}>
              <h1>Sign In</h1>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <a href="#">Forgot your password?</a>
              <button type="submit">Sign In</button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Get Started</h1>
                <p>Start Playing Today</p>
                <button className="ghost" onClick={handleSignInClick}>
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Welcome Back!</h1>
                <p>Pokemon Battler</p>
                <button className="ghost" onClick={handleSignUpClick}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
