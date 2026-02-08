import { http, createConfig } from 'wagmi'
import { arbitrum, arbitrumSepolia } from 'wagmi/chains'

const isMainnet = process.env.NEXT_PUBLIC_IS_MAINNET === 'true';
const rpcUrl = process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL;
const activeChain = isMainnet ? arbitrum : arbitrumSepolia;

export const config = createConfig({
  chains: [activeChain],
  transports: {
    [arbitrum.id]: http(rpcUrl),
    [arbitrumSepolia.id]: http(rpcUrl),
  },
})