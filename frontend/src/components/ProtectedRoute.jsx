import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase auth

const ProtectedRoute = () => {
  const user = auth.currentUser; // Check if user is signed in

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
