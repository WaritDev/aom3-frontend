import { NextResponse } from 'next/server';
import * as hl from "@nktkas/hyperliquid";
import { getAddress, type Hex } from 'viem';

const rawVaultAddress = process.env.NEXT_PUBLIC_HL_HLP_VAULT_ADDRESS;
if (!rawVaultAddress) {
    throw new Error("NEXT_PUBLIC_HL_HLP_VAULT_ADDRESS is missing in your .env file");
}
export const VAULT_ADDRESS = getAddress(rawVaultAddress as Hex);
const transport = new hl.HttpTransport();
const client = new hl.InfoClient({ transport });

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const vaultAddress = body.vaultAddress || VAULT_ADDRESS;

        const vaultData = await client.vaultDetails({ vaultAddress: vaultAddress as Hex });
        const allTime = vaultData?.portfolio?.find(item => item[0] === 'allTime');
        
        if (!allTime) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

        const snapshots = allTime[1].accountValueHistory;
        const pnlHistory = allTime[1].pnlHistory;

        const pnlMap = new Map<number, number>();
        pnlHistory.forEach(([ts, pnl]) => pnlMap.set(ts as number, parseFloat(pnl as string)));

        let sharePrice = 1.0;
        const navHistory: { ts: number, dateKey: string, price: number }[] = [];

        if (snapshots.length > 0) {
            const firstTs = snapshots[0][0] as number;
            const d = new Date(firstTs);
            const dateKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
            navHistory.push({ ts: firstTs, dateKey, price: sharePrice });
        }

        for (let i = 1; i < snapshots.length; i++) {
            const ts = snapshots[i][0] as number;
            const prevTs = snapshots[i - 1][0] as number;
            const prevEquity = parseFloat(snapshots[i - 1][1] as string);

            const currentPnl = pnlMap.get(ts) || 0;
            const prevPnl = pnlMap.get(prevTs) || 0;

            if (prevEquity > 0) {
                const deltaPnl = currentPnl - prevPnl;
                const returnRate = deltaPnl / prevEquity;
                sharePrice *= (1 + returnRate);
            }

            const d = new Date(ts);
            const dateKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
            
            navHistory.push({ ts, dateKey, price: sharePrice });
        }

        const endOfMonthPrices: Record<string, number> = {};
        const months = Array.from(new Set(navHistory.map(n => n.dateKey)));

        months.forEach(m => {
            const dataInMonth = navHistory.filter(n => n.dateKey === m);
            endOfMonthPrices[m] = dataInMonth[dataInMonth.length - 1].price;
        });

        const monthlyReturns: Record<string, Record<string, number>> = {};

        for (let i = 0; i < months.length; i++) {
            const m = months[i];
            const [year, month] = m.split('-');

            let startPrice = 1.0;
            if (i > 0) {
                startPrice = endOfMonthPrices[months[i - 1]];
            } else {
                startPrice = navHistory.filter(n => n.dateKey === m)[0].price;
            }

            const endPrice = endOfMonthPrices[m];
            
            const yieldPct = ((endPrice / startPrice) - 1) * 100;

            if (!monthlyReturns[year]) monthlyReturns[year] = {};
            monthlyReturns[year][month] = Number(yieldPct.toFixed(2));
        }

        const tableData = Object.keys(monthlyReturns).map(year => ({
            year,
            returns: monthlyReturns[year]
        })).sort((a, b) => b.year.localeCompare(a.year));

        return NextResponse.json({ tableData });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Sync Error' }, { status: 500 });
    }
}