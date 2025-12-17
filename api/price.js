export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const BINANCE_URL =
    "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

  async function fetchPrice(tradeType) {
    const r = await fetch(BINANCE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: 1,
        rows: 1,
        asset: "USDT",
        fiat: "VND",
        tradeType,
        payTypes: [],
        publisherType: null
      })
    });

    const j = await r.json();
    const item = j.data?.[0];

    if (!item) throw new Error("No Binance data");

    return Number(item.adv.price);
  }

  try {
    const buy = await fetchPrice("BUY");
    const sell = await fetchPrice("SELL");

    res.json({
      buy,
      sell,
      spread: sell - buy,
      ts: Date.now()
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
