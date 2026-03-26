'use client';

import React, { useState, useEffect } from 'react';
import { formatUnits } from 'viem';
import { useReadContract, useAccount } from 'wagmi';
import { 
    Card, CardContent, Stack, Box, Typography, 
    LinearProgress, Button, Skeleton, Divider, Chip, Tooltip,
    Dialog, DialogContent, CircularProgress, useTheme, alpha
} from '@mui/material';

import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EventBusyIcon from '@mui/icons-material/EventBusy';

import { useAOM3 } from '@/hooks/useAOM3';
import { useHL } from '@/hooks/useHL'; 
import { AOM3_VAULT_ADDRESS, AOM3_VAULT_ABI } from '@/constants/contracts';
import { AOM3ActionModal } from '../modal/AOM3ActionModal';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FFA500';
const NEON_RED = '#FF4D4D';
const GOLD_COLOR = '#FFD700';

interface StatusModalProps {
    open: boolean;
    status: 'processing' | 'success' | 'error';
    step: number;
    totalSteps: number;
    message: string;
    onClose: () => void;
}

const TransactionStatusModal = ({ open, status, step, totalSteps, message, onClose }: StatusModalProps) => {
    const theme = useTheme();
    return (
        <Dialog 
            open={open} 
            onClose={status !== 'processing' ? onClose : undefined}
            PaperProps={{
                sx: { 
                    bgcolor: 'background.paper',
                    border: `1px solid ${status === 'error' ? NEON_RED : NEON_GREEN}44`, 
                    borderRadius: 4, 
                    backgroundImage: 'none', 
                    minWidth: 340 
                }
            }}
        >
            <DialogContent sx={{ p: 4, textAlign: 'center' }}>
                <Stack spacing={3} alignItems="center">
                    {status === 'processing' && (
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress size={80} thickness={2} sx={{ color: NEON_GREEN }} />
                            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: NEON_GREEN, lineHeight: 1 }}>{step}/{totalSteps}</Typography>
                                <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 700, fontSize: 10 }}>STEP</Typography>
                            </Box>
                        </Box>
                    )}
                    {status === 'success' && <CheckCircleIcon sx={{ fontSize: 80, color: NEON_GREEN }} />}
                    {status === 'error' && <ErrorOutlineIcon sx={{ fontSize: 80, color: NEON_RED }} />}

                    <Box>
                        <Typography variant="h6" fontWeight={900} color="text.primary" sx={{ textTransform: 'uppercase', mb: 1 }}>
                            {status === 'processing' ? 'Processing Action' : status === 'success' ? 'Mission Success' : 'Action Failed'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, lineHeight: 1.6 }}>
                            {message}
                        </Typography>
                    </Box>

                    {status !== 'processing' && (
                        <Button 
                            fullWidth variant="contained" onClick={onClose}
                            sx={{ bgcolor: status === 'error' ? NEON_RED : NEON_GREEN, color: '#000', fontWeight: 900, borderRadius: 2, py: 1.5, '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.8) } }}
                        >
                            {status === 'error' ? 'TRY AGAIN' : 'CONTINUE'}
                        </Button>
                    )}
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

interface DynamicPlanCardProps {
    questId: bigint;
    onActionSuccess?: () => void;
}

type QuestData = readonly [
    `0x${string}`, bigint, bigint, bigint, bigint, bigint, bigint, bigint, boolean
];

export const DynamicPlanCard: React.FC<DynamicPlanCardProps> = ({ questId, onActionSuccess }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { address } = useAccount();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [currentDate, setCurrentDate] = useState<number>(0);
    const [modalConfig, setModalConfig] = useState<{ open: boolean; type: 'deposit' | 'withdraw'; }>({ open: false, type: 'deposit' });
    
    const [statusModal, setStatusModal] = useState<Omit<StatusModalProps, 'onClose'>>({
        open: false, status: 'processing', step: 1, totalSteps: 1, message: ''
    });

    const { syncQuestAction, withdrawAction } = useAOM3();
    const { runAutoDeposit, executeQuestExit } = useHL();

    const { data: vaultTotalDPRaw } = useReadContract({
        address: AOM3_VAULT_ADDRESS as `0x${string}`,
        abi: AOM3_VAULT_ABI,
        functionName: 'totalDisciplinePoints',
    });
    const systemTotalDP = vaultTotalDPRaw ? Number(vaultTotalDPRaw) : 0;


    const { data: userTotalBalanceRaw } = useReadContract({
        address: AOM3_VAULT_ADDRESS as `0x${string}`,
        abi: AOM3_VAULT_ABI,
        functionName: 'userBalance',
        args: address ? [address] : undefined,
    });

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(Math.floor(now.getTime() / 1000));
            setCurrentDate(now.getDate());
        };
        updateTime();
        const interval = setInterval(updateTime, 1000); 
        return () => clearInterval(interval);
    }, []);

    const { data: quest, isLoading, refetch } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'quests',
        args: [questId],
    });

    const questData = quest as QuestData | undefined;

    if (isLoading || !questData || currentTime === 0) {
        return <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 4, bgcolor: 'background.paper' }} />;
    }

    const [, monthlyAmount, totalDeposited, currentStreak, duration, startTimestamp, lastDepositTimestamp, dp, active] = questData;
    if (!active && Number(dp) === 0) return null;

    const monthlyAmtStr = formatUnits(monthlyAmount, 6);
    const totalDepNum = Number(formatUnits(totalDeposited, 6));
    const progress = Math.min((Number(currentStreak) / Number(duration)) * 100, 100);
    const totalDurationSec = Number(duration) * 30 * 24 * 60 * 60;
    const maturityTimestamp = Number(startTimestamp) + totalDurationSec;
    const isMatured = (currentTime >= maturityTimestamp) || (Number(currentStreak) >= Number(duration));
    const isDepositWindowOpen = currentDate >= 1 && currentDate <= 7;
    const lastDepositDate = new Date(Number(lastDepositTimestamp) * 1000);
    const nowDate = new Date(currentTime * 1000);
    const monthDiff = (nowDate.getFullYear() - lastDepositDate.getFullYear()) * 12 + (nowDate.getMonth() - lastDepositDate.getMonth());
    const isAlreadyDepositedThisMonth = monthDiff === 0;
    let isBroken = false;
    if (!isMatured) {
        if (monthDiff > 1) {
            isBroken = true;
        } else if (monthDiff === 1 && currentDate > 7) {
            isBroken = true;
        }
    }

    const totalUserPrincipal = userTotalBalanceRaw ? Number(formatUnits(userTotalBalanceRaw as bigint, 6)) : totalDepNum;

    const canDeposit = !isMatured && isDepositWindowOpen && !isAlreadyDepositedThisMonth && !isBroken;

    let currentPenaltyPct = 0;
    let penaltyAmount = 0;
    
    if (!isMatured && currentTime > 0) {
        const remainingSec = Math.max(0, maturityTimestamp - currentTime);
        currentPenaltyPct = 1 + ((remainingSec * 2) / totalDurationSec);
        penaltyAmount = (totalDepNum * currentPenaltyPct) / 100;
    }

    const networkShare = systemTotalDP > 0 ? (Number(dp) / systemTotalDP) * 100 : 0;

    let depositBtnText = "DEPOSIT NOW";
    if (isProcessing && modalConfig.type === 'deposit') depositBtnText = "PROCESSING...";

    let depositTooltip = "Maintain your streak by depositing now.";
    if (isBroken) {
        depositTooltip = "Deposit window has already passed. Quest failed.";
    } else if (isMatured) {
        depositTooltip = "Quest is already matured.";
    } else if (isAlreadyDepositedThisMonth) {
        depositTooltip = "You have already deposited for this month. See you next month!";
    } else if (!isDepositWindowOpen) {
        depositTooltip = "Deposit window is closed. Please come back between the 1st and 7th of the month.";
    }

    const handleConfirmAction = async () => {
        setModalConfig(prev => ({ ...prev, open: false }));
        setIsProcessing(true);
        
        const currentTotalSteps = 2; 
        const amountToReturn = isMatured ? totalDepNum : totalDepNum - penaltyAmount;

        setStatusModal({
            open: true, status: 'processing', step: 1, totalSteps: currentTotalSteps,
            message: modalConfig.type === 'deposit' 
                ? `Step 1/${currentTotalSteps}: Signing Commitment on Arbitrum...` 
                : `Step 1/${currentTotalSteps}: Processing Withdrawals & Bridge Routing...`
        });

        try {
            if (modalConfig.type === 'deposit') {
                const hash = await syncQuestAction(Number(questId), monthlyAmtStr); 
                if (hash) {
                    setStatusModal(prev => ({ ...prev, step: 2, message: `Step 2/${currentTotalSteps}: Deploying to HL Yield Strategy...` }));
                    await runAutoDeposit(monthlyAmtStr);
                }
            } else {                
                try {
                    await executeQuestExit(isMatured, totalDepNum, penaltyAmount, totalUserPrincipal);
                } catch (innerErr: unknown) {
                    const error = innerErr as Error;
                    if (error.message?.toLowerCase().includes("lock")) {
                        throw new Error("HL_VAULT_LOCKED: Please disable withdrawal lock on Hyperliquid Testnet first.");
                    }
                    throw innerErr;
                }

                setStatusModal(prev => ({ 
                    ...prev, step: 2, 
                    message: `Step 2/${currentTotalSteps}: Recording On-chain Settlement on Arbitrum (Sign required)...` 
                }));
                
                await withdrawAction(Number(questId));
            }

            setStatusModal(prev => ({
                ...prev, status: 'success', 
                message: modalConfig.type === 'deposit' 
                    ? 'Quest Updated! Your funds are earning yield.' 
                    : isMatured 
                        ? `Redeemed $${amountToReturn.toLocaleString()} successfully! Principal and Yield have been returned to your wallet.` 
                        : `Exit Complete! $${amountToReturn.toLocaleString()} returned. You forfeited all yield to the Reward Pool. 🤝`
            }));
            await refetch();
            onActionSuccess?.();
        } catch (outerErr: unknown) {
            const error = outerErr as Error;
            setStatusModal(prev => ({ ...prev, status: 'error', message: error.message || "Transaction failed." }));
        } finally { setIsProcessing(false); }
    };

    return (
        <>
            <Card sx={{ 
                bgcolor: 'background.paper',
                border: `1px solid ${isBroken ? NEON_RED : isMatured ? NEON_GREEN : theme.palette.divider}`, 
                borderRadius: 4, position: 'relative', overflow: 'visible', transition: '0.3s',
                backgroundImage: 'none',
                '&:hover': { borderColor: isBroken ? NEON_RED : NEON_GREEN, boxShadow: isBroken ? `0 0 25px ${alpha(NEON_RED, 0.15)}` : isDark ? `0 0 25px ${alpha(NEON_GREEN, 0.15)}` : `0 4px 20px ${alpha(NEON_GREEN, 0.1)}` }
            }}>
                <Box sx={{ position: 'absolute', top: -14, right: 24, zIndex: 1 }}>
                    {isBroken ? (
                        <Chip 
                            icon={<ErrorOutlineIcon sx={{ color: '#fff !important', fontSize: 18 }} />}
                            label="STREAK BROKEN"
                            sx={{ bgcolor: NEON_RED, fontWeight: 900, color: '#fff', px: 1, height: 28, boxShadow: `0 4px 15px ${alpha(NEON_RED, 0.4)}` }}
                        />
                    ) : (
                        <Chip 
                            icon={<MilitaryTechIcon sx={{ color: '#000 !important', fontSize: 18 }} />}
                            label={`${Number(dp).toLocaleString()} DP`}
                            sx={{ bgcolor: GOLD_COLOR, fontWeight: 900, color: '#000', px: 1, height: 28, boxShadow: `0 4px 15px ${alpha(GOLD_COLOR, 0.4)}` }}
                        />
                    )}
                </Box>

                <CardContent sx={{ p: 4 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                        <Box sx={{ flex: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                                <Typography variant="h6" fontWeight="900" sx={{ color: isBroken ? NEON_RED : 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {isBroken ? <EventBusyIcon sx={{ color: NEON_RED }} /> : isMatured ? <CheckCircleIcon sx={{ color: NEON_GREEN }} /> : null}
                                    {isBroken ? "QUEST FAILED: MISSED DEPOSIT" : isMatured ? "STRATEGY MATURED" : "ACTIVE SAVINGS QUEST"}
                                </Typography>
                                <Chip label={`Streak: ${currentStreak}/${duration} Months`} size="small" sx={{ bgcolor: isBroken ? alpha(NEON_RED, 0.1) : alpha(NEON_GREEN, 0.1), color: isBroken ? NEON_RED : NEON_GREEN, fontWeight: 800, borderRadius: 1.5 }} />
                            </Stack>

                            <Box mb={2.5}>
                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                    <Typography variant="caption" sx={{ color: isBroken ? NEON_RED : 'text.secondary', fontWeight: 700 }}>
                                        {isBroken ? "MATURITY PROGRESS (HALTED)" : "MATURITY PROGRESS"}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 800 }}>{progress.toFixed(0)}%</Typography>
                                </Stack>
                                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: theme.palette.divider, '& .MuiLinearProgress-bar': { bgcolor: isBroken ? NEON_RED : isMatured ? NEON_GREEN : NEON_ORANGE } }} />
                            </Box>

                            <Stack direction="row" spacing={4}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>EST. NETWORK SHARE</Typography>
                                    <Typography variant="body2" color="text.primary" fontWeight={800} sx={{ textDecoration: isBroken ? 'line-through' : 'none' }}>{networkShare.toFixed(2)}%</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                                        {isBroken ? "STATUS" : "MATURITY DATE"}
                                    </Typography>
                                    <Typography variant="body2" color={isBroken ? NEON_RED : isMatured ? NEON_GREEN : "text.primary"} fontWeight={800}>
                                        {isBroken ? "LOCKED" : new Date(maturityTimestamp * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.divider, display: { xs: 'none', md: 'block' } }} />

                        <Box sx={{ flex: 1, textAlign: { xs: 'left', md: 'right' }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box mb={3}>
                                <Typography variant="caption" sx={{ color: isBroken ? NEON_RED : 'text.secondary', fontWeight: 700, display: 'block' }}>
                                    {isBroken ? "EMERGENCY WITHDRAWAL ONLY" : isMatured ? "TOTAL REDEEMABLE" : "EMERGENCY WITHDRAWAL"}
                                </Typography>
                                <Typography variant="h3" fontWeight="900" sx={{ color: isBroken ? 'text.primary' : isMatured ? NEON_GREEN : 'text.primary', letterSpacing: -1 }}>
                                    ${(totalDepNum - penaltyAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </Typography>
                                {!isMatured && (
                                    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} mt={0.5}>
                                        <WarningAmberIcon sx={{ fontSize: 14, color: NEON_RED }} />
                                        <Typography variant="caption" sx={{ color: NEON_RED, fontWeight: 700 }}>Includes {currentPenaltyPct.toFixed(1)}% Early Exit Fee</Typography>
                                    </Stack>
                                )}
                            </Box>
                            
                            <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                <Tooltip title={isMatured ? "Redeem full principal + yield" : `Exit and forfeit all yield + ${currentPenaltyPct.toFixed(1)}% principal fee`}>
                                    <Box component="span">
                                        <Button 
                                            variant={isMatured ? "contained" : "outlined"} 
                                            disabled={isProcessing}
                                            onClick={() => setModalConfig({ open: true, type: 'withdraw' })}
                                            startIcon={isProcessing && modalConfig.type === 'withdraw' ? <CircularProgress size={16} color="inherit" /> : null}
                                            sx={{ 
                                                borderRadius: 2, px: 3, 
                                                bgcolor: isMatured ? NEON_GREEN : 'transparent',
                                                borderColor: isBroken ? NEON_RED : isMatured ? 'transparent' : NEON_RED, 
                                                color: isBroken ? NEON_RED : isMatured ? '#000' : NEON_RED, 
                                                fontWeight: 800,
                                                '&:hover': isMatured ? { bgcolor: alpha(NEON_GREEN, 0.8) } : {},
                                                '&.Mui-disabled': isMatured ? { bgcolor: alpha(NEON_GREEN, 0.3), color: '#000' } : {}
                                            }}
                                        >
                                            {isProcessing && modalConfig.type === 'withdraw' ? "PROCESSING..." : (isMatured ? "REDEEM FULL + YIELD" : "EXIT QUEST")}
                                        </Button>
                                    </Box>
                                </Tooltip>
                                
                                {!isMatured && (
                                    <Tooltip title={depositTooltip}>
                                        <span style={{ cursor: (!canDeposit && !isProcessing) ? 'not-allowed' : 'default' }}>
                                            <Button 
                                                variant="contained" disabled={!canDeposit || isProcessing}
                                                onClick={() => setModalConfig({ open: true, type: 'deposit' })}
                                                startIcon={
                                                    isProcessing && modalConfig.type === 'deposit' 
                                                        ? <CircularProgress size={16} color="inherit" /> 
                                                        : null
                                                }
                                                sx={{ 
                                                    borderRadius: 2, px: 3, 
                                                    bgcolor: canDeposit ? NEON_GREEN : alpha(theme.palette.divider, 0.2), 
                                                    color: canDeposit ? '#000' : 'text.disabled', 
                                                    fontWeight: 900, 
                                                    boxShadow: canDeposit && !isProcessing ? `0 4px 15px ${alpha(NEON_GREEN, 0.4)}` : 'none',
                                                    '&:hover': { bgcolor: alpha(NEON_GREEN, 0.8) },
                                                }}
                                            >
                                                {isBroken ? "DEPOSIT LOCKED" : depositBtnText}
                                            </Button>
                                        </span>
                                    </Tooltip>
                                )}
                            </Stack>
                            
                            {!isMatured && !isBroken && (!isDepositWindowOpen || isAlreadyDepositedThisMonth) && (
                                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 0.5, mt: 1, fontWeight: 700 }}>
                                    {isAlreadyDepositedThisMonth ? (
                                        <><CheckCircleIcon sx={{ fontSize: 14, color: NEON_GREEN }} /> DEPOSITED FOR THIS MONTH</>
                                    ) : (
                                        <><EventBusyIcon sx={{ fontSize: 14 }} /> OPENS EVERY 1ST - 7TH</>
                                    )}
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    {isBroken && (
                        <Box sx={{ 
                            mt: 4, p: 2.5, borderRadius: 3, 
                            bgcolor: alpha(NEON_RED, 0.08), 
                            border: `1px dashed ${NEON_RED}`,
                            display: 'flex', alignItems: 'center', gap: 2.5
                        }}>
                            <ErrorOutlineIcon sx={{ color: NEON_RED, fontSize: 36, display: { xs: 'none', sm: 'block' } }} />
                            <Box>
                                <Typography variant="subtitle1" sx={{ color: NEON_RED, fontWeight: 900, letterSpacing: 0.5 }}>
                                    ACTION REQUIRED: DEPOSIT WINDOW MISSED (1ST - 7TH)
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mt: 0.5 }}>
                                    You failed to deposit within the required timeframe. Your streak is broken and your current funds are locked in the vault. You must execute an <Box component="span" sx={{ color: NEON_RED, fontWeight: 800 }}>EMERGENCY EXIT</Box> to retrieve your remaining principal (minus penalties). Yield has been forfeit.
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {isMatured && (
                        <Box sx={{ 
                            mt: 4, p: 2.5, borderRadius: 3, 
                            bgcolor: alpha(NEON_GREEN, 0.08), 
                            border: `1px dashed ${NEON_GREEN}`,
                            display: 'flex', alignItems: 'center', gap: 2.5
                        }}>
                            <WorkspacePremiumIcon sx={{ color: NEON_GREEN, fontSize: 36, display: { xs: 'none', sm: 'block' } }} />
                            <Box>
                                <Typography variant="subtitle1" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 0.5 }}>
                                    QUEST COMPLETED! PENDING DP CLAIM
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mt: 0.5 }}>
                                    You have successfully maintained your discipline. Please click <Box component="span" sx={{ color: NEON_GREEN, fontWeight: 800 }}>REDEEM FULL + YIELD</Box> to finalize your rank and officially claim your permanent Discipline Points (DP) on the Leaderboard.
                                </Typography>
                            </Box>
                        </Box>
                    )}

                </CardContent>
            </Card>

            <AOM3ActionModal 
                open={modalConfig.open} onClose={() => !isProcessing && setModalConfig((prev) => ({ ...prev, open: false }))}
                type={modalConfig.type} title={modalConfig.type === 'deposit' ? "Discipline Deposit" : (isMatured ? "Redeem Principal" : "Early Exit Warning")}
                amount={modalConfig.type === 'deposit' ? monthlyAmtStr : totalDepNum.toFixed(2)} penalty={penaltyAmount} streak={Number(currentStreak)} loading={isProcessing} onConfirm={handleConfirmAction}
            />

            <TransactionStatusModal 
                open={statusModal.open} status={statusModal.status} step={statusModal.step} totalSteps={statusModal.totalSteps} message={statusModal.message}
                onClose={() => setStatusModal(prev => ({ ...prev, open: false }))}
            />
        </>
    );
};