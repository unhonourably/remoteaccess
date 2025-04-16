export type UserRole = 'student' | 'counselor' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  school: SchoolName
  role: UserRole
  createdAt: string
  lastLogin: string
  bio?: string
  profileImage?: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface SchoolSettings {
  name: SchoolName
  primaryColor: string
  accentColor: string
  counselors: Counselor[]
  resources: Resource[]
}

export interface Counselor {
  id: string
  name: string
  email: string
  title: string
  availability: string[]
  subjects: string[]
}

export interface Resource {
  id: string
  title: string
  link: string
  description: string
  category: 'mental-health' | 'academic' | 'bullying' | 'college-career' | 'other'
  tags: string[]
}

export type SchoolName = 'Parkway North' | 'Parkway South' | 'Parkway West' | 'Parkway Central'

export interface DashboardLink {
  name: string
  href: string
  icon: string
  current: boolean
} 