/**
 * Extracts a user-friendly error message from an API error response
 * @param {Error} error The error object (usually from Axios)
 * @param {string} fallback A fallback message if no specific error can be extracted
 * @returns {string} A user-friendly error message
 */
export const getErrorMessage = (error, fallback = 'An unexpected error occurred') => {
  if (!error.response) {
    if (error.message === 'Network Error') {
      return 'Cannot connect to the server. Please check your internet connection and ensure the backend is running.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    return error.message || fallback;
  }

  const data = error.response.data;
  const status = error.response.status;

  if (status === 401) {
    return 'Your session has expired. Please login again.';
  }

  if (status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (status === 404) {
    return 'The requested resource was not found.';
  }

  if (status >= 500) {
    // Try to get specific error message from backend for 500 errors
    if (data?.error) {
      return `Server error: ${data.error}`;
    }
    if (data?.message) {
      return `Server error: ${data.message}`;
    }
    if (data?.detail) {
      return `Server error: ${data.detail}`;
    }
    return 'Server error. Please try again later or contact support.';
  }

  if (data?.message) {
    return data.message;
  }
  
  if (data?.error) {
    return data.error;
  }

  if (data?.detail) {
    return data.detail;
  }

  // Handle Django Rest Framework validation errors
  if (data && typeof data === 'object') {
    const errorMessages = [];
    
    for (const [field, messages] of Object.entries(data)) {
      if (Array.isArray(messages)) {
        errorMessages.push(`${field}: ${messages.join(' ')}`);
      } else if (typeof messages === 'string') {
        errorMessages.push(`${field}: ${messages}`);
      } else if (typeof messages === 'object') {
        // Handle nested objects if necessary
        errorMessages.push(`${field}: invalid input`);
      }
    }
    
    if (errorMessages.length > 0) {
      return errorMessages.join(' | ');
    }
  }

  return fallback;
};

/**
 * Get error details for debugging
 * @param {Error} error The error object
 * @returns {Object} Error details including status, message, and data
 */
export const getErrorDetails = (error) => {
  if (!error.response) {
    return {
      status: null,
      message: error.message,
      code: error.code,
      isNetworkError: error.message === 'Network Error',
    };
  }

  return {
    status: error.response.status,
    message: error.response.data?.error || error.response.data?.message || error.response.data?.detail,
    data: error.response.data,
    headers: error.response.headers,
  };
};
