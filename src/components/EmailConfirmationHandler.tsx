import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuoteForm } from '@/contexts/QuoteFormContext';
import { toast } from 'sonner';

export const EmailConfirmationHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wasRedirectedFromAuth, redirectPath, setWasRedirectedFromAuth } = useQuoteForm();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error) {
        toast.error('Email verification failed', {
          description: errorDescription || 'Please try again or contact support.'
        });
        navigate('/auth');
        return;
      }

      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      if (accessToken && refreshToken && type === 'signup') {
        if (user) {
          toast.success('Successfully verified your account!', {
            description: wasRedirectedFromAuth 
              ? 'Your quote requests have been submitted and you will be redirected to the dashboard soon.'
              : 'Welcome to BuildEasy!'
          });

          if (wasRedirectedFromAuth) {
            // Show additional message about quote submission
            setTimeout(() => {
              navigate('/tickets');
              setWasRedirectedFromAuth(false);
            }, 2500);
          } else {
            // Regular redirect to dashboard based on user type
            setTimeout(() => {
              navigate('/tickets'); // All clients go to tickets (which is now the main dashboard)
            }, 1500);
          }
        }
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate, user, wasRedirectedFromAuth, redirectPath, setWasRedirectedFromAuth]);

  return null;
};