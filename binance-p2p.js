/**
 * Binance P2P USDT/VND Price Fetcher
 * Run: node binance-p2p.js
 * Node.js >= 18 (có sẵn fetch)
 */

const BINANCE_P2P_URL =
  "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

async function fetchP2PPrice(tradeType) {
  const body = {
    page: 1,
    rows: 1,
    asset: "USDT",
    fiat: "VND",
    tradeType: tradeType, // "BUY" | "SELL"
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

  if (!response.ok) {
    throw new Error("HTTP Error: " + response.status);
  }

  const json = await response.json();

  if (!json.success || !json.data || json.data.length === 0) {
    throw new Error("No data returned from Binance P2P");
  }

  const item = json.data[0];

  return {
    tradeType,
    price: Number(item.adv.price),
    minAmount: Number(item.adv.minSingleTransAmount),
    maxAmount: Number(item.adv.maxSingleTransAmount),
    nickName: item.advertiser.nickName,
    monthOrderCount: item.advertiser.monthOrderCount,
    positiveRate: item.advertiser.positiveRate
  };
}

async function main() {
  try {
    const buy = await fetchP2PPrice("BUY");
    const sell = await fetchP2PPrice("SELL");

    console.log("=== BINANCE P2P USDT / VND ===\n");

    console.log("BUY (Bạn mua USDT)");
    console.table(buy);

    console.log("\nSELL (Bạn bán USDT)");
    console.table(sell);

    console.log(
      "\nSPREAD:",
      sell.price - buy.price,
      "VND"
    );
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

main();
