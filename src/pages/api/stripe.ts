
import type { NextApiRequest, NextApiResponse } from 'next';

type StripeData = {
  mrr: number;
  totalRev: number;
  failedPayments: number;
  churnedCount: number;
  activeSubscriptions: number;
};

async function stripeGet(path: string, apiKey: string): Promise<unknown> {
  const res = await fetch(`https://api.stripe.com${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = (data as { error?: { message?: string } })?.error?.message ?? 'Stripe request failed';
    throw new Error(msg);
  }
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StripeData | { error: string }>
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured' });
  }

  try {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstOfMonthTs = Math.floor(firstOfMonth.getTime() / 1000);
    const firstOfLastMonthTs = Math.floor(firstOfLastMonth.getTime() / 1000);

    const chargesParams = new URLSearchParams({
      'created[gte]': String(firstOfMonthTs),
      limit: '100'
    });
    const churnParams = new URLSearchParams({
      status: 'canceled',
      'canceled_at[gte]': String(firstOfLastMonthTs),
      'canceled_at[lte]': String(firstOfMonthTs),
      limit: '100'
    });

    const [activeSubs, charges, churnedSubs] = await Promise.all([
      stripeGet('/v1/subscriptions?status=active&limit=100', apiKey),
      stripeGet(`/v1/charges?${chargesParams}`, apiKey),
      stripeGet(`/v1/subscriptions?${churnParams}`, apiKey)
    ]) as [
      { data: Array<{ items?: { data?: Array<{ price?: { unit_amount?: number; recurring?: { interval?: string; interval_count?: number } } }> } }> },
      { data: Array<{ status: string; refunded: boolean; amount: number }> },
      { data: unknown[] }
    ];

    let mrr = 0;
    for (const sub of activeSubs.data ?? []) {
      const item = sub.items?.data?.[0];
      if (!item) continue;
      const amount = item.price?.unit_amount ?? 0;
      const interval = item.price?.recurring?.interval ?? 'month';
      const intervalCount = item.price?.recurring?.interval_count ?? 1;
      if (interval === 'month') {
        mrr += amount / 100 / intervalCount;
      } else if (interval === 'year') {
        mrr += amount / 100 / (intervalCount * 12);
      }
    }

    let totalRev = 0;
    let failedPayments = 0;
    for (const charge of charges.data ?? []) {
      if (charge.status === 'failed') {
        failedPayments++;
      } else if (charge.status === 'succeeded' && !charge.refunded) {
        totalRev += charge.amount / 100;
      }
    }

    return res.status(200).json({
      mrr: Math.round(mrr * 100) / 100,
      totalRev: Math.round(totalRev * 100) / 100,
      failedPayments,
      churnedCount: (churnedSubs.data ?? []).length,
      activeSubscriptions: (activeSubs.data ?? []).length
    });
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
