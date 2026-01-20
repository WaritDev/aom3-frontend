'use client';

import React from 'react';
import Link from 'next/link';
import { 
    Container, Typography, Box, Stack, Card, CardContent, 
    useTheme, useMediaQuery, SxProps, Theme, Button 
} from '@mui/material';
import { motion } from 'framer-motion';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TimerIcon from '@mui/icons-material/TimerOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SavingsIcon from '@mui/icons-material/SavingsOutlined';
import GavelIcon from '@mui/icons-material/Gavel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FF9800';
const BG_DARK = '#050505';

interface QuestStep {
    id: number;
    label: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const QUEST_STEPS: QuestStep[] = [
    {
        id: 1,
        label: "INITIALIZE",
        title: "Quest Selection",
        description: "The strategist (User) selects their target asset (USDC/ETH) and commits to a 6, 12, or 24-month duration to lock in their base multiplier.",
        icon: <AccountBalanceWalletIcon fontSize="large" />,
        color: NEON_GREEN
    },
    {
        id: 2,
        label: "COMMIT",
        title: "7-Day Deposit Window",
        description: "Every month, the strategist must deposit their commitment within the first 7 days. This 'Window' is the primary test of discipline.",
        icon: <TimerIcon fontSize="large" />,
        color: NEON_GREEN
    },
    {
        id: 3,
        label: "EXECUTE",
        title: "Delta-Neutral Engine",
        description: "Funds move from the AOM3 Vault to the Liminal Vault, capturing Hyperliquid funding rates to generate market-neutral yield.",
        icon: <BoltIcon fontSize="large" />,
        color: NEON_GREEN
    },
    {
        id: 4,
        label: "STREAK",
        title: "Performance Tracking",
        description: "Consistent deposits earn points and 'Streak Up' status. Missing a window results in forfeited yield, which feeds the global Reward Pool.",
        icon: <WhatshotIcon fontSize="large" />,
        color: NEON_ORANGE
    },
    {
        id: 5,
        label: "HARVEST",
        title: "Bi-Weekly Rewards",
        description: "Active strategists receive bonus yields from the Reward Pool every 2 weeks, distributed based on their accumulated points.",
        icon: <EmojiEventsIcon fontSize="large" />,
        color: NEON_GREEN
    },
    {
        id: 6,
        label: "MATURITY",
        title: "Loot Payout",
        description: "At the end of the term, the strategist withdraws their principal plus all yield. Early exits incur a 2-3% penalty fee.",
        icon: <SavingsIcon fontSize="large" />,
        color: NEON_GREEN
    }
    ];

    const RoadmapStep: React.FC<{ step: QuestStep; index: number }> = ({ step, index }) => {
    const isRight = index % 2 === 0;
    
    return (
        <Box 
        component={motion.div}
        initial={{ opacity: 0, x: isRight ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        viewport={{ once: true }}
        sx={{ 
            display: 'flex', 
            flexDirection: isRight ? 'row' : 'row-reverse',
            alignItems: 'center',
            justifyContent: 'center',
            mb: { xs: 8, md: 0 },
            position: 'relative'
        }}
        >
        <Box sx={{ width: { xs: '70%', md: '40%' }, textAlign: isRight ? 'right' : 'left' }}>
            <Typography variant="overline" sx={{ color: step.color, fontWeight: 900, letterSpacing: 2 }}>
            Step 0{step.id}: {step.label}
            </Typography>
            <Typography variant="h5" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase' }}>
            {step.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            {step.description}
            </Typography>
        </Box>

        <Box 
            sx={{ 
            mx: { xs: 2, md: 6 }, 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: '#0A0A0A', 
            border: `2px solid ${step.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: step.color,
            boxShadow: `0 0 20px ${step.color}30`,
            zIndex: 2,
            position: 'relative'
            }}
        >
            {step.icon}
        </Box>

        <Box sx={{ width: { xs: '0%', md: '40%' }, display: { xs: 'none', md: 'block' } }} />
        </Box>
    );
    };

    export default function DocsPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const headerSx: SxProps<Theme> = {
        textAlign: 'center',
        mb: 12,
        position: 'relative',
        zIndex: 1
    };

    const backButtonSx: SxProps<Theme> = {
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: 800,
        fontSize: '0.75rem',
        letterSpacing: 2,
        mb: 4,
        '&:hover': {
        color: NEON_GREEN,
        bgcolor: 'transparent',
        '& .MuiSvgIcon-root': {
            transform: 'translateX(-4px)',
        }
        },
        '& .MuiSvgIcon-root': {
        transition: 'transform 0.2s',
        fontSize: '1rem',
        mr: 1
        }
    };

    return (
        <Box sx={{ bgcolor: BG_DARK, color: 'white', minHeight: '100vh', py: 6, overflowX: 'hidden' }}>
        <Container maxWidth="lg">
            
            <Button 
            component={Link} 
            href="/" 
            disableRipple 
            sx={backButtonSx}
            >
            <ArrowBackIcon /> EXIT DOCUMENTATION
            </Button>

            <Box sx={headerSx}>
            <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 4 }}>
                System Architecture
            </Typography>
            <Typography variant="h2" fontWeight="900" sx={{ mt: 2, mb: 3, textTransform: 'uppercase' }}>
                AOM3 <Box component="span" sx={{ color: NEON_GREEN }}>Operational Flow</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', maxWidth: 650, mx: 'auto' }}>
                A strategic breakdown of our delta-neutral savings quest—designed for discipline and high-performance yield.
            </Typography>
            </Box>

            <Box sx={{ position: 'relative' }}>
            {!isMobile && (
                <Box 
                sx={{ 
                    position: 'absolute', 
                    left: '50%', 
                    top: 0, 
                    bottom: 0, 
                    width: '2px', 
                    bgcolor: 'rgba(255,255,255,0.05)',
                    transform: 'translateX(-50%)',
                    zIndex: 1
                }} 
                />
            )}

            <Stack spacing={{ xs: 0, md: 12 }}>
                {QUEST_STEPS.map((step, index) => (
                <RoadmapStep key={step.id} step={step} index={index} />
                ))}
            </Stack>
            </Box>

            <Box sx={{ mt: 15, position: 'relative', zIndex: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <Card sx={{ flex: 1, bgcolor: 'rgba(255,152,0,0.03)', border: `1px solid ${NEON_ORANGE}30`, borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="900" color={NEON_ORANGE} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <GavelIcon /> EMERGENCY WITHDRAWAL
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
                    Strategists can force a withdrawal before maturity, but a **2-3% penalty fee** is applied to the principal, and all accumulated yield is forfeited to the Reward Pool.
                    </Typography>
                </CardContent>
                </Card>

                <Card sx={{ flex: 1, bgcolor: 'rgba(0, 224, 143, 0.03)', border: `1px solid ${NEON_GREEN}30`, borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, mb: 2, display: 'block' }}>
                    The Maturity Algorithm
                    </Typography>
                    <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: -1 }}>
                    UserShare = UserDeposit × DurationMult × StreakMult
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#555', mt: 2, display: 'block' }}>
                    *Final loot distribution is weighted by your time commitment and discipline streak.
                    </Typography>
                </CardContent>
                </Card>
            </Stack>
            </Box>

            <Box textAlign="center" mt={15} sx={{ opacity: 0.2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800 }}>
                © 2026 AOM3 PROTOCOL
            </Typography>
            </Box>

        </Container>
        </Box>
    );
}