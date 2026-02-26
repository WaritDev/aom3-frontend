'use client';

import React from 'react';
import Link from 'next/link';
import { 
    Container, Typography, Box, Stack, Card, CardContent, 
    useTheme, useMediaQuery, SxProps, Theme, Button, alpha 
} from '@mui/material';
import { motion } from 'framer-motion';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TimerIcon from '@mui/icons-material/TimerOutlined';
import HubIcon from '@mui/icons-material/Hub';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SavingsIcon from '@mui/icons-material/SavingsOutlined';
import GavelIcon from '@mui/icons-material/Gavel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FF9800';

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
        id: 1, label: "INITIALIZE", title: "Quest Commitment",
        description: "Strategists choose their monthly deposit amount and commit to a term (6-24 months). This initial choice sets your Base Discipline Points (DP).",
        icon: <AccountBalanceWalletIcon fontSize="large" />, color: NEON_GREEN
    },
    {
        id: 2, label: "DEPOSIT", title: "Monthly Window",
        description: "Consistency is key. You must deposit within the 7-day monthly window. Success here keeps your streak alive and fuels the HLP engine.",
        icon: <TimerIcon fontSize="large" />, color: NEON_GREEN
    },
    {
        id: 3, label: "GENERATE", title: "HLP Market Making",
        description: "Your funds are aggregated into Hyperliquid’s HLP vaults, earning real-yield from trading fees, spreads, and liquidations across the platform.",
        icon: <HubIcon fontSize="large" />, color: NEON_GREEN
    },
    {
        id: 4, label: "MULTIPLY", title: "Discipline Streak",
        description: "Maintaining your streak increases your Active DP. The longer you stay disciplined, the larger your share of the global bonus pool.",
        icon: <WhatshotIcon fontSize="large" />, color: NEON_ORANGE
    },
    {
        id: 5, label: "ACCURE", title: "Bonus Pool Distribution",
        description: "AOM3 collects penalty fees from undisciplined users. This 'Reward Pool' is distributed as extra USDC to strategists with high streaks.",
        icon: <EmojiEventsIcon fontSize="large" />, color: NEON_GREEN
    },
    {
        id: 6, label: "MATURITY", title: "Vault Settlement",
        description: "At the end of your term, withdraw your full principal plus all accrued HLP yields and discipline bonuses. Quest complete.",
        icon: <SavingsIcon fontSize="large" />, color: NEON_GREEN
    }
];

const RoadmapStep: React.FC<{ step: QuestStep; index: number }> = ({ step, index }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
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
                    Phase 0{step.id}: {step.label}
                </Typography>
                <Typography variant="h5" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase', color: 'text.primary' }}>
                    {step.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {step.description}
                </Typography>
            </Box>

            <Box 
                sx={{ 
                    mx: { xs: 2, md: 6 }, 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: isDark ? '#0A0A0A' : '#fff', 
                    border: `2px solid ${step.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.color,
                    boxShadow: isDark ? `0 0 20px ${step.color}30` : `0 4px 15px ${alpha(step.color, 0.2)}`,
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
    const isDark = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const backButtonSx: SxProps<Theme> = {
        color: 'text.secondary',
        fontWeight: 800,
        fontSize: '0.75rem',
        letterSpacing: 2,
        mb: 4,
        '&:hover': {
            color: NEON_GREEN,
            bgcolor: 'transparent',
            '& .MuiSvgIcon-root': { transform: 'translateX(-4px)' }
        },
        '& .MuiSvgIcon-root': { transition: 'transform 0.2s', fontSize: '1rem', mr: 1 }
    };

    return (
        <Box sx={{ 
            bgcolor: 'background.default', 
            color: 'text.primary', 
            minHeight: '100vh', 
            py: 6, 
            overflowX: 'hidden',
            transition: 'background-color 0.3s ease'
        }}>
            <Container maxWidth="lg">
                
                <Button component={Link} href="/" sx={backButtonSx}>
                    <ArrowBackIcon /> BACK TO MISSION CONTROL
                </Button>

                <Box sx={{ textAlign: 'center', mb: 12, zIndex: 1 }}>
                    <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 4 }}>
                        Quest Architecture
                    </Typography>
                    <Typography variant="h2" fontWeight="900" sx={{ mt: 2, mb: 3, textTransform: 'uppercase', letterSpacing: -1 }}>
                        The <Box component="span" sx={{ color: NEON_GREEN }}>AOM3</Box> Engine
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 650, mx: 'auto' }}>
                        A systematic breakdown of how discipline converts into institutional-grade yield through HLP and streak-based multipliers.
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    {!isMobile && (
                        <Box 
                            sx={{ 
                                position: 'absolute', left: '50%', top: 0, bottom: 0, 
                                width: '2px', 
                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                transform: 'translateX(-50%)', zIndex: 1
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
                        <Card sx={{ 
                            flex: 1, 
                            bgcolor: isDark ? alpha(NEON_ORANGE, 0.03) : alpha(NEON_ORANGE, 0.01), 
                            border: `1px solid ${alpha(NEON_ORANGE, 0.3)}`, 
                            borderRadius: 4,
                            boxShadow: 'none'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight="900" color={NEON_ORANGE} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <GavelIcon /> EMERGENCY EXIT
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                                    Strategists can withdraw before maturity, but a 10% penalty fee is applied. 
                                    This penalty is distributed back to the Reward Pool for other disciplined strategists.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{ 
                            flex: 1, 
                            bgcolor: isDark ? alpha(NEON_GREEN, 0.03) : alpha(NEON_GREEN, 0.01), 
                            border: `1px solid ${alpha(NEON_GREEN, 0.3)}`, 
                            borderRadius: 4,
                            boxShadow: 'none'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, mb: 2, display: 'block' }}>
                                    The DP Algorithm
                                </Typography>
                                <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: -1, mb: 1, color: 'text.primary' }}>
                                    Active DP = ∑(Deposit) × Duration_Mult
                                </Typography>
                                <Typography variant="h6" sx={{ fontFamily: 'monospace', color: NEON_ORANGE, fontWeight: 700, fontSize: '1rem', mb: 2 }}>
                                    Bonus_Share = (User_DP / Total_DP) × Reward_Pool
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.disabled', mt: 2, display: 'block', lineHeight: 1.5 }}>
                                    *DP (Discipline Points) represents your protocol weight. Your share of the HLP yield and penalty-driven Reward Pool is strictly proportional to your accumulated DP and streak consistency.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>

                <Box textAlign="center" mt={15} sx={{ opacity: isDark ? 0.2 : 0.4 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        © 2026 AOM3 PROTOCOL - ALL RIGHTS RESERVED
                    </Typography>
                </Box>

            </Container>
        </Box>
    );
}