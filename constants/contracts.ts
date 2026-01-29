export const AOM3_VAULT_ADDRESS = "0xC0F41cFAB106419A386De9813d5438F8cCb55106" as const;
export const AOM3_STRATEGY_ADDRESS = "0x65463976BF5859e1e6a7610782C2676110FB3F88" as const;
export const AOM3_REWARD_DISTRIBUTOR_ADDRESS = "0x5D3368490F081C12948e77aFf83Bf8294FDE9c22" as const;
export const AOM3_RANKING_ADDRESS = "0x401454e264030503Ed344E6131e37C21F5611ba9" as const;
export const USDC_ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as const;

export const AOM3_VAULT_ABI = [
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_usdc",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "_yieldStrategy",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "_ranking",
        "type": "address"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "owner",
        "type": "address"
    }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
},
{
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "bool",
        "name": "insideWindow",
        "type": "bool"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "bonusDP",
        "type": "uint256"
    }
    ],
    "name": "DepositExecuted",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "dp",
        "type": "uint256"
    }
    ],
    "name": "QuestCreated",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "dpSubtracted",
        "type": "uint256"
    }
    ],
    "name": "WithdrawalExecuted",
    "type": "event"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_monthlyAmount",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "_durationMonths",
        "type": "uint256"
    }
    ],
    "name": "createQuest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_questId",
        "type": "uint256"
    }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
    }
    ],
    "name": "getDayOfMonth",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "pure",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_months",
        "type": "uint256"
    }
    ],
    "name": "getMultiplier",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "pure",
    "type": "function"
},
{
    "inputs": [],
    "name": "isInsideWindow",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "nextQuestId",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "owner",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "name": "quests",
    "outputs": [
    {
        "internalType": "address",
        "name": "owner",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "monthlyAmount",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "totalDeposited",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "currentStreak",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "durationMonths",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "startTimestamp",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "lastDepositTimestamp",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "dp",
        "type": "uint256"
    },
    {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "ranking",
    "outputs": [
    {
        "internalType": "contract IAOM3Ranking",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "totalDisciplinePoints",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "usdc",
    "outputs": [
    {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_questId",
        "type": "uint256"
    }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "yieldStrategy",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
}
] as const;

export const USDC_ABI = [
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'allowance',
        type: 'function',
        stateMutability: 'view',
        inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        ],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ type: 'bool' }],
    },
    {
        name: 'decimals',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint8' }],
    }
] as const;

export const AOM3_REWARD_DISTRIBUTOR_ABI = [
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_usdc",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "owner",
        "type": "address"
    }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
},
{
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }
    ],
    "name": "RewardClaimed",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }
    ],
    "name": "RewardReceived",
    "type": "event"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_questId",
        "type": "uint256"
    }
    ],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "getDayOfMonth",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "name": "hasClaimed",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "lastSnapshotAmount",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "lastSnapshotDay",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }
    ],
    "name": "notifyRewardAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "owner",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "usdc",
    "outputs": [
    {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "vault",
    "outputs": [
    {
        "internalType": "contract IAOM3Vault",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
}
] as const;

export const AOM3_RANKING_ABI = [
{
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "owner",
        "type": "address"
    }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "currentDP",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "lifetimeDP",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalMonths",
        "type": "uint256"
    }
    ],
    "name": "RankUpdated",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountReduced",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
    }
    ],
    "name": "StatsDecreased",
    "type": "event"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "name": "allParticipants",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "getTotalParticipants",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_user",
        "type": "address"
    }
    ],
    "name": "getUserFullStats",
    "outputs": [
    {
        "components": [
        {
            "internalType": "uint256",
            "name": "lifetimeDP",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "currentActiveDP",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "totalQuests",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "totalMonths",
            "type": "uint256"
        }
        ],
        "internalType": "struct AOM3Ranking.UserStats",
        "name": "",
        "type": "tuple"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "owner",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_user",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_dp",
        "type": "uint256"
    }
    ],
    "name": "reduceActiveDP",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_user",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_dp",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "_months",
        "type": "uint256"
    }
    ],
    "name": "registerNewQuest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
    }
    ],
    "name": "setVault",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "name": "userStats",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "lifetimeDP",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "currentActiveDP",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "totalQuests",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "totalMonths",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "vault",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
}
] as const;