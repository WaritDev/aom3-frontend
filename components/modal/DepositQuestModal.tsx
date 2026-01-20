'use client';

import React, { useState } from 'react';
import { 
    Dialog, DialogContent, Typography, Box, Stack, 
    TextField, InputAdornment, Button, IconButton, 
    Divider, Checkbox, FormControlLabel, Fade 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BoltIcon from '@mui/icons-material/Bolt';
import GavelIcon from '@mui/icons-material/Gavel';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FF9800';

interface DepositQuestModalProps {
    open: boolean;
    onClose: () => void;
    type: 'deposit' | 'topup';
    planName: string;
    assetSymbol: string;
    requiredAmount: number;
}

const DepositQuestModal: React.FC<DepositQuestModalProps> = ({ 
    open, 
    onClose, 
    type, 
    planName, 
    assetSymbol, 
    requiredAmount 
    }) => {
    const [amount, setAmount] = useState<string>(requiredAmount.toString());
    const [confirmed, setConfirmed] = useState<boolean>(false);

    const isDeposit = type === 'deposit';

    return (
        <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        TransitionComponent={Fade}
        PaperProps={{
            sx: {
            bgcolor: '#0A0A0A',
            border: `1px solid ${isDeposit ? NEON_GREEN : NEON_ORANGE}40`,
            borderRadius: 4,
            backgroundImage: 'none',
            boxShadow: `0 0 30px ${isDeposit ? NEON_GREEN : NEON_ORANGE}15`
            }
        }}
        >
        <Box sx={{ p: 3, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ p: 1, bgcolor: isDeposit ? `${NEON_GREEN}15` : `${NEON_ORANGE}15`, borderRadius: 2, display: 'flex' }}>
                <BoltIcon sx={{ color: isDeposit ? NEON_GREEN : NEON_ORANGE }} />
            </Box>
            <Box>
                <Typography variant="overline" sx={{ color: isDeposit ? NEON_GREEN : NEON_ORANGE, fontWeight: 900, letterSpacing: 2, display: 'block', lineHeight: 1 }}>
                {isDeposit ? 'Monthly Quest' : 'Manual Boost'}
                </Typography>
                <Typography variant="h6" fontWeight="900" sx={{ textTransform: 'uppercase' }}>
                {isDeposit ? 'Deposit Now' : 'Top Up Asset'}
                </Typography>
            </Box>
            </Stack>
            <IconButton onClick={onClose} sx={{ color: '#444' }}>
            <CloseIcon />
            </IconButton>
        </Box>

        <DialogContent sx={{ p: 3, mt: 2 }}>
            <Stack spacing={3}>
            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid #1A1A1A' }}>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 800, display: 'block', mb: 0.5 }}>TARGET PLAN</Typography>
                <Typography variant="body1" fontWeight="900">{planName}</Typography>
            </Box>

            <Box>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 800, display: 'block', mb: 1 }}>TRANSACTION AMOUNT</Typography>
                <TextField 
                fullWidth
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><AccountBalanceWalletIcon sx={{ color: isDeposit ? NEON_GREEN : NEON_ORANGE }} /></InputAdornment>,
                    endAdornment: <InputAdornment position="end"><Typography fontWeight="900" color="#FFF">{assetSymbol}</Typography></InputAdornment>,
                    sx: { borderRadius: 3, bgcolor: '#000', fontWeight: 800, '& fieldset': { borderColor: '#222' } }
                }}
                />
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

            <Stack spacing={1.5}>
                <Typography variant="caption" sx={{ color: NEON_ORANGE, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <GavelIcon fontSize="small" /> MISSION REGULATION
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', lineHeight: 1.5 }}>
                Funds will be routed from <b>AOM3 Vault</b> to <b>Liminal Vault</b> for delta-neutral hedging. 
                Your streak multipliers will be updated upon block confirmation.
                </Typography>
                <FormControlLabel 
                control={
                    <Checkbox 
                    size="small" 
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    sx={{ color: '#333', '&.Mui-checked': { color: NEON_GREEN } }} 
                    />
                }
                label={
                    <Typography variant="caption" sx={{ color: '#AAA', fontWeight: 600 }}>
                    I confirm this is within the 7-day window.
                    </Typography>
                }
                />
            </Stack>

            <Button 
                fullWidth
                variant="contained"
                disabled={!confirmed || !amount || parseFloat(amount) <= 0}
                sx={{ 
                py: 2, borderRadius: 3, fontWeight: 900, fontSize: '1rem',
                bgcolor: isDeposit ? NEON_GREEN : NEON_ORANGE,
                color: '#000',
                boxShadow: confirmed ? `0 0 20px ${isDeposit ? NEON_GREEN : NEON_ORANGE}40` : 'none',
                '&:hover': { bgcolor: isDeposit ? '#00C97F' : '#E68A00' }
                }}
            >
                CONFIRM {type.toUpperCase()}
            </Button>
            </Stack>
        </DialogContent>
        </Dialog>
    );
};

export default DepositQuestModal;