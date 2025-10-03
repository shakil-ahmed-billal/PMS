
// Demo users
export const demoUsers = [
  {
    id: 'leader-1',
    email: 'leader@example.com',
    full_name: 'Sarah Johnson',
    role: 'leader',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'member-1',
    email: 'john@example.com',
    full_name: 'John Smith',
    role: 'member',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'member-2',
    email: 'alice@example.com',
    full_name: 'Alice Brown',
    role: 'member',
    created_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 'member-3',
    email: 'mike@example.com',
    full_name: 'Mike Wilson',
    role: 'member',
    created_at: '2024-02-01T00:00:00Z'
  }
]

// Demo projects
export const demoProjects = [
  {
    id: 'project-1',
    title: 'E-commerce Website Redesign',
    description: 'Complete redesign of the company e-commerce platform with modern UI/UX',
    amount: 15000,
    status: 'in_progress',
    deadline: '2024-03-15',
    progress: 65,
    member_id: 'member-1',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z'
  },
  {
    id: 'project-2',
    title: 'Mobile App Development',
    description: 'Native iOS and Android app for customer engagement',
    amount: 25000,
    status: 'completed',
    deadline: '2024-02-28',
    progress: 100,
    member_id: 'member-1',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-02-28T00:00:00Z'
  },
  {
    id: 'project-3',
    title: 'Database Migration',
    description: 'Migrate legacy database to modern cloud infrastructure',
    amount: 8000,
    status: 'pending',
    deadline: '2024-04-01',
    progress: 15,
    member_id: 'member-2',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z'
  },
  {
    id: 'project-4',
    title: 'API Integration',
    description: 'Integrate third-party payment and shipping APIs',
    amount: 12000,
    status: 'in_progress',
    deadline: '2024-03-30',
    progress: 40,
    member_id: 'member-2',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-02-20T00:00:00Z'
  },
  {
    id: 'project-5',
    title: 'Security Audit',
    description: 'Comprehensive security audit and vulnerability assessment',
    amount: 6000,
    status: 'completed',
    deadline: '2024-02-15',
    progress: 100,
    member_id: 'member-3',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z'
  },
  {
    id: 'project-6',
    title: 'Performance Optimization',
    description: 'Optimize application performance and reduce load times',
    amount: 4500,
    status: 'cancelled',
    deadline: '2024-03-01',
    progress: 25,
    member_id: 'member-3',
    created_at: '2024-01-30T00:00:00Z',
    updated_at: '2024-02-25T00:00:00Z'
  },
  {
    id: 'project-7',
    title: 'Content Management System',
    description: 'Build custom CMS for content creators',
    amount: 18000,
    status: 'in_progress',
    deadline: '2024-04-15',
    progress: 30,
    member_id: 'member-1',
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-02-28T00:00:00Z'
  },
  {
    id: 'project-8',
    title: 'Analytics Dashboard',
    description: 'Real-time analytics dashboard for business metrics',
    amount: 9500,
    status: 'pending',
    deadline: '2024-05-01',
    progress: 5,
    member_id: 'member-2',
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-02-25T00:00:00Z'
  }
]

// Demo tasks
export const demoTasks= [
  // Tasks for project-1 (E-commerce Website Redesign)
  {
    id: 'task-1',
    title: 'Design Homepage Layout',
    description: 'Create wireframes and mockups for the new homepage',
    status: 'completed',
    priority: 'high',
    deadline: '2024-02-01',
    project_id: 'project-1',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Implement Product Catalog',
    description: 'Build responsive product catalog with filtering',
    status: 'in_progress',
    priority: 'high',
    deadline: '2024-03-01',
    project_id: 'project-1',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z'
  },
  {
    id: 'task-3',
    title: 'Shopping Cart Integration',
    description: 'Integrate shopping cart functionality',
    status: 'pending',
    priority: 'medium',
    deadline: '2024-03-10',
    project_id: 'project-1',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  },
  // Tasks for project-2 (Mobile App Development)
  {
    id: 'task-4',
    title: 'iOS App Development',
    description: 'Develop native iOS application',
    status: 'completed',
    priority: 'high',
    deadline: '2024-02-20',
    project_id: 'project-2',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-02-20T00:00:00Z'
  },
  {
    id: 'task-5',
    title: 'Android App Development',
    description: 'Develop native Android application',
    status: 'completed',
    priority: 'high',
    deadline: '2024-02-25',
    project_id: 'project-2',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-02-25T00:00:00Z'
  },
  {
    id: 'task-6',
    title: 'App Store Deployment',
    description: 'Deploy apps to App Store and Google Play',
    status: 'completed',
    priority: 'medium',
    deadline: '2024-02-28',
    project_id: 'project-2',
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-02-28T00:00:00Z'
  },
  // Tasks for project-3 (Database Migration)
  {
    id: 'task-7',
    title: 'Data Analysis',
    description: 'Analyze existing database structure and data',
    status: 'completed',
    priority: 'high',
    deadline: '2024-02-15',
    project_id: 'project-3',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z'
  },
  {
    id: 'task-8',
    title: 'Migration Script Development',
    description: 'Develop scripts for data migration',
    status: 'pending',
    priority: 'high',
    deadline: '2024-03-15',
    project_id: 'project-3',
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z'
  },
  // Tasks for project-4 (API Integration)
  {
    id: 'task-9',
    title: 'Payment API Integration',
    description: 'Integrate Stripe payment processing',
    status: 'in_progress',
    priority: 'high',
    deadline: '2024-03-15',
    project_id: 'project-4',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-02-20T00:00:00Z'
  },
  {
    id: 'task-10',
    title: 'Shipping API Integration',
    description: 'Integrate shipping provider APIs',
    status: 'pending',
    priority: 'medium',
    deadline: '2024-03-25',
    project_id: 'project-4',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  }
]

// Helper functions to get data with relationships
export const getProjectWithProfile = (projectId) => {
  const project = demoProjects.find(p => p.id === projectId)
  if (!project) return null
  
  const profile = demoUsers.find(u => u.id === project.member_id)
  return {
    ...project,
    profiles: profile
  }
}

export const getAllProjectsWithProfiles = () => {
  return demoProjects.map(project => {
    const profile = demoUsers.find(u => u.id === project.member_id)
    return {
      ...project,
      profiles: profile
    }
  })
}

export const getProjectsByMemberId = (memberId) => {
  return demoProjects.filter(p => p.member_id === memberId)
}

export const getTasksByProjectId = (projectId) => {
  return demoTasks.filter(t => t.project_id === projectId)
}

export const getUserByEmail = (email) => {
  return demoUsers.find(u => u.email === email)
}

// Demo authentication credentials
export const demoCredentials = {
  leader: { email: 'leader@example.com', password: 'password123' },
  member1: { email: 'john@example.com', password: 'password123' },
  member2: { email: 'alice@example.com', password: 'password123' },
  member3: { email: 'mike@example.com', password: 'password123' }
}