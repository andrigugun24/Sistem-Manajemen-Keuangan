import React from 'react';

const ChickenBankIcon = ({ className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <circle cx="12" cy="4" r="2" />
        <path d="M12 7v1" />
        <path d="M19 12c0-3.5-3-6-7-6S5 8.5 5 12c0 2 1 3 2.5 4H16c2 0 3-1.5 3-4z" />
        <path d="M10 6c-1-2-3-1-3-1s1 2 0 3" />
        <path d="M19 11l3-1-2 3" />
        <circle cx="16" cy="11" r="1" fill="currentColor" />
        <path d="M9 16v3" />
        <path d="M14 16v3" />
        <path d="M8 19h2" />
        <path d="M13 19h2" />
    </svg>
);

export default ChickenBankIcon;
