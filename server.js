import express from "express";
import fetchAmazonSearchResults from "./scraper.js";
const app = express();

const PORT = 9001

app.use(express.static('public'));

// Route
app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword query parameter is required' });
    }

    try {
        const products = await fetchAmazonSearchResults(keyword);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, (err) => console.log(`Server running on port: ${PORT}`))
