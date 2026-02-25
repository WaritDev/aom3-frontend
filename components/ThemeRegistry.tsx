'use client';

import React, { createContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState({
        mode: 'dark' as 'light' | 'dark',
        mounted: false
    });

    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark';
        const frameId = requestAnimationFrame(() => {
            setState({
                mode: savedMode || 'dark',
                mounted: true
            });
        });

        return () => cancelAnimationFrame(frameId);
    }, []);

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setState((prev) => {
                const newMode = prev.mode === 'light' ? 'dark' : 'light';
                localStorage.setItem('themeMode', newMode);
                return { ...prev, mode: newMode };
            });
        },
    }), []);

    const theme = useMemo(() => createTheme({
        palette: {
            mode: state.mode,
            primary: { main: '#00E08F' },
            background: {
                default: state.mode === 'dark' ? '#050505' : '#fafafa',
                paper: state.mode === 'dark' ? '#0A0A0A' : '#FFFFFF',
            },
            text: {
                primary: state.mode === 'dark' ? '#FFFFFF' : '#050505',
            },
        },
        typography: {
            fontFamily: 'inherit',
        },
        shape: { borderRadius: 12 },
    }), [state.mode]);

    if (!state.mounted) {
        return <div style={{ visibility: 'hidden' }}>{children}</div>;
    }

    return (
        <ColorModeContext.Provider value={colorMode}>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </AppRouterCacheProvider>
        </ColorModeContext.Provider>
    );
}