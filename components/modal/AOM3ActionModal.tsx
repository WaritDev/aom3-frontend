'use client';

import React, { useState, useMemo } from 'react';
import { 
    Dialog, DialogContent, DialogTitle, Box, Typography, 
    Stack, Button, IconButton, Divider, CircularProgress,
    useTheme, alpha 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, maxUint256 } from 'viem';
import { AOM3_VAULT_ADDRESS, USDC_ADDRESS, USDC_ABI } from '@/constants/contracts';

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
}

export const AOM3ActionModal: React.FC<AOM3ActionModalProps> = ({
    open, onClose, title, type, amount, penalty = 0, streak = 0, onConfirm, loading
}) => {
    const { address } = useAccount();
    const isWithdraw = type === 'withdraw';
    const [isInternalLoading, setIsInternalLoading] = useState(false);
    
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    const amountBigInt = useMemo(() => parseUnits(amount || "0", 6), [amount]);

    const { data: allowance, refetch: refetchAllowance, isLoading: isLoadingAllowance } = useReadContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'allowance',
        args: address ? [address, AOM3_VAULT_ADDRESS] : undefined,
    });

    const { writeContractAsync: approveAsync, data: approveHash } = useWriteContract();
    const { isLoading: isApproving } = useWaitForTransactionReceipt({ hash: approveHash });

    const needsApproval = useMemo(() => {
        if (isWithdraw || isLoadingAllowance) return false;
        if (allowance === undefined) return true; 
        return (allowance as bigint) < amountBigInt;
    }, [allowance, amountBigInt, isWithdraw, isLoadingAllowance]);

    const handleAction = async () => {
        setIsInternalLoading(true);
        try {
            if (needsApproval) {
                await approveAsync({
                    address: USDC_ADDRESS,
                    abi: USDC_ABI,
                    functionName: 'approve',
                    args: [AOM3_VAULT_ADDRESS, maxUint256], 
                });
                await refetchAllowance(); 
            }
            await onConfirm();
        } catch (err) {
            console.error("❌ Transaction failed:", err);
        } finally {
            setIsInternalLoading(false);
        }
    };

    const isProcessing = loading || isApproving || isInternalLoading;

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    backgroundImage: 'none',
                    border: `1px solid ${isWithdraw && penalty > 0 ? ERROR_RED : (isDark ? alpha(NEON_GREEN, 0.4) : theme.palette.divider)}`,
                    borderRadius: 4,
                    color: 'text.primary',
                    maxWidth: '400px',
                    width: '100%',
                    boxShadow: isDark ? `0 24px 48px rgba(0,0,0,0.5)` : `0 12px 32px ${alpha(NEON_GREEN, 0.1)}`
                }
            }}
        >
            <DialogTitle sx={{ p: 3, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="900" component="div" sx={{ color: 'text.primary' }}>
                    {title}
                </Typography>
                
                <IconButton onClick={onClose} sx={{ color: 'text.disabled' }} disabled={isProcessing}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, pt: 1 }}>
                <Stack spacing={3}>
                    <Box sx={{ 
                        p: 3, 
                        bgcolor: isDark ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02), 
                        borderRadius: 3, 
                        textAlign: 'center',
                        border: `1px solid ${theme.palette.divider}`
                    }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1 }}>TRANSACTION AMOUNT</Typography>
                        <Typography variant="h4" fontWeight="900" sx={{ color: isWithdraw ? 'text.primary' : NEON_GREEN, mt: 0.5 }}>
                            {amount} <Typography component="span" variant="h6" fontWeight="900">USDC</Typography>
                        </Typography>
                    </Box>

                    {!isWithdraw && (
                        <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                            <Typography variant="caption" sx={{ 
                                color: !needsApproval ? NEON_GREEN : 'text.disabled', 
                                display: 'flex', alignItems: 'center', gap: 0.5,
                                fontWeight: !needsApproval ? 800 : 600
                            }}>
                                1. Approve {!needsApproval && <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />}
                            </Typography>
                            <Typography variant="caption" color="divider"> | </Typography>
                            <Typography variant="caption" sx={{ 
                                color: isProcessing && !isApproving ? NEON_GREEN : 'text.disabled',
                                fontWeight: 800
                            }}>
                                2. Deposit
                            </Typography>
                        </Stack>
                    )}

                    {isWithdraw && penalty > 0 ? (
                        <Box sx={{ p: 2, bgcolor: alpha(ERROR_RED, 0.1), borderRadius: 3, border: `1px solid ${alpha(ERROR_RED, 0.2)}` }}>
                            <Stack direction="row" spacing={1} mb={0.5}>
                                <WarningAmberIcon sx={{ color: ERROR_RED, fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight="900" color={ERROR_RED}>EARLY WITHDRAWAL PENALTY</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: isDark ? '#ff9999' : '#c62828', fontWeight: 500 }}>
                                Early redemption detected. A 1-3% penalty will be deducted and redirected to the Reward Pool, totaling {penalty.toFixed(2)} USDC.
                            </Typography>
                        </Box>
                    ) : type === 'deposit' && (
                        <Box sx={{ p: 2, bgcolor: alpha(NEON_GREEN, 0.1), borderRadius: 3, border: `1px solid ${alpha(NEON_GREEN, 0.2)}` }}>
                            <Stack direction="row" spacing={1} mb={0.5}>
                                <RocketLaunchIcon sx={{ color: NEON_GREEN, fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight="900" color={NEON_GREEN}>STREAK COMBO</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: isDark ? '#99ffda' : '#007a4d', fontWeight: 500 }}>
                                Complete this deposit to extend your streak to month {streak + 1} and qualify for Global Pool rewards.
                            </Typography>
                        </Box>
                    )}

                    <Divider sx={{ borderColor: theme.palette.divider }} />

                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={handleAction}
                        disabled={isProcessing || isLoadingAllowance}
                        startIcon={isProcessing && <CircularProgress size={20} color="inherit" />}
                        sx={{ 
                            py: 2, borderRadius: 2.5, fontWeight: 900, fontSize: '1rem',
                            bgcolor: isWithdraw && penalty > 0 ? ERROR_RED : NEON_GREEN,
                            color: '#000',
                            boxShadow: `0 8px 20px ${alpha(isWithdraw && penalty > 0 ? ERROR_RED : NEON_GREEN, 0.3)}`,
                            '&:hover': { 
                                bgcolor: isWithdraw && penalty > 0 ? '#cc0000' : '#00C97F',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s'
                        }}
                    >
                        {isLoadingAllowance ? "CHECKING STATUS..." : 
                            isApproving ? "STEP 1/2: APPROVING..." : 
                            (loading || isInternalLoading ? "STEP 2/2: PROCESSING..." : 
                            (needsApproval ? "APPROVE & DEPOSIT" : `CONFIRM ${type.toUpperCase()}`))}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};