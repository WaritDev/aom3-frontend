import { useReadContract } from 'wagmi';
import { AOM3_VAULT_ADDRESS, AOM3_VAULT_ABI } from '../constants/contracts';

export function useQuestData(questId: bigint) {
    return useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'quests',
        args: [questId],
    });
}