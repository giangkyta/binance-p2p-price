export default async function handler(req, res) {
  // ✅ CORS headers (QUAN TRỌNG)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const BINANCE_P2P_URL =
    "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

  async function fetchP2PPrice(tradeType) {
    const body = {
      page: 1,
      rows: 1,
      asset: "USDT",
      fiat: "VND",
      tradeType,
      payTypes: [],
      publisherType: null
    };

    const response = await fetch(BINANCE_P2P_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const json = await response.json();
    const item = json.data[0];

    return {
      price: Number(item.adv.price),
      minAmount: Number(item.adv.minSingleTransAmount),
      maxAmount: Number(item.adv.maxSingleTransAmount)
    };
  }

  try {
    const buy = await fetc
