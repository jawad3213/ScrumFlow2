import React from 'react';
import illustrationMain from '@/assets/illustrationLogin1.png';
import AuthLayout from '@/features/auth/components/AuthLayout';
import LoginForm from '@/features/auth/components/LoginForm';

const LoginPage = () => {
    return (
        <AuthLayout
            illustration={illustrationMain}
            illustrationAlt="Work illustration"
            title="Log in"
            subtitle="Access your workspace"
        >
            <LoginForm />
        </AuthLayout>
    );
};

export default LoginPage;
