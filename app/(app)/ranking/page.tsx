'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Container, Typography, Box, Card, CardContent, Stack, 
    Avatar, Chip, Button, ToggleButton, ToggleButtonGroup,
    useTheme, useMediaQuery, Zoom, CircularProgress, alpha
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { createClient } from '@supabase/supabase-js';
import { useAOM3 } from '@/hooks/useAOM3';
import { useAccount } from 'wagmi';

const NEON_GREEN = '#00E08F';

export interface UserDB {
    wallet_address: string;
    lifetime_dp: number;
    current_active_dp: number;
    total_quests: number;
    total_months: number;
}

interface RankItem {
    rank: number | string;
    name: string;
    score: number;
    streak: number;
    yield: number;
    address?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PodiumCard = ({ user, index }: { user: RankItem, index: number }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const isFirst = user.rank === 1; 
    
    const order = { 
        xs: index === 1 ? 1 : index === 0 ? 2 : 3, 
        md: index === 1 ? 2 : index === 0 ? 1 : 3 
    };
    
    return (
        <Zoom in timeout={500 + (index * 200)}>
            <Card 
                sx={{ 
                    flex: 1,
                    order: order,
                    bgcolor: 'background.paper', 
                    backgroundImage: 'none',
                    border: `1px solid ${isFirst ? NEON_GREEN : theme.palette.divider}`,
                    transform: { md: isFirst ? 'scale(1.08) translateY(-10px)' : 'none' }, 
                    zIndex: isFirst ? 2 : 1,
                    boxShadow: isFirst 
                        ? (isDark ? `0 10px 40px ${alpha(NEON_GREEN, 0.2)}` : `0 15px 45px ${alpha(NEON_GREEN, 0.15)}`) 
                        : 'none',
                    position: 'relative',
                    borderRadius: 4,
                    minWidth: { xs: '100%', md: '220px' },
                    transition: 'all 0.3s ease'
                }}
            >
                <CardContent sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
                    {isFirst && (
                        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                            <EmojiEventsIcon sx={{ color: NEON_GREEN, fontSize: 36 }} />
                        </Box>
                    )}
                    
                    <Avatar 
                        sx={{ 
                            width: isFirst ? 90 : 72, height: isFirst ? 90 : 72, 
                            bgcolor: isFirst ? NEON_GREEN : (isDark ? '#1A1A1A' : '#f0f0f0'),
                            color: isFirst ? 'black' : 'text.primary',
                            fontWeight: '900', 
                            border: `4px solid ${isFirst ? NEON_GREEN : theme.palette.divider}`,
                            mx: 'auto', mb: 2.5,
                            fontSize: isFirst ? '2rem' : '1.5rem'
                        }}
                    >
                        {user.rank}
                    </Avatar>

                    <Typography variant="h6" fontWeight="900" sx={{ color: 'text.primary', letterSpacing: -0.5 }} noWrap>
                        {user.name}
                    </Typography>
                    
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5} mt={1} mb={3}>
                        <StarIcon sx={{ color: NEON_GREEN, fontSize: 18 }} />
                        <Typography variant="h6" fontWeight="900" color={NEON_GREEN} sx={{ fontFamily: 'monospace' }}>
                            {user.score.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" fontWeight="900" color={NEON_GREEN}>PTS</Typography>
                    </Stack>

                    <Stack spacing={1.5} sx={{ 
                        bgcolor: isDark ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02), 
                        p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}`
                    }}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="overline" color="text.disabled" fontWeight="900" sx={{ fontSize: '0.6rem' }}>TOTAL MONTH</Typography>
                            <Typography variant="caption" fontWeight="900" color="text.primary">{user.streak} MO</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="overline" color="text.disabled" fontWeight="900" sx={{ fontSize: '0.6rem' }}>EST. YIELD</Typography>
                            <Typography variant="caption" fontWeight="900" color={NEON_GREEN}>+${user.yield.toFixed(2)}</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Zoom>
    );
};

const RankRow = ({ user, isMe = false }: { user: RankItem, isMe?: boolean }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box 
            sx={{ 
                p: { xs: 2, md: 2.5 }, 
                bgcolor: isMe ? alpha(NEON_GREEN, 0.08) : 'background.paper', 
                border: `1px solid ${isMe ? NEON_GREEN : theme.palette.divider}`,
                borderRadius: 3,
                mb: 1.5, 
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                    bgcolor: isMe ? alpha(NEON_GREEN, 0.12) : alpha(theme.palette.divider, 0.1),
                    transform: 'translateX(4px)'
                }
            }}
        >
            <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 3 }}>
                <Typography variant="body2" fontWeight="900" sx={{ width: { xs: 30, md: 50 }, textAlign: 'center', color: isMe ? NEON_GREEN : 'text.disabled', fontFamily: 'monospace' }}>
                    #{user.rank}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
                    <Avatar sx={{ 
                        width: 36, height: 36, 
                        bgcolor: isMe ? NEON_GREEN : (isDark ? '#1A1A1A' : '#eee'), 
                        color: isMe ? 'black' : 'text.primary', 
                        fontWeight: 900, fontSize: '0.85rem' 
                    }}>
                        {user.name[0]}
                    </Avatar>
                    <Typography variant="body1" fontWeight={isMe ? '900' : '800'} color={isMe ? NEON_GREEN : 'text.primary'} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }} noWrap>
                        {user.name} {isMe && '(YOU)'}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', sm: 'flex' }, flex: 2, justifyContent: 'flex-end' }}>
                    <Box textAlign="right">
                        <Typography variant="overline" color="text.disabled" sx={{ display: 'block', fontWeight: 900, lineHeight: 1 }}>STREAK</Typography>
                        <Typography variant="body2" fontWeight="900" color="text.primary">{user.streak} MO</Typography>
                    </Box>
                    <Box textAlign="right" sx={{ minWidth: 100 }}>
                        <Typography variant="overline" color="text.disabled" sx={{ display: 'block', fontWeight: 900, lineHeight: 1 }}>EST. YIELD</Typography>
                        <Typography variant="body2" fontWeight="900" color={NEON_GREEN}>+${user.yield.toFixed(2)}</Typography>
                    </Box>
                </Stack>

                <Box sx={{ width: { xs: 70, md: 100 }, textAlign: 'right' }}>
                    <Chip 
                        label={`${user.score} PTS`} 
                        size="small" 
                        sx={{ 
                            bgcolor: isMe ? NEON_GREEN : (isDark ? '#1A1A1A' : alpha(theme.palette.common.black, 0.05)), 
                            color: isMe ? 'black' : 'text.primary', 
                            fontWeight: 900, 
                            fontSize: '0.7rem',
                            fontFamily: 'monospace'
                        }} 
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default function RankingPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { address } = useAccount();
    const { totalDP, rewardPoolBalance } = useAOM3();
    const [period, setPeriod] = useState('all-time');
    const [leaderboardDB, setLeaderboardDB] = useState<UserDB[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalParticipants, setTotalParticipants] = useState(0);

    const loadLeaderboardData = useCallback(async () => {
        try {
            setLoading(true);
            
            const { data, count, error } = await supabase
                .from('users')
                .select('*', { count: 'exact' })
                .order('current_active_dp', { ascending: false });
                
            if (error) throw error;
            
            if (data) setLeaderboardDB(data as UserDB[]);
            if (count !== null) setTotalParticipants(count);
            
        } catch (error) {
            console.error("Failed to load leaderboard from Supabase:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLeaderboardData();
    }, [loadLeaderboardData, period]);

    const calculateYield = useCallback((userDP: number) => {
        if (totalDP === 0) return 0;
        return (userDP / totalDP) * Number(rewardPoolBalance);
    }, [totalDP, rewardPoolBalance]);

    const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const formattedLeaderboard = useMemo(() => {
        return leaderboardDB.map((user, index) => ({
            rank: index + 1,
            name: user.wallet_address.toLowerCase() === address?.toLowerCase() ? 'You' : shortenAddress(user.wallet_address),
            score: Number(user.current_active_dp),
            streak: Number(user.total_months),
            yield: calculateYield(Number(user.current_active_dp)),
            address: user.wallet_address
        }));
    }, [leaderboardDB, address, calculateYield]);

    const podiumData = useMemo(() => [
        formattedLeaderboard[1] || null,
        formattedLeaderboard[0] || null,
        formattedLeaderboard[2] || null,
    ], [formattedLeaderboard]);

    const myRankItem = useMemo(() => {
        const index = leaderboardDB.findIndex(u => u.wallet_address.toLowerCase() === address?.toLowerCase());
        const me = index !== -1 ? leaderboardDB[index] : null;
        
        return {
            rank: index !== -1 ? index + 1 : '-',
            name: 'You',
            score: me ? Number(me.current_active_dp) : 0,
            streak: me ? Number(me.total_months) : 0,
            yield: calculateYield(me ? Number(me.current_active_dp) : 0),
        };
    }, [leaderboardDB, address, calculateYield]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', bgcolor: 'background.default' }}>
                <CircularProgress sx={{ color: NEON_GREEN, mb: 2 }} />
                <Typography sx={{ fontWeight: 900, color: NEON_GREEN, letterSpacing: 3, fontSize: '0.8rem' }}>SYNCING_PROTOCOL_DATA...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={isMobile ? 'flex-start' : 'center'} mb={8} spacing={3}>
                    <Box>
                        <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 3 }}>Global Statistics</Typography>
                        <Typography variant="h2" fontWeight="900" sx={{ letterSpacing: '-2px', textTransform: 'uppercase', color: 'text.primary' }}>
                            Quest <Box component="span" sx={{ color: NEON_GREEN }}>Leaderboard</Box>
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight="700">
                            Competing with <Box component="span" color="text.primary">{totalParticipants}</Box> strategists for rewards.
                        </Typography>
                    </Box>
                    
                    <ToggleButtonGroup
                        value={period}
                        exclusive
                        onChange={(_, v) => v && setPeriod(v)}
                        sx={{ 
                            bgcolor: isDark ? alpha(theme.palette.common.black, 0.4) : alpha(theme.palette.common.black, 0.05),
                            p: '5px', 
                            borderRadius: '16px',
                            border: `1px solid ${theme.palette.divider}`,
                            backdropFilter: 'blur(10px)',
                            '& .MuiToggleButtonGroup-grouped': {
                                border: 0,
                                mx: 0.5,
                                borderRadius: '12px !important',
                            },
                        }}
                    >
                        <ToggleButton 
                            value="all-time" 
                            sx={{ 
                                px: 4, py: 1.2,
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                                fontWeight: 900,
                                letterSpacing: '1px',
                                '&.Mui-selected': {
                                    color: '#000',
                                    bgcolor: NEON_GREEN,
                                    boxShadow: `0 4px 15px ${alpha(NEON_GREEN, 0.4)}`,
                                    '&:hover': { bgcolor: NEON_GREEN }
                                }
                            }}
                        >
                            ALL TIME
                        </ToggleButton>
                        <ToggleButton 
                            value="monthly" 
                            sx={{ 
                                px: 4, py: 1.2,
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                                fontWeight: 900,
                                letterSpacing: '1px',
                                '&.Mui-selected': {
                                    color: '#000',
                                    bgcolor: NEON_GREEN,
                                    boxShadow: `0 4px 15px ${alpha(NEON_GREEN, 0.4)}`,
                                    '&:hover': { bgcolor: NEON_GREEN }
                                }
                            }}
                        >
                            MONTHLY
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={isMobile ? 3 : 4} alignItems={isMobile ? 'stretch' : 'flex-end'} mb={12} sx={{ px: { md: 4 } }}>
                    {podiumData.map((user, idx) => (
                        user ? <PodiumCard key={idx} user={user} index={idx} /> : <Box key={idx} sx={{ flex: 1 }} />
                    ))}
                </Stack>

                <Box sx={{ 
                    position: 'sticky', 
                    top: { xs: 80, md: 90 }, 
                    zIndex: 10, 
                    mb: 8, 
                    px: { xs: 2, md: 3 }, 
                    bgcolor: alpha(theme.palette.background.default, 0.9), 
                    backdropFilter: 'blur(12px)',
                    py: 3, 
                    borderRadius: 4,
                    border: `2px dashed ${NEON_GREEN}44`,
                    boxShadow: isDark ? `0 20px 40px rgba(0,0,0,0.4)` : `0 10px 30px rgba(0,0,0,0.05)`
                }}>
                    <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, mb: 1.5, display: 'block', letterSpacing: 2, ml: 1 }}>
                        Your Performance Index
                    </Typography>
                    <RankRow user={myRankItem} isMe />
                </Box>

                <Box sx={{ mb: 10 }}>
                    <Typography variant="overline" sx={{ color: 'text.disabled', mb: 3, display: 'block', fontWeight: 900, letterSpacing: 2, ml: 1 }}>
                        Global Strategist List
                    </Typography>
                    <Stack spacing={0.5}>
                        {formattedLeaderboard.slice(3, 13).map((user) => (
                            <RankRow key={user.rank} user={user} isMe={user.address?.toLowerCase() === address?.toLowerCase()} />
                        ))}
                    </Stack>
                    {formattedLeaderboard.length > 13 && (
                        <Button 
                            fullWidth 
                            variant="text" 
                            sx={{ mt: 4, color: 'text.disabled', fontWeight: 900, letterSpacing: 1, py: 2, '&:hover': { color: NEON_GREEN } }} 
                            endIcon={<ArrowDownwardIcon />}
                        >
                            LOAD MORE ARCHIVES
                        </Button>
                    )}
                </Box>

                <Box textAlign="center" sx={{ opacity: 0.2, py: 4 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>© 2026 AOM3 PROTOCOL - LEADERBOARD_SYNC_V2.0</Typography>
                </Box>
            </Container>
        </Box>
    );
}