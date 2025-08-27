// Centralized error handling utilities
export const handleApiError = (error, fallbackMessage = 'An unexpected error occurred') => {
  console.error('API Error:', error);
  
  // Check for network errors
  if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
    return {
      type: 'network',
      message: 'Unable to connect to the server. Please check your internet connection and try again.',
      canRetry: true
    };
  }
  
  // Check for authentication errors
  if (error.response?.status === 401 || error.response?.status === 403) {
    return {
      type: 'auth',
      message: 'Authentication required. Please sign in to continue.',
      canRetry: false
    };
  }
  
  // Check for server errors
  if (error.response?.status >= 500) {
    return {
      type: 'server',
      message: 'Server error. Please try again later.',
      canRetry: true
    };
  }
  
  // Check for client errors
  if (error.response?.status >= 400) {
    return {
      type: 'client',
      message: error.response?.data?.message || 'Invalid request. Please check your input.',
      canRetry: false
    };
  }
  
  // Generic error
  return {
    type: 'generic',
    message: error.message || fallbackMessage,
    canRetry: true
  };
};

export const withErrorHandling = async (apiCall, fallbackData = null) => {
  try {
    return await apiCall();
  } catch (error) {
    const errorInfo = handleApiError(error);
    console.warn(`API call failed: ${errorInfo.message}`);
    return fallbackData;
  }
};

export const createSafeApiCall = (entityName, method, fallbackData = []) => {
  return async (...args) => {
    try {
      // Import the entities module directly instead of using dynamic imports
      const { 
        Employee, Training, LeaveRequest, PerformanceReview, Policy, 
        SupportTicket, Company, AILesson, BillingInvoice, Applicant, 
        JobPosting, GlossaryTerm, ChatMessage, ChatChannel, PrivacyConsent, 
        AuditLog, ExitInterview, PulseSurvey, SurveyResponse, Payslip, SiteContent 
      } = await import('@/api/entities.js');
      
      // Map entity names to their imported entities
      const entityMap = {
        Employee,
        Training,
        LeaveRequest,
        PerformanceReview,
        Policy,
        SupportTicket,
        Company,
        AILesson,
        BillingInvoice,
        Applicant,
        JobPosting,
        GlossaryTerm,
        ChatMessage,
        ChatChannel,
        PrivacyConsent,
        AuditLog,
        ExitInterview,
        PulseSurvey,
        SurveyResponse,
        Payslip,
        SiteContent
      };
      
      const entity = entityMap[entityName];
      if (!entity) {
        throw new Error(`Entity ${entityName} not found`);
      }
      
      return await entity[method](...args);
    } catch (error) {
      console.warn(`Safe API call failed for ${entityName}.${method}:`, error);
      return fallbackData;
    }
  };
};