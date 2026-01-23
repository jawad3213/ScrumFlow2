import React, { useState } from 'react';
import illustrationAlt from '@/assets/illustrationLogin2.png';
import AuthLayout from '@/features/auth/components/AuthLayout';
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';
import ResetPasswordSuccess from '@/features/auth/components/ResetPasswordSuccess';

const ResetPasswordPage = () => {
    const [success, setSuccess] = useState(false);

    return (
        <AuthLayout
            illustration={illustrationAlt}
            illustrationAlt={success ? "Success illustration" : "Security illustration"}
            title={success ? null : "Set New Password"}
            subtitle={success ? null : "Ensure your new password is secure"}
        >
            {success ? (
                <ResetPasswordSuccess />
            ) : (
                <ResetPasswordForm onSuccess={() => setSuccess(true)} />
            )}
        </AuthLayout>
    );
};

export default ResetPasswordPage;
