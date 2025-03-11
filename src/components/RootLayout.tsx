
import React from 'react';
import { WelcomeTour } from './WelcomeTour';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      {children}
      <WelcomeTour />
    </>
  );
}
