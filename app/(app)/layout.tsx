'use client';

import React from 'react';
import { Box } from '@mui/material';
import AppNavbar from '@/components/app/AppNavBar';
import WalletGuard from '@/components/app/WalletGuard';

export default function AppLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <Box >
            <AppNavbar />
            <Box component="main" sx={{ p: { xs: 2, md: 4 } }}>
                <WalletGuard>
                    {children}
                </WalletGuard>
            </Box>
        </Box>
    );
}