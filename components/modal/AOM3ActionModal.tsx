'use client';

import React from 'react';
import { 
    Dialog, DialogContent, DialogTitle, Box, Typography, 
    Stack, Button, IconButton, Divider 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const NEON_GREEN = '#00E08F';
const ERROR_RED = '#FF4D4D';

interface AOM3ActionModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    type: 'deposit' | 'withdraw';
    amount: string;
    penalty?: number;
    streak?: number;
    onConfirm: () => Promise<void>;
    loading: boolean;
    lastDepositTimestamp?: number;
}

export const AOM3ActionModal: React.FC<AOM3ActionModalProps> = ({
    open, onClose, title, type, amount, penalty = 0, streak = 0, onConfirm, loading
}) => {
    const isWithdraw = type === 'withdraw';

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: {
                    bgcolor: '#0A0A0A',
                    backgroundImage: 'none',
                    border: `1px solid ${isWithdraw && penalty > 0 ? ERROR_RED : NEON_GREEN}`,
                    borderRadius: 4,
                    color: 'white',
                    maxWidth: '400px',
                    width: '100%'
                }
            }}
        >
            <DialogTitle sx={{ p: 3, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="900">{title}</Typography>
                <IconButton onClick={onClose} sx={{ color: '#444' }}><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, pt: 1 }}>
                <Stack spacing={3}>
                    <Box sx={{ p: 2, bgcolor: '#111', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">AMOUNT</Typography>
                        <Typography variant="h4" fontWeight="900" sx={{ color: isWithdraw ? 'white' : NEON_GREEN }}>
                            {amount} USDC
                        </Typography>
                    </Box>

                    {isWithdraw && penalty > 0 ? (
                        <Box sx={{ p: 2, bgcolor: `${ERROR_RED}15`, borderRadius: 2, border: `1px solid ${ERROR_RED}44` }}>
                            <Stack direction="row" spacing={1} mb={0.5}>
                                <WarningAmberIcon sx={{ color: ERROR_RED, fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight="900" color={ERROR_RED}>EARLY WITHDRAWAL PENALTY</Typography>
                            </Stack>
                            <Typography variant="body2" color="#ff9999">
                                Early redemption detected. A **10%** penalty will be deducted and redirected to the Reward Pool, totaling **${penalty.toFixed(2)} USDC**.
                            </Typography>
                        </Box>
                    ) : type === 'deposit' && (
                        <Box sx={{ p: 2, bgcolor: `${NEON_GREEN}15`, borderRadius: 2, border: `1px solid ${NEON_GREEN}44` }}>
                            <Stack direction="row" spacing={1} mb={0.5}>
                                <RocketLaunchIcon sx={{ color: NEON_GREEN, fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight="900" color={NEON_GREEN}>STREAK COMBO</Typography>
                            </Stack>
                            <Typography variant="body2" color="#99ffda">
                                Complete this deposit to extend your streak to month **{streak + 1}** and qualify for Global Pool rewards!
                            </Typography>
                        </Box>
                    )}

                    <Divider sx={{ borderColor: '#222' }} />

                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={onConfirm}
                        disabled={loading}
                        sx={{ 
                            py: 1.5, borderRadius: 2, fontWeight: 900,
                            bgcolor: isWithdraw && penalty > 0 ? ERROR_RED : NEON_GREEN,
                            color: '#000',
                            '&:hover': { bgcolor: isWithdraw && penalty > 0 ? '#cc0000' : '#00C97F' }
                        }}
                    >
                        {loading ? "PROCESSING..." : "CONFIRM TRANSACTION"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};