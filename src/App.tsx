import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuthStore } from '@/stores/authStore'

// 頁面組件
import WelcomePage from '@/pages/WelcomePage'
import SimpleLoginPage from '@/pages/SimpleLoginPage'
import KintoneTestPage from '@/pages/KintoneTestPage'
import DiagnosticPage from '@/pages/DiagnosticPage'
import KintoneConfigTest from '@/pages/KintoneConfigTest'
import ApiTokenManager from '@/pages/ApiTokenManager'
import StudentLayout from '@/layouts/StudentLayout'
import TeacherLayout from '@/layouts/TeacherLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ChangePasswordPage from '@/pages/ChangePasswordPage'

// 學生端頁面
import StudentDashboard from '@/pages/student/Dashboard'
import StudentCalendar from '@/pages/student/Calendar'
import LeaveRequest from '@/pages/student/LeaveRequest'
import ExamRequest from '@/pages/student/ExamRequest'
import LearningRecords from '@/pages/student/LearningRecords'
import Grades from '@/pages/student/Grades'
import Reports from '@/pages/student/Reports'

// 老師端頁面
import TeacherDashboard from '@/pages/teacher/Dashboard'
import TeacherCalendar from '@/pages/teacher/Calendar'
import ClassRecord from '@/pages/teacher/ClassRecord'
import StudentHistory from '@/pages/teacher/StudentHistory'
import TeacherSalary from '@/pages/teacher/Salary'

// 管理員端頁面
import AdminDashboard from '@/pages/admin/Dashboard'
import UserManagement from '@/pages/admin/UserManagement'
import CourseManagement from '@/pages/admin/CourseManagement'

function App() {
  const { user, isAuthenticated } = useAuthStore()

  return (
    <>
      <Helmet>
        <title>個別指導系統</title>
        <meta name="description" content="補習班個別指導管理系統" />
      </Helmet>

      <Routes>
        {/* 公開路由 */}
        <Route path="/login" element={<SimpleLoginPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/kintone-test" element={<KintoneTestPage />} />
        <Route path="/diagnostic" element={<DiagnosticPage />} />
        <Route path="/kintone-config-test" element={<KintoneConfigTest />} />
        <Route path="/api-token-manager" element={<ApiTokenManager />} />
        
        {/* 學生端路由 */}
        <Route 
          path="/student/*" 
          element={
            isAuthenticated && (user?.role === 'student' || user?.role === 'parent') 
              ? <StudentLayout /> 
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="calendar" element={<StudentCalendar />} />
          <Route path="leave-request" element={<LeaveRequest />} />
          <Route path="exam-request" element={<ExamRequest />} />
          <Route path="learning-records" element={<LearningRecords />} />
          <Route path="grades" element={<Grades />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* 老師端路由 */}
        <Route 
          path="/teacher/*" 
          element={
            isAuthenticated && user?.role === 'teacher' 
              ? <TeacherLayout /> 
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="calendar" element={<TeacherCalendar />} />
          <Route path="class-record" element={<ClassRecord />} />
          <Route path="student-history" element={<StudentHistory />} />
          <Route path="salary" element={<TeacherSalary />} />
        </Route>

        {/* 管理員端路由 */}
        <Route 
          path="/admin/*" 
          element={
            isAuthenticated && user?.role === 'admin' 
              ? <AdminLayout /> 
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="course-management" element={<CourseManagement />} />
        </Route>

        {/* 預設路由 */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App 