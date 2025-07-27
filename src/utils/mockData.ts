// 模擬用戶數據
export const mockUsers = {
  student: {
    id: '1',
    username: 'student001',
    name: '張小明',
    role: 'student' as const,
    email: 'student@example.com',
    phone: '0912345678',
    status: 'active' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  parent: {
    id: '2',
    username: 'parent001',
    name: '張爸爸',
    role: 'parent' as const,
    email: 'parent@example.com',
    phone: '0923456789',
    status: 'active' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  teacher: {
    id: '3',
    username: 'teacher001',
    name: '李老師',
    role: 'teacher' as const,
    email: 'teacher@example.com',
    phone: '0934567890',
    status: 'active' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  admin: {
    id: '4',
    username: 'admin001',
    name: '王管理員',
    role: 'admin' as const,
    email: 'admin@example.com',
    phone: '0945678901',
    status: 'active' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
}

// 模擬課程數據
export const mockCourses = [
  {
    id: 1,
    title: '數學基礎課程',
    teacher: '李老師',
    student: '張小明',
    date: '2024-01-15',
    time: '14:00-15:30',
    status: 'scheduled',
    classroom: 'A教室',
  },
  {
    id: 2,
    title: '英文會話練習',
    teacher: '王老師',
    student: '張小明',
    date: '2024-01-16',
    time: '16:00-17:30',
    status: 'scheduled',
    classroom: 'B教室',
  },
]

// 模擬請假記錄
export const mockLeaveRequests = [
  {
    id: 1,
    studentName: '張小明',
    courseTitle: '數學基礎課程',
    requestDate: '2024-01-10',
    leaveDate: '2024-01-15',
    reason: '身體不適',
    status: 'approved',
  },
]

// 模擬成績數據
export const mockGrades = [
  {
    id: 1,
    subject: '數學',
    examType: '段考',
    score: 85,
    maxScore: 100,
    examDate: '2024-01-10',
    classAverage: 78,
  },
  {
    id: 2,
    subject: '英文',
    examType: '段考',
    score: 92,
    maxScore: 100,
    examDate: '2024-01-12',
    classAverage: 82,
  },
] 