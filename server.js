import express from "express";
import fetchAmazonSearchResults from "./scraper.js";
const app = express();

const PORT = 9001

app.use(express.static('public'));

// Route
app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword query parameter is required' });
    }

    try {
        const products = await fetchAmazonSearchResults(keyword);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = products.slice(startIndex, endIndex);

        res.json({
            page,
            limit,
            total: products.length,
            totalPages: Math.ceil(products.length / limit),
            products: paginatedProducts
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, (err) => console.log(`Server running on port: ${PORT}`))
