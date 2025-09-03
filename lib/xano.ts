// Xano API клиент для работы с базой данных
const XANO_API_URL = process.env.XANO_API_URL || ''
const XANO_API_KEY = process.env.XANO_API_KEY || ''

interface XanoResponse<T> {
  success: boolean
  data: T
  message?: string
}

export class XanoClient {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = XANO_API_URL
    this.apiKey = XANO_API_KEY
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<XanoResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Xano API error:', error)
      throw error
    }
  }

  // Сохранение сообщения
  async saveMessage(data: {
    projectId: string
    content: string
    role: 'user' | 'assistant'
  }) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({
        project_id: data.projectId,
        content: data.content,
        role: data.role,
        created_at: new Date().toISOString()
      })
    })
  }

  // Получение сообщений
  async getMessages(projectId = 'default-project') {
    const response = await this.request<Array<{
      id: string
      project_id: string
      content: string
      role: string
      created_at: string
    }>>(`/messages?project_id=${projectId}`)
    
    return response.data || []
  }

  // Сохранение объекта Canvas
  async saveCanvasObject(data: {
    projectId: string
    type: string
    content: string
    positionX: number
    positionY: number
    createdBy: 'ai' | 'user'
  }) {
    return this.request('/canvas_objects', {
      method: 'POST',
      body: JSON.stringify({
        project_id: data.projectId,
        type: data.type,
        content: data.content,
        position_x: data.positionX,
        position_y: data.positionY,
        created_by: data.createdBy,
        created_at: new Date().toISOString()
      })
    })
  }

  // Получение объектов Canvas
  async getCanvasObjects(projectId = 'default-project') {
    const response = await this.request<Array<{
      id: string
      project_id: string
      type: string
      content: string
      position_x: number
      position_y: number
      created_by: string
      created_at: string
    }>>(`/canvas_objects?project_id=${projectId}`)
    
    return response.data || []
  }

  // Создание проекта
  async createProject(data: {
    title: string
    description: string
    ownerId: string
  }) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        owner_id: data.ownerId,
        current_phase: 1,
        created_at: new Date().toISOString()
      })
    })
  }

  // Получение проектов
  async getProjects(ownerId: string) {
    const response = await this.request<Array<{
      id: string
      title: string
      description: string
      owner_id: string
      current_phase: number
      created_at: string
    }>>(`/projects?owner_id=${ownerId}`)
    
    return response.data || []
  }
}

// Экспортируем функции для совместимости с существующим кодом
const xanoClient = new XanoClient()

export async function saveMessage(data: {
  projectId: string
  content: string
  role: 'user' | 'assistant'
}) {
  return xanoClient.saveMessage(data)
}

export async function getMessages(projectId = 'default-project') {
  return xanoClient.getMessages(projectId)
}

export async function saveCanvasObject(data: {
  projectId: string
  type: string
  content: string
  positionX: number
  positionY: number
  createdBy: 'ai' | 'user'
}) {
  return xanoClient.saveCanvasObject(data)
}

export async function getCanvasObjects(projectId = 'default-project') {
  return xanoClient.getCanvasObjects(projectId)
}

export async function createProject(data: {
  title: string
  description: string
  ownerId: string
}) {
  return xanoClient.createProject(data)
}

export async function getProjects(ownerId: string) {
  return xanoClient.getProjects(ownerId)
}
