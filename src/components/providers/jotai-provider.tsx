'use client';

import { Provider } from 'jotai';
import * as React from 'react';

interface JotaiProviderProps {
    children: React.ReactNode;
}

export function JotaiProvider({ children }: JotaiProviderProps) {
    return <Provider>{children}</Provider>;
} 