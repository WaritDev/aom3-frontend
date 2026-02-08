import { http, createConfig } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http('https://arb-sepolia.g.alchemy.com/v2/37WStqCX4HX8xS-9k3bdB'),
  },
})