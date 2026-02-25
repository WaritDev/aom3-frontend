'use client';

import React from 'react';
import { 
  Stack, 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  CircularProgress,
  Fade,
  useTheme
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import StarsIcon from '@mui/icons-material/Stars';
import BoltIcon from '@mui/icons-material/Bolt';

import { useAaveYield } from '@/hooks/useAaveYield';
import { useRealYield } from '@/hooks/useRealYield';
import { getAddress, Hex } from 'viem';

const NEON_GREEN = '#00E08F';

interface StatCardProps {
  label: string;
  value: string;
  isHero?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  chipLabel?: string;
  bonus?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  isHero, 
  icon, 
  loading, 
  chipLabel, 
  bonus 
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card 
      sx={{ 
        height: '100%',
        bgcolor: isDark ? 'background.paper' : '#FFFFFF', 
        color: 'text.primary',
        border: `1px solid ${isHero ? NEON_GREEN : isDark ? '#1E1E1E' : '#EEE'}`,
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 4,
        boxShadow: isHero 
            ? `0 0 25px ${NEON_GREEN}${isDark ? '15' : '30'}` 
            : isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.05)',
        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor: isHero ? NEON_GREEN : isDark ? '#444' : '#CCC',
          boxShadow: isHero 
            ? `0 10px 40px ${NEON_GREEN}${isDark ? '30' : '50'}` 
            : isDark ? `0 10px 20px rgba(0,0,0,0.5)` : `0 10px 30px rgba(0,0,0,0.1)`,
        }
      }}
    >
      {isHero && (
          <Box 
              sx={{ 
                  position: 'absolute', inset: -1, borderRadius: 4, 
                  border: `1px solid ${NEON_GREEN}`, opacity: isDark ? 0.5 : 0.3,
                  animation: 'pulse-border 2s infinite ease-in-out',
                  pointerEvents: 'none'
              }} 
          />
      )}

      <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Typography variant="overline" sx={{ color: isHero ? NEON_GREEN : 'text.secondary', fontWeight: 900, letterSpacing: 2 }}>
            {label}
          </Typography>
          {icon && <Box sx={{ color: isHero ? NEON_GREEN : 'text.disabled', display: 'flex' }}>{icon}</Box>}
        </Stack>

        <Box sx={{ flexGrow: 1 }}>
          {loading ? (
              <CircularProgress size={28} sx={{ color: NEON_GREEN }} />
          ) : (
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1, letterSpacing: '-1px', mb: 1.5 }}>
                  {value}
              </Typography>
              
              {bonus && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                      <StarsIcon sx={{ fontSize: 18, color: NEON_GREEN }} />
                      <Typography 
                          variant="caption" 
                          sx={{ fontWeight: 800, color: NEON_GREEN, letterSpacing: 0.5, textTransform: 'uppercase' }}
                      >
                          {bonus}
                      </Typography>
                  </Stack>
              )}
            </Box>
          )}
        </Box>
        
        {chipLabel && (
          <Box mt={3}>
              <Chip 
                icon={<BoltIcon sx={{ fontSize: '14px !important', color: 'inherit !important' }} />}
                label={chipLabel}
                size="small" 
                sx={{ 
                  bgcolor: isHero ? `${NEON_GREEN}15` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                  color: isHero ? NEON_GREEN : 'text.secondary', 
                  fontWeight: 900,
                  fontSize: '10px',
                  height: 24,
                  border: `1px solid ${isHero ? `${NEON_GREEN}30` : isDark ? '#333' : '#DDD'}`,
                  borderRadius: 1.5
                }} 
              />
          </Box>
        )}
      </CardContent>

      <style jsx global>{`
        @keyframes pulse-border {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.02); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.5; }
        }
      `}</style>
    </Card>
  );
};

const rawVaultAddress = process.env.NEXT_PUBLIC_HL_VAULT_ADDRESS;
if (!rawVaultAddress) {
    throw new Error("NEXT_PUBLIC_HL_VAULT_ADDRESS is missing in your .env file");
}
export const VAULT_ADDRESS = getAddress(rawVaultAddress as Hex);

const YieldStats: React.FC = () => {
  const { baseApy: aaveApy, loading: aaveLoading } = useAaveYield();
  const { apy: realApy, vaultName, loading: realLoading } = useRealYield(VAULT_ADDRESS);

  const formatPercent = (val: number | undefined | null): string => {
      const safeVal = val ?? 0; 
      return `${safeVal.toFixed(2)}%`;
  };

  return (
    <Box sx={{ width: '100%', py: 8 }}>
      <Fade in timeout={1000}>
        <Box mb={8} textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px', textTransform: 'uppercase', color: 'text.primary' }}>
                Tactical <Box component="span" sx={{ color: NEON_GREEN }}>Yield Intelligence</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {realLoading ? "Analyzing Strategy..." : `Live Execution: ${vaultName} Protocol`}
            </Typography>
        </Box>
      </Fade>

      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={3} 
        alignItems="stretch"
      >
        <Box sx={{ flex: 1 }}>
          <StatCard 
            label="Aave Lending [BASE]" 
            value={formatPercent(aaveApy)} 
            loading={aaveLoading}
            icon={<ShowChartIcon fontSize="small" />}
            chipLabel="Passive Liquidity"
          />
        </Box>
        
        <Box sx={{ flex: 1.2 }}>
          <StatCard 
            label="AOM3 Strategy [BOOSTED]" 
            value={realLoading ? "SYNCING..." : formatPercent(realApy)} 
            isHero
            loading={realLoading}
            bonus={`+ Reward Pool & DP Multiplier`}
            chipLabel={vaultName || "HLP Aggregator"}
            icon={<AutoGraphIcon sx={{ fontSize: 32 }} />}
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <StatCard 
            label="TradFi Savings [LEGACY]" 
            value="~0.55%" 
            icon={<ShowChartIcon fontSize="small" />}
            chipLabel="Standard Bank"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default YieldStats;