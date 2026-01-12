import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/utils/utils';

const FileDropzone = ({
    onFileSelected,
    accept = "*",
    children,
    className,
    disabled = false
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, [disabled]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (disabled) return;
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelected(e.dataTransfer.files[0]);
        }
    }, [disabled, onFileSelected]);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelected(e.target.files[0]);
        }
    };

    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
            className={cn(
                "cursor-pointer",
                isDragging && "scale-[1.02] transition-transform",
                className
            )}
        >
            <input
                type="file"
                ref={fileInputRef}
                accept={accept}
                className="hidden"
                onChange={handleChange}
                disabled={disabled}
            />
            {typeof children === 'function' ? children({ isDragging, openFilePicker: handleClick }) : children}
        </div>
    );
};

export default FileDropzone;
