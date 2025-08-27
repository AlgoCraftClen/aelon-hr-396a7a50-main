/**
 * VERSION MANAGER - Application Version Control
 * 
 * This utility manages version control and provides rollback capabilities
 * for the IAKWE HR application.
 */

export const APPLICATION_VERSIONS = {
  'v1.0-STABLE': {
    name: 'IAKWE HR Baseline',
    date: '2024-01-16',
    description: 'Stable foundation with all core features',
    protected: true,
    components: {
      layout: 'AuthenticatedLayout.js',
      ai: 'FloatingAIAssistant.js',
      pages: [
        'Dashboard.js',
        'EmployeeDirectory.js',
        'Onboarding.js',
        'TrainingCenter.js',
        'LeaveManagement.js',
        'PerformanceReviews.js',
        'Compliance.js',
        'Analytics.js',
        'Recruitment.js',
        'AdminChat.js',
        'Glossary.js',
        'Settings.js',
        'Support.js'
      ],
      entities: [
        'Employee',
        'Training',
        'TrainingProgress', 
        'LeaveRequest',
        'PerformanceReview',
        'Policy',
        'PolicyAcknowledgment',
        'SupportTicket',
        'Company',
        'AILesson',
        'User'
      ]
    },
    features: [
      'Dark theme UI',
      'Floating AI assistant',
      'Complete navigation',
      'Marshall Islands cultural integration',
      'Sample data population',
      'Guest mode functionality',
      'Role-based access control'
    ]
  }
};

export const PROTECTED_OPERATIONS = {
  // Operations that require special approval
  DELETE_PAGE: 'delete_page',
  MODIFY_LAYOUT: 'modify_layout', 
  REMOVE_AI: 'remove_ai',
  CHANGE_NAVIGATION: 'change_navigation',
  ALTER_THEME: 'alter_theme'
};

export class VersionGuard {
  static validateOperation(operation, targetComponent) {
    const isProtectedComponent = this.isProtectedComponent(targetComponent);
    const isDestructiveOperation = this.isDestructiveOperation(operation);
    
    if (isProtectedComponent && isDestructiveOperation) {
      throw new Error(
        `BLOCKED: Cannot perform ${operation} on protected component ${targetComponent}. ` +
        `This would compromise v1.0-STABLE integrity.`
      );
    }
    
    return true;
  }
  
  static isProtectedComponent(component) {
    const protectedComponents = APPLICATION_VERSIONS['v1.0-STABLE'].components;
    
    return (
      component === protectedComponents.layout ||
      component === protectedComponents.ai ||
      protectedComponents.pages.includes(component) ||
      protectedComponents.entities.includes(component)
    );
  }
  
  static isDestructiveOperation(operation) {
    const destructiveOps = [
      PROTECTED_OPERATIONS.DELETE_PAGE,
      PROTECTED_OPERATIONS.MODIFY_LAYOUT,
      PROTECTED_OPERATIONS.REMOVE_AI,
      PROTECTED_OPERATIONS.CHANGE_NAVIGATION,
      PROTECTED_OPERATIONS.ALTER_THEME
    ];
    
    return destructiveOps.includes(operation);
  }
  
  static logChange(version, component, operation, description) {
    const changeLog = {
      timestamp: new Date().toISOString(),
      version,
      component,
      operation, 
      description,
      approved: !this.isProtectedComponent(component)
    };
    
    console.log('VERSION CHANGE:', changeLog);
    
    // In a real application, this would be persisted to a database
    return changeLog;
  }
  
  static createRollbackPoint() {
    // Create a snapshot of current application state
    const rollbackData = {
      version: 'v1.0-STABLE',
      timestamp: new Date().toISOString(),
      components: APPLICATION_VERSIONS['v1.0-STABLE'].components,
      note: 'Stable baseline rollback point'
    };
    
    localStorage.setItem('iakwe_rollback_v1.0', JSON.stringify(rollbackData));
    return rollbackData;
  }
  
  static executeRollback() {
    const rollbackData = localStorage.getItem('iakwe_rollback_v1.0');
    
    if (!rollbackData) {
      throw new Error('No rollback point found for v1.0-STABLE');
    }
    
    // In a real application, this would restore the codebase from backup
    console.log('ROLLBACK INITIATED:', JSON.parse(rollbackData));
    
    // Force page reload to restore stable state
    window.location.reload();
  }
}

// Initialize rollback point on first load
if (typeof window !== 'undefined') {
  VersionGuard.createRollbackPoint();
}

export default VersionGuard;