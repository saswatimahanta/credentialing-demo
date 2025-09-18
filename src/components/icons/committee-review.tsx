import * as React from 'react';

// New Committee Review Icon (from provided asset) simplified
export const CommitteeReviewIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
    >
        <rect x="8" y="20" width="112" height="88" rx="12" stroke="currentColor" strokeWidth="8" />
        <path d="M32 48h64M32 68h40M32 88h24" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="96" cy="88" r="10" stroke="currentColor" strokeWidth="8" />
        <path d="M96 78v20" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
);

export default CommitteeReviewIcon;
