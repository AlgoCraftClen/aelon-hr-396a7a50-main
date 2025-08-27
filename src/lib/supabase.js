import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we're in development mode and environment variables are missing
const isDevMode = import.meta.env.DEV
const hasEnvVars = supabaseUrl && supabaseAnonKey

// Create a mock Supabase client for development when env vars are missing
const createMockSupabaseClient = () => {
  console.log('🔧 Using mock Supabase client for development')
  
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Mock auth - please configure Supabase' } }),
      signUp: async () => ({ data: null, error: { message: 'Mock auth - please configure Supabase' } }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ error: null }),
      onAuthStateChange: (callback) => {
        // Mock auth state change listener
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      signInWithOAuth: async () => ({ data: null, error: { message: 'Mock OAuth - please configure Supabase' } })
    },
    from: (table) => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: { message: 'Mock DB - please configure Supabase' } }),
      update: () => ({ data: null, error: { message: 'Mock DB - please configure Supabase' } }),
      delete: () => ({ error: { message: 'Mock DB - please configure Supabase' } }),
      eq: function() { return this },
      order: function() { return this },
      limit: function() { return this }
    }),
    storage: {
      from: (bucket) => ({
        upload: async () => ({ data: { path: 'mock-path' }, error: null }),
        download: async () => ({ data: null, error: { message: 'Mock storage - please configure Supabase' } }),
        getPublicUrl: (path) => ({ data: { publicUrl: `mock-url/${path}` } }),
        remove: async () => ({ error: null })
      })
    }
  }
}

// Create the appropriate client
export const supabase = hasEnvVars 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createMockSupabaseClient()

// Auth helpers
export const auth = {
  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
    return data
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Reset password
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  },

  // Update password
  updatePassword: async (password) => {
    const { error } = await supabase.auth.updateUser({
      password
    })
    if (error) throw error
  }
}

// Database helpers
export const db = {
  // Generic CRUD operations
  select: async (table, options = {}) => {
    let query = supabase.from(table).select(options.select || '*')
    
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending })
    }
    
    if (options.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  insert: async (table, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
    if (error) throw error
    return result[0]
  },

  update: async (table, id, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
    if (error) throw error
    return result[0]
  },

  delete: async (table, id) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Specific table operations
  employees: {
    getAll: () => db.select('employees'),
    getById: (id) => db.select('employees', { filters: { id } }),
    create: (data) => db.insert('employees', data),
    update: (id, data) => db.update('employees', id, data),
    delete: (id) => db.delete('employees', id)
  },

  trainings: {
    getAll: () => db.select('trainings'),
    getById: (id) => db.select('trainings', { filters: { id } }),
    create: (data) => db.insert('trainings', data),
    update: (id, data) => db.update('trainings', id, data),
    delete: (id) => db.delete('trainings', id)
  },

  leave_requests: {
    getAll: () => db.select('leave_requests'),
    getById: (id) => db.select('leave_requests', { filters: { id } }),
    create: (data) => db.insert('leave_requests', data),
    update: (id, data) => db.update('leave_requests', id, data),
    delete: (id) => db.delete('leave_requests', id)
  },

  performance_reviews: {
    getAll: () => db.select('performance_reviews'),
    getById: (id) => db.select('performance_reviews', { filters: { id } }),
    create: (data) => db.insert('performance_reviews', data),
    update: (id, data) => db.update('performance_reviews', id, data),
    delete: (id) => db.delete('performance_reviews', id)
  },

  policies: {
    getAll: () => db.select('policies'),
    getById: (id) => db.select('policies', { filters: { id } }),
    create: (data) => db.insert('policies', data),
    update: (id, data) => db.update('policies', id, data),
    delete: (id) => db.delete('policies', id)
  },

  support_tickets: {
    getAll: () => db.select('support_tickets'),
    getById: (id) => db.select('support_tickets', { filters: { id } }),
    create: (data) => db.insert('support_tickets', data),
    update: (id, data) => db.update('support_tickets', id, data),
    delete: (id) => db.delete('support_tickets', id)
  },

  companies: {
    getAll: () => db.select('companies'),
    getById: (id) => db.select('companies', { filters: { id } }),
    create: (data) => db.insert('companies', data),
    update: (id, data) => db.update('companies', id, data),
    delete: (id) => db.delete('companies', id)
  },

  ai_lessons: {
    getAll: () => db.select('ai_lessons'),
    getById: (id) => db.select('ai_lessons', { filters: { id } }),
    create: (data) => db.insert('ai_lessons', data),
    update: (id, data) => db.update('ai_lessons', id, data),
    delete: (id) => db.delete('ai_lessons', id)
  }
}

// Storage helpers
export const storage = {
  upload: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    if (error) throw error
    return data
  },

  download: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    if (error) throw error
    return data
  },

  getPublicUrl: (bucket, path) => {
    return supabase.storage
      .from(bucket)
      .getPublicUrl(path)
  },

  delete: async (bucket, path) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    if (error) throw error
  }
}
