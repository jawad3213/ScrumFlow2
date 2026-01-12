import React from 'react';
import illustrationAlt from '@/assets/illustrationLogin2.png';
import AuthLayout from '@/features/auth/components/AuthLayout';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';

const ForgotPasswordPage = () => {
    return (
        <AuthLayout
            illustration={illustrationAlt}
            illustrationAlt="Recovery illustration"
            title="Recover Password"
            subtitle="Enter your email to receive a reset link"
        >
            <ForgotPasswordForm />
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
