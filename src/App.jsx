import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import CreateDelivery from './components/CreateDelivery';
import DriverRegistration from './components/DriverRegistration';
import DriverEdit from './components/DriverEdit';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/deliveries/new"
                        element={<ProtectedRoute><CreateDelivery />
                                 </ProtectedRoute>}
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                    <Route
                        path="/driver-registration"
                        element={<ProtectedRoute><DriverRegistration /></ProtectedRoute>}
                    />
                    <Route
                        path="/driver-profile/edit"
                        element={<ProtectedRoute><DriverEdit /></ProtectedRoute>}
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;