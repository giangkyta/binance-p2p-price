export default async function handler(req, res) {
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
      maxAmount: Number(item.adv.maxSingleTransAmount),
      nickName: item.advertiser.nickName,
      monthOrderCount: item.advertiser.monthOrderCount,
      positiveRate: item.advertiser.positiveRate
    };
  }

  try {
    const buy = await fetchP2PPrice("BUY");
    const sell = await fetchP2PPrice("SELL");

    res.status(200).json({
      asset: "USDT",
      fiat: "VND",
      buy,
      sell,
      spread: sell.price - buy.price,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
