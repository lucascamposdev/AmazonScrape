// Iniciando as variáveis globais
let allData;
let totalPages;
let query;

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
        const response = await fetch(`/api/scrape?keyword=${encodeURIComponent(search)}`);
        const data = await response.json();

        if (data.products.length > 0) {
            // Tudo Ok
            query = search;
            allData = data.products;
            paginate(data.products);
            changePageStyle();

            // Tudo Ok: porém nenhum produto encontrado
        } else if(response.ok && data.products.length === 0){
            infoContainer.innerHTML = `No products found`;
        } 
        // Algum erro vindo do servidor - relacionado ao site da amazon
        else {
            infoContainer.innerHTML = `External error, please try again later.`;
        }
        // Algum erro vindo do servidor - relacionado á minha aplicação
    } catch (error) {
        infoContainer.innerHTML = `Internal error, please try again later.`;
    }
}

// 3) Paginação: realiza a paginação de produtos no lado do cliente

/* Razão: buscando uma melhor experiência do usuário, todos os
dados já estarão prontos e requisitados, restando apenas que o usuário
interaja com pequenos blocos de página sem necessidade de loading */
const paginate = (data) =>{
    const firstProduct = (currentPage - 1) * limit;
    const lastProduct = currentPage * limit;
    totalPages = Math.ceil(data.length / limit)

    const paginatedProducts = data.slice(firstProduct, lastProduct);

    displayResultsInfo(firstProduct);
    displayData(paginatedProducts);
}

// 4) Display: informa quantos produtos estão sendo mostrados, total e nome da query
const displayResultsInfo = (firstProduct) =>{
    const lastProduct = Math.min(currentPage * limit, allData.length)
    infoContainer.innerHTML = `${firstProduct + 1}-${lastProduct} de ${allData.length} resultados para "<b class="light-purple">${query}</b>"`
}

// 5) Display: insere os produtos visualmente na tela
const displayData = (data) => {
    resultsContainer.innerHTML = '';

    data.forEach(product => {
        const rating = product.rating.split(" ")[0]

        /* Elemento principal será um <a> 
        onde ao clicar levará até á pagina do produto no site oficial da Amazon */
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
        resultsContainer.appendChild(productElement);
    });
    
    pagination(data)
};

// 5) Display: realiza a criação dos botões de <Previuous> e <Next>
const pagination = () =>{
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';

    // Página que estamos é maior do que 1 ? então temos um botão para voltar
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.onclick = () => {
            window.scrollTo(0, 0);
            currentPage--;
            paginate(allData);
        };
        paginationContainer.appendChild(prevButton);
    }

    // Página que estamos é menor do que o total ? então temos mais páginas para avançar
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.onclick = () => {
            window.scrollTo(0, 0);
            currentPage++;
            paginate(allData);
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

