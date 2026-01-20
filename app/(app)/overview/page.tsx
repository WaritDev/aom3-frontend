'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, Typography, Box, Card, CardContent, Stack, 
  LinearProgress, Button, Chip,
} from '@mui/material';
import Image from 'next/image';

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DepositQuestModal from '@/components/modal/DepositQuestModal';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FF9800';

interface Plan {
  id: number;
  name: string;
  asset: string;
  targetAmount: number;
  currentAmount: number;
  monthlyDeposit: number;
  progress: number;
  streak: number;
  durationMultiplier: number;
  streakMultiplier: number;
  baseApy: number;
  hasDepositedThisMonth: boolean;
  image: string;
}

const ACTIVE_PLANS: Plan[] = [
  {
    id: 1,
    name: 'USDC Quest',
    asset: 'USDC',
    targetAmount: 6000,
    currentAmount: 2500,
    monthlyDeposit: 500,
    progress: 42,
    streak: 5,
    durationMultiplier: 1.2,
    streakMultiplier: 1.15,
    baseApy: 5.89,
    hasDepositedThisMonth: true,
    image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    id: 2,
    name: 'ETH Quest',
    asset: 'ETH',
    targetAmount: 12,
    currentAmount: 1.5, 
    monthlyDeposit: 0.1,
    progress: 12, 
    streak: 0,
    durationMultiplier: 1.5, 
    streakMultiplier: 1.0,
    baseApy: 3.82,
    hasDepositedThisMonth: false,
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  }
];

const isInsideDepositWindow = (): boolean => {
  const now = new Date();
  const utcDate = now.getUTCDate();
  return utcDate >= 1 && utcDate <= 7;
};

const getNextDistributionDate = (): number => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  let target: Date;
  if (date < 16) {
    target = new Date(Date.UTC(year, month, 16, 0, 0, 0));
  } else {
    target = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0));
  }
  return target.getTime();
};

const calculateTimeLeft = (): string => {
  const now = new Date().getTime();
  const target = getNextDistributionDate();
  const difference = target - now;
  if (difference <= 0) return "00d 00h 00m 00s";
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
};

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>(calculateTimeLeft);
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Typography variant="h5" fontWeight="900" sx={{ color: NEON_GREEN, fontFamily: 'monospace', letterSpacing: 1 }}>
      {timeLeft}
    </Typography>
  );
};

const PlanCard: React.FC<{ plan: Plan; onAction: (type: 'deposit' | 'topup', plan: Plan) => void }> = ({ plan, onAction }) => {
    const inWindow = useMemo(() => isInsideDepositWindow(), []);
    const isSuccess = plan.hasDepositedThisMonth;
    const isMissed = !plan.hasDepositedThisMonth && !inWindow;
    const isPending = !plan.hasDepositedThisMonth && inWindow;

    const boostedApy = (plan.baseApy * plan.durationMultiplier * plan.streakMultiplier).toFixed(2);
    
    return (
        <Card sx={{ 
          bgcolor: '#0A0A0A', 
          border: `1px solid ${isMissed ? NEON_ORANGE : isPending ? NEON_GREEN : '#1E1E1E'}`, 
          borderRadius: 4,
          opacity: isMissed ? 0.75 : 1,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: isMissed ? 'none' : `0 10px 30px ${NEON_GREEN}10` }
        }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                    
                    <Box sx={{ flex: 2, width: '100%' }}>
                        <Stack direction="row" justifyContent="space-between" mb={2}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Image src={plan.image} alt={plan.asset} width={40} height={40} unoptimized />
                                <Box>
                                    <Typography variant="h6" fontWeight="900" sx={{ lineHeight: 1.2 }}>{plan.name}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>GOAL: {plan.targetAmount.toLocaleString()} {plan.asset}</Typography>
                                </Box>
                            </Stack>
                            <Box>
                              {isSuccess && <Chip icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />} label="SYNCHRONIZED" sx={{ bgcolor: `${NEON_GREEN}15`, color: NEON_GREEN, fontWeight: 900, height: 24, fontSize: 10 }} />}
                              {isMissed && <Chip icon={<ErrorOutlineIcon sx={{ fontSize: '14px !important' }} />} label="YIELD FORFEITED" sx={{ bgcolor: `${NEON_ORANGE}15`, color: NEON_ORANGE, fontWeight: 900, height: 24, fontSize: 10 }} />}
                              {isPending && <Chip label="WINDOW OPEN" sx={{ bgcolor: NEON_GREEN, color: '#000', fontWeight: 900, height: 24, fontSize: 10 }} />}
                            </Box>
                        </Stack>
                        <LinearProgress variant="determinate" value={plan.progress} sx={{ height: 6, borderRadius: 3, bgcolor: '#1A1A1A', '& .MuiLinearProgress-bar': { bgcolor: isMissed ? NEON_ORANGE : NEON_GREEN } }} />
                    </Box>

                    <Box sx={{ flex: 1.2, width: '100%', textAlign: { xs: 'left', md: 'right' } }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="800">EXPECTED APY</Typography>
                        <Typography variant="h3" fontWeight="900" sx={{ color: isMissed ? '#444' : NEON_GREEN, letterSpacing: -1.5 }}>
                          {isMissed ? '0.00%' : `${boostedApy}%`}
                        </Typography>
                        
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, mb: 2, color: isMissed ? NEON_ORANGE : 'text.secondary', fontWeight: 700 }}>
                          {isMissed ? "Streak Reset: Principal Safe" : isSuccess ? "Mission Secured for January" : `Action Required: Deposit by Day 7`}
                        </Typography>

                        <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                          <Button 
                            variant="contained" size="small" 
                            disabled={isSuccess || isMissed}
                            onClick={() => onAction('deposit', plan)}
                            startIcon={isMissed ? <LockIcon sx={{ fontSize: '14px !important' }} /> : null}
                            sx={{ fontWeight: 900, bgcolor: NEON_GREEN, color: '#000', '&.Mui-disabled': { bgcolor: '#1A1A1A', color: '#444' } }}
                          >
                            {isSuccess ? "Deposited" : isMissed ? "Locked" : "Deposit Now"}
                          </Button>
                          <Button variant="outlined" size="small" onClick={() => onAction('topup', plan)} sx={{ fontWeight: 900, borderColor: '#333', color: '#888' }}>
                            Top Up
                          </Button>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default function OverviewPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'deposit' | 'topup'>('deposit');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleAction = (type: 'deposit' | 'topup', plan: Plan) => {
    setModalType(type);
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: -2, textTransform: 'uppercase' }}>
          Mission <Box component="span" sx={{ color: NEON_GREEN }}>Dashboard</Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Manage your strategic quests and monitor the global reward pool.
        </Typography>
      </Box>

      <Card sx={{ background: 'linear-gradient(135deg, #0d2e15 0%, #000 100%)', border: `1px solid ${NEON_GREEN}`, boxShadow: `0 0 30px ${NEON_GREEN}10`, mb: 8, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
        <WhatshotIcon sx={{ position: 'absolute', right: -30, bottom: -30, fontSize: 180, opacity: 0.05, color: NEON_GREEN }} />
        <CardContent sx={{ p: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={4}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                <EmojiEventsIcon sx={{ color: '#ffd700', fontSize: 28 }} />
                <Typography variant="overline" color="#ffd700" fontWeight="900" letterSpacing={3}>GLOBAL REWARD POOL</Typography>
              </Stack>
              <Typography variant="h2" fontWeight="900" color="white" sx={{ letterSpacing: -2 }}>$25,400.50</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                Collected from <Box component="span" color={NEON_ORANGE} fontWeight="900">12 defaulted strategists</Box> this period.
              </Typography>
            </Box>
            <Stack alignItems={{ xs: 'center', md: 'flex-end' }} spacing={0.5}>
              <Typography variant="caption" color="#888" fontWeight="800" sx={{ letterSpacing: 1 }}>NEXT REWARD DROP (UTC):</Typography>
              <CountdownTimer />
              <Chip label="STREAK ELIGIBLE" size="small" sx={{ mt: 1.5, bgcolor: `${NEON_GREEN}15`, color: NEON_GREEN, fontWeight: 900 }} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 1 }}>ACTIVE STRATEGIES</Typography>
          <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} href="/deposit" sx={{ borderRadius: 2, fontWeight: 900, borderColor: '#222', color: '#FFF' }}>NEW QUEST</Button>
        </Stack>
        
        <Stack spacing={3}>
          {ACTIVE_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onAction={handleAction} />
          ))}
        </Stack>
      </Stack>

      <Box sx={{ mt: 12, p: 4, bgcolor: 'rgba(0, 224, 143, 0.02)', border: '1px dashed #222', borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, mb: 2, display: 'block', letterSpacing: 2 }}>PROTOCOL_ALGORITHM</Typography>
        <Typography variant="h5" sx={{ color: '#DDD', fontFamily: 'monospace', fontWeight: 700, letterSpacing: -0.5 }}>
          $$UserShare = UserDeposit \times DurationMultiplier \times StreakMultiplier$$
        </Typography>
        <Typography variant="caption" sx={{ color: '#444', mt: 2, display: 'block', fontWeight: 700 }}>
          ESTIMATED PAYOUT BASED ON CURRENT EXECUTION PARAMETERS.
        </Typography>
      </Box>

      <Box textAlign="center" mt={10} sx={{ opacity: 0.2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800 }}>
              © 2026 AOM3 PROTOCOL
            </Typography>
      </Box>

      {selectedPlan && (
        <DepositQuestModal 
          open={modalOpen} 
          onClose={() => setModalOpen(false)} 
          type={modalType}
          planName={selectedPlan.name} 
          assetSymbol={selectedPlan.asset} 
          requiredAmount={selectedPlan.monthlyDeposit}
        />
      )}
    </Container>
  );
}