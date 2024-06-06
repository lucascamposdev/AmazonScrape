document.getElementById('search-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Encontrando a caixa de pesquisa
    const search = document.getElementById('search');
    // Encontrando o container de respostas
    const resultsContainer = document.getElementById('results');

    // Loading
    resultsContainer.innerHTML = 'Searching...';

    try {
        const response = await fetch(`/api/scrape?keyword=${encodeURIComponent(search.value)}`);
        const data = await response.json();
        // Limpa caixa de pesquisa depois da busca
        search.value = ''

        // Checando se ocorreu tudo bem com a requisição e se foram retornados produtos
        if (response.ok && data.length > 0) {
            resultsContainer.innerHTML = '';
            data.forEach(product => {
                // Retirando apenas o valor do rating ex: 4.2
                const rating = product.rating.split(" ")[0]

                /* Elemento principal será um <a> 
                pois quero que a product bar seja clicável
                e leve até á pagina do produto no site oficial da Amazon
                */
                const productElement = document.createElement('a');
                productElement.className = 'product';
                productElement.href = product.productLink;
                productElement.target = '_blank';
                // Montando a product bar
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

            // Ocorreu tudo bem com a requisição porém não foram encontrados produtos
        } else if(data.length < 1) {
            resultsContainer.innerHTML = `No product found.`;
            // Algum erro de requisição vindo do servidor - relacionado ao site da amazon
        } else if(!response.ok){
            resultsContainer.innerHTML = `Internal error, please try again later.`;
        }
        
        // Algum erro de requisição vindo do servidor - relacionado a minha aplicação
    } catch (error) {
        resultsContainer.innerHTML = `Internal error, please try again later.`;
    }
});