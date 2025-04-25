import React from 'react';

export function Breadcrumb({ children, className = '', ...props }) {
  return (
    <nav className={`${className}`} aria-label="breadcrumb" {...props}>
      {children}
    </nav>
  );
}

export function BreadcrumbList({ children, className = '', ...props }) {
  return (
    <ol className={`flex flex-wrap items-center gap-1.5 break-words ${className}`} {...props}>
      {children}
    </ol>
  );
}

export function BreadcrumbItem({ children, className = '', ...props }) {
  return (
    <li className={`inline-flex items-center gap-1.5 ${className}`} {...props}>
      {children}
    </li>
  );
}

export function BreadcrumbSeparator({ children = '/', className = '', ...props }) {
  return (
    <li className={`text-gray-400 ${className}`} {...props}>
      {children}
    </li>
  );
}

export function BreadcrumbLink({ children, className = '', href, ...props }) {
  return href ? (
    <a 
      href={href}
      className={`text-gray-500 hover:text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </a>
  ) : (
    <span className={`text-gray-500 ${className}`} {...props}>
      {children}
    </span>
  );
} 