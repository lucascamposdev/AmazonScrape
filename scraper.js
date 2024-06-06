import axios from 'axios';
import { JSDOM } from 'jsdom';

const fetchAmazonSearchResults = async (search) => {
    const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(search)}`;
    
    /* Houve a necessidade de adicionar 
    headers na requisição para simular 
    um acesso real ao site da Amazon 
    e não ser bloqueado. */
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'DNT': '1',
                'Upgrade-Insecure-Requests': '1',
            }
        });

        const dom = new JSDOM(data);
        const document = dom.window.document;

        const products = [];

        // Acessando os elementos da página
        document.querySelectorAll('.s-result-item').forEach(item => {
            const titleElement = item.querySelector('h2 .a-link-normal');
            const ratingElement = item.querySelector('.a-icon-alt');
            const imageElement = item.querySelector('.s-image');
            const reviewsElement = item.querySelector('.a-size-base.s-underline-text');

            // Encontrar o link do produto
            const linkElement = item.querySelector('h2 .a-link-normal');
            const productLink = linkElement ? linkElement.getAttribute('href') : '';

            // Montando o objeto Produto que retorna ao front-end
            if (titleElement && ratingElement && reviewsElement && imageElement) {
                const product = {
                    title: titleElement.textContent.trim(),
                    rating: ratingElement.textContent.trim(),
                    numberOfReviews: reviewsElement.textContent.trim(),
                    imageUrl: imageElement.src,
                    productLink: `https://www.amazon.com.br${productLink}`
                };
                products.push(product);
            }
        });

        return products;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
};

export default fetchAmazonSearchResults;
