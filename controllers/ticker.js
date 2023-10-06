const { default: axios } = require("axios");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const getTicker = async (req, res, next) => {
  try {
    const response = await axios.get(
      "https://whitebit.com/api/v4/public/ticker"
    );
    const tickerData = response.data;
    // console.log(tickerData.ETH_USD, tickerData.ETH_USDT, tickerData.ETH_USD);

    const cryptoList = [];

    const usdtToUsd = tickerData.USDT_USD.last_price;
    for (const pairSymbol in tickerData) {
      const pairData = tickerData[pairSymbol];
      const [crypto, quoteCurrency] = pairSymbol.split("_");

      if (quoteCurrency === "USDT" || pairSymbol === "USDT_USD") {
        // const priceInUSDT = parseFloat(pairData.last_price);
        const priceInUSD = parseFloat(pairData.last_price * usdtToUsd);
        const change24h = parseFloat(pairData.change);
        const marketCap = Math.round(pairData.quote_volume);

        cryptoList.push({
          crypto,
          // priceInUSDT,
          priceInUSD,
          change24h,
          marketCap,
        });
      }
    }

    cryptoList.sort((a, b) => b.marketCap - a.marketCap);

    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const paginatedCryptoList = cryptoList.slice(startIndex, endIndex);

    res.json(paginatedCryptoList);
  } catch (error) {
    console.error("Error fetching Api:", error);
    res.status(500).json({ error: "Error fetching Api" });
  }
};

module.exports = {
  getTicker: ctrlWrapper(getTicker),
};
