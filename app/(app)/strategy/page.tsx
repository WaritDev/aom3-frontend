'use client';

import { 
    Container, Typography, Box, Card, CardContent, Stack, 
    Divider, useTheme, alpha 
} from '@mui/material';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import FunctionsIcon from '@mui/icons-material/Functions';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FFA500';
const THEME_DANGER = '#FF5252';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FlowNode = ({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
    <Card sx={{ 
        flex: 1, bgcolor: alpha(color, 0.05), border: `1px solid ${alpha(color, 0.3)}`, 
        borderRadius: 4, textAlign: 'center', transition: '0.3s',
        '&:hover': { borderColor: color, transform: 'translateY(-5px)', boxShadow: `0 8px 20px ${alpha(color, 0.15)}` }
    }}>
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: alpha(color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <Icon sx={{ fontSize: 32, color: color }} />
            </Box>
            <Typography variant="h6" fontWeight={900} mb={1} color="text.primary">{title}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{desc}</Typography>
        </CardContent>
    </Card>
);

export default function StrategyPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
            <Box mb={8} textAlign="center">
                <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 2 }}>
                    THE ENGINE BEHIND THE YIELD
                </Typography>
                <Typography variant="h3" fontWeight="900" textTransform="uppercase" mt={1}>
                    How <Box component="span" color={NEON_GREEN}>HLP</Box> Works
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={2} maxWidth="md" mx="auto" fontSize="1.1rem">
                    HLP (Hyperliquidity Provider) democratizes <b>Market Making</b>—a highly profitable strategy traditionally reserved for large financial institutions. It allows anyone to provide liquidity and earn a share of the exchange&apos;s trading fees and spreads.
                </Typography>
            </Box>

            <Box mb={10}>
                <Typography variant="h5" fontWeight={900} mb={4} display="flex" alignItems="center" gap={1}>
                    <PrecisionManufacturingIcon sx={{ color: NEON_GREEN }} /> Visual Flow: The Yield Generation
                </Typography>
                
                <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={{ xs: 2, md: 2 }} 
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <FlowNode 
                        icon={AccountBalanceWalletIcon} color={NEON_GREEN} title="1. Pool Liquidity" 
                        desc="Users deposit USDC into the HLP Vault. These funds are aggregated into a massive, community-owned liquidity pool." 
                    />
                    
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}><ArrowDownwardIcon sx={{ color: 'text.disabled' }} /></Box>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}><ArrowForwardIosIcon sx={{ color: 'text.disabled' }} /></Box>

                    <FlowNode 
                        icon={StorefrontIcon} color={NEON_ORANGE} title="2. Market Making" 
                        desc="Algorithmic bots run 24/7, continuously placing buy (Bid) and sell (Ask) orders around the fair price on the Hyperliquid exchange." 
                    />

                    <Box sx={{ display: { xs: 'block', md: 'none' } }}><ArrowDownwardIcon sx={{ color: 'text.disabled' }} /></Box>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}><ArrowForwardIosIcon sx={{ color: 'text.disabled' }} /></Box>

                    <FlowNode 
                        icon={CurrencyExchangeIcon} color="#00BFFF" title="3. Earn & Compound" 
                        desc="Profits generated from spreads and fees are proportionally distributed and automatically compounded for the depositors." 
                    />
                </Stack>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 10 }}>
                <Box>
                    <Card sx={{ height: '100%', borderRadius: 4, border: `1px solid ${alpha(NEON_GREEN, 0.3)}`, bgcolor: alpha(NEON_GREEN, 0.02) }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" fontWeight={900} mb={3} display="flex" alignItems="center" gap={1} color={NEON_GREEN}>
                                <LocalAtmIcon /> Revenue Sources
                            </Typography>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800}>1. Bid-Ask Spread</Typography>
                                    <Typography variant="body2" color="text.secondary">The bot quotes slightly lower prices to buy and higher prices to sell. When traders execute against these orders, HLP captures the difference (the spread) as profit.</Typography>
                                </Box>
                                <Divider sx={{ borderColor: alpha(NEON_GREEN, 0.1) }} />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800}>2. Liquidation Fees</Typography>
                                    <Typography variant="body2" color="text.secondary">When over-leveraged traders are liquidated, HLP often steps in to take over those positions, earning a percentage of the liquidation fees.</Typography>
                                </Box>
                                <Divider sx={{ borderColor: alpha(NEON_GREEN, 0.1) }} />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800}>3. Zero Management Fees</Typography>
                                    <Typography variant="body2" color="text.secondary">Unlike traditional hedge funds, HLP charges exactly <b>0% management fee</b>. 100% of the generated profits go directly back to the liquidity providers proportionally.</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>

                <Box>
                    <Card sx={{ height: '100%', borderRadius: 4, border: `1px solid ${alpha(THEME_DANGER, 0.3)}`, bgcolor: alpha(THEME_DANGER, 0.02) }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" fontWeight={900} mb={3} display="flex" alignItems="center" gap={1} color={THEME_DANGER}>
                                <WarningAmberIcon /> Risks & Disclosures
                            </Typography>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800}>1. Directional / Inventory Risk</Typography>
                                    <Typography variant="body2" color="text.secondary">During extreme market volatility (flash crashes), the bot may temporarily hold losing positions. This can cause the vault&apos;s total equity to fluctuate and temporarily decrease.</Typography>
                                </Box>
                                <Divider sx={{ borderColor: alpha(THEME_DANGER, 0.1) }} />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800}>2. Withdrawal Lock-up Period</Typography>
                                    <Typography variant="body2" color="text.secondary">To protect the exchange from sudden liquidity drains, Hyperliquid enforces a mandatory <b>4-day lock-up period</b> when you request to withdraw your funds.</Typography>
                                </Box>
                                <Divider sx={{ borderColor: alpha(THEME_DANGER, 0.1) }} />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800}>3. Smart Contract Risk</Typography>
                                    <Typography variant="body2" color="text.secondary">While the protocol is highly transparent and audited, all Decentralized Finance (DeFi) platforms inherently carry technical risks associated with blockchain bugs.</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            <Card sx={{ borderRadius: 4, bgcolor: isDark ? '#111' : '#f8f8f8', border: `1px solid ${theme.palette.divider}` }}>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                    <Typography variant="h5" fontWeight={900} mb={3} display="flex" alignItems="center" gap={1}>
                        <FunctionsIcon sx={{ color: NEON_ORANGE }} /> The Mathematics & Game Theory
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" mb={4}>
                        HLP&apos;s profit sharing is strictly <b>pro-rata</b> based on your deposit size relative to the entire vault. However, when you integrate this with the <b>AOM3 Protocol</b>, you unlock a powerful yield multiplier:
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, border: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={800} display="block" mb={2}>
                                Standard Vault Share
                            </Typography>
                            <Typography sx={{ fontFamily: 'monospace', fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 700, color: 'text.primary' }}>
                                Share = User Deposit / Total Vault Equity
                            </Typography>
                        </Box>

                        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, border: `1px solid ${alpha(NEON_GREEN, 0.3)}`, textAlign: 'center' }}>
                            <Typography variant="caption" color={NEON_GREEN} fontWeight={800} display="block" mb={2}>
                                AOM3 Boosted Return
                            </Typography>
                            <Typography sx={{ fontFamily: 'monospace', fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 700, color: NEON_GREEN }}>
                                Effective APY = Base HLP APY + Reward Shared (AOM3 Distribution)
                            </Typography>
                        </Box>
                    </Box>

                    <Box mt={4} p={3} borderRadius={3} bgcolor={alpha(NEON_ORANGE, 0.1)} border={`1px dashed ${alpha(NEON_ORANGE, 0.3)}`}>
                        <Typography variant="body2" color="text.primary" fontWeight={600} display="flex" alignItems="flex-start" gap={1}>
                            <TimelineIcon sx={{ color: NEON_ORANGE, mt: -0.2 }} />
                            <span>
                                <b>Why AOM3?</b> In standard DeFi, you only earn the base APY. AOM3 introduces <i>Game Theory</i> by charging a 10% penalty to users who break their savings discipline (early exits). These penalties are redistributed as the &quot;Multiplier&quot; to users who maintain their streak, allowing your <i>Effective APY</i> to sustainably outperform standard market rates.
                            </span>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

        </Container>
    );
}