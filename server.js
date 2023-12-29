import express from 'express';
import axios from 'axios';
import cors from 'cors';

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.status(200).json({ status: 200, message: 'Server is working!' });
});

async function getBinanceData() {
  const usdToUahExchangeRate = 37.5;

  try {
    const exchangeInfoResponse = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
    const tickerResponse = await axios.get('https://api.binance.com/api/v3/ticker/price');

    const symbols = exchangeInfoResponse.data.symbols.map(symbol => symbol.symbol);

    const filteredPrices = tickerResponse.data
      .filter(item => symbols.includes(item.symbol))
      .map(item => {
        return {
          symbol: item.symbol,
          priceInUSD: parseFloat(item.price),
          priceInUAH: parseFloat(item.price) * usdToUahExchangeRate,
        };
      });

    return filteredPrices;
  } catch (error) {
    console.error('Error fetching data from Binance API:', error.message);
    throw error;
  }
}

app.get('/getBinancePrices', async (req, res) => {
  try {
    const binanceData = await getBinanceData();
    res.json(binanceData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getTradingPairs', async (req, res) => {
  try {
    const exchangeInfoResponse = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
    const tradingPairs = exchangeInfoResponse.data.symbols.map(symbol => symbol.symbol);
    res.json(tradingPairs);
  } catch (error) {
    console.error('Error fetching trading pairs from Binance API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getRecentTrades/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const recentTradesResponse = await axios.get(`https://api.binance.com/api/v3/trades`, {
      params: { symbol, limit: 5 },
    });

    const recentTrades = recentTradesResponse.data.map(trade => ({
      id: trade.id,
      price: parseFloat(trade.price),
      qty: parseFloat(trade.qty),
      time: new Date(trade.time),
      isBuyerMaker: trade.isBuyerMaker,
      isBestMatch: trade.isBestMatch,
    }));

    res.json(recentTrades);
  } catch (error) {
    console.error(`Error fetching recent trades for ${symbol} from Binance API:`, error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getRecentBuys/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const recentTradesResponse = await axios.get(`https://api.binance.com/api/v3/trades`, {
      params: { symbol, limit: 5, side: 'BUY' },
    });

    const recentBuys = recentTradesResponse.data.map(trade => ({
      id: trade.id,
      price: parseFloat(trade.price),
      qty: parseFloat(trade.qty),
      time: new Date(trade.time),
    }));

    res.json(recentBuys);
  } catch (error) {
    console.error(`Error fetching recent buy trades for ${symbol} from Binance API:`, error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getAccountStatus/:apiKey/:apiSecret', async (req, res) => {
  const { apiKey, apiSecret } = req.params;
  try {
    const accountStatusResponse = await axios.get('https://api.binance.com/api/v3/account', {
      headers: {
        'X-MBX-APIKEY': apiKey,
      },
    });

    res.json({
      status: accountStatusResponse.data.status,
      balances: accountStatusResponse.data.balances.map(balance => ({
        asset: balance.asset,
        free: parseFloat(balance.free),
        locked: parseFloat(balance.locked),
      })),
    });
  } catch (error) {
    console.error('Error fetching account status from Binance API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getSymbolPrices/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const tickerPriceResponse = await axios.get('https://api.binance.com/api/v3/ticker/price', {
      params: { symbol },
    });

    res.json({
      symbol: tickerPriceResponse.data.symbol,
      price: parseFloat(tickerPriceResponse.data.price),
    });
  } catch (error) {
    console.error(`Error fetching price for ${symbol} from Binance API:`, error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log('SERVER STARTED ON ' + PORT + ' PORT');
});