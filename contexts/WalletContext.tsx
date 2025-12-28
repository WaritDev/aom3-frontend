'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance] = useState('1,250.00'); // Mock balance

  const connectWallet = () => {
    // Simulate wallet connection - in real app, this would connect to MetaMask/WalletConnect
    const mockAddress = '0x742d...8f9c';
    setIsConnected(true);
    setAddress(mockAddress);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
  };

  const value = {
    isConnected,
    address,
    balance,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
