import { createClient } from '@supabase/supabase-js';
import { createPublicClient, http, parseAbi } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env file");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("❌ Missing NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY in .env file");
}

import { AOM3_RANKING_ADDRESS, AOM3_VAULT_ADDRESS } from '@/constants/contracts';

type UserStatsTuple = readonly [bigint, bigint, bigint, bigint];
type QuestDataTuple = readonly [
    `0x${string}`, bigint, bigint, bigint, bigint, bigint, bigint, bigint, boolean
];

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc')
});

async function syncData(questId: bigint, eventName: string, txHash: string, actionAmount?: bigint) {
    try {
        const vaultAbi = parseAbi(['function quests(uint256) view returns (address, uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool)']);
        const q = await publicClient.readContract({
            address: AOM3_VAULT_ADDRESS,
            abi: vaultAbi,
            functionName: 'quests',
            args: [questId]
        }) as QuestDataTuple;

        const owner = q[0];
        if (owner === '0x0000000000000000000000000000000000000000') return;

        const walletLower = owner.toLowerCase();
        
        const rankingAbi = parseAbi(['function getUserFullStats(address) view returns (uint256, uint256, uint256, uint256)']);
        const stats = await publicClient.readContract({
            address: AOM3_RANKING_ADDRESS,
            abi: rankingAbi,
            functionName: 'getUserFullStats',
            args: [owner as `0x${string}`]
        }) as UserStatsTuple;

        await Promise.all([
            supabase.from('users').upsert({
                wallet_address: walletLower,
                lifetime_dp: Number(stats[0]),
                current_active_dp: Number(stats[1]),
                total_quests: Number(stats[2]),
                total_months: Number(stats[3]),
                updated_at: new Date().toISOString()
            }),
            supabase.from('quests').upsert({
                quest_id: Number(questId),
                owner_address: walletLower,
                monthly_amount: Number(q[1]) / 1e6,
                total_deposited: Number(q[2]) / 1e6,
                current_streak: Number(q[3]),
                duration_months: Number(q[4]),
                start_timestamp: new Date(Number(q[5]) * 1000).toISOString(),
                last_deposit_timestamp: new Date(Number(q[6]) * 1000).toISOString(),
                dp: Number(q[7]),
                is_active: q[8]
            }),
            supabase.from('transaction_logs').upsert({
                tx_hash: txHash,
                wallet_address: walletLower,
                action_type: eventName,
                amount: actionAmount !== undefined ? Number(actionAmount) / 1e6 : Number(q[1]) / 1e6,
                quest_id: Number(questId)
            }, { onConflict: 'tx_hash' })
        ]);

        console.log(`✅ Sync successful: Quest #${questId} by ${owner} [Event: ${eventName}]`);

    } catch (err) {
        console.error(`❌ Error syncing Quest #${questId}:`, err);
    }
}

async function main() {
    console.log("🔄 Starting Historical Sync from Blockchain...");

    const vaultMetaAbi = parseAbi(['function nextQuestId() view returns (uint256)']);

    try {
        const nextQuestId = await publicClient.readContract({
            address: AOM3_VAULT_ADDRESS,
            abi: vaultMetaAbi,
            functionName: 'nextQuestId'
        });

        console.log(`📌 Found ${nextQuestId} Quests in the system. Starting Database sync...`);

        for (let i = BigInt(0) ; i < nextQuestId; i++) {
            await syncData(i, 'HISTORICAL_SYNC', `HISTORICAL_SYNC_QUEST_${i}`);
        }
        console.log("✅ Historical sync to Database completed successfully!");

    } catch (err) {
        console.error("❌ Historical sync failed:", err);
    }

    console.log("🟢 Starting Real-time Event monitoring...");

    const eventAbi = parseAbi([
        'event QuestCreated(uint256 indexed questId, address indexed owner, uint256 amount, uint256 dp)',
        'event DepositSynced(uint256 indexed questId, uint256 amount, uint256 bonusDP)',
        'event WithdrawalClosed(uint256 indexed questId, uint256 amount, uint256 dpSubtracted)',
        'event QuestDPBurned(uint256 indexed questId, address indexed owner, uint256 dpBurned)'
    ]);

    publicClient.watchContractEvent({
        address: AOM3_VAULT_ADDRESS, abi: eventAbi, eventName: 'QuestCreated',
        onLogs: logs => logs.forEach(log => {
            if (log.args.questId !== undefined && log.transactionHash) {
                syncData(log.args.questId, 'CREATE_QUEST', log.transactionHash, log.args.amount);
            }
        })
    });

    publicClient.watchContractEvent({
        address: AOM3_VAULT_ADDRESS, abi: eventAbi, eventName: 'DepositSynced',
        onLogs: logs => logs.forEach(log => {
            if (log.args.questId !== undefined && log.transactionHash) {
                syncData(log.args.questId, 'DEPOSIT_SYNCED', log.transactionHash, log.args.amount);
            }
        })
    });

    publicClient.watchContractEvent({
        address: AOM3_VAULT_ADDRESS, abi: eventAbi, eventName: 'WithdrawalClosed',
        onLogs: logs => logs.forEach(log => {
            if (log.args.questId !== undefined && log.transactionHash) {
                syncData(log.args.questId, 'WITHDRAW_CLOSED', log.transactionHash, log.args.amount);
            }
        })
    });

    publicClient.watchContractEvent({
        address: AOM3_VAULT_ADDRESS, abi: eventAbi, eventName: 'QuestDPBurned',
        onLogs: logs => logs.forEach(log => {
            if (log.args.questId !== undefined && log.transactionHash) {
                syncData(log.args.questId, 'CLAIM_REWARD_BURN_DP', log.transactionHash, BigInt(0));
            }
        })
    });
}

main().catch(console.error);