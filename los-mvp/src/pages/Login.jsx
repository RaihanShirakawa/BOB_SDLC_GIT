import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ username, password }));
    if (result.type === 'auth/login/fulfilled') {
      navigate('/dashboard');
    }
  };

  const quickLogin = (user) => {
    setUsername(user.username);
    setPassword(user.password);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>Loan Origination System</h1>
        <p style={styles.subtitle}>SME Credit Processing</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Enter username"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.quickLogin}>
          <p style={styles.quickLoginTitle}>Quick Login (Demo):</p>
          <div style={styles.quickLoginButtons}>
            <button 
              onClick={() => quickLogin({ username: 'john.rm', password: 'password123' })}
              style={styles.quickButton}
            >
              RM
            </button>
            <button 
              onClick={() => quickLogin({ username: 'sarah.analyst', password: 'password123' })}
              style={styles.quickButton}
            >
              Analyst
            </button>
            <button 
              onClick={() => quickLogin({ username: 'michael.approver', password: 'password123' })}
              style={styles.quickButton}
            >
              Approver
            </button>
            <button 
              onClick={() => quickLogin({ username: 'admin', password: 'admin123' })}
              style={styles.quickButton}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  loginBox: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    margin: '0 0 10px 0',
    color: '#333',
    textAlign: 'center',
    fontSize: '24px',
  },
  subtitle: {
    margin: '0 0 30px 0',
    color: '#666',
    textAlign: 'center',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  error: {
    padding: '10px',
    background: '#fee',
    color: '#c33',
    borderRadius: '5px',
    fontSize: '14px',
    textAlign: 'center',
  },
  quickLogin: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  quickLoginTitle: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '10px',
    textAlign: 'center',
  },
  quickLoginButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  quickButton: {
    padding: '8px',
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default Login;

// Made with Bob
