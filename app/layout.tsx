import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
export const metadata: Metadata = { title: 'ProcessLab | Linux Systems Learning', description: 'Interactive learning laboratory for Class 7, slides 15–19: ELF loading, scheduling, CPU shares and homework.' };
export default function RootLayout({children}: {children: ReactNode}) {return <html lang="en"><body>{children}</body></html>}
