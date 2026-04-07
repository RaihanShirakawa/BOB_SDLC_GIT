import { STORAGE_KEYS, DATA_PATHS, AUDIT_ACTIONS, ENTITY_TYPES } from '../utils/constants';
import { logAuditAction } from './auditService';

/**
 * Authentication Service
 * Handles user login, logout, and session management
 */

/**
 * Login user
 */
export const login = async (username, password) => {
  try {
    // Fetch users data
    const response = await fetch(DATA_PATHS.USERS);
    const users = await response.json();
    
    // Find user
    const user = users.find(u => u.username === username && u.password === password && u.is_active);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // Create session
    const session = {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      },
      token: generateToken(),
      loginTime: new Date().toISOString()
    };
    
    // Store in session storage
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session.user));
    sessionStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, session.token);
    
    // Log audit
    await logAuditAction(
      user.id,
      AUDIT_ACTIONS.LOGIN,
      ENTITY_TYPES.USER,
      user.id,
      null,
      { username: user.username, loginTime: session.loginTime }
    );
    
    return session;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      // Log audit
      await logAuditAction(
        currentUser.id,
        AUDIT_ACTIONS.LOGOUT,
        ENTITY_TYPES.USER,
        currentUser.id,
        null,
        { logoutTime: new Date().toISOString() }
      );
    }
    
    // Clear session
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Get current user from session
 */
export const getCurrentUser = () => {
  try {
    const userStr = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const user = getCurrentUser();
  const token = sessionStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
  return !!(user && token);
};

/**
 * Check if user has specific role
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (roles) => {
  const user = getCurrentUser();
  return user && roles.includes(user.role);
};

/**
 * Check if user can perform action on resource
 */
export const canPerformAction = (action, resource, resourceOwnerId = null) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const { role, id } = user;
  
  // Admin can do everything
  if (role === 'Admin') return true;
  
  // Role-based permissions
  switch (action) {
    case 'create_application':
      return role === 'RM';
      
    case 'edit_application':
      if (resource?.status === 'Draft') {
        return role === 'RM' && id === resourceOwnerId;
      }
      return false;
      
    case 'delete_application':
      return (role === 'RM' && id === resourceOwnerId) || role === 'Admin';
      
    case 'submit_application':
      return role === 'RM' && id === resourceOwnerId;
      
    case 'upload_document':
      return role === 'RM' || role === 'Credit_Analyst';
      
    case 'run_agent_review':
      return role === 'RM' || role === 'Credit_Analyst';
      
    case 'edit_analysis':
      return role === 'Credit_Analyst';
      
    case 'submit_recommendation':
      return role === 'Credit_Analyst';
      
    case 'approve_reject':
      return role === 'Approver';
      
    case 'view_audit_logs':
      return role === 'Admin' || role === 'Approver';
      
    case 'edit_policy':
      return role === 'Admin';
      
    default:
      return false;
  }
};

/**
 * Generate simple token
 */
const generateToken = () => {
  return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
};

/**
 * Validate session
 */
export const validateSession = () => {
  const user = getCurrentUser();
  const token = sessionStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
  
  if (!user || !token) {
    return false;
  }
  
  // In a real app, you would validate token expiry here
  return true;
};

// Made with Bob
