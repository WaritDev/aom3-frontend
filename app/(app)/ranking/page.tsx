'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Container, Typography, Box, Card, CardContent, Stack, 
    Avatar, Chip, Button, ToggleButton, ToggleButtonGroup,
    useTheme, useMediaQuery, Zoom, CircularProgress
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useAOM3, type LeaderboardEntry } from '@/hooks/useAOM3';
import { useAccount } from 'wagmi';

const NEON_GREEN = '#00E08F';
const CARD_BG = '#0A0A0A';
const CARD_BORDER = '#1E1E1E';

interface RankItem {
    rank: number | string;
    name: string;
    score: number;
    streak: number;
    yield: number;
    address?: string;
}

const PodiumCard = ({ user, index }: { user: RankItem, index: number }) => {
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
                    bgcolor: CARD_BG, 
                    border: `1px solid ${isFirst ? NEON_GREEN : CARD_BORDER}`,
                    transform: { md: isFirst ? 'scale(1.08) translateY(-10px)' : 'none' }, 
                    zIndex: isFirst ? 2 : 1,
                    boxShadow: isFirst ? `0 10px 40px ${NEON_GREEN}25` : 'none',
                    position: 'relative',
                    borderRadius: 3,
                    minWidth: { xs: '100%', md: '200px' }
                }}
            >
                <CardContent sx={{ textAlign: 'center', py: { xs: 3, md: 5 } }}>
                    {isFirst && (
                        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                            <EmojiEventsIcon sx={{ color: NEON_GREEN, fontSize: 32 }} />
                        </Box>
                    )}
                    
                    <Avatar 
                        sx={{ 
                            width: isFirst ? 80 : 64, height: isFirst ? 80 : 64, 
                            bgcolor: isFirst ? NEON_GREEN : '#1A1A1A',
                            color: isFirst ? 'black' : 'white',
                            fontWeight: '900', border: `4px solid ${isFirst ? NEON_GREEN : '#222'}`,
                            mx: 'auto', mb: 2
                        }}
                    >
                        {user.rank}
                    </Avatar>

                    <Typography variant="h6" fontWeight="900" noWrap>{user.name}</Typography>
                    
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5} mt={1} mb={2}>
                        <StarIcon sx={{ color: NEON_GREEN, fontSize: 18 }} />
                        <Typography variant="body1" fontWeight="900" color={NEON_GREEN}>
                            {user.score.toLocaleString()} PTS
                        </Typography>
                    </Stack>

                    <Stack spacing={1} sx={{ 
                        bgcolor: 'rgba(255,255,255,0.03)', 
                        p: 1.5, 
                        borderRadius: 2
                    }}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary" fontWeight="700">STREAK</Typography>
                            <Typography variant="caption" fontWeight="900">{user.streak} MO</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary" fontWeight="700">EST. YIELD</Typography>
                            <Typography variant="caption" fontWeight="900" color={NEON_GREEN}>+${user.yield.toFixed(2)}</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Zoom>
    );
};

