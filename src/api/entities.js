import { db, auth, storage } from '@/lib/supabase'

// Mock data for development
const mockEmployees = [
  {
    id: '1',
    employee_id: 'EMP001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    employment_type: 'Full-time',
    start_date: '2023-01-15',
    location: 'Majuro',
    salary: 75000,
    emergency_contact_name: 'Jane Doe',
    emergency_contact_phone: '+692-555-0123',
    emergency_contact_relationship: 'Spouse'
  },
  {
    id: '2',
    employee_id: 'EMP002',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Human Resources',
    position: 'HR Manager',
    employment_type: 'Full-time',
    start_date: '2022-08-20',
    location: 'Ebeye',
    salary: 65000,
    emergency_contact_name: 'Mike Johnson',
    emergency_contact_phone: '+692-555-0456',
    emergency_contact_relationship: 'Spouse'
  },
  {
    id: '3',
    employee_id: 'EMP003',
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@company.com',
    department: 'Finance',
    position: 'Accountant',
    employment_type: 'Full-time',
    start_date: '2023-03-10',
    location: 'Jaluit',
    salary: 55000,
    emergency_contact_name: 'Lisa Wilson',
    emergency_contact_phone: '+692-555-0789',
    emergency_contact_relationship: 'Spouse'
  }
]

const mockTrainings = [
  {
    id: '1',
    title: 'Workplace Safety Training',
    description: 'Essential safety protocols for the workplace',
    category: 'Safety',
    type: 'Mandatory',
    duration_minutes: 60,
    is_mandatory: true,
    cultural_relevance: true
  },
  {
    id: '2',
    title: 'Cultural Sensitivity Workshop',
    description: 'Understanding Marshall Islands culture and traditions',
    category: 'Cultural',
    type: 'Workshop',
    duration_minutes: 90,
    is_mandatory: false,
    cultural_relevance: true
  },
  {
    id: '3',
    title: 'Leadership Development',
    description: 'Building leadership skills for managers',
    category: 'Professional Development',
    type: 'Course',
    duration_minutes: 120,
    is_mandatory: false,
    cultural_relevance: false
  }
]

const mockPolicies = [
  {
    id: '1',
    title: 'Equal Employment Opportunity Policy',
    content: 'Our company is committed to providing equal employment opportunities...',
    category: 'Employment',
    version: '1.0',
    effective_date: '2023-01-01',
    is_active: true
  },
  {
    id: '2',
    title: 'Remote Work Policy',
    content: 'Guidelines for remote work arrangements...',
    category: 'Work Arrangements',
    version: '2.1',
    effective_date: '2023-06-01',
    is_active: true
  },
  {
    id: '3',
    title: 'Cultural Leave Policy',
    content: 'Supporting cultural and traditional observances...',
    category: 'Leave',
    version: '1.0',
    effective_date: '2023-01-01',
    is_active: true
  }
]

// Enhanced database helpers with mock data fallback
const createMockDataHelper = (mockData) => ({
  getAll: async () => {
    try {
      return await db.select('employees')
    } catch (error) {
      console.log('🔧 Using mock data for development')
      return mockData
    }
  },
  getById: async (id) => {
    try {
      return await db.select('employees', { filters: { id } })
    } catch (error) {
      console.log('🔧 Using mock data for development')
      return mockData.filter(item => item.id === id)
    }
  },
  create: async (data) => {
    try {
      return await db.insert('employees', data)
    } catch (error) {
      console.log('🔧 Mock create operation')
      return { ...data, id: Date.now().toString() }
    }
  },
  update: async (id, data) => {
    try {
      return await db.update('employees', id, data)
    } catch (error) {
      console.log('🔧 Mock update operation')
      return { ...data, id }
    }
  },
  delete: async (id) => {
    try {
      return await db.delete('employees', id)
    } catch (error) {
      console.log('🔧 Mock delete operation')
      return { success: true }
    }
  }
})

// Export the database helpers as entities for backward compatibility
export const Employee = createMockDataHelper(mockEmployees)
export const Training = createMockDataHelper(mockTrainings)
export const TrainingProgress = createMockDataHelper([])
export const LeaveRequest = createMockDataHelper([])
export const PerformanceReview = createMockDataHelper([])
export const Policy = createMockDataHelper(mockPolicies)
export const PolicyAcknowledgment = createMockDataHelper([])
export const SupportTicket = createMockDataHelper([])
export const Company = createMockDataHelper([])

// Auth entity
export const User = auth

