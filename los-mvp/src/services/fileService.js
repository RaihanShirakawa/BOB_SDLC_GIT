import { MAX_FILE_SIZE } from '../utils/constants';

/**
 * File Service
 * Handles file upload, download, and management using browser File API
 */

/**
 * Upload file and store in browser storage
 */
export const uploadFile = async (file, applicationId, docType) => {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    
    // Read file as base64
    const base64 = await readFileAsBase64(file);
    
    // Create file metadata
    const fileData = {
      filename: file.name,
      mime_type: file.type,
      file_size: file.size,
      doc_type: docType,
      application_id: applicationId,
      storage_path: `uploads/${applicationId}/${file.name}`,
      content: base64 // Store base64 content
    };
    
    // Store in localStorage (for demo purposes)
    const storageKey = `file_${applicationId}_${Date.now()}`;
    localStorage.setItem(storageKey, JSON.stringify(fileData));
    
    return {
      ...fileData,
      storage_key: storageKey
    };
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
};

/**
 * Read file as base64
 */
const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Download file from storage
 */
export const downloadFile = async (storageKey, filename) => {
  try {
    const fileDataStr = localStorage.getItem(storageKey);
    
    if (!fileDataStr) {
      throw new Error('File not found');
    }
    
    const fileData = JSON.parse(fileDataStr);
    
    // Create blob from base64
    const blob = base64ToBlob(fileData.content, fileData.mime_type);
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || fileData.filename;
    link.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Download file error:', error);
    throw error;
  }
};

/**
 * Convert base64 to Blob
 */
const base64ToBlob = (base64, mimeType) => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
};

/**
 * Delete file from storage
 */
export const deleteFile = async (storageKey) => {
  try {
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

/**
 * Get file preview URL
 */
export const getFilePreviewUrl = async (storageKey) => {
  try {
    const fileDataStr = localStorage.getItem(storageKey);
    
    if (!fileDataStr) {
      throw new Error('File not found');
    }
    
    const fileData = JSON.parse(fileDataStr);
    
    // For images, return base64 directly
    if (fileData.mime_type.startsWith('image/')) {
      return fileData.content;
    }
    
    // For PDFs, create object URL
    if (fileData.mime_type === 'application/pdf') {
      const blob = base64ToBlob(fileData.content, fileData.mime_type);
      return window.URL.createObjectURL(blob);
    }
    
    return null;
  } catch (error) {
    console.error('Get file preview URL error:', error);
    return null;
  }
};

/**
 * Validate file type
 */
export const validateFileType = (file, allowedTypes) => {
  if (!allowedTypes || allowedTypes.length === 0) {
    return true;
  }
  
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const category = type.split('/')[0];
      return file.type.startsWith(category + '/');
    }
    return file.type === type;
  });
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get all files for an application
 */
export const getApplicationFiles = (applicationId) => {
  try {
    const files = [];
    
    // Iterate through localStorage to find files for this application
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith('file_')) {
        const fileDataStr = localStorage.getItem(key);
        const fileData = JSON.parse(fileDataStr);
        
        if (fileData.application_id === applicationId) {
          files.push({
            ...fileData,
            storage_key: key
          });
        }
      }
    }
    
    return files;
  } catch (error) {
    console.error('Get application files error:', error);
    return [];
  }
};

/**
 * Clear all files for an application
 */
export const clearApplicationFiles = (applicationId) => {
  try {
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith('file_')) {
        const fileDataStr = localStorage.getItem(key);
        const fileData = JSON.parse(fileDataStr);
        
        if (fileData.application_id === applicationId) {
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    return true;
  } catch (error) {
    console.error('Clear application files error:', error);
    return false;
  }
};

/**
 * Extract text from file (simple mock for demo)
 */
export const extractTextFromFile = async (file) => {
  try {
    // For demo purposes, return mock extracted data
    // In real app, this would use OCR or document parsing libraries
    
    if (file.type === 'application/pdf') {
      return {
        text: 'Mock extracted text from PDF',
        fields: {
          account_number: '1234567890',
          period: '2024-01',
          total_credits: 50000000,
          total_debits: 30000000
        }
      };
    }
    
    if (file.type.startsWith('image/')) {
      return {
        text: 'Mock extracted text from image',
        fields: {}
      };
    }
    
    // For text files, read actual content
    if (file.type.startsWith('text/')) {
      const text = await readFileAsText(file);
      return {
        text,
        fields: {}
      };
    }
    
    return {
      text: '',
      fields: {}
    };
  } catch (error) {
    console.error('Extract text from file error:', error);
    return {
      text: '',
      fields: {}
    };
  }
};

/**
 * Read file as text
 */
const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// Made with Bob