const RankRow = ({ user, isMe = false }: { user: RankItem, isMe?: boolean }) => (
    <Box 
        sx={{ 
            p: { xs: 2, md: 2.5 }, 
            bgcolor: isMe ? 'rgba(0, 224, 143, 0.08)' : CARD_BG, 
            border: `1px solid ${isMe ? NEON_GREEN : CARD_BORDER}`,
            borderRadius: 2,
            mb: 2, 
            transition: 'all 0.2s',
            '&:hover': { bgcolor: isMe ? 'rgba(0, 224, 143, 0.12)' : '#111' }
        }}
    >
        <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 3 }}>
            <Typography variant="body2" fontWeight="900" sx={{ width: { xs: 30, md: 40 }, textAlign: 'center', color: isMe ? NEON_GREEN : '#444' }}>
                #{user.rank}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: isMe ? NEON_GREEN : '#1A1A1A', color: isMe ? 'black' : 'white', fontWeight: 900, fontSize: '0.8rem' }}>
                    {user.name[0]}
                </Avatar>
                <Typography variant="body2" fontWeight={isMe ? '900' : '700'} color={isMe ? NEON_GREEN : 'white'} noWrap>
                    {user.name} {isMe && '(YOU)'}
                </Typography>
            </Stack>

            <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', sm: 'flex' }, flex: 2, justifyContent: 'flex-end' }}>
                <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>STREAK</Typography>
                    <Typography variant="caption" fontWeight="900">{user.streak} MO</Typography>
                </Box>
                <Box textAlign="right" sx={{ minWidth: 80 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>EST. YIELD</Typography>
                    <Typography variant="caption" fontWeight="900" color={NEON_GREEN}>+${user.yield.toFixed(2)}</Typography>
                </Box>
            </Stack>

            <Box sx={{ width: { xs: 60, md: 80 }, textAlign: 'right' }}>
                <Chip label={`${user.score} PTS`} size="small" sx={{ bgcolor: isMe ? NEON_GREEN : '#1A1A1A', color: isMe ? 'black' : 'white', fontWeight: 900, fontSize: '0.7rem' }} />
            </Box>
        </Stack>
    </Box>
);

export default function RankingPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { address } = useAccount();
    
    const { 
        userRanking, 
        totalParticipants, 
        fetchLeaderboard, 
        totalDP, 
        rewardPoolBalance 
    } = useAOM3();

    const [period, setPeriod] = useState('all-time');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const loadLeaderboardData = useCallback(async () => {
        try {
            const data = await fetchLeaderboard();
            setLeaderboard(data);
        } catch (error) {
            console.error("Failed to load leaderboard:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchLeaderboard]);

    useEffect(() => {
        loadLeaderboardData();
    }, [loadLeaderboardData, totalParticipants]);

    const calculateYield = useCallback((userDP: number) => {
        if (totalDP === 0) return 0;
        return (userDP / totalDP) * Number(rewardPoolBalance);
    }, [totalDP, rewardPoolBalance]);

    const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const formattedLeaderboard = useMemo(() => {
        return leaderboard.map((user, index) => ({
            rank: index + 1,
            name: user.address.toLowerCase() === address?.toLowerCase() ? 'You' : shortenAddress(user.address),
            score: user.currentActiveDP,
            streak: user.totalMonths,
            yield: calculateYield(user.currentActiveDP),
            address: user.address
        }));
    }, [leaderboard, address, calculateYield]);

    const podiumData = useMemo(() => [
        formattedLeaderboard[1] || null,
        formattedLeaderboard[0] || null,
        formattedLeaderboard[2] || null,
    ], [formattedLeaderboard]);

    const myRankItem = useMemo(() => {
        const index = leaderboard.findIndex(u => u.address.toLowerCase() === address?.toLowerCase());
        return {
            rank: index !== -1 ? index + 1 : '-',
            name: 'You',
            score: userRanking.currentActiveDP,
            streak: userRanking.totalMonths,
            yield: calculateYield(userRanking.currentActiveDP),
        };
    }, [leaderboard, address, userRanking, calculateYield]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress sx={{ color: NEON_GREEN, mb: 2 }} />
                <Typography sx={{ fontWeight: 900, color: NEON_GREEN, letterSpacing: 2 }}>SYNCING WITH BASE...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={isMobile ? 'flex-start' : 'center'} mb={6} spacing={3}>
                <Box>
                    <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: '-1.5px', textTransform: 'uppercase', fontSize: { xs: '2rem', md: '3rem' } }}>
                        Quest <Box component="span" sx={{ color: NEON_GREEN }}>Leaderboard</Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                        Competing with {totalParticipants} strategists for protocol rewards.
                    </Typography>
                </Box>
                
                <ToggleButtonGroup
                    value={period}
                    exclusive
                    onChange={(_, v) => v && setPeriod(v)}
                    sx={{ 
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        p: '4px', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        '& .MuiToggleButtonGroup-grouped': {
                            border: 0,
                            '&.Mui-disabled': { border: 0 },
                            '&:not(:first-of-type)': { borderRadius: '8px' },
                            '&:first-of-type': { borderRadius: '8px' },
                        },
                    }}
                >
                    <ToggleButton 
                        value="all-time" 
                        sx={{ 
                            px: 4, 
                            py: 1,
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            letterSpacing: '1px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            
                            '&.Mui-selected': {
                                color: '#000',
                                bgcolor: NEON_GREEN,
                                boxShadow: `0 0 15px ${NEON_GREEN}66`,
                                '&:hover': {
                                    bgcolor: NEON_GREEN,
                                    opacity: 0.9,
                                },
                            },

                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                            }
                        }}
                    >
                        ALL TIME
                    </ToggleButton>
                    
                    <ToggleButton 
                        value="monthly" 
                        sx={{ 
                            px: 4, 
                            py: 1,
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            letterSpacing: '1px',
                            '&.Mui-selected': {
                                color: '#000',
                                bgcolor: NEON_GREEN,
                                boxShadow: `0 0 15px ${NEON_GREEN}66`,
                            },
                        }}
                    >
                        MONTHLY
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={isMobile ? 2 : 4} alignItems={isMobile ? 'stretch' : 'flex-end'} mb={10} sx={{ px: { md: 8 } }}>
                {podiumData.map((user, idx) => (
                    user ? <PodiumCard key={idx} user={user} index={idx} /> : <Box key={idx} sx={{ flex: 1 }} />
                ))}
            </Stack>

            <Box sx={{ 
                position: 'sticky', 
                top: { xs: 70, md: 80 }, 
                zIndex: 10, 
                mb: 6, 
                px: { xs: 2, md: 3 }, 
                bgcolor: 'rgba(10,10,10,0.8)', 
                backdropFilter: 'blur(12px)',
                py: 2, 
                borderRadius: 2,
                border: `1px solid ${CARD_BORDER}`
            }}>
                <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, mb: 1, display: 'block', letterSpacing: 2, ml: 1 }}>
                    YOUR STATUS
                </Typography>
                <RankRow user={myRankItem} isMe />
            </Box>

            <Box sx={{ mb: 8 }}>
                <Typography variant="overline" color="#444" sx={{ mb: 2, display: 'block', fontWeight: 900, letterSpacing: 1, ml: 1 }}>
                    GLOBAL STRATEGISTS
                </Typography>
                <Stack spacing={0.5}>
                    {formattedLeaderboard.slice(3, 13).map((user) => (
                        <RankRow key={user.rank} user={user} isMe={user.address?.toLowerCase() === address?.toLowerCase()} />
                    ))}
                </Stack>
                {formattedLeaderboard.length > 13 && (
                    <Button fullWidth variant="text" sx={{ mt: 3, color: '#444', fontWeight: 900 }} endIcon={<ArrowDownwardIcon />}>
                        LOAD MORE
                    </Button>
                )}
            </Box>
        </Container>
    );
}