import React from 'react';
import illustrationMain from '@/assets/illustrationLogin1.png';
import AuthLayout from '@/features/auth/components/AuthLayout';
import SignupForm from '@/features/auth/components/SignupForm';

const SignupPage = () => {
    return (
        <AuthLayout
            illustration={illustrationMain}
            illustrationAlt="Work illustration"
            title="Sign up"
            subtitle="Create your workspace"
            logoPath="/signup"
        >
            <SignupForm />
        </AuthLayout>
    );
};

export default SignupPage;
