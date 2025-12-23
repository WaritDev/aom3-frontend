import React from 'react';
import { Box } from '@mui/material';
import AppNavbar from '@/components/app/AppNavBar';

export default function AppLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#050505' }}>
        <AppNavbar />

        <Box component="main" sx={{ p: { xs: 2, md: 4 } }}>
            {children}
        </Box>
        </Box>
    );
}