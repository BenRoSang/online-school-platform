import { Route, Routes } from 'react-router-dom'
import { ApplicationLayout } from '../layouts/ApplicationLayout'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RegisterPage } from '../pages/RegisterPage'
import { DashboardRedirectPage } from '../pages/DashboardRedirectPage'
import { ProfilePage } from '../pages/ProfilePage'
import { StudentDashboardPage } from '../pages/StudentDashboardPage'
import { TeacherDashboardPage } from '../pages/TeacherDashboardPage'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { CourseCataloguePage } from '../pages/CourseCataloguePage'
import { CourseDetailsPage } from '../pages/CourseDetailsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<ApplicationLayout />}>
        <Route index element={<HomePage />} />
        <Route path="courses" element={<CourseCataloguePage />} />
        <Route path="courses/:slug" element={<CourseDetailsPage />} />
        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardRedirectPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="student" element={<StudentDashboardPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route path="teacher" element={<TeacherDashboardPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
