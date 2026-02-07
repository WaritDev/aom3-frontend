'use client';

import React, { useState, useMemo } from 'react';
import { 
    Dialog, DialogContent, DialogTitle, Box, Typography, 
    Stack, Button, IconButton, Divider, CircularProgress 
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

    // ✨ Seamless Action: หนึ่งคลิก รันสองธุรกรรม
    const handleAction = async () => {
        setIsInternalLoading(true);
        try {
            if (needsApproval) {
                console.log("🛠️ Step 1: Requesting Infinite Approval...");
                await approveAsync({
                    address: USDC_ADDRESS,
                    abi: USDC_ABI,
                    functionName: 'approve',
                    args: [AOM3_VAULT_ADDRESS, maxUint256], 
                });
                await refetchAllowance(); 
                console.log("✅ Approval Success. Proceeding to Step 2...");
            }
            // เรียกฟังก์ชันฝากหรือถอนต่อทันที
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
                <IconButton onClick={onClose} sx={{ color: '#444' }} disabled={isProcessing}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, pt: 1 }}>
                <Stack spacing={3}>
                    <Box sx={{ p: 2, bgcolor: '#111', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">TRANSACTION AMOUNT</Typography>
                        <Typography variant="h4" fontWeight="900" sx={{ color: isWithdraw ? 'white' : NEON_GREEN }}>
                            {amount} USDC
                        </Typography>
                    </Box>

                    {!isWithdraw && (
                        <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                            <Typography variant="caption" sx={{ 
                                color: !needsApproval ? NEON_GREEN : '#666', 
                                display: 'flex', alignItems: 'center', gap: 0.5,
                                fontWeight: !needsApproval ? 800 : 400
                            }}>
                                1. Approve {!needsApproval && <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />}
                            </Typography>
                            <Typography variant="caption" color="#222"> | </Typography>
                            <Typography variant="caption" sx={{ 
                                color: !needsApproval ? NEON_GREEN : '#666',
                                fontWeight: !needsApproval ? 800 : 400
                            }}>
                                2. Deposit
                            </Typography>
                        </Stack>
                    )}

                    {isWithdraw && penalty > 0 ? (
                        <Box sx={{ p: 2, bgcolor: `${ERROR_RED}15`, borderRadius: 2, border: `1px solid ${ERROR_RED}44` }}>
                            <Stack direction="row" spacing={1} mb={0.5}>
                                <WarningAmberIcon sx={{ color: ERROR_RED, fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight="900" color={ERROR_RED}>EARLY WITHDRAWAL PENALTY</Typography>
                            </Stack>
                            <Typography variant="body2" color="#ff9999">
                                Early redemption detected. A 10% penalty will be deducted and redirected to the Reward Pool, totaling {penalty.toFixed(2)} USDC.
                            </Typography>
                        </Box>
                    ) : type === 'deposit' && (
                        <Box sx={{ p: 2, bgcolor: `${NEON_GREEN}15`, borderRadius: 2, border: `1px solid ${NEON_GREEN}44` }}>
                            <Stack direction="row" spacing={1} mb={0.5}>
                                <RocketLaunchIcon sx={{ color: NEON_GREEN, fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight="900" color={NEON_GREEN}>STREAK COMBO</Typography>
                            </Stack>
                            <Typography variant="body2" color="#99ffda">
                                Complete this deposit to extend your streak to month {streak + 1} and qualify for Global Pool rewards.
                            </Typography>
                        </Box>
                    )}

                    <Divider sx={{ borderColor: '#222' }} />

                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={handleAction}
                        disabled={isProcessing || isLoadingAllowance}
                        startIcon={isProcessing && <CircularProgress size={20} color="inherit" />}
                        sx={{ 
                            py: 1.5, borderRadius: 2, fontWeight: 900, fontSize: '1rem',
                            bgcolor: isWithdraw && penalty > 0 ? ERROR_RED : NEON_GREEN,
                            color: '#000',
                            '&:hover': { bgcolor: isWithdraw && penalty > 0 ? '#cc0000' : '#00C97F' }
                        }}
                    >
                        {isLoadingAllowance ? "CHECKING STATUS..." : 
                            isApproving ? "STEP 1/2: APPROVING..." : 
                            (loading || isInternalLoading ? "STEP 2/2: PROCESSING..." : 
                            (needsApproval ? "INITIALIZE & DEPOSIT" : `CONFIRM ${type.toUpperCase()}`))}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};