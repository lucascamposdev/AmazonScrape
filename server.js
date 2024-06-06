import express from "express";
import fetchAmazonSearchResults from "./scraper.js";
const app = express();

const PORT = 9001

app.use(express.static('public'));

// Route
app.get('/api/scrape', async (req, res) => {
    const search = req.query.search;
    if (!search) {
        return res.status(400).json({ error: 'Search query parameter is required' });
    }

    try {
        const products = await fetchAmazonSearchResults(search);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, (err) => console.log(`Server running on port: ${PORT}`))
