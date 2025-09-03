// Используем Supabase
import { 
  saveMessage as supabaseSaveMessage,
  getMessages as supabaseGetMessages,
  saveCanvasObject as supabaseSaveCanvasObject,
  getCanvasObjects as supabaseGetCanvasObjects,
  createProject as supabaseCreateProject,
  getProjects as supabaseGetProjects
} from './supabase'

export async function saveMessage(data: {
  projectId: string
  content: string
  role: 'user' | 'assistant'
}) {
  try {
    return await supabaseSaveMessage(data)
  } catch (error) {
    console.error('Error saving message:', error)
    throw error
  }
}

export async function getMessages(projectId = 'default-project') {
  try {
    return await supabaseGetMessages(projectId)
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
    return await supabaseSaveCanvasObject(data)
  } catch (error) {
    console.error('Error saving canvas object:', error)
    throw error
  }
}

export async function getCanvasObjects(projectId = 'default-project') {
  try {
    return await supabaseGetCanvasObjects(projectId)
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
    return await supabaseCreateProject(data)
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export async function getProjects(ownerId: string) {
  try {
    return await supabaseGetProjects(ownerId)
  } catch (error) {
    console.error('Error getting projects:', error)
    return []
  }
}
