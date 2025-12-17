export default async function handler(req, res) {
  // ✅ Cho phép mọi domain gọi (HTML ở đâu cũng được)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ❗ Chỉ cho GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 🔁 Gọi API nội bộ (KHÔNG CORS)
    const response = await fetch(
      "https://binance-p2p-price.vercel.app/api/price"
    );

    const data = await response.json();

    // 🚀 Trả JSON thẳng cho HTML ngoài
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      error: "Proxy failed",
      message: err.message
    });
  }
}
