document.getElementById('game-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const gameName = document.getElementById('game-name').value;
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

        // Agrupar resultados por tienda
        const groupedResults = results.reduce((acc, result) => {
            if (!acc[result.store]) {
                acc[result.store] = [];
            }
            acc[result.store].push(result);
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
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error al buscar el videojuego. 😢</p>';
        console.error(error);
    }
});