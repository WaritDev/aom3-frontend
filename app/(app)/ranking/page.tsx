'use client';

import React, { useState } from 'react';
import { 
    Container, Typography, Box, Card, CardContent, Stack, 
    Avatar, Chip, Button, ToggleButton, ToggleButtonGroup,
    useTheme, useMediaQuery, Zoom
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const NEON_GREEN = '#00E08F';
const CARD_BG = '#0A0A0A';
const CARD_BORDER = '#1E1E1E';

type RankItem = {
    rank: number;
    name: string;
    score: number;
    streak: number;
    yield: number;
    avatarColor?: string;
};

const TOP_THREE: RankItem[] = [
    { rank: 1, name: '0x12...89A', score: 2450, streak: 12, yield: 4520.50, avatarColor: NEON_GREEN }, 
    { rank: 2, name: 'CryptoNinja', score: 2100, streak: 10, yield: 3200.12, avatarColor: '#C0C0C0' }, 
    { rank: 3, name: 'DiamondHand', score: 1950, streak: 9, yield: 1850.00, avatarColor: '#CD7F32' }, 
];

const LEADERBOARD_LIST: RankItem[] = [
    { rank: 4, name: '0x88...12B', score: 1800, streak: 8, yield: 1200.00 },
    { rank: 5, name: 'SaverPro', score: 1750, streak: 8, yield: 950.50 },
    { rank: 6, name: 'ToTheMoon', score: 1600, streak: 6, yield: 800.00 },
    { rank: 7, name: '0xAB...CDE', score: 1550, streak: 5, yield: 600.00 },
    { rank: 8, name: 'WagmiFam', score: 1400, streak: 4, yield: 450.00 },
];

const MY_RANK: RankItem = { rank: 145, name: 'Rit (Warit)', score: 850, streak: 4, yield: 1240.22 };
const PodiumCard = ({ user, index }: { user: RankItem, index: number }) => {
    const isFirst = user.rank === 1;
    const order = { xs: index === 1 ? 1 : index === 0 ? 2 : 3, md: index === 1 ? 2 : index === 0 ? 1 : 3 };
    
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
                    borderRadius: 5,
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

                    <Stack spacing={1} sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 1.5, borderRadius: 3 }}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary" fontWeight="700">STREAK</Typography>
                            <Typography variant="caption" fontWeight="900">{user.streak} MO</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary" fontWeight="700">YIELD</Typography>
                            <Typography variant="caption" fontWeight="900" color={NEON_GREEN}>+${user.yield.toLocaleString()}</Typography>
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
            p: { xs: 1.5, md: 2 }, 
            bgcolor: isMe ? 'rgba(0, 224, 143, 0.08)' : CARD_BG, 
            border: `1px solid ${isMe ? NEON_GREEN : CARD_BORDER}`,
            borderRadius: 3,
            mb: 1.5,
            transition: 'all 0.2s',
            '&:hover': { bgcolor: isMe ? 'rgba(0, 224, 143, 0.12)' : '#111', borderColor: isMe ? NEON_GREEN : '#444' }
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
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>YIELD</Typography>
                    <Typography variant="caption" fontWeight="900" color={NEON_GREEN}>+${user.yield.toLocaleString()}</Typography>
                </Box>
            </Stack>

            <Box sx={{ width: { xs: 60, md: 80 }, textAlign: 'right' }}>
                <Chip label={user.score} size="small" sx={{ bgcolor: isMe ? NEON_GREEN : '#1A1A1A', color: isMe ? 'black' : 'white', fontWeight: 900, fontSize: '0.7rem' }} />
            </Box>
        </Stack>
    </Box>
);

export default function RankingPage() {
    const [period, setPeriod] = useState('all-time');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={isMobile ? 'flex-start' : 'center'} mb={6} spacing={3}>
                <Box>
                    <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: '-1.5px', textTransform: 'uppercase', fontSize: { xs: '2rem', md: '3rem' } }}>
                        Quest <Box component="span" sx={{ color: NEON_GREEN }}>Leaderboard</Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                        Top strategists maintaining maximum discipline streaks.
                    </Typography>
                </Box>
                
                <ToggleButtonGroup
                    value={period} exclusive
                    onChange={(_, v) => v && setPeriod(v)}
                    sx={{ bgcolor: '#000', p: 0.5, borderRadius: 3, border: '1px solid #1E1E1E', width: isMobile ? '100%' : 'auto' }}
                >
                    <ToggleButton value="weekly" sx={{ flex: 1, px: 3, border: 'none', borderRadius: '8px !important', fontWeight: 900 }}>WEEKLY</ToggleButton>
                    <ToggleButton value="all-time" sx={{ flex: 1, px: 3, border: 'none', borderRadius: '8px !important', fontWeight: 900 }}>ALL TIME</ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={isMobile ? 2 : 4} alignItems={isMobile ? 'stretch' : 'flex-end'} mb={10} sx={{ px: { md: 8 } }}>
                <PodiumCard user={TOP_THREE[1]} index={0} />
                <PodiumCard user={TOP_THREE[0]} index={1} />
                <PodiumCard user={TOP_THREE[2]} index={2} />
            </Stack>

            <Box sx={{ 
                position: 'sticky', top: { xs: 70, md: 80 }, zIndex: 10, mb: 4, mx: { xs: -1, md: -2 }, px: { xs: 1, md: 2 },
                bgcolor: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(8px)', py: 1, borderRadius: 4
            }}> 
                <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, mb: 1, display: 'block', letterSpacing: 2, ml: 1 }}>
                    YOUR STATUS
                </Typography>
                <RankRow user={MY_RANK} isMe />
            </Box>

            <Box sx={{ mb: 8 }}>
                <Typography variant="overline" color="#444" sx={{ mb: 2, display: 'block', fontWeight: 900, letterSpacing: 1, ml: 1 }}>
                    GLOBAL STRATEGISTS
                </Typography>
                <Stack spacing={0.5}>
                    {LEADERBOARD_LIST.map((user) => (
                        <RankRow key={user.rank} user={user} />
                    ))}
                </Stack>
                <Button fullWidth variant="text" sx={{ mt: 3, color: '#444', fontWeight: 900 }} endIcon={<ArrowDownwardIcon />}>
                    LOAD MORE
                </Button>
            </Box>
        </Container>
    );
}