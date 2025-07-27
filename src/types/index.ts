// 用戶相關類型
export interface User {
  id: string
  username: string
  name: string
  role: 'student' | 'parent' | 'teacher' | 'admin'
  email?: string
  phone?: string
  avatar?: string
  studentId?: string // 學生ID（家長角色使用）
  parentLineId?: string // 家長LINE ID
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// 課程相關類型
export interface Course {
  id: string
  studentId: string
  teacherId: string
  courseDate: string
  startTime: string
  endTime: string
  courseType: 'regular' | 'exam' | 'self_study'
  subject: string
  classroomId?: string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

// 教室類型
export interface Classroom {
  id: string
  name: string
  capacity: number
  equipment?: string
  status: 'available' | 'occupied' | 'maintenance'
}

// 學習紀錄類型
export interface LearningRecord {
  id: string
  courseId: string
  studentId: string
  teacherId: string
  courseDate: string
  courseTopic: string
  teachingStrategy?: string
  starRating?: number
  homework?: string
  teacherComments?: string
  photos?: string[]
  testPapers?: string[]
  examScores?: number
  learningProgress?: 'excellent' | 'good' | 'fair' | 'needs_improvement'
  classStatus: 'not_started' | 'ongoing' | 'completed'
  lineNotificationSent: boolean
  createdAt: string
  updatedAt: string
}

// 請假申請類型
export interface LeaveRequest {
  id: string
  studentId: string
  parentLineId?: string
  courseId?: string
  leaveDate: string
  leaveReason: string
  leaveType: 'sick' | 'personal' | 'other'
  status: 'pending' | 'approved' | 'rejected'
  createdBy: string
  createdAt: string
  approvedBy?: string
  approvedAt?: string
  notes?: string
}

// 小考/自習申請類型
export interface ExamRequest {
  id: string
  studentId: string
  requestType: 'exam' | 'self_study'
  subject: string
  examRange?: string
  studyContent?: string
  requestDate: string
  requestTime: string
  duration: number
  status: 'pending' | 'approved' | 'rejected' | 'scheduled'
  teacherId?: string
  approvedAt?: string
  scheduledCourseId?: string
}

// 成績類型
export interface Grade {
  id: string
  studentId: string
  examType: 'midterm' | 'final' | 'mock'
  examDate: string
  subject: string
  score: number
  classAverage?: number
  rank?: number
  testPaper?: string
  reportCard?: string
  uploadedBy: string
  uploadedAt: string
  notes?: string
}

// 學習報告類型
export interface Report {
  id: string
  studentId: string
  reportType: 'monthly' | 'quarterly' | 'semester'
  reportPeriod: string
  reportFile: string
  generatedBy: 'system' | 'teacher'
  generatedAt: string
  downloadCount: number
  status: 'draft' | 'published'
}

// 老師薪資類型
export interface TeacherSalary {
  id: string
  teacherId: string
  salaryPeriod: string // YYYY-MM
  totalClasses: number
  regularClasses: number
  examClasses: number
  selfStudyClasses: number
  hourlyRate: number
  totalSalary: number
  deductions?: number
  netSalary: number
  paymentStatus: 'pending' | 'paid'
  paymentDate?: string
  notes?: string
}

// API 回應類型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 分頁類型
export interface Pagination {
  current: number
  pageSize: number
  total: number
}

// 查詢參數類型
export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  filters?: Record<string, any>
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 登入表單類型
export interface LoginForm {
  username: string
  password: string
  loginType: 'account' | 'verification'
  studentName?: string
  verificationCode?: string
}

// 請假申請表單類型
export interface LeaveRequestForm {
  courseId?: string
  leaveDate: string
  leaveReason: string
  leaveType: 'sick' | 'personal' | 'other'
}

// 小考/自習申請表單類型
export interface ExamRequestForm {
  requestType: 'exam' | 'self_study'
  subject: string
  examRange?: string
  studyContent?: string
  requestDate: string
  requestTime: string
  duration: number
}

// 上課紀錄表單類型
export interface ClassRecordForm {
  courseId: string
  courseTopic: string
  teachingStrategy?: string
  starRating?: number
  homework?: string
  teacherComments?: string
  photos?: File[]
  testPapers?: File[]
  examScores?: number
  learningProgress?: 'excellent' | 'good' | 'fair' | 'needs_improvement'
}

// 成績登記表單類型
export interface GradeForm {
  examType: 'midterm' | 'final' | 'mock'
  examDate: string
  subject: string
  score: number
  classAverage?: number
  rank?: number
  testPaper?: File
  reportCard?: File
  notes?: string
} 