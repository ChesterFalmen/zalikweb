import express from 'express'
import axios from 'axios'
import cors from 'cors';

const PORT = 5000;

const app = express();
app.use(express.json());

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    res.status(200).json({status: 200, message:"Server is working!"});
});

async function getBinanceData() {
    const usdToUahExchangeRate = 37.5;

    try {
        const exchangeInfoResponse = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
        const tickerResponse = await axios.get('https://api.binance.com/api/v3/ticker/price');

        const symbols = exchangeInfoResponse.data.symbols.filter(symbol => symbol.quoteAsset === "USDT").map(symbol => symbol.symbol);

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

app.get('/getBinancePricesUSDT', async (req, res) => {
    try {
        const binanceData = await getBinanceData();
        res.json(binanceData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
});

app.listen(PORT, () => {
    console.log('SERVER STARTED ON ' + PORT + ' PORT')
});