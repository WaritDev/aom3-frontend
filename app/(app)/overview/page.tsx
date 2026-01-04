'use client';

import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Stack, 
  LinearProgress, 
  Button, 
  Divider,
  Chip,
  Tooltip
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TokenIcon from '@mui/icons-material/Token';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
    baseApy: 5.5,
    boostedApy: 12.4,
    status: 'On Track',
    color: '#2775CA'
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
    durationMultiplier: 1.0, 
    streakMultiplier: 1.0,
    baseApy: 3.8,
    boostedApy: 4.2,
    status: 'Due Soon',
    color: '#627EEA'
  }
];

const RewardPoolHero = () => (
  <Card 
    sx={{ 
      background: 'linear-gradient(135deg, #0d2e15 0%, #000000 100%)', 
      border: '1px solid #4caf50',
      boxShadow: '0 0 30px rgba(76, 175, 80, 0.15)',
      position: 'relative',
      overflow: 'hidden',
      mb: 4
    }}
  >
    <WhatshotIcon 
        sx={{ 
            position: 'absolute', right: -30, top: -30, 
            fontSize: 200, opacity: 0.05, color: '#4caf50' 
        }} 
    />

    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={4}>
        
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <EmojiEventsIcon sx={{ color: '#ffd700', fontSize: 28 }} />
              <Typography variant="overline" color="#ffd700" fontWeight="bold" letterSpacing={2}>
                WEEKLY PRIZE POOL
              </Typography>
            </Stack>
            <Typography variant="h3" fontWeight="bold" sx={{ color: '#fff', mb: 1 }}>
              ${WEEKLY_POOL.amount.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.6)">
              Collected from {WEEKLY_POOL.dropoutCount} broken commitments this week.
            </Typography>
        </Box>

        <Stack alignItems={{ xs: 'center', md: 'flex-end' }} spacing={1}>
            <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
              <AccessTimeIcon fontSize="small" /> Next Distribution closes in:
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#4caf50' }}>
              {WEEKLY_POOL.timeLeft}
            </Typography>
            <Chip 
              label="Keep your streak to win share" 
              size="small" 
              sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', fontWeight: 'bold' }} 
            />
        </Stack>

      </Stack>
    </CardContent>
  </Card>
);

const PlanCard = ({ plan }: { plan: typeof ACTIVE_PLANS[0] }) => {
    const isWarning = plan.status === 'Due Soon';
    
    return (
        <Card sx={{ bgcolor: '#121212', border: '1px solid #333', mb: 2 }}>
            <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                    
                    <Box sx={{ flex: 2, width: '100%' }}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <TokenIcon sx={{ color: plan.color, fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">{plan.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Goal: {plan.targetAmount.toLocaleString()} {plan.asset}
                                    </Typography>
                                </Box>
                            </Stack>
                            {isWarning && (
                                <Chip label="Deposit Due Soon" color="warning" size="small" variant="outlined" />
                            )}
                        </Stack>

                        <Box sx={{ mt: 2 }}>
                            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                <Typography variant="caption" color="text.secondary">Progress ({plan.progress}%)</Typography>
                                <Typography variant="caption" fontWeight="bold">
                                    {plan.currentAmount.toLocaleString()} / {plan.targetAmount.toLocaleString()} {plan.asset}
                                </Typography>
                            </Stack>
                            <LinearProgress 
                                variant="determinate" 
                                value={plan.progress} 
                                color={isWarning ? 'warning' : 'primary'}
                                sx={{ height: 8, borderRadius: 4, bgcolor: '#333' }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, width: '100%', bgcolor: 'rgba(255,255,255,0.03)', p: 2, borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            Active Multipliers
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Streak</Typography>
                                <Typography variant="body1" fontWeight="bold" color={plan.streak > 1 ? '#4caf50' : '#fff'}>
                                    🔥 x{plan.streakMultiplier}
                                </Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#444' }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">Duration</Typography>
                                <Typography variant="body1" fontWeight="bold" color="#4caf50">
                                    ⏳ x{plan.durationMultiplier}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ flex: 1, width: '100%', textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">Current Boosted APY</Typography>
                          <Stack direction="row" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} alignItems="baseline" spacing={1}>
                              <Typography variant="h4" fontWeight="bold" color="#4caf50">
                                  {plan.boostedApy}%
                              </Typography>
                              <Tooltip title={`Base ${plan.baseApy}% + Boost ${(plan.boostedApy - plan.baseApy).toFixed(1)}%`}>
                                  <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
                              </Tooltip>
                          </Stack>
                          
                          <Typography variant="caption" color={isWarning ? 'warning.main' : 'text.secondary'} display="block" mt={1} mb={1}>
                              Next: {plan.monthlyDeposit} {plan.asset} by {plan.nextDue}
                          </Typography>

                          <Button 
                              variant={isWarning ? "contained" : "outlined"} 
                              color={isWarning ? "warning" : "success"}
                              fullWidth
                              size="small"
                          >
                              Deposit Now
                          </Button>
                    </Box>

                </Stack>
            </CardContent>
        </Card>
    );
};

export default function OverviewPage() {
  return (
    <Container maxWidth="lg">
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Consistency pays off. Maintain your streak to maximize your share of the pool.
        </Typography>
      </Box>

      <RewardPoolHero />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 6 }}>
          <Card sx={{ flex: 1, bgcolor: '#121212', border: '1px solid #333' }}>
              <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ p: 1.5, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: '50%' }}>
                          <CheckCircleIcon sx={{ color: '#4caf50' }} />
                      </Box>
                      <Box>
                          <Typography variant="caption" color="text.secondary">Discipline Score</Typography>
                          <Typography variant="h6" fontWeight="bold">850 / 1000</Typography>
                      </Box>
                  </Stack>
              </CardContent>
          </Card>
          
          <Card sx={{ flex: 1, bgcolor: '#121212', border: '1px solid #333' }}>
              <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ p: 1.5, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: '50%' }}>
                          <TrendingUpIcon sx={{ color: '#2196f3' }} />
                      </Box>
                      <Box>
                          <Typography variant="caption" color="text.secondary">Total Earned</Typography>
                          <Typography variant="h6" fontWeight="bold" color="#4caf50">+$1,240.22</Typography>
                      </Box>
                  </Stack>
              </CardContent>
          </Card>

          <Card sx={{ flex: 1, bgcolor: '#121212', border: '1px solid #333' }}>
              <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: '50%' }}>
                          <TokenIcon sx={{ color: '#ff9800' }} />
                      </Box>
                      <Box>
                          <Typography variant="caption" color="text.secondary">Total Deposited</Typography>
                          <Typography variant="h6" fontWeight="bold">$3,450.00</Typography>
                      </Box>
                  </Stack>
              </CardContent>
          </Card>
      </Stack>

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">Active Savings Plans</Typography>
            <Button 
                variant="outlined" 
                startIcon={<AddCircleOutlineIcon />}
                href="/deposit"
            >
                Start New Plan
            </Button>
        </Stack>
        
        <Stack spacing={2}>
            {ACTIVE_PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
            ))}
        </Stack>
      </Box>

    </Container>
  );
}