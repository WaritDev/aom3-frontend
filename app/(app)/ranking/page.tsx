'use client';

import React, { useState } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Card, 
    CardContent, 
    Stack, 
    Avatar, 
    Chip, 
    Button,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import StarIcon from '@mui/icons-material/Star';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

type RankItem = {
    rank: number;
    name: string;
    score: number;
    streak: number;
    yield: number;
    avatarColor?: string;
};

const TOP_THREE: RankItem[] = [
    { rank: 1, name: '0x12...89A', score: 2450, streak: 12, yield: 4520.50, avatarColor: '#FFD700' }, 
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

const MY_RANK: RankItem = { rank: 145, name: 'You', score: 850, streak: 4, yield: 1240.22 };

const PodiumCard = ({ user }: { user: RankItem }) => {
    const isFirst = user.rank === 1;
    
    return (
        <Card 
        sx={{ 
            flex: 1,
            bgcolor: '#121212', 
            border: `1px solid ${isFirst ? '#FFD700' : '#333'}`,
            transform: isFirst ? 'scale(1.05)' : 'none', 
            zIndex: isFirst ? 2 : 1,
            boxShadow: isFirst ? '0 0 20px rgba(255, 215, 0, 0.2)' : 'none',
            position: 'relative'
        }}
        >
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
            {isFirst && (
                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 32 }} />
                </Box>
            )}
            
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar 
                    sx={{ 
                        width: isFirst ? 80 : 64, 
                        height: isFirst ? 80 : 64, 
                        bgcolor: user.avatarColor || '#333',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: isFirst ? '2rem' : '1.5rem',
                        border: `4px solid ${isFirst ? '#FFD700' : '#333'}`
                    }}
                >
                    {user.rank}
                </Avatar>
            </Box>

            <Typography variant="h6" fontWeight="bold" noWrap>{user.name}</Typography>
            
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5} mt={1} mb={2}>
                <StarIcon sx={{ color: '#4caf50', fontSize: 18 }} />
                <Typography variant="body1" fontWeight="bold" color="#4caf50">
                    {user.score.toLocaleString()} Pts
                </Typography>
            </Stack>

            <Stack spacing={1} sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 1, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">Streak</Typography>
                    <Typography variant="caption" fontWeight="bold">{user.streak} Months</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">Total Yield</Typography>
                    <Typography variant="caption" fontWeight="bold" color="#4caf50">+${user.yield.toLocaleString()}</Typography>
                </Stack>
            </Stack>

        </CardContent>
        </Card>
    );
};

const RankRow = ({ user, isMe = false }: { user: RankItem, isMe?: boolean }) => (
    <Box 
        sx={{ 
            p: 2, 
            bgcolor: isMe ? 'rgba(76, 175, 80, 0.1)' : '#121212', 
            border: `1px solid ${isMe ? '#4caf50' : '#222'}`,
            borderRadius: 2,
            mb: 1.5,
            transition: 'transform 0.2s',
            '&:hover': { bgcolor: isMe ? 'rgba(76, 175, 80, 0.15)' : '#1e1e1e' }
        }}
    >
        <Stack direction="row" alignItems="center" spacing={3}>
            <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={{ width: 40, textAlign: 'center', color: 'text.secondary' }}
            >
                #{user.rank}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: isMe ? '#4caf50' : '#333', fontSize: '0.8rem' }}>
                    {user.name[0]}
                </Avatar>
                <Typography fontWeight={isMe ? 'bold' : 'normal'} color={isMe ? '#4caf50' : 'white'}>
                    {user.name} {isMe && '(You)'}
                </Typography>
            </Stack>

            <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', sm: 'flex' }, flex: 3, justifyContent: 'flex-end' }}>
                <Box sx={{ width: 100, textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" display="block">Streak</Typography>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={0.5}>
                        <WhatshotIcon sx={{ fontSize: 14, color: '#ff9800' }} />
                        <Typography fontWeight="bold">{user.streak} Mo</Typography>
                    </Stack>
                </Box>
                <Box sx={{ width: 120, textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" display="block">Total Earned</Typography>
                    <Typography fontWeight="bold" color="#4caf50">+${user.yield.toLocaleString()}</Typography>
                </Box>
            </Stack>

            <Box sx={{ width: 80, textAlign: 'right' }}>
                    <Chip 
                        label={`${user.score}`} 
                        size="small" 
                        sx={{ 
                            bgcolor: isMe ? '#4caf50' : '#333', 
                            color: isMe ? '#000' : '#fff', 
                            fontWeight: 'bold' 
                        }} 
                    />
            </Box>

        </Stack>
    </Box>
);

export default function RankingPage() {
    const [period, setPeriod] = useState('all-time');

    return (
        <Container maxWidth="lg">
        
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" mb={6} spacing={2}>
            <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                Discipline Leaderboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                Top savers who maximize their multipliers. Consistency is the key to winning.
                </Typography>
            </Box>
            
            <ToggleButtonGroup
                value={period}
                exclusive
                onChange={(e, v) => { if(v) setPeriod(v); }}
                sx={{ bgcolor: '#121212' }}
            >
                <ToggleButton value="weekly" sx={{ px: 3, textTransform: 'none', borderRadius: '8px 0 0 8px !important' }}>
                    Weekly
                </ToggleButton>
                <ToggleButton value="all-time" sx={{ px: 3, textTransform: 'none', borderRadius: '0 8px 8px 0 !important' }}>
                    All Time
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>

        <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={2} 
            alignItems="flex-end" 
            mb={6}
            sx={{ px: { md: 8 } }} 
        >
            <PodiumCard user={TOP_THREE[1]} />
            <PodiumCard user={TOP_THREE[0]} />
            <PodiumCard user={TOP_THREE[2]} />
        </Stack>

        <Box sx={{ position: 'sticky', top: 80, zIndex: 10, mb: 2, mx: -2, px: 2 }}> 
            <RankRow user={MY_RANK} isMe />
        </Box>

        <Box sx={{ mb: 8 }}>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Rest of the pack
            </Typography>
            {LEADERBOARD_LIST.map((user) => (
                <RankRow key={user.rank} user={user} />
            ))}
            
            <Button 
                fullWidth 
                sx={{ mt: 2, color: 'text.secondary' }}
                endIcon={<ArrowUpwardIcon sx={{ transform: 'rotate(180deg)' }} />}
            >
                Load more savers
            </Button>
        </Box>

        </Container>
    );
}