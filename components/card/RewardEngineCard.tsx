'use client';

import { 
    Card, CardContent, Typography, Box, Stack, 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Chip 
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const NEON_GREEN = '#00E08F';

const podLogic = [
    { duration: '3 Months', multiplier: '1.0x', status: 'Novice', weight: 'Base Share' },
    { duration: '6 Months', multiplier: '1.2x', status: 'Disciplined', weight: '+20% Boost' },
    { duration: '12 Months', multiplier: '1.5x', status: 'Elite', weight: '+50% Boost' },
    { duration: '18 Months', multiplier: '1.8x', status: 'Veteran', weight: '+80% Boost' },
    { duration: '24 Months', multiplier: '2.0x', status: 'Diamond Hands', weight: '2x Massive Share' },
];

export const RewardEngineCard = () => {
    return (
        <Card sx={{ bgcolor: '#0A0A0A', border: `1px solid #1E1E1E`, borderRadius: 4, overflow: 'hidden' }}>
        <CardContent sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
            <Box>
                <Typography variant="h6" fontWeight="900" display="flex" alignItems="center" gap={1.5} sx={{ color: '#FFF' }}>
                <BoltIcon sx={{ color: NEON_GREEN }} /> PROOF OF DISCIPLINE (PoD)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Your share = (Your DP / Total Network DP) × Reward Pool
                </Typography>
            </Box>
            <Chip 
                label="DYNAMIC CALCULATION" 
                size="small" 
                sx={{ bgcolor: 'rgba(0, 224, 143, 0.1)', color: NEON_GREEN, fontWeight: 900, fontSize: '0.65rem' }} 
            />
            </Stack>

            {/* Formula Box */}
            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, mb: 3, border: '1px dashed #333' }}>
                <Typography variant="body2" color="#888" textAlign="center">
                    Discipline Points (DP) Formula:
                </Typography>
                <Typography variant="h6" color="white" textAlign="center" fontWeight="800" sx={{ mt: 0.5 }}>
                    {`DP = Deposit Amount × Streak Multiplier`}
                </Typography>
            </Box>

            {/* Table Section */}
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
            <Table size="small">
                <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                    <TableCell sx={{ color: '#666', fontWeight: 800, borderColor: '#222', fontSize: '0.7rem' }}>STREAK DURATION</TableCell>
                    <TableCell sx={{ color: '#666', fontWeight: 800, borderColor: '#222', fontSize: '0.7rem' }}>MULTIPLIER</TableCell>
                    <TableCell sx={{ color: '#666', fontWeight: 800, borderColor: '#222', fontSize: '0.7rem' }}>RANK</TableCell>
                    <TableCell sx={{ color: '#666', fontWeight: 800, borderColor: '#222', fontSize: '0.7rem' }} align="right">REWARD WEIGHT</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {podLogic.map((row) => (
                    <TableRow key={row.duration} sx={{ '&:hover': { bgcolor: 'rgba(0, 224, 143, 0.03)' }, transition: '0.2s' }}>
                    <TableCell sx={{ color: '#EEE', borderColor: '#111', fontWeight: 700 }}>{row.duration}</TableCell>
                    <TableCell sx={{ color: NEON_GREEN, borderColor: '#111', fontWeight: 900 }}>{row.multiplier}</TableCell>
                    <TableCell sx={{ borderColor: '#111' }}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 700 }}>{row.status}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#FFF', borderColor: '#111', fontWeight: 800 }} align="right">
                        {row.weight}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>

            <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.1)' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <WorkspacePremiumIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 800 }}>
                        DIAMOND HANDS BONUS: Reach 12 months to double your point weight!
                    </Typography>
                </Stack>
            </Box>
        </CardContent>
        </Card>
    );
};