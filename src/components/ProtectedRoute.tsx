import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: 'client' | 'vendor';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType,
  redirectTo = '/auth'
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate(redirectTo);
        return;
      }

      if (requiredUserType) {
        // Check user type from profiles table if needed
        // For now, we'll use the user metadata
        const userType = user.user_metadata?.user_type;
        if (userType !== requiredUserType) {
          // Redirect to appropriate dashboard or error page
          if (userType === 'client') {
            navigate('/dashboard');
          } else if (userType === 'vendor') {
            navigate('/vendor-dashboard');
          } else {
            navigate(redirectTo);
          }
        }
      }
    }
  }, [user, loading, requiredUserType, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredUserType) {
    const userType = user.user_metadata?.user_type;
    if (userType !== requiredUserType) {
      return null;
    }
  }

  return <>{children}</>;
};