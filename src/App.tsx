import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { UnauthorizedPage } from "./pages/auth/UnauthorizedPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { UserListPage } from "./pages/users/UserListPage";
import { UserCreatePage } from "./pages/users/UserCreatePage";
import { UserEditPage } from "./pages/users/UserEditPage";
import { UserDetailPage } from "./pages/users/UserDetailPage";
import { RoleListPage } from "./pages/roles/RoleListPage";
import { RoleCreatePage } from "./pages/roles/RoleCreatePage";
import { RoleEditPage } from "./pages/roles/RoleEditPage";
import { PermissionListPage } from "./pages/permissions/PermissionListPage";
import { AppAccessPage } from "./pages/app-access/AppAccessPage";
import { AuditLogPage } from "./pages/audit-logs/AuditLogPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { ChangePasswordPage } from "./pages/profile/ChangePasswordPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Main App Routes - Protected */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Users */}
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/create" element={<UserCreatePage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/users/:id/edit" element={<UserEditPage />} />
            
            {/* Roles */}
            <Route path="/roles" element={<RoleListPage />} />
            <Route path="/roles/create" element={<RoleCreatePage />} />
            <Route path="/roles/:id/edit" element={<RoleEditPage />} />
            
            {/* Permissions */}
            <Route path="/permissions" element={<PermissionListPage />} />
            
            {/* App Access */}
            <Route path="/app-access" element={<AppAccessPage />} />
            
            {/* Audit Logs */}
            <Route path="/audit-logs" element={<AuditLogPage />} />
            
            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/change-password" element={<ChangePasswordPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
