import { DATA_PATHS } from '../utils/constants';
import { v4 as uuidv4 } from 'uuid';

/**
 * Audit Service
 * Handles audit logging for all actions
 */

/**
 * Log an audit action
 */
export const logAuditAction = async (actorId, action, entityType, entityId, beforeState = null, afterState = null) => {
  try {
    // Fetch current audit logs
    const response = await fetch(DATA_PATHS.AUDIT_LOGS);
    const auditLogs = await response.json();
    
    // Create new audit log entry
    const auditLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      actor_id: actorId,
      action: action,
      entity_type: entityType,
      entity_id: entityId,
      before_state: beforeState,
      after_state: afterState,
      ip_address: 'localhost', // In browser, we can't get real IP
      user_agent: navigator.userAgent
    };
    
    // Add to logs
    auditLogs.push(auditLog);
    
    // Save back (in real app, this would be handled by backend)
    // For demo, we'll store in localStorage as backup
    localStorage.setItem('audit_logs_cache', JSON.stringify(auditLogs));
    
    return auditLog;
  } catch (error) {
    console.error('Audit log error:', error);
    // Don't throw error to prevent breaking main functionality
    return null;
  }
};

/**
 * Get all audit logs
 */
export const getAllAuditLogs = async () => {
  try {
    // Try to get from localStorage first (for demo)
    const cached = localStorage.getItem('audit_logs_cache');
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Otherwise fetch from file
    const response = await fetch(DATA_PATHS.AUDIT_LOGS);
    return await response.json();
  } catch (error) {
    console.error('Get audit logs error:', error);
    return [];
  }
};

/**
 * Get audit logs for specific application
 */
export const getApplicationAuditLogs = async (applicationId) => {
  try {
    const allLogs = await getAllAuditLogs();
    return allLogs.filter(log => log.entity_id === applicationId);
  } catch (error) {
    console.error('Get application audit logs error:', error);
    return [];
  }
};

/**
 * Get audit logs by entity type
 */
export const getAuditLogsByEntityType = async (entityType) => {
  try {
    const allLogs = await getAllAuditLogs();
    return allLogs.filter(log => log.entity_type === entityType);
  } catch (error) {
    console.error('Get audit logs by entity type error:', error);
    return [];
  }
};

/**
 * Get audit logs by actor
 */
export const getAuditLogsByActor = async (actorId) => {
  try {
    const allLogs = await getAllAuditLogs();
    return allLogs.filter(log => log.actor_id === actorId);
  } catch (error) {
    console.error('Get audit logs by actor error:', error);
    return [];
  }
};

/**
 * Get audit logs by action
 */
export const getAuditLogsByAction = async (action) => {
  try {
    const allLogs = await getAllAuditLogs();
    return allLogs.filter(log => log.action === action);
  } catch (error) {
    console.error('Get audit logs by action error:', error);
    return [];
  }
};

/**
 * Get audit logs with filters
 */
export const getFilteredAuditLogs = async (filters = {}) => {
  try {
    let logs = await getAllAuditLogs();
    
    // Apply filters
    if (filters.entityType) {
      logs = logs.filter(log => log.entity_type === filters.entityType);
    }
    
    if (filters.entityId) {
      logs = logs.filter(log => log.entity_id === filters.entityId);
    }
    
    if (filters.actorId) {
      logs = logs.filter(log => log.actor_id === filters.actorId);
    }
    
    if (filters.action) {
      logs = logs.filter(log => log.action === filters.action);
    }
    
    if (filters.startDate) {
      logs = logs.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      logs = logs.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
    }
    
    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return logs;
  } catch (error) {
    console.error('Get filtered audit logs error:', error);
    return [];
  }
};

/**
 * Clear audit logs (admin only)
 */
export const clearAuditLogs = async () => {
  try {
    localStorage.removeItem('audit_logs_cache');
    return true;
  } catch (error) {
    console.error('Clear audit logs error:', error);
    return false;
  }
};

/**
 * Export audit logs to CSV
 */
export const exportAuditLogsToCSV = async (filters = {}) => {
  try {
    const logs = await getFilteredAuditLogs(filters);
    
    // Create CSV header
    const headers = ['Timestamp', 'Actor ID', 'Action', 'Entity Type', 'Entity ID', 'Before State', 'After State'];
    
    // Create CSV rows
    const rows = logs.map(log => [
      log.timestamp,
      log.actor_id,
      log.action,
      log.entity_type,
      log.entity_id,
      JSON.stringify(log.before_state || {}),
      JSON.stringify(log.after_state || {})
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Export audit logs error:', error);
    return false;
  }
};

// Made with Bob
