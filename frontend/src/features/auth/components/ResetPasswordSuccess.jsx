import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResetPasswordSuccess = () => {
    return (
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-24 h-24 bg-success-lighter rounded-full flex items-center justify-center text-success-default mb-8 border border-success-default/10 animate-in zoom-in-95 duration-default">
                <Check size={48} className="stroke-[3]" />
            </div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-4">Password Reset!</h1>
            <p className="text-sm text-neutral-500 font-bold mb-10 leading-relaxed">
                Your password has been successfully updated. You will be redirected to the login page shortly.
            </p>
            <Link to="/login" className="w-full py-4 bg-success-default text-white font-black rounded-xl hover:bg-success-darker shadow-lg shadow-success-default/25 transition-ui duration-default ease-soft active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                Go to Login
            </Link>
        </div>
    );
};

export default ResetPasswordSuccess;
