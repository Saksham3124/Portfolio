import React from "react";

export const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const TableauIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M11.3 1.7v3.2H8.1V6h3.2v3.2h1.1V6h3.2V4.9h-3.2V1.7h-1.1zm-6 5.1v2.7H2.6v1.1h2.7v2.7h1.1v-2.7h2.7V9.5H6.4V6.8H5.3zm12.3.5v2.5h-2.5v1.1h2.5v2.5h1.1v-2.5h2.5v-1.1h-2.5V7.3h-1.1zM11.3 10.9v4.2H7.1v1.3h4.2v4.2h1.3v-4.2h4.2v-1.3h-4.2v-4.2h-1.3zm-6 5.8v2.7H2.6v1.1h2.7v2.7h1.1v-2.7h2.7v-1.1H6.4v-2.7H5.3zm12.3.5v2.5h-2.5v1.1h2.5v2.5h1.1v-2.5h2.5v-1.1h-2.5v-2.5h-1.1z" />
  </svg>
);
