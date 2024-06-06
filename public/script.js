document.getElementById('search-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const search = document.getElementById('search');
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = 'Searching...';

    try {
        const response = await fetch(`/api/scrape?keyword=${encodeURIComponent(search.value)}`);
        const data = await response.json();
        search.value = ''

        if (response.ok && data.length > 0) {
            resultsContainer.innerHTML = '';
            data.forEach(product => {
                const rating = product.rating.split(" ")[0]
                const productElement = document.createElement('a');
                productElement.className = 'product';
                productElement.href = product.productLink;
                productElement.target = '_blank';
                productElement.innerHTML = `
                    <figure>
                        <img src="${product.imageUrl}" alt="${product.title}">
                    </figure>
                    <div>
                        <h2 class="title">${product.title}</h2>
                        <div class="info">
                            <span class="rating">${rating}
                                <i class="bi bi-star-fill"></i>
                            </span>
                            <p class="category">${product.numberOfReviews} Reviews</p>
                        </div>
                    </div>
                `;
                resultsContainer.appendChild(productElement);
            });
        } else if(data.length < 1) {
            resultsContainer.innerHTML = `No product found.`;
        } else if(!response.ok){
            resultsContainer.innerHTML = `Internal error, please try again later.`;
        }

    } catch (error) {
        resultsContainer.innerHTML = `Internal error, please try again later.`;
    }
});