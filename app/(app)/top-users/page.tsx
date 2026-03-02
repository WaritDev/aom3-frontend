'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    Container, Typography, Box, Card, CardContent, Stack, 
    Avatar, Chip, useTheme, useMediaQuery, Zoom, 
    CircularProgress, alpha
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const NEON_GREEN = '#00E08F';
const HLP_VAULT_ADDRESS = "0xdfc24b077bc1425ad1dea75bcb6f8158e10df303";

interface HLFollower {
    user: string;
    vaultEquity: string;
    pnl: string;
    allTimePnl: string;
    daysFollowing: number;
}

interface VaultDetailsResponse {
    name: string;
    followers: HLFollower[];
}

const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const PodiumCard = ({ follower, index }: { follower: HLFollower, index: number }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const rank = index + 1;
    const isFirst = rank === 1; 
    const isSecond = rank === 2;
    
    const order = { 
        xs: rank, 
        md: isFirst ? 2 : isSecond ? 1 : 3 
    };

    const pnlValue = parseFloat(follower.allTimePnl);
    const isPositive = pnlValue >= 0;
    const pnlColor = isPositive ? NEON_GREEN : '#FF4D4D';
    
    const avatarSize = isFirst ? 90 : isSecond ? 72 : 64;
    const avatarFontSize = isFirst ? '2rem' : isSecond ? '1.5rem' : '1.25rem';
    
    return (
        <Zoom in timeout={500 + (index * 200)}>
            <Card sx={{ 
                flex: 1, 
                order: order, 
                bgcolor: 'background.paper', 
                backgroundImage: 'none',
                border: `1px solid ${isFirst ? NEON_GREEN : theme.palette.divider}`,
                zIndex: isFirst ? 3 : isSecond ? 2 : 1,
                boxShadow: isFirst ? (isDark ? `0 10px 40px ${alpha(NEON_GREEN, 0.25)}` : `0 15px 45px ${alpha(NEON_GREEN, 0.15)}`) : 'none',
                position: 'relative', 
                borderRadius: 4, 
                width: '100%', 
                minHeight: { xs: 'auto', md: isFirst ? '420px' : isSecond ? '380px' : '350px' },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: isDark ? `0 15px 50px ${alpha(NEON_GREEN, 0.3)}` : `0 20px 50px rgba(0,0,0,0.1)`
                }
            }}>
                <CardContent sx={{ 
                    textAlign: 'center', 
                    py: 4, px: { xs: 2, md: 3 }, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    height: '100%' 
                }}>
                    {isFirst && <Box sx={{ position: 'absolute', top: 16, right: 16 }}><EmojiEventsIcon sx={{ color: NEON_GREEN, fontSize: 36 }} /></Box>}
                    
                    <Avatar sx={{ 
                        width: avatarSize, height: avatarSize, 
                        bgcolor: isFirst ? NEON_GREEN : (isDark ? '#1A1A1A' : '#f0f0f0'), 
                        color: isFirst ? 'black' : 'text.primary',
                        fontWeight: '900', 
                        border: `4px solid ${isFirst ? NEON_GREEN : theme.palette.divider}`, 
                        mx: 'auto', mb: 3, 
                        fontSize: avatarFontSize
                    }}>
                        {rank}
                    </Avatar>

                    <Typography variant="h6" fontWeight="900" sx={{ color: 'text.primary', letterSpacing: -0.5, fontFamily: 'monospace' }} noWrap>
                        {shortenAddress(follower.user)}
                    </Typography>
                    
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5} mt={1} mb={3}>
                        <AttachMoneyIcon sx={{ color: pnlColor, fontSize: 18 }} />
                        <Typography variant="h5" fontWeight="900" color={pnlColor} sx={{ fontFamily: 'monospace' }}>
                            {pnlValue >= 0 ? '+' : ''}{pnlValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                    </Stack>

                    <Stack spacing={1.5} sx={{ bgcolor: isDark ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02), p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, mt: 'auto' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="overline" color="text.disabled" fontWeight="900" sx={{ fontSize: '0.65rem' }}>DURATION</Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <AccessTimeIcon sx={{ fontSize: 14, color: 'text.primary' }} />
                                <Typography variant="caption" fontWeight="900" color="text.primary">{follower.daysFollowing} DAYS</Typography>
                            </Stack>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="overline" color="text.disabled" fontWeight="900" sx={{ fontSize: '0.65rem' }}>VAULT EQUITY</Typography>
                            <Typography variant="caption" fontWeight="900" color="text.secondary">${parseFloat(follower.vaultEquity).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Zoom>
    );
};

const FollowerRow = ({ follower, rank }: { follower: HLFollower, rank: number }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const pnlValue = parseFloat(follower.allTimePnl);
    const isPositive = pnlValue >= 0;
    const pnlColor = isPositive ? NEON_GREEN : '#FF4D4D';

    return (
        <Box sx={{ p: { xs: 2, md: 2.5 }, bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}`, borderRadius: 3, mb: 1.5, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { bgcolor: alpha(theme.palette.divider, 0.1), transform: 'translateX(4px)' } }}>
            <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 3 }}>
                <Typography variant="body2" fontWeight="900" sx={{ width: { xs: 30, md: 50 }, textAlign: 'center', color: 'text.disabled', fontFamily: 'monospace' }}>#{rank}</Typography>

                <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: isDark ? '#1A1A1A' : '#eee', color: 'text.primary', fontWeight: 900, fontSize: '0.85rem' }}>
                        {follower.user.substring(2, 4).toUpperCase()}
                    </Avatar>
                    <Typography variant="body1" fontWeight="800" color="text.primary" sx={{ letterSpacing: 0.5, fontFamily: 'monospace' }} noWrap>
                        {shortenAddress(follower.user)}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', sm: 'flex' }, flex: 2, justifyContent: 'flex-end' }}>
                    <Box textAlign="right">
                        <Typography variant="overline" color="text.disabled" sx={{ display: 'block', fontWeight: 900, lineHeight: 1 }}>EQUITY</Typography>
                        <Typography variant="body2" fontWeight="900" color="text.primary">${parseFloat(follower.vaultEquity).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                    </Box>
                    <Box textAlign="right" sx={{ minWidth: 80 }}>
                        <Typography variant="overline" color="text.disabled" sx={{ display: 'block', fontWeight: 900, lineHeight: 1 }}>DURATION</Typography>
                        <Typography variant="body2" fontWeight="900" color="text.primary">{follower.daysFollowing} D</Typography>
                    </Box>
                </Stack>

                <Box sx={{ width: { xs: 90, md: 120 }, textAlign: 'right' }}>
                    <Chip label={`${isPositive ? '+' : ''}${pnlValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} size="small" sx={{ bgcolor: isDark ? alpha(pnlColor, 0.1) : alpha(pnlColor, 0.15), color: pnlColor, fontWeight: 900, fontSize: '0.8rem', fontFamily: 'monospace', px: 1 }} />
                </Box>
            </Stack>
        </Box>
    );
};

export default function TopUsersPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [followers, setFollowers] = useState<HLFollower[]>([]);
    const [loading, setLoading] = useState(true);
    const [vaultName, setVaultName] = useState<string>("HL Vault");

    useEffect(() => {
        const fetchVaultData = async () => {
            try {
                const response = await fetch("https://api.hyperliquid.xyz/info", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        type: "vaultDetails", 
                        vaultAddress: HLP_VAULT_ADDRESS
                    })
                });

                if (!response.ok) throw new Error("API responded with an error");
                
                const data: VaultDetailsResponse = await response.json();
                
                if (data?.followers) {
                    setVaultName(data.name || "HLP Vault");
                    const sortedFollowers = data.followers.sort((a, b) => parseFloat(b.allTimePnl) - parseFloat(a.allTimePnl));
                    setFollowers(sortedFollowers);
                }
            } catch (error) {
                console.error("Failed to fetch vault data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVaultData();
    }, []);

    const topThree = useMemo(() => followers.slice(0, 3), [followers]);
    const restFollowers = useMemo(() => followers.slice(3, 50), [followers]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
                <CircularProgress sx={{ color: NEON_GREEN, mb: 2 }} />
                <Typography sx={{ fontWeight: 900, color: NEON_GREEN, letterSpacing: 3, fontSize: '0.8rem' }}>SYNCING_HYPERLIQUID_ENGINE...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={isMobile ? 'flex-start' : 'center'} mb={8} spacing={3}>
                    <Box>
                        <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 3 }}>
                            Hyperliquid Vault Analytics
                        </Typography>
                        <Typography variant="h2" fontWeight="900" sx={{ letterSpacing: '-2px', textTransform: 'uppercase', color: 'text.primary' }}>
                            Top <Box component="span" sx={{ color: NEON_GREEN }}>Depositor</Box>
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight="700">
                            Elite operators ranked by All-Time PnL in <Box component="span" color="text.primary">{vaultName}</Box>.
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Chip icon={<AccountBalanceWalletIcon sx={{ fontSize: 16 }} />} label={`${followers.length - 50} TOP ADDRESS`} sx={{ bgcolor: alpha(theme.palette.divider, 0.1), color: 'text.primary', fontWeight: 900, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }} />
                    </Box>
                </Stack>

                {topThree.length > 0 && (
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 4 }} alignItems={{ xs: 'stretch', md: 'flex-end' }} mb={10} sx={{ px: { md: 4 } }}>
                        <PodiumCard follower={topThree[1]} index={1} />
                        <PodiumCard follower={topThree[0]} index={0} />
                        <PodiumCard follower={topThree[2]} index={2} />
                    </Stack>
                )}

                <Box sx={{ mb: 10 }}>
                    <Typography variant="overline" sx={{ color: 'text.disabled', mb: 3, display: 'block', fontWeight: 900, letterSpacing: 2, ml: 1 }}>
                        Top 50 Operators
                    </Typography>
                    <Stack spacing={0.5}>
                        {restFollowers.map((follower, idx) => (
                            <FollowerRow key={follower.user} follower={follower} rank={idx + 4} />
                        ))}
                    </Stack>
                </Box>

            </Container>
        </Box>
    );
}