'use client';

import { ReactNode } from 'react';

interface ScrollLinkProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function ScrollLink({ id, children, className }: ScrollLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!id) return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button onClick={handleClick} className={className} type='button'>
      {children}
    </button>
  );
}
