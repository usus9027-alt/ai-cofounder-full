import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Типы для TypeScript
export interface User {
  id: string
  email: string
  name?: string
  created_at: string
}

export interface Project {
  id: string
  title: string
  description?: string
  owner_id: string
  current_phase: number
  created_at: string
}

export interface Message {
  id: string
  project_id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
}

export interface CanvasObject {
  id: string
  project_id: string
  type: 'problem' | 'insight' | 'persona' | 'solution' | 'milestone' | 'note' | 'image'
  position_x: number
  position_y: number
  width?: number
  height?: number
  content: any
  style?: any
  created_by: 'ai' | 'user'
  created_at: string
  updated_at: string
}

// Функции для работы с базой данных
export async function saveMessage(data: {
  projectId: string
  content: string
  role: 'user' | 'assistant'
}) {
  try {
    const { data: result, error } = await supabase
      .from('messages')
      .insert({
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        project_id: data.projectId,
        content: data.content,
        role: data.role,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) throw error
    return result
  } catch (error) {
    console.error('Error saving message:', error)
    throw error
  }
}

export async function getMessages(projectId = 'default-project') {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting messages:', error)
    return []
  }
}

export async function saveCanvasObject(data: {
  projectId: string
  type: string
  content: string
  positionX: number
  positionY: number
  createdBy: 'ai' | 'user'
}) {
  try {
    const { data: result, error } = await supabase
      .from('canvas_objects')
      .insert({
        id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        project_id: data.projectId,
        type: data.type,
        content: data.content,
        position_x: data.positionX,
        position_y: data.positionY,
        created_by: data.createdBy,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) throw error
    return result
  } catch (error) {
    console.error('Error saving canvas object:', error)
    throw error
  }
}

export async function getCanvasObjects(projectId = 'default-project') {
  try {
    const { data, error } = await supabase
      .from('canvas_objects')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting canvas objects:', error)
    return []
  }
}

export async function createProject(data: {
  title: string
  description: string
  ownerId: string
}) {
  try {
    const { data: result, error } = await supabase
      .from('projects')
      .insert({
        id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: data.title,
        description: data.description,
        owner_id: data.ownerId,
        current_phase: 1,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) throw error
    return result
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export async function getProjects(ownerId: string) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting projects:', error)
    return []
  }
}

// Функции для аутентификации
export async function signUp(email: string, password: string, name?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0]
        }
      }
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
