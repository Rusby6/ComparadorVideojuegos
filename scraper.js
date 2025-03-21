const puppeteer = require('puppeteer');

async function scrapeGamePrices(gameName) {
    let browser;
    try {
        console.log('Iniciando Puppeteer...');
        browser = await puppeteer.launch({ headless: true }); 
        const page = await browser.newPage();
        const results = [];

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        const stores = [
            {
                name: 'Epic Games',
                url: `https://store.epicgames.com/es-ES/browse?q=${encodeURIComponent(gameName)}&sortBy=relevancy&sortDir=DESC&count=40`,
                selector: '.css-1a6kj04',
                titleSelector: '.css-s98few',
                priceSelector: '.css-12s1vua',
                originalPriceSelector: '.css-4jky3p', 
            },
            {
                name: 'Steam',
                url: `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`,
                selector: '#search_resultsRows > a',
                titleSelector: '.title',
                priceSelector: '.discount_final_price',
                originalPriceSelector: '.discount_original_price',
            },
            {
                name: 'Humble Bundle',
                url: `https://www.humblebundle.com/store/search?sort=bestselling&search=${encodeURIComponent(gameName)}`,
                selector: '.js-entity',
                titleSelector: '.entity-title',
                priceSelector: '.price',
                originalPriceSelector: '.full-price', // Ajusta según sea necesario
            }
        ];

        for (const store of stores) {
            try {
                console.log(`Navegando a ${store.name}: ${store.url}`);
                await page.goto(store.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

                await page.waitForSelector(store.selector, { timeout: 10000 });

                // Extraer todos los resultados
                const games = await page.evaluate((store) => {
                    const gameElements = document.querySelectorAll(store.selector);
                    const games = [];

                    gameElements.forEach((element) => {
                        const title = element.querySelector(store.titleSelector)?.innerText.trim() || 'Título no disponible';
                        const priceElement = element.querySelector(store.priceSelector);
                        const price = priceElement ? priceElement.innerText.trim() : 'No disponible';
                        const originalPriceElement = element.querySelector(store.originalPriceSelector);
                        const originalPrice = originalPriceElement ? originalPriceElement.innerText.trim() : 'No disponible';
                        const url = element.href || store.url;

                        games.push({
                            title: title,
                            price: {
                                originalPrice: originalPrice,
                                finalPrice: price
                            },
                            url: url
                        });
                    });
                    return games;
                }, store);

                console.log(`Resultados encontrados en ${store.name}:`, games);

                // Agregar los resultados a la lista
                games.forEach(game => {
                    results.push({
                        store: store.name,
                        title: game.title,
                        price: game.price,
                        url: game.url
                    });
                });

            } catch (error) {
                console.error(`Error al scrapear ${store.name}:`, error.message);
            }
        }

        return results;
    } catch (error) {
        console.error('Error general:', error);
        return [];
    } finally {
        if (browser) {
            await browser.close();
            console.log('Navegador cerrado.');
        }
    }
}

module.exports = scrapeGamePrices;