// Additional entities that need custom implementation
export const AILesson = {
  getAll: async () => {
    try {
      return await db.select('ai_lessons')
    } catch (error) {
      console.log('🔧 Using mock data for AILesson development')
      return []
    }
  },
  list: async () => {
    try {
      return await db.select('ai_lessons')
    } catch (error) {
      console.log('🔧 Using mock data for AILesson development')
      return []
    }
  },
  getById: async (id) => {
    try {
      return await db.select('ai_lessons', { filters: { id } })
    } catch (error) {
      console.log('🔧 Using mock data for AILesson development')
      return []
    }
  },
  create: async (data) => {
    try {
      return await db.insert('ai_lessons', data)
    } catch (error) {
      console.log('🔧 Mock AILesson create operation')
      return { ...data, id: Date.now().toString(), created_at: new Date().toISOString() }
    }
  },
  update: async (id, data) => {
    try {
      return await db.update('ai_lessons', id, data)
    } catch (error) {
      console.log('🔧 Mock AILesson update operation')
      return { ...data, id }
    }
  },
  delete: async (id) => {
    try {
      return await db.delete('ai_lessons', id)
    } catch (error) {
      console.log('🔧 Mock AILesson delete operation')
      return { success: true }
    }
  }
}

export const AuthSession = {
  getCurrent: () => auth.getUser(),
  signOut: () => auth.signOut()
}

export const BillingInvoice = {
  getAll: () => db.select('billing_invoices'),
  getById: (id) => db.select('billing_invoices', { filters: { id } }),
  create: (data) => db.insert('billing_invoices', data),
  update: (id, data) => db.update('billing_invoices', id, data),
  delete: (id) => db.delete('billing_invoices', id)
}

export const Applicant = {
  getAll: () => db.select('applicants'),
  getById: (id) => db.select('applicants', { filters: { id } }),
  create: (data) => db.insert('applicants', data),
  update: (id, data) => db.update('applicants', id, data),
  delete: (id) => db.delete('applicants', id)
}

export const JobPosting = {
  getAll: () => db.select('job_postings'),
  getById: (id) => db.select('job_postings', { filters: { id } }),
  create: (data) => db.insert('job_postings', data),
  update: (id, data) => db.update('job_postings', id, data),
  delete: (id) => db.delete('job_postings', id)
}

export const GlossaryTerm = {
  getAll: () => db.select('glossary_terms'),
  getById: (id) => db.select('glossary_terms', { filters: { id } }),
  create: (data) => db.insert('glossary_terms', data),
  update: (id, data) => db.update('glossary_terms', id, data),
  delete: (id) => db.delete('glossary_terms', id)
}

export const ChatMessage = {
  getAll: () => db.select('chat_messages'),
  getById: (id) => db.select('chat_messages', { filters: { id } }),
  create: (data) => db.insert('chat_messages', data),
  update: (id, data) => db.update('chat_messages', id, data),
  delete: (id) => db.delete('chat_messages', id)
}

export const ChatChannel = {
  getAll: () => db.select('chat_channels'),
  getById: (id) => db.select('chat_channels', { filters: { id } }),
  create: (data) => db.insert('chat_channels', data),
  update: (id, data) => db.update('chat_channels', id, data),
  delete: (id) => db.delete('chat_channels', id)
}

export const PrivacyConsent = {
  getAll: () => db.select('privacy_consents'),
  getById: (id) => db.select('privacy_consents', { filters: { id } }),
  create: (data) => db.insert('privacy_consents', data),
  update: (id, data) => db.update('privacy_consents', id, data),
  delete: (id) => db.delete('privacy_consents', id)
}

export const AuditLog = {
  getAll: () => db.select('audit_logs'),
  getById: (id) => db.select('audit_logs', { filters: { id } }),
  create: (data) => db.insert('audit_logs', data),
  update: (id, data) => db.update('audit_logs', id, data),
  delete: (id) => db.delete('audit_logs', id)
}

export const ExitInterview = {
  getAll: () => db.select('exit_interviews'),
  getById: (id) => db.select('exit_interviews', { filters: { id } }),
  create: (data) => db.insert('exit_interviews', data),
  update: (id, data) => db.update('exit_interviews', id, data),
  delete: (id) => db.delete('exit_interviews', id)
}

export const PulseSurvey = {
  getAll: () => db.select('pulse_surveys'),
  getById: (id) => db.select('pulse_surveys', { filters: { id } }),
  create: (data) => db.insert('pulse_surveys', data),
  update: (id, data) => db.update('pulse_surveys', id, data),
  delete: (id) => db.delete('pulse_surveys', id)
}

export const SurveyResponse = {
  getAll: () => db.select('survey_responses'),
  getById: (id) => db.select('survey_responses', { filters: { id } }),
  create: (data) => db.insert('survey_responses', data),
  update: (id, data) => db.update('survey_responses', id, data),
  delete: (id) => db.delete('survey_responses', id)
}

export const Payslip = {
  getAll: () => db.select('payslips'),
  getById: (id) => db.select('payslips', { filters: { id } }),
  create: (data) => db.insert('payslips', data),
  update: (id, data) => db.update('payslips', id, data),
  delete: (id) => db.delete('payslips', id)
}

export const SiteContent = {
  getAll: () => db.select('site_content'),
  getById: (id) => db.select('site_content', { filters: { id } }),
  create: (data) => db.insert('site_content', data),
  update: (id, data) => db.update('site_content', id, data),
  delete: (id) => db.delete('site_content', id)
}
