'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi'; 
import { 
    Box, 
    Dialog, 
    DialogContent, 
    Typography, 
    Stack, 
    Chip, 
    Divider, 
    Fade,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockIcon from '@mui/icons-material/Lock';
import { CustomConnectButton } from '@/components/app/CustomConnectButton';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<unknown, string> },
    ref: React.Ref<unknown>,
) {
    return <Fade ref={ref} {...props} />;
});

function useIsMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);
    return mounted;
    }

export default function WalletGuard({ children }: { children: React.ReactNode }) {
    const { isConnected } = useAccount();
    const isMounted = useIsMounted();

    if (!isMounted) return null;

    return (
        <Box sx={{ position: 'relative', minHeight: '80vh' }}>
        
        <Dialog 
            open={!isConnected} 
            TransitionComponent={Transition}
            keepMounted
            maxWidth="sm"
            fullWidth
            scroll="body"
            slotProps={{
            backdrop: {
                sx: {
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                }
            }
            }}
            PaperProps={{
            sx: {
                bgcolor: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: 4,
                backgroundImage: 'none',
                boxShadow: '0 0 50px rgba(76, 175, 80, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            }
            }}
            disableEscapeKeyDown
        >
            <Box sx={{ 
                position: 'absolute', top: -50, left: -50, width: 150, height: 150, 
                bgcolor: '#4caf50', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15,
                pointerEvents: 'none' 
            }} />
            
            <DialogContent sx={{ py: 6, px: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                
                <Box 
                sx={{ 
                    width: 80, height: 80, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(76, 175, 80, 0.1)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    boxShadow: '0 0 20px rgba(76, 175, 80, 0.2)',
                    mb: 1
                }}
                >
                <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                </Box>

                <Box>
                <Typography variant="h4" fontWeight="800" sx={{ color: '#fff', mb: 1, letterSpacing: -0.5 }}>
                    Connect Wallet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}>
                    Access the <Box component="span" color="#4caf50" fontWeight="bold">AOM3 Protocol</Box> to start your disciplined savings journey.
                </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip icon={<LockIcon sx={{ fontSize: '14px !important' }}/>} label="Secure" size="small" sx={{ bgcolor: '#1a1a1a', border: '1px solid #333' }} />
                <Chip label="Arbitrum Network" size="small" sx={{ bgcolor: '#1a1a1a', border: '1px solid #333' }} />
                </Stack>
                
                <Divider sx={{ width: '100%', borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

                <Box sx={{ width: '100%', mt: 1 }}>
                <CustomConnectButton fullWidth={true} />
                </Box>
            </DialogContent>
        </Dialog>

        <Box sx={{ 
            filter: !isConnected ? 'blur(8px) grayscale(30%)' : 'none', 
            opacity: !isConnected ? 0.3 : 1, 
            pointerEvents: !isConnected ? 'none' : 'auto',
            transition: 'all 0.5s ease'
        }}>
            {children}
        </Box>

        </Box>
    );
}