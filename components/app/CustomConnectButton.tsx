'use client';

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, Box, Stack } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const CustomConnectButton = ({ fullWidth = false }: { fullWidth?: boolean }) => {
    return (
        <ConnectButton.Custom>
        {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
        }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
            <div
                style={{
                    width: fullWidth ? '100%' : 'auto',
                    opacity: ready ? 1 : 0,
                    pointerEvents: ready ? 'auto' : 'none',
                    userSelect: 'none',
                }}
            >
                {(() => {
                if (!connected) {
                    return (
                    <Button
                        onClick={openConnectModal}
                        fullWidth={fullWidth}
                        variant="contained"
                        startIcon={<AccountBalanceWalletIcon />}
                        sx={{
                        bgcolor: '#4caf50',
                        color: '#fff',
                        fontWeight: '800',
                        py: 1.5,
                        px: 3,
                        textTransform: 'none',
                        fontSize: '1rem',
                        borderRadius: '12px',
                        boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            bgcolor: '#43a047',
                            boxShadow: '0 0 40px rgba(76, 175, 80, 0.6)',
                            transform: 'translateY(-2px)'
                        },
                        }}
                    >
                        Connect Wallet
                    </Button>
                    );
                }

                if (chain.unsupported) {
                    return (
                    <Button
                        onClick={openChainModal}
                        fullWidth={fullWidth}
                        variant="contained"
                        color="error"
                        startIcon={<WarningAmberIcon />}
                        sx={{ 
                            borderRadius: '12px', 
                            fontWeight: 'bold',
                            textTransform: 'none' 
                        }}
                    >
                        Wrong Network
                    </Button>
                    );
                }

                return (
                    <Stack direction="row" spacing={1} width={fullWidth ? '100%' : 'auto'}>
                    {/* ปุ่มเลือก Chain */}
                    <Button
                        onClick={openChainModal}
                        variant="outlined"
                        sx={{
                        borderColor: '#333',
                        color: '#fff',
                        textTransform: 'none',
                        minWidth: 0,
                        px: 2,
                        borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.03)',
                        '&:hover': { borderColor: '#4caf50', bgcolor: 'rgba(76, 175, 80, 0.1)' }
                        }}
                    >
                        {chain.hasIcon && (
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    mr: { xs: 0, sm: 1 }
                                }}
                            >
                                {chain.iconUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        alt={chain.name ?? 'Chain icon'}
                                        src={chain.iconUrl}
                                        style={{ width: 24, height: 24 }}
                                    />
                                )}
                            </Box>
                        )}
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {chain.name}
                        </Box>
                    </Button>

                    <Button
                        onClick={openAccountModal}
                        fullWidth={fullWidth}
                        variant="outlined"
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                            flex: 1,
                            borderColor: '#333',
                            color: '#fff',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            bgcolor: 'rgba(255,255,255,0.03)',
                            '&:hover': { borderColor: '#4caf50', bgcolor: 'rgba(76, 175, 80, 0.1)' }
                        }}
                    >
                        {account.displayName}
                        <Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, ml: 0.5 }}>
                            {account.displayBalance ? ` (${account.displayBalance})` : ''}
                        </Box>
                    </Button>
                    </Stack>
                );
                })()}
            </div>
            );
        }}
        </ConnectButton.Custom>
    );
};