import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const GoogleAuthButton = ({ label = 'Continue with Google' }) => {
    const { loginWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGoogleAuth = async () => {
        setError('');
        setIsLoading(true);

        try {
            // 1. Open Google popup via Firebase
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            // 2. Get the Firebase ID token
            const idToken = await firebaseUser.getIdToken();

            // 3. Send to our Laravel backend
            await loginWithGoogle({
                id_token: idToken,
                email: firebaseUser.email,
                first_name: firebaseUser.displayName?.split(' ')[0] || '',
                last_name: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                avatar: firebaseUser.photoURL || '',
                google_id: firebaseUser.uid,
            });

            navigate('/dashboard');
        } catch (err) {
            // Don't show error if user just closed the popup
            if (err.code === 'auth/popup-closed-by-user') {
                setIsLoading(false);
                return;
            }
            const message = err.message || 'Google sign-in failed. Please try again.';
            setError(message);
            console.error('Google auth error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {error && (
                <div className="mb-4 p-3 bg-danger-lighter border border-danger-default/20 text-danger-darker text-sm font-bold rounded-xl">
                    {error}
                </div>
            )}
            <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3.5 bg-white border-2 border-surface-border rounded-xl hover:bg-surface-background hover:border-neutral-300 transition-ui duration-default ease-soft active:scale-[0.98] flex items-center justify-center gap-3 font-bold text-sm text-neutral-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <>
                        <GoogleIcon />
                        {label}
                    </>
                )}
            </button>
        </div>
    );
};

export default GoogleAuthButton;
