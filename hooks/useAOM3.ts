import { useReadContract, useWriteContract, useAccount, usePublicClient } from 'wagmi';
import { parseUnits } from 'viem';
import { AOM3_VAULT_ADDRESS, AOM3_VAULT_ABI, USDC_ADDRESS, USDC_ABI } from '../constants/contracts';

export function useAOM3() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    const { data: isWindowOpen, refetch: refetchWindow } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'isInsideWindow',
    });

    const { data: nextQuestId } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'nextQuestId',
    });

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'allowance',
        args: address ? [address, AOM3_VAULT_ADDRESS] : undefined,
    });

    const ensureAllowance = async (amountBigInt: bigint) => {
        if (!address || !publicClient) return;

        if (!allowance || (allowance as bigint) < amountBigInt) {
            console.log("Requesting USDC Approval...");
            const approveHash = await writeContractAsync({
                address: USDC_ADDRESS,
                abi: USDC_ABI,
                functionName: 'approve',
                args: [AOM3_VAULT_ADDRESS, amountBigInt],
            });
            await publicClient.waitForTransactionReceipt({ hash: approveHash });
            await refetchAllowance();
        }
    };

    const depositWithApprove = async (questId: bigint, amount: string) => {
        if (!address) throw new Error("Wallet not connected");
        const amountBigInt = parseUnits(amount, 6);

        await ensureAllowance(amountBigInt);

        console.log("Executing Monthly Deposit...");
        return await writeContractAsync({
            address: AOM3_VAULT_ADDRESS,
            abi: AOM3_VAULT_ABI,
            functionName: 'deposit',
            args: [questId],
        });
    };

        const createQuestAction = async (monthlyAmount: string, durationMonths: number) => {
        if (!address) throw new Error("Wallet not connected");
        
        const amountBigInt = parseUnits(monthlyAmount, 6);

        console.log("Monthly Amount (Raw):", monthlyAmount);
        console.log("Amount in BigInt (Units):", amountBigInt.toString());
        console.log("Duration Months:", durationMonths);

        await ensureAllowance(amountBigInt);

        return await writeContractAsync({
            address: AOM3_VAULT_ADDRESS,
            abi: AOM3_VAULT_ABI,
            functionName: 'createQuest',
            args: [
                amountBigInt, 
                BigInt(durationMonths)
            ],
        });
    };

    return { 
        isWindowOpen: isWindowOpen as boolean, 
        depositWithApprove, 
        nextQuestId: nextQuestId as bigint | undefined, 
        createQuestAction,
        refetchWindow 
    };
}