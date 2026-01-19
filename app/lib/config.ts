// lib/config.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'AOM3 DeFi',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    arbitrum,       // Mainnet
    arbitrumSepolia // Testnet (แนะนำให้ใช้ตัวนี้ตอนพัฒนา)
  ],
  ssr: true,
});