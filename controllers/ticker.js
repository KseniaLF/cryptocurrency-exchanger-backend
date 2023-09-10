const { default: axios } = require("axios");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const getTicker = async (req, res, next) => {
  try {
    const response = await axios.get(
      "https://whitebit.com/api/v4/public/ticker"
    );
    const tickerData = response.data;

    const cryptoList = [];

    // Проходимся по всем данным о криптовалютах
    for (const pairSymbol in tickerData) {
      const pairData = tickerData[pairSymbol];
      const [crypto, quoteCurrency] = pairSymbol.split("_");

      // Проверяем, что это пара с котируемой валютой USDT
      if (quoteCurrency === "USDT") {
        const priceInUSDT = parseFloat(pairData.last_price);
        const change24h = parseFloat(pairData.change);

        // Рассчитываем рыночную капитализацию (примерно)
        // Это просто для иллюстрации исходя из текущей цены и объема
        const marketCap = Math.round(priceInUSDT * pairData.quote_volume);

        // Добавляем информацию о криптовалюте в список
        cryptoList.push({ crypto, priceInUSDT, change24h, marketCap });
      }
    }

    // Сортируем криптовалюты по рыночной капитализации в порядке убывания
    cryptoList.sort((a, b) => b.marketCap - a.marketCap);

    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const paginatedCryptoList = cryptoList.slice(startIndex, endIndex);

    res.json(paginatedCryptoList);
  } catch (error) {
    console.error("Ошибка при запросе к API:", error);
    res.status(500).json({ error: "Ошибка при запросе к API" });
  }
};

module.exports = {
  getTicker: ctrlWrapper(getTicker),
};
