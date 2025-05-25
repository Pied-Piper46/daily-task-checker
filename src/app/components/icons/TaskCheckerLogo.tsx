import React from 'react';

interface TaskCheckerLogoProps extends React.SVGProps<SVGSVGElement> {
    checkColor?: string;
    plusColor?: string;
    circleColor?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'custom';
    customSize?: string; // カスタムサイズ用（例: "w-20 h-20"）
}

const TaskCheckerLogo: React.FC<TaskCheckerLogoProps> = ({ 
    checkColor = "currentColor", 
    plusColor = "currentColor", 
    circleColor = "currentColor",
    size = "md",
    customSize,
    ...props 
}) => {
    const sizeClasses = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-6 h-6", 
        lg: "w-8 h-8",
        xl: "w-12 h-12",
        "2xl": "w-16 h-16",
        "3xl": "w-20 h-20",
        "4xl": "w-24 h-24",
        custom: customSize || "w-6 h-6"
    };

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            enableBackground="new 0 0 24 24" 
            height="24" 
            viewBox="0 0 24 24" 
            width="24" 
            className={`${sizeClasses[size]} ${props.className || ''}`}
            {...props}
        >
            <rect fill="none" height="24" width="24"/>
            {/* チェックマーク部分 */}
            <path 
                d="M22,5.18L10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l10-10L22,5.18z" 
                fill={checkColor}
            />
            {/* 円形部分 */}
            <path 
                d="M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8 c1.57,0,3.04,0.46,4.28,1.25l1.45-1.45C16.1,2.67,14.13,2,12,2C6.48,2,2,6.48,2,12s4.48,10,10,10c1.73,0,3.36-0.44,4.78-1.22 l-1.5-1.5C14.28,19.74,13.17,20,12,20z" 
                fill={circleColor}
            />
            {/* プラス記号部分 */}
            <path 
                d="M19,15h-3v2h3v3h2v-3h3v-2h-3v-3h-2V15z" 
                fill={plusColor}
            />
        </svg>
    );
};

export default TaskCheckerLogo;
