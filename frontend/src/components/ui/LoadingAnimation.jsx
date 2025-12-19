import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingAnimation = ({ className = "w-48 h-48" }) => {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <DotLottieReact
                src="https://lottie.host/bae0f660-1f99-45bd-90b3-2f9eeeeac65b/kRsMetvmWB.lottie"
                loop
                autoplay
            />
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mt-4 animate-pulse">
                Fetching Data...
            </p>
        </div>
    );
};

export default LoadingAnimation;
