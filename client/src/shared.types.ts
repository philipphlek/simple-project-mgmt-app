export type Client = {
  id: string
  name: string
  email: string
  phone: string
}

enum ProjectStatus {
  New = 'Not Started',
  Progress = 'In Progress',
  Completed = 'Completed',
}

export type Project = {
  id: string
  name: string
  description: string
  status: ProjectStatus
  clientId: string
}

export type ClientCache = {
  clients: Client[]
}
