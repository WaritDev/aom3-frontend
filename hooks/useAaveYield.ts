import { useState, useEffect } from 'react';
import { createPublicClient, http, parseAbi, formatUnits } from 'viem';
import { arbitrum } from 'viem/chains';

const AAVE_POOL_ADDRESS = '0x794a61358D6845594F94dc1DB02A252b5b4814aD';
const USDC_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

const AAVE_ABI = parseAbi([
    'function getReserveData(address asset) view returns (uint256 configuration, uint128 liquidityIndex, uint128 currentLiquidityRate, uint128 variableBorrowIndex, uint128 currentVariableBorrowRate, uint128 currentStableBorrowRate, uint40 lastUpdateTimestamp, uint16 id, address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress, address interestRateStrategyAddress, uint128 accruedToTreasury, uint128 unbacked, uint128 isolationModeTotalDebt)'
]);

const SECONDS_PER_YEAR = 31536000;

export const useAaveYield = () => {
    const [baseApy, setBaseApy] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchYield = async () => {
        try {
            const client = createPublicClient({
            chain: arbitrum,
            transport: http(),
            });

            const data = await client.readContract({
            address: AAVE_POOL_ADDRESS,
            abi: AAVE_ABI,
            functionName: 'getReserveData',
            args: [USDC_ADDRESS],
            });

            const liquidityRate = data[2];
            const apr = Number(formatUnits(liquidityRate, 27));
            const apy = (Math.pow(1 + (apr / SECONDS_PER_YEAR), SECONDS_PER_YEAR) - 1);
            setBaseApy(apy * 100);

        } catch (error) {
            console.error('Failed to fetch Aave yield:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchYield();
    }, []);

    return { baseApy, loading };
};