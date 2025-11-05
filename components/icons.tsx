import React from 'react';

export const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  />
);

export const SendIcon: React.FC<{className?: string}> = (props) => (
  <Icon {...props}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </Icon>
);

export const UserIcon: React.FC<{className?: string}> = (props) => (
  <Icon {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>
);

export const AssistantIcon: React.FC<{className?: string}> = (props) => (
  <Icon {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></Icon>
);

export const CleanIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></Icon>
);

export const VirtualStagingIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="M21 17.5V13h-2v-2h2V9" /><path d="M19 13h-2v2" /><path d="M21 9h-2" /><path d="M3 13v4.5" /><path d="M3 13h2v-2H3v2Z" /><path d="M5 13v-2" /><path d="m2 16 20 6" /><path d="m2 8 20-6" /><path d="M12 4 2 8" /><path d="M12 4v17" /><path d="m22 8-10-4" /></Icon>
);

export const TwilightIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></Icon>
);

export const ExteriorBoostIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="m4.22 4.22 1.42 1.42"/><path d="m18.36 18.36 1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="m4.22 19.78 1.42-1.42"/><path d="m18.36 5.64 1.42-1.42"/><path d="m3 21 4-4h10l4 4"/><path d="M17 21v-4H7v4"/></Icon>
);

export const PaintBrushIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></Icon>
);

export const FlooringIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="M5 21h14" /><path d="M5 21V5" /><path d="M19 21V5" /><path d="M5 13h14" /><path d="M5 9h14" /><path d="M9 21V5" /><path d="M15 21V5" /></Icon>
);

export const UploadIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></Icon>
);

export const LogoIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M12 9h9" /><path d="M12 15h9" /><path d="M12 3h9" /></Icon>
);

export const PlusCircleIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="16" /><line x1="8" x2="16" y1="12" y2="12" /></Icon>
);

export const EditIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></Icon>
);

export const ChevronDownIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="m6 9 6 6 6-6" /></Icon>
);

export const ChevronUpIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="m18 15-6-6-6 6" /></Icon>
);

export const ChevronLeftIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="m15 18-6-6 6-6" /></Icon>
);

export const ChevronRightIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="m9 18 6-6-6-6" /></Icon>
);

export const StarIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Icon>
);

export const BrushIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}>
      <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
    </Icon>
);

export const LayoutGridIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}>
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
    </Icon>
);

export const LinkIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Icon>
);

export const XCircleIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
    </Icon>
);

export const ExpandIcon: React.FC<{className?: string}> = (props) => (
  <Icon {...props}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </Icon>
);

export const DownloadIcon: React.FC<{className?: string}> = (props) => (
  <Icon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </Icon>
);

export const WatermarkIcon: React.FC<{className?: string}> = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 12l3 3 7-7" />
    <path d="M8 8h8" />
  </Icon>
);

export const CheckIcon: React.FC<{className?: string}> = (props) => (
  <Icon {...props}><path d="M20 6 9 17l-5-5"/></Icon>
);

export const SparklesIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18l1.9-5.8 5.8-1.9-5.8-1.9L12 3z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></Icon>
);

export const EnhanceIcon: React.FC<{className?: string}> = (props) => (
    <Icon {...props}>
        <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
    </Icon>
);
