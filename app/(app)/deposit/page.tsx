'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Box, Card, CardContent, Stack, Fade
} from '@mui/material';

import GavelIcon from '@mui/icons-material/Gavel';
import { useAOM3 } from '@/hooks/useAOM3';
import { useRealYield } from '@/hooks/useRealYield';
import { useAccount, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { USDC_ADDRESS, USDC_ABI } from '@/constants/contracts';
import { RewardEngineCard } from '@/components/card/RewardEngineCard';
import { MissionCommitmentCard } from '@/components/card/MissionCommitmentCard';
import { MissionSummaryCard } from '@/components/card/MissionSummaryCard';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FF9800';

interface Asset {
  symbol: string;
  name: string;
  coinId: string;
  image: string;
}

const DURATIONS = [
  { label: '3 Months', value: 3, multiplier: 1.0 },
  { label: '6 Months', value: 6, multiplier: 1.0 },
  { label: '12 Months', value: 12, multiplier: 1.2 },
  { label: '18 Months', value: 18, multiplier: 1.5 },
  { label: '24 Months', value: 24, multiplier: 2.0 },
];

const ASSETS: Asset[] = [
  { symbol: 'USDC', name: 'USD Coin', coinId: 'USDC', image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
];

export default function DepositPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { createQuestAction } = useAOM3();
  const [selectedAsset] = useState<Asset>(ASSETS[0]);
  const [monthlyAmount, setMonthlyAmount] = useState<string>('');
  const [durationValue, setDurationValue] = useState<number>(12);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isDeploying, setIsDeploying] = useState(false);

  const selectedDuration = useMemo(() => 
    DURATIONS.find(d => d.value === durationValue) || DURATIONS[1], 
    [durationValue]
  );

  const { data: balanceData, refetch: refetchBalance, isLoading: isBalanceLoading } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const walletBalance = balanceData ? formatUnits(balanceData as bigint, 6) : '0';

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });
  const { apy: realBaseApy, loading: isYieldLoading } = useRealYield(selectedAsset.coinId);

  const amountNum = parseFloat(monthlyAmount) || 0;
  const totalPrincipal = amountNum * selectedDuration.value;
  const estimatedMaxApy = (realBaseApy * selectedDuration.multiplier * 1.5).toFixed(2);

  const estimatedInterest = useMemo(() => {
    const annualRate = (realBaseApy * selectedDuration.multiplier) / 100;
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return 0;
    const fv = amountNum * ((Math.pow(1 + monthlyRate, selectedDuration.value) - 1) / monthlyRate);
    return fv - totalPrincipal;
  }, [amountNum, realBaseApy, selectedDuration, totalPrincipal]);

  const handleInitializeQuest = async () => {
    if (!isConnected) return alert("Please connect your wallet first");
    if (Number(monthlyAmount) > Number(walletBalance)) {
        return alert(`Insufficient USDC. Needed: ${monthlyAmount} USDC`);
    }
    
    setIsDeploying(true);
    try {
      const hash = await createQuestAction(monthlyAmount, selectedDuration.value);
      setTxHash(hash);
    } catch (error) {
      console.error("Transaction Failed:", error);
      setIsDeploying(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
      setTimeout(() => router.push('/overview'), 3000);
    }
  }, [isSuccess, router, refetchBalance]);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Fade in timeout={800}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: '-2px', textTransform: 'uppercase', color: 'white' }}>
            Savings <Box component="span" sx={{ color: NEON_GREEN }}>Quest</Box>
          </Typography>
        </Box>
      </Fade>

      <Stack spacing={4}>
        <Card sx={{ bgcolor: 'rgba(255,152,0,0.03)', border: `1px solid ${NEON_ORANGE}`, borderRadius: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle2" fontWeight="800" color={NEON_ORANGE} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <GavelIcon fontSize="small" /> AOM3 DISCIPLINE REGULATION
            </Typography>
            <Typography variant="caption" sx={{ color: '#CCC', display: 'block' }}>
              Principal is 100% safe. Streak Multipliers apply to active savers only.
            </Typography>
          </CardContent>
        </Card>

        <MissionCommitmentCard 
          monthlyAmount={monthlyAmount}
          setMonthlyAmount={setMonthlyAmount}
          duration={durationValue}
          setDuration={setDurationValue}
          walletBalance={walletBalance}
          isBalanceLoading={isBalanceLoading}
          assetSymbol="USDC"
        />

        <MissionSummaryCard 
          isYieldLoading={isYieldLoading}
          estimatedMaxApy={estimatedMaxApy}
          totalPrincipal={totalPrincipal}
          estimatedInterest={estimatedInterest}
          amountNum={amountNum}
          walletBalance={Number(walletBalance)}
          isDeploying={isDeploying}
          isConfirming={isConfirming}
          onInitialize={handleInitializeQuest}
          coinSymbol={'BTC'}
          durationMultiplier={selectedDuration.multiplier}
          durationMonths={selectedDuration.value}
        />

        <RewardEngineCard />
      </Stack>
    </Container>
  );
}