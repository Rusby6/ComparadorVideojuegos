document.getElementById('game-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const gameName = document.getElementById('game-name').value;

    // Obtener los valores seleccionados en los filtros (checkboxes)
    const priceRanges = Array.from(document.querySelectorAll('input[name="price-range"]:checked')).map(checkbox => checkbox.value);
    const stores = Array.from(document.querySelectorAll('input[name="store"]:checked')).map(checkbox => checkbox.value);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Buscando precios... ⏳</p>';

    try {
        const results = await window.electron.invoke('search-game', gameName);
        console.log('Resultados recibidos en el renderer:', results);
        resultsDiv.innerHTML = '';

        if (results.length === 0) {
            resultsDiv.innerHTML = '<p>No se encontraron resultados. 😕</p>';
            return;
        }

        // Mapeo de valores del filtro a nombres de tiendas
        const storeMapping = {
            'steam': 'Steam',
            'epic': 'Epic Games',
            'humble': 'Humble Bundle'
        };

        // Aplicar filtros
        const filteredResults = results.filter(result => {
            const price = parseFloat(result.price.finalPrice.replace('$', ''));

            // Filtro de precios (múltiples rangos)
            const meetsPriceRange = priceRanges.length === 0 || priceRanges.some(range => {
                if (range === '100+') return price >= 100;
                const [minPrice, maxPrice] = range.split('-').map(Number);
                return price >= minPrice && price <= maxPrice;
            });

            // Filtro de tiendas (múltiples selecciones)
            const meetsStore = stores.length === 0 || stores.includes('all') || stores.some(store => {
                return result.store === storeMapping[store];
            });

            return meetsPriceRange && meetsStore;
        });

        if (filteredResults.length === 0) {
            resultsDiv.innerHTML = '<p>No se encontraron resultados con los filtros seleccionados. 😕</p>';
            return;
        }

        // Agrupar resultados por tienda
        const groupedResults = filteredResults.reduce((acc, result) => {
            if (!acc[result.store]) {
                acc[result.store] = [];
            }
            if (acc[result.store].length < 10) { // Limitar a 10 juegos por tienda
                acc[result.store].push(result);
            }
            return acc;
        }, {});

        // Mostrar los resultados en bloques por tienda
        for (const store in groupedResults) {
            const storeResults = groupedResults[store];

            const storeBlock = document.createElement('div');
            storeBlock.className = 'store-block';

            const storeHeader = document.createElement('h2');
            storeHeader.textContent = store;
            storeBlock.appendChild(storeHeader);

            storeResults.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.className = 'result-item';
                resultElement.innerHTML = `
                    <h3>${result.title}</h3>
                    ${result.price.originalPrice !== 'No disponible' ? `<p>Precio original: <del>${result.price.originalPrice}</del></p>` : ''}
                    <p>Precio final: ${result.price.finalPrice}</p>
                    <a href="${result.url}" target="_blank">Comprar</a>
                `;
                storeBlock.appendChild(resultElement);
            });
            resultsDiv.appendChild(storeBlock);
        }

        // Mostrar el panel flotante
        document.querySelector('.results-panel').classList.add('active');
        document.querySelector('.overlay').classList.add('active');
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error al buscar el videojuego. 😢</p>';
        console.error(error);
    }
});

// Cerrar el panel flotante
document.querySelector('.close-panel').addEventListener('click', () => {
    document.querySelector('.results-panel').classList.remove('active');
    document.querySelector('.overlay').classList.remove('active');
});
