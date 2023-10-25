import express from 'express'
import axios from 'axios'
import cors from 'cors';

const PORT = 5000;

const app = express();
app.use(express.json());

app.use(cors({ origin: '*' }));

const apiKey = '64964a77aa3e32bf787a793f247b9dfa';

app.get('/', (req, res) => {
    res.status(200).json({status: 200, message:"Сервер працює"});
});

app.get('/weather/:city', async (req, res)=> {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + req.params.city + '&appid=' + apiKey);
        const data = response.data;

        if (response.status === 200) {
            console.log(req.params.city);
            res.status(200).json({ status: 200, data: data });
        }
    } catch (error) {
        console.error(error.response.status);
        res.status(404).json({ status: 404, message: error.response.statusText});
    }
    
});

app.listen(PORT, () => {
    console.log('SERVER STARTED ON ' + PORT + ' PORT')
});