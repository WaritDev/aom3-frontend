import { NextResponse } from 'next/server';

const HL_API = 'https://api.hyperliquid.xyz/info';

const PERFORMANCE_FEE = 0.10;
const ALLOCATION_RATE = 0.704;

const EFFECTIVE_MULTIPLIER = ALLOCATION_RATE * (1 - PERFORMANCE_FEE);

interface HLFundingHistory {
    coin: string;
    fundingRate: string;
    premium: string;
    time: number;
}

interface RequestBody {
    coin?: string;
}

export interface CalculatedYieldItem {
    date: string;
    apy: number;
    rawFunding: number;
    count: number;
}


async function fetchFundingChunk(coin: string, start: number, end: number) {
    try {
        const response = await fetch(HL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: "fundingHistory",
            coin: coin,
            startTime: start,
            endTime: end
        }),
        next: { revalidate: 300 }
        });

        if (!response.ok) return [];
        return (await response.json()) as HLFundingHistory[];
    } catch (error) {
        console.error("Fetch Chunk Error:", error);
        return [];
    }
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as RequestBody;
        const coin = body.coin || 'HYPE'; 

        const now = Date.now();
        const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;

        const end1 = now;
        const start1 = now - fifteenDaysMs;

        const end2 = start1;
        const start2 = end2 - fifteenDaysMs;

        const [chunk1, chunk2] = await Promise.all([
        fetchFundingChunk(coin, start1, end1),
        fetchFundingChunk(coin, start2, end2)
        ]);

        let allData = [...chunk2, ...chunk1];
        
        allData = allData
            .sort((a, b) => a.time - b.time)
            .filter((item, index, self) => 
                index === self.findIndex((t) => t.time === item.time)
            );

        const dailyMap = new Map<string, { sumRate: number; count: number; sortTime: number }>();

        allData.forEach((item) => {
        const dateKey = new Date(item.time).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric' 
        });

        const rate = parseFloat(item.fundingRate);
        
        const current = dailyMap.get(dateKey) || { sumRate: 0, count: 0, sortTime: item.time };
        
        dailyMap.set(dateKey, {
            sumRate: current.sumRate + rate,
            count: current.count + 1,
            sortTime: item.time
        });
        });

        const history: CalculatedYieldItem[] = Array.from(dailyMap.entries())
        .map(([date, val]) => {
        const dailyYield = val.sumRate; 
        const grossApr = dailyYield * 365;
        const netApr = grossApr * EFFECTIVE_MULTIPLIER; 
        
        return {
            date,
            apy: netApr * 100,
            rawFunding: dailyYield,
            count: val.count,
            _sortTime: val.sortTime
        };
        })
        .sort((a, b) => a._sortTime - b._sortTime)
        .map(({ ...rest }) => rest);
        const sumApy = history.reduce((sum, item) => sum + item.apy, 0);
        const avgApy = sumApy / (history.length || 1);

        return NextResponse.json({ 
        coin,
        average30dApy: avgApy,
        history: history 
        });

    } catch (error) {
        console.error("HL Calc Critical Error:", error);
        return NextResponse.json({ error: 'Calculation failed' }, { status: 500 });
    }
}