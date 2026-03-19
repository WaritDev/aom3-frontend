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

type UserStatsTuple = readonly [
    bigint, // lifetimeDP
    bigint, // currentActiveDP
    bigint, // totalQuests
    bigint  // totalMonths
];

type QuestDataTuple = readonly [
    `0x${string}`, // owner
    bigint,        // monthlyAmount
    bigint,        // totalDeposited
    bigint,        // currentStreak
    bigint,        // durationMonths
    bigint,        // startTimestamp
    bigint,        // lastDepositTimestamp
    bigint,        // dp
    boolean        // active
];

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc')
});

async function syncData(questId: bigint, owner: string, eventName: string, txHash: string, actionAmount: bigint) {
    try {
        const walletLower = owner.toLowerCase();
        
        const rankingAbi = parseAbi(['function getUserFullStats(address) view returns (uint256, uint256, uint256, uint256)']);
        const stats = await publicClient.readContract({
            address: AOM3_RANKING_ADDRESS,
            abi: rankingAbi,
            functionName: 'getUserFullStats',
            args: [owner as `0x${string}`]
        }) as UserStatsTuple;

        await supabase.from('users').upsert({
            wallet_address: walletLower,
            lifetime_dp: Number(stats[0]),
            current_active_dp: Number(stats[1]),
            total_quests: Number(stats[2]),
            total_months: Number(stats[3]),
            updated_at: new Date().toISOString()
        });

        const vaultAbi = parseAbi(['function quests(uint256) view returns (address, uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool)']);
        const q = await publicClient.readContract({
            address: AOM3_VAULT_ADDRESS,
            abi: vaultAbi,
            functionName: 'quests',
            args: [questId]
        }) as QuestDataTuple;

        await supabase.from('quests').upsert({
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
        });

        await supabase.from('transaction_logs').upsert({
            tx_hash: txHash,
            wallet_address: walletLower,
            action_type: eventName,
            amount: Number(actionAmount) / 1e6,
            quest_id: Number(questId)
        }, { onConflict: 'tx_hash' });

        console.log(`✅ Sync successful: Quest #${questId} by ${owner} [Event: ${eventName}]`);

    } catch (err) {
        console.error(`❌ Error syncing Quest #${questId}:`, err);
    }
}

async function main() {
    console.log("🔄 Starting Historical Sync from Blockchain...");

    const vaultMetaAbi = parseAbi([
        'function nextQuestId() view returns (uint256)',
        'function quests(uint256) view returns (address, uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool)'
    ]);

    try {
        const nextQuestId = await publicClient.readContract({
            address: AOM3_VAULT_ADDRESS,
            abi: vaultMetaAbi,
            functionName: 'nextQuestId'
        });

        console.log(`📌 Found ${nextQuestId} Quests in the system. Starting Database sync...`);

        for (let i = BigInt(0) ; i < nextQuestId; i++) {
            try {
                const q = await publicClient.readContract({
                    address: AOM3_VAULT_ADDRESS,
                    abi: vaultMetaAbi,
                    functionName: 'quests',
                    args: [i]
                }) as QuestDataTuple;

                const owner = q[0];
                const monthlyAmount = q[1];

                if (owner !== '0x0000000000000000000000000000000000000000') {
                    const historicalTxHash = `HISTORICAL_SYNC_QUEST_${i}`;
                    await syncData(i, owner, 'HISTORICAL_SYNC', historicalTxHash, monthlyAmount);
                }
            } catch (err) {
                console.error(`⚠️ Skipped historical sync for Quest #${i} (Might not exist)`, err);
            }
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
        onLogs: logs => {
            logs.forEach(log => {
                const { questId, owner, amount } = log.args;
                if (questId !== undefined && owner !== undefined && amount !== undefined && log.transactionHash) {
                    syncData(questId, owner, 'CREATE_QUEST', log.transactionHash, amount);
                }
            });
        }
    });

    const fetchOwnerAndSync = async (questId: bigint | undefined, amount: bigint | undefined, txHash: string | null, eventName: string) => {
        if (questId === undefined || amount === undefined || !txHash) return;
        
        const vaultAbi = parseAbi(['function quests(uint256) view returns (address, uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool)']);
        const q = await publicClient.readContract({
            address: AOM3_VAULT_ADDRESS, 
            abi: vaultAbi,
            functionName: 'quests', 
            args: [questId]
        }) as QuestDataTuple;
        
        const ownerAddress = q[0];
        await syncData(questId, ownerAddress, eventName, txHash, amount);
    };

    publicClient.watchContractEvent({
        address: AOM3_VAULT_ADDRESS, abi: eventAbi, eventName: 'DepositSynced',
        onLogs: async logs => {
            for (const log of logs) {
                await fetchOwnerAndSync(log.args.questId, log.args.amount, log.transactionHash, 'DEPOSIT_SYNCED');
            }
        }
    });

    publicClient.watchContractEvent({
        address: AOM3_VAULT_ADDRESS, abi: eventAbi, eventName: 'WithdrawalClosed',
        onLogs: async logs => {
            for (const log of logs) {
                await fetchOwnerAndSync(log.args.questId, log.args.amount, log.transactionHash, 'WITHDRAW_CLOSED');
            }
        }
    });

    publicClient.watchContractEvent({
        address: AOM3_VAULT_ADDRESS, abi: eventAbi, eventName: 'QuestDPBurned',
        onLogs: logs => {
            logs.forEach(log => {
                const { questId, owner } = log.args;
                if (questId !== undefined && owner !== undefined && log.transactionHash) {
                    syncData(questId, owner, 'CLAIM_REWARD_BURN_DP', log.transactionHash, BigInt(0));
                }
            });
        }
    });
}

main().catch(console.error);