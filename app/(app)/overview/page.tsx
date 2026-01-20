'use client';

import React from 'react';
import { 
  Container, Typography, Box, Card, CardContent, Stack, 
  LinearProgress, Button, Chip, Tooltip, Divider
} from '@mui/material';
import Image from 'next/image';

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BoltIcon from '@mui/icons-material/Bolt';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FF9800';

const WEEKLY_POOL = {
  amount: 25400.50,
  timeLeft: '2 Days, 4 Hours',
  dropoutCount: 12,
};

const ACTIVE_PLANS = [
  {
    id: 1,
    name: 'Wealth Builder 12M',
    asset: 'USDC',
    targetAmount: 6000,
    currentAmount: 2000,
    monthlyDeposit: 500,
    nextDue: 'Feb 7, 2026',
    progress: 33,
    streak: 4,
    durationMultiplier: 1.2,
    streakMultiplier: 1.1,
    baseApy: 5.89,
    status: 'On Track',
    image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    id: 2,
    name: 'ETH Long Term',
    asset: 'ETH',
    targetAmount: 12,
    currentAmount: 1, 
    monthlyDeposit: 0.1,
    nextDue: 'Feb 5, 2026',
    progress: 8, 
    streak: 1,
    durationMultiplier: 1.5, 
    streakMultiplier: 1.0,
    baseApy: 3.82,
    status: 'Due Soon',
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  }
];

const RewardPoolHero = () => (
  <Card 
    sx={{ 
      background: 'linear-gradient(135deg, #0d2e15 0%, #000000 100%)', 
      border: `1px solid ${NEON_GREEN}`,
      boxShadow: `0 0 20px ${NEON_GREEN}15`,
      position: 'relative',
      overflow: 'hidden',
      mb: 4,
      borderRadius: 4
    }}
  >
    <WhatshotIcon sx={{ position: 'absolute', right: -20, top: -20, fontSize: 160, opacity: 0.08, color: NEON_GREEN }} />

    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <EmojiEventsIcon sx={{ color: '#ffd700', fontSize: 24 }} />
              <Typography variant="overline" color="#ffd700" fontWeight="900" letterSpacing={2}>
                GLOBAL PRIZE POOL
              </Typography>
            </Stack>
            <Typography variant="h4" fontWeight="900" sx={{ color: '#fff', mb: 0.5 }}>
              ${WEEKLY_POOL.amount.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ fontWeight: 500 }}>
              From <Box component="span" color={NEON_ORANGE} fontWeight="800">{WEEKLY_POOL.dropoutCount} defaulted plans</Box> this week.
            </Typography>
        </Box>

        <Stack alignItems={{ xs: 'center', md: 'flex-end' }} spacing={0.5}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', fontWeight: 800 }}>
              Reward Drop In:
            </Typography>
            <Typography variant="h5" fontWeight="900" sx={{ color: NEON_GREEN, fontFamily: 'monospace' }}>
              {WEEKLY_POOL.timeLeft}
            </Typography>
            <Chip 
                label="STREAK ELIGIBLE" 
                size="small" 
                sx={{ mt: 1, bgcolor: 'rgba(0, 224, 143, 0.1)', color: NEON_GREEN, fontWeight: 900, fontSize: '10px', height: '20px' }} 
            />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

const PlanCard = ({ plan }: { plan: typeof ACTIVE_PLANS[0] }) => {
    const isWarning = plan.status === 'Due Soon';
    const boostedApy = (plan.baseApy * plan.durationMultiplier * plan.streakMultiplier).toFixed(2);
    
    return (
        <Card sx={{ bgcolor: '#0A0A0A', border: `1px solid ${isWarning ? NEON_ORANGE : '#1E1E1E'}`, borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                    
                    <Box sx={{ flex: 2, width: '100%' }}>
                        <Stack direction="row" justifyContent="space-between" mb={2.5}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Image src={plan.image} alt={plan.asset} width={40} height={40} unoptimized />
                                <Box>
                                    <Typography variant="caption" color={NEON_GREEN} fontWeight="900">QUEST:</Typography>
                                    <Typography variant="h5" fontWeight="900" sx={{ lineHeight: 1.1 }}>{plan.name}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                        GOAL: {plan.targetAmount.toLocaleString()} {plan.asset}
                                    </Typography>
                                </Box>
                            </Stack>
                            {isWarning && (
                                <Chip label="ACTION REQ" sx={{ bgcolor: `${NEON_ORANGE}20`, color: NEON_ORANGE, fontWeight: 900, height: 24, fontSize: 10 }} />
                            )}
                        </Stack>

                        <Box>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography variant="caption" color="text.secondary" fontWeight="800">LEVEL {plan.streak} PROGRESS</Typography>
                                <Typography variant="caption" fontWeight="900" color={NEON_GREEN}>
                                    {plan.currentAmount.toLocaleString()} / {plan.targetAmount.toLocaleString()} {plan.asset}
                                </Typography>
                            </Stack>
                            <LinearProgress 
                                variant="determinate" 
                                value={plan.progress} 
                                sx={{ height: 8, borderRadius: 4, bgcolor: '#1A1A1A', '& .MuiLinearProgress-bar': { bgcolor: isWarning ? NEON_ORANGE : NEON_GREEN } }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, width: '100%', bgcolor: 'rgba(255,255,255,0.02)', p: 2, borderRadius: 3, border: '1px solid #1A1A1A' }}>
                        <Typography variant="caption" color="#555" fontWeight="900" sx={{ display: 'block', mb: 1.5, textTransform: 'uppercase' }}>Boosters</Typography>
                        <Stack direction="row" spacing={2}>
                            <Box flex={1}>
                                <Typography variant="caption" color="text.secondary" fontWeight="800">STREAK</Typography>
                                <Typography variant="h6" fontWeight="900" color={NEON_GREEN}>{plan.streakMultiplier}x</Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ borderColor: '#222' }} />
                            <Box flex={1}>
                                <Typography variant="caption" color="text.secondary" fontWeight="800">DUR</Typography>
                                <Typography variant="h6" fontWeight="900" color={NEON_GREEN}>{plan.durationMultiplier}x</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ flex: 1, width: '100%', textAlign: { xs: 'left', md: 'right' } }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="800">ESTIMATED APY</Typography>
                          <Stack direction="row" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} alignItems="baseline" spacing={0.5}>
                              <Typography variant="h3" fontWeight="900" sx={{ color: NEON_GREEN, letterSpacing: -1 }}>{boostedApy}%</Typography>
                              <Tooltip title={`Base ${plan.baseApy}% × Multipliers`}>
                                  <InfoOutlinedIcon sx={{ fontSize: 14, color: '#444' }} />
                              </Tooltip>
                          </Stack>
                          <Typography variant="caption" color={isWarning ? NEON_ORANGE : 'text.secondary'} sx={{ fontWeight: 700, display: 'block', mt: 0.5, mb: 1.5 }}>
                              Next: {plan.monthlyDeposit} {plan.asset} by Feb 7
                          </Typography>
                          <Button variant="contained" fullWidth size="small" sx={{ fontWeight: 900, bgcolor: isWarning ? NEON_ORANGE : 'rgba(255,255,255,0.05)', color: isWarning ? '#000' : '#FFF' }}>
                              {isWarning ? "DEPOSIT NOW" : "TOP UP"}
                          </Button>
                    </Box>

                </Stack>
            </CardContent>
        </Card>
    );
};

export default function OverviewPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
          MISSION <Box component="span" sx={{ color: NEON_GREEN }}>DASHBOARD</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Manage your active quests and monitor the global reward pool.
        </Typography>
      </Box>

      <RewardPoolHero />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{ mb: 6 }}>
          {[
            { label: 'DISCIPLINE SCORE', value: '850', total: '/ 1000', icon: <CheckCircleIcon />, color: NEON_GREEN },
            { label: 'YIELD EARNED', value: '+$1,240', total: '.22', icon: <TrendingUpIcon />, color: NEON_GREEN },
            { label: 'TOTAL COMMITMENT', value: '$3,450', total: '.00', icon: <BoltIcon />, color: '#FFF' }
          ].map((stat, idx) => (
            <Card key={idx} sx={{ flex: 1, bgcolor: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 3 }}>
                <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{ p: 1, bgcolor: `${stat.color}10`, borderRadius: 2, display: 'flex', color: stat.color }}>{stat.icon}</Box>
                        <Box>
                            <Typography variant="caption" color="#555" fontWeight="900" sx={{ fontSize: 10 }}>{stat.label}</Typography>
                            <Typography variant="h6" fontWeight="900" color={stat.color}>
                                {stat.value}<Box component="span" sx={{ fontSize: '0.8rem', opacity: 0.5 }}>{stat.total}</Box>
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
          ))}
      </Stack>

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="900" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>ACTIVE QUESTS</Typography>
            <Button 
                variant="outlined" startIcon={<AddCircleOutlineIcon />} href="/deposit"
                sx={{ borderRadius: 2, fontWeight: 900, borderColor: '#333', color: '#FFF', fontSize: 12 }}
            >
                NEW QUEST
            </Button>
        </Stack>
        
        <Stack spacing={3}>
            {ACTIVE_PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
            ))}
        </Stack>
      </Box>

    </Container>
  );
}