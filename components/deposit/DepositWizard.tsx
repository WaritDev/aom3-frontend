'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Shield,
  Zap,
  Calendar,
  Wallet,
  CheckCircle,
} from 'lucide-react';

// =====================
// TypeScript Interfaces
// =====================

interface DepositData {
  amount: string;
  duration: 7 | 30 | 90 | null;
  tier: 'starter' | 'saver' | 'pro' | null;
  extraLifeline: boolean;
}

interface ExchangeRate {
  rate: number;
  timestamp: string;
}

interface TierConfig {
  id: 'starter' | 'saver' | 'pro';
  title: string;
  subtitle: string;
  description: string;
  yield: string;
  penalty: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

// =====================
// Tier Configurations
// =====================

const TIERS: TierConfig[] = [
  {
    id: 'starter',
    title: 'The Try-out',
    subtitle: 'Build Discipline',
    description: '0% Yield. High Penalty. Pure Discipline.',
    yield: '0%',
    penalty: 'High (50%)',
    icon: <Shield size={32} />,
    color: '#6B8E9F', // Slate Blue-Gray (Common)
    features: ['Focus on habit building', 'No yield returns', 'Penalties fund Pro tier'],
  },
  {
    id: 'saver',
    title: 'The Saver',
    subtitle: 'Balanced Approach',
    description: 'Standard Yield. Includes Lifelines.',
    yield: '8-12%',
    penalty: 'Medium (25%)',
    icon: <TrendingUp size={32} />,
    color: '#4CAF50', // Emerald Green (Uncommon)
    features: ['Standard DeFi yields', '2 Lifelines included', 'Skip days without penalty'],
  },
  {
    id: 'pro',
    title: 'Winner Takes All',
    subtitle: 'Maximum Risk/Reward',
    description: 'Max Yield + Bonus Pool. High Stakes. Miss 1 day = ZERO Return.',
    yield: '15-25%',
    penalty: 'Total Loss',
    icon: <Zap size={32} />,
    color: '#E89C4A', // Amber Gold (Rare/Legendary)
    features: ['100% Base Yield', 'Bonus from penalty pool', 'One miss = Total loss'],
  },
];

const STEPS = ['Configure Deposit', 'Select Risk Tier', 'Review & Confirm'];

// =====================
// Main Component
// =====================

const DepositWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [depositData, setDepositData] = useState<DepositData>({
    amount: '',
    duration: null,
    tier: null,
    extraLifeline: false,
  });
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loadingRate, setLoadingRate] = useState(true);
  // Mock wallet balance - will be fetched from API in the future
  const [walletBalance] = useState('1,250.00');

  // Fetch USDC -> THB exchange rate
  React.useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Using CoinGecko API (no API key required)
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=thb'
        );
        const data = await response.json();
        const rate = data['usd-coin']?.thb || 0;
        
        setExchangeRate({
          rate,
          timestamp: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }) + ' GMT+7',
        });
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Fallback rate
        setExchangeRate({
          rate: 33.5,
          timestamp: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }) + ' GMT+7',
        });
      } finally {
        setLoadingRate(false);
      }
    };

    fetchExchangeRate();
  }, []);

  // Validation
  const isStep1Valid = useMemo(() => {
    const amount = parseFloat(depositData.amount);
    return amount > 0 && !isNaN(amount) && depositData.duration !== null;
  }, [depositData.amount, depositData.duration]);

  const isStep2Valid = depositData.tier !== null;

  // Calculate THB value
  const thbValue = useMemo(() => {
    const amount = parseFloat(depositData.amount);
    if (!amount || !exchangeRate) return '0';
    return (amount * exchangeRate.rate).toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [depositData.amount, exchangeRate]);

  // Calculate end date
  const estimatedEndDate = useMemo(() => {
    if (!depositData.duration) return '';
    const date = new Date();
    date.setDate(date.getDate() + depositData.duration);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [depositData.duration]);

  // Handlers
  const handleNext = () => {
    if (activeStep === 0 && !isStep1Valid) return;
    if (activeStep === 1 && !isStep2Valid) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleConfirmDeposit = () => {
    console.log('Deposit Confirmed:', depositData);
    alert('Transaction would be signed here!\n\n' + JSON.stringify(depositData, null, 2));
  };

  const handleAmountChange = (delta: number) => {
    const currentAmount = parseFloat(depositData.amount) || 0;
    const newAmount = Math.max(0, currentAmount + delta);
    setDepositData({ ...depositData, amount: newAmount.toString() });
  };

  // =====================
  // Step 1: Configuration
  // =====================

  const renderStep1 = () => (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Card sx={{ bgcolor: '#1e1e1e', border: '1px solid #333' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Wallet size={28} color="#4caf50" />
            <Typography variant="h5" fontWeight="bold">
              Configure Your Deposit
            </Typography>
          </Box>

          {/* Wallet Balance */}
          <Box
            sx={{
              mb: 4,
              p: 2.5,
              bgcolor: '#0a0a0a',
              borderRadius: 2,
              border: '1px solid #2d2d2d',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Your Wallet Balance
                </Typography>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    boxShadow: '0 0 8px rgba(76, 175, 80, 0.6)',
                  }}
                />
              </Box>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                {walletBalance} USDC
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
                Wallet Connected
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.3,
              }}
            >
              <Wallet size={40} color="#4caf50" />
            </Box>
          </Box>

          {/* Amount Input */}
          <Box mb={4}>
            <Typography variant="body2" color="text.secondary" mb={1.5} fontWeight={600}>
              Deposit Amount (USDC)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  bgcolor: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: 2,
                  p: 1,
                  flex: 1,
                }}
              >
                <Button
                  onClick={() => handleAmountChange(-10)}
                  sx={{
                    minWidth: 48,
                    height: 48,
                    bgcolor: '#1e1e1e',
                    color: 'primary.main',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    borderRadius: 1.5,
                    '&:hover': {
                      bgcolor: '#2d2d2d',
                    },
                  }}
                >
                  −
                </Button>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="0"
                  value={depositData.amount}
                  onChange={(e) => setDepositData({ ...depositData, amount: e.target.value })}
                  InputProps={{
                    sx: {
                      bgcolor: 'transparent',
                      '& input': {
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        MozAppearance: 'textfield',
                      },
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                      '& fieldset': { border: 'none' },
                    },
                  }}
                />
                <Button
                  onClick={() => handleAmountChange(10)}
                  sx={{
                    minWidth: 48,
                    height: 48,
                    bgcolor: 'primary.main',
                    color: 'black',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    borderRadius: 1.5,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  +
                </Button>
              </Box>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 600, minWidth: 70 }}
              >
                USDC
              </Typography>
            </Box>
            {/* THB Conversion */}
            {exchangeRate && depositData.amount && (
              <Box
                sx={{
                  mt: 1.5,
                  p: 2,
                  bgcolor: '#1e1e1e',
                  borderRadius: 1.5,
                  border: '1px solid #2d2d2d',
                }}
              >
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  ≈ {thbValue} THB
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
                  Updated: {exchangeRate.timestamp}
                </Typography>
              </Box>
            )}
            {loadingRate && (
              <Typography variant="caption" color="text.secondary" mt={1} display="block">
                Loading exchange rate...
              </Typography>
            )}
          </Box>

          {/* Duration Selection */}
          <Box mb={4}>
            <Typography variant="body2" color="text.secondary" mb={1.5} fontWeight={600}>
              Lock Duration
            </Typography>
            <ToggleButtonGroup
              value={depositData.duration}
              exclusive
              onChange={(_, value) => value && setDepositData({ ...depositData, duration: value })}
              fullWidth
              sx={{
                '& .MuiToggleButton-root': {
                  py: 2,
                  border: '1px solid #333',
                  bgcolor: '#0a0a0a',
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'black',
                    fontWeight: 700,
                    borderColor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                  '&:hover': {
                    bgcolor: '#1e1e1e',
                    borderColor: '#555',
                  },
                },
              }}
            >
              <ToggleButton value={7}>7 Days</ToggleButton>
              <ToggleButton value={30}>30 Days</ToggleButton>
              <ToggleButton value={90}>90 Days</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Lock Period Timeline */}
          {depositData.duration && (
            <Box
              sx={{
                bgcolor: '#0a0a0a',
                p: 3,
                borderRadius: 2,
                border: '2px solid #2d2d2d',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)',
                },
              }}
            >
              {/* Header */}
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Calendar size={18} color="#4caf50" />
                <Typography variant="caption" color="primary.main" fontWeight={700} letterSpacing={0.5}>
                  LOCK PERIOD TIMELINE
                </Typography>
              </Box>

              {/* Timeline Range */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {/* Start Date */}
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    bgcolor: '#1e1e1e',
                    borderRadius: 1.5,
                    border: '1px solid #333',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                    Start Date
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Typography>
                  <Typography variant="caption" color="primary.main" fontWeight={600}>
                    Today
                  </Typography>
                </Box>

                {/* Arrow */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 60,
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '2px',
                      bgcolor: 'primary.main',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: -6,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid #4caf50',
                        borderTop: '4px solid transparent',
                        borderBottom: '4px solid transparent',
                      },
                    }}
                  />
                  {/* <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, fontSize: '0.65rem' }}
                  >
                    {depositData.duration} days
                  </Typography> */}
                </Box>

                {/* End Date */}
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    bgcolor: 'primary.main',
                    borderRadius: 1.5,
                    border: '2px solid #4caf50',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'black', opacity: 0.7, mb: 0.5, display: 'block' }}
                  >
                    Maturity Date
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="black">
                    {estimatedEndDate}
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="black">
                    ✓ Unlocked
                  </Typography>
                </Box>
              </Box>

              {/* Additional Info */}
              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: '1px solid #2d2d2d',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Your funds will be locked until maturity
                </Typography>
                <Chip
                  label={`${depositData.duration} Days`}
                  size="small"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'black',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  // =====================
  // Step 2: Select Tier
  // =====================

  const renderStep2 = () => (
    <Box>
      <Typography variant="h5" textAlign="center" mb={1} fontWeight="bold">
        Choose Your Risk Tier
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={5}>
        Different tiers, different strategies. Choose wisely.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
        }}
      >
        {TIERS.map((tier) => {
          const isSelected = depositData.tier === tier.id;
          return (
            <Box key={tier.id} sx={{ position: 'relative' }}>
              {tier.id === 'saver' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    bgcolor: 'primary.main',
                    color: 'black',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  ⭐ BEST VALUE
                </Box>
              )}
              <Card
                onClick={() => setDepositData({ ...depositData, tier: tier.id })}
                sx={{
                  cursor: 'pointer',
                  bgcolor: '#1e1e1e',
                  border: isSelected
                    ? `3px solid ${tier.color}`
                    : tier.id === 'saver'
                    ? `2px solid ${tier.color}50`
                    : '1px solid #333',
                  boxShadow: isSelected ? `0 0 30px ${tier.color}40` : 'none',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: tier.color,
                  },
                }}
              >
                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: tier.color,
                      borderRadius: '50%',
                      p: 0.5,
                    }}
                  >
                    <CheckCircle size={20} color="black" />
                  </Box>
                )}

                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box sx={{ color: tier.color }}>{tier.icon}</Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {tier.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tier.subtitle}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={3} minHeight={60}>
                    {tier.description}
                  </Typography>

                  <Box display="flex" gap={1} mb={3} flexWrap="wrap">
                    <Chip
                      label={`Yield: ${tier.yield}`}
                      size="small"
                      sx={{
                        bgcolor: tier.id === 'starter' ? '#333' : `${tier.color}20`,
                        color: tier.id === 'starter' ? 'text.secondary' : tier.color,
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={`Penalty: ${tier.penalty}`}
                      size="small"
                      sx={{ bgcolor: '#ff525220', color: '#ff5252', fontWeight: 600 }}
                    />
                  </Box>

                  <Box>
                    {tier.features.map((feature, idx) => (
                      <Typography
                        key={idx}
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        mb={0.5}
                      >
                        • {feature}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  // =====================
  // Step 3: Review
  // =====================

  const renderStep3 = () => {
    const selectedTier = TIERS.find((t) => t.id === depositData.tier);
    const extraLifelineFee = depositData.extraLifeline
      ? (parseFloat(depositData.amount) * 0.01).toFixed(2)
      : '0.00';

    return (
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h5" textAlign="center" mb={1} fontWeight="bold">
          Review Your Deposit
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
          Double-check everything before confirming.
        </Typography>

        <Card sx={{ bgcolor: '#1e1e1e', border: '1px solid #333', mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="overline" color="text.secondary" fontWeight={600}>
              Deposit Summary
            </Typography>

            <Box mt={3} display="flex" flexDirection="column" gap={2.5}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {depositData.amount} USDC
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {depositData.duration} Days
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {estimatedEndDate}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Risk Tier
                </Typography>
                <Chip
                  label={selectedTier?.title}
                  sx={{
                    bgcolor: `${selectedTier?.color}20`,
                    color: selectedTier?.color,
                    fontWeight: 700,
                  }}
                />
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Expected Yield
                </Typography>
                <Typography variant="body1" fontWeight={700} color="primary.main">
                  {selectedTier?.yield}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tier-Specific Options */}
        {depositData.tier === 'saver' && (
          <Card sx={{ bgcolor: '#1e1e1e', border: '1px solid #333', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                🛡️ Enhanced Protection
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={depositData.extraLifeline}
                    onChange={(e) =>
                      setDepositData({ ...depositData, extraLifeline: e.target.checked })
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'primary.main',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Purchase Extra Lifeline (+1% Fee)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Additional {extraLifelineFee} USDC fee - Total: 3 Lifelines
                    </Typography>
                  </Box>
                }
              />
            </CardContent>
          </Card>
        )}

        {depositData.tier === 'pro' && (
          <Alert
            severity="success"
            icon={<Zap size={20} />}
            sx={{
              bgcolor: '#4caf5020',
              border: '1px solid #4caf50',
              color: 'white',
              mb: 3,
              '& .MuiAlert-icon': { color: '#4caf50' },
            }}
          >
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              🎯 Bonus Pool Eligible
            </Typography>
            <Typography variant="caption">
              Estimated Bonus Pool Share: <strong>+12.5% APY</strong> (from penalties)
            </Typography>
          </Alert>
        )}

        {/* Confirm Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleConfirmDeposit}
          sx={{
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 700,
            bgcolor: 'primary.main',
            color: 'black',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Confirm Deposit & Sign Transaction
        </Button>

        <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={2}>
          By confirming, you agree to the terms and understand the risks.
        </Typography>
      </Box>
    );
  };

  // =====================
  // Main Render
  // =====================

  return (
    <Box sx={{ py: 6, px: 2 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Stepper */}
        <Box sx={{ mb: 6 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: 'text.secondary',
                      fontWeight: 600,
                      '&.Mui-active': {
                        color: 'primary.main',
                        fontWeight: 700,
                      },
                      '&.Mui-completed': {
                        color: 'text.primary',
                      },
                    },
                    '& .MuiStepIcon-root': {
                      color: '#333',
                      '&.Mui-active': {
                        color: 'primary.main',
                      },
                      '&.Mui-completed': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        <Box sx={{ mb: 4 }}>
          {activeStep === 0 && renderStep1()}
          {activeStep === 1 && renderStep2()}
          {activeStep === 2 && renderStep3()}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
            sx={{
              minWidth: 120,
              borderColor: '#333',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'transparent',
              },
            }}
          >
            Back
          </Button>
          {activeStep < 2 && (
            <Button
              onClick={handleNext}
              disabled={(activeStep === 0 && !isStep1Valid) || (activeStep === 1 && !isStep2Valid)}
              variant="contained"
              sx={{
                minWidth: 120,
                bgcolor: 'primary.main',
                color: 'black',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DepositWizard;
