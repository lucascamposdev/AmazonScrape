// Iniciando a requisição na primeira página e setando sempre a mostragem de 10 produtos por página
let currentPage = 1;
const limit = 10;

// Seleção de elementos importantes
const infoContainer = document.querySelector('.results-info')
const resultsContainer = document.getElementById('results');

// 1) Evento principal que inicia a busca
document.getElementById('search-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    currentPage = 1;
    searchProducts();
})

// 2) Service que realiza o fetch dos dados
const searchProducts = async () => {
    const search = document.getElementById('search').value;
    infoContainer.innerHTML = 'Loading...';
    resultsContainer.innerHTML = '';

    try {
        const response = await fetch(`/api/scrape?keyword=${encodeURIComponent(search)}&page=${currentPage}&limit=${limit}`);
        const data = await response.json();

        if (data.products.length > 0) {
            // Tudo Ok: chame essas funções de display
            displayResultsInfo(data, search);
            displayData(data);
            changePageStyle();

            // Tudo Ok: porém nenhum produto encontrado
        } else if(response.ok && data.products.length === 0){
            infoContainer.innerHTML = `No products found`;
        } 
        // Algum erro vindo do servidor - relacionado ao site da amazon
        else {
            infoContainer.innerHTML = `Internal error, please try again later.`;
        }
        // Algum erro vindo do servidor - relacionado a minha aplicação
    } catch (error) {
        infoContainer.innerHTML = `Internal error, please try again later.`;
    }

}

// 3) Display: quantos produtos estão sendo mostrados, total de produtos encontrados e nome da query
const displayResultsInfo = (data, query) =>{
    const firstProduct = (currentPage - 1) * limit + 1;
    const lastProduct = Math.min(currentPage * limit, data.total);

    infoContainer.innerHTML = `${firstProduct}-${lastProduct} de ${data.total} resultados para "<b class="light-purple">${query}</b>"`
}

// 4) Display: mostre os produtos na tela
const displayData = (data) => {
    resultsContainer.innerHTML = '';

    data.products.forEach(product => {
        const rating = product.rating.split(" ")[0]

        /* Elemento principal será um <a> 
        pois quero que o elemento seja clicável
        e leve até á pagina do produto no site oficial da Amazon
        */
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
                    <p class="reviews">${product.numberOfReviews} Reviews</p>
                </div>
            </div>
        `;
        // Insere os produtos na tela
        resultsContainer.appendChild(productElement);
    });
    
    pagination(data)
};

// 5) Display: realiza a criação dos botões de paginação
const pagination = (data) =>{
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';

    // Página que estamos é maior do que 1 ? então temos um botão para voltar
    if (data.page > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.onclick = () => {
            currentPage--;
            searchProducts();
        };
        paginationContainer.appendChild(prevButton);
    }

    // Página que estamos é menor do que o total ? então temos um botão para avançar
    if (data.page < data.totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.onclick = () => {
            currentPage++;
            searchProducts();
        };
        paginationContainer.appendChild(nextButton);
    }

    resultsContainer.appendChild(paginationContainer);
}

// X) Display: altera o layout da página
const changePageStyle = () =>{
    const body = document.getElementsByTagName('body')[0]; 
    body.style.justifyContent = 'flex-start'; 
};

