import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingAnimation = ({ className = "w-48", message = "Almost there... Just a moment" }) => {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <DotLottieReact
                src="https://lottie.host/bae0f660-1f99-45bd-90b3-2f9eeeeac65b/kRsMetvmWB.lottie"
                loop
                autoplay
            />
            {message && (
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-4 animate-pulse text-center leading-relaxed">
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingAnimation;
