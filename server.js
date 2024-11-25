const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path'); // Importar el módulo path

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/fetch-url', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required.' });
    }

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const metaTags = {};

        // Extraer el título de la página
        const title = $('title').text();
        if (title) {
            metaTags['title'] = title;
            console.log('Title:', title);
        }

        // Extraer la descripción de la página
        const description = $('meta[name="description"]').attr('content');
        if (description) {
            metaTags['description'] = description;
            console.log('Description:', description);
        }

        // Extraer etiquetas Open Graph
        $('meta[property^="og:"]').each((index, element) => {
            const property = $(element).attr('property');
            const content = $(element).attr('content');
            if (property && content) {
                metaTags[property] = content;
                console.log(`${property}:`, content);
            }
        });

        // Extraer etiquetas Twitter Card
        $('meta[name^="twitter:"]').each((index, element) => {
            const name = $(element).attr('name');
            const content = $(element).attr('content');
            if (name && content) {
                metaTags[name] = content;
                console.log(`${name}:`, content);
            }
        });

        // Extraer etiquetas de robots
        const robots = $('meta[name="robots"]').attr('content');
        if (robots) {
            metaTags['robots'] = robots;
            console.log('Robots:', robots);
        }
        const googlebot = $('meta[name="googlebot"]').attr('content');
        if (googlebot) {
            metaTags['googlebot'] = googlebot;
            console.log('Googlebot:', googlebot);
        }
        const bingbot = $('meta[name="bingbot"]').attr('content');
        if (bingbot) {
            metaTags['bingbot'] = bingbot;
            console.log('Bingbot:', bingbot);
        }

        // Extraer etiquetas de idioma
        const language = $('meta[name="language"]').attr('content');
        if (language) {
            metaTags['language'] = language;
            console.log('Language:', language);
        }
        const contentLanguage = $('meta[http-equiv="content-language"]').attr('content');
        if (contentLanguage) {
            metaTags['content-language'] = contentLanguage;
            console.log('Content-Language:', contentLanguage);
        }

        // Extraer etiquetas de autor
        const author = $('meta[name="author"]').attr('content');
        if (author) {
            metaTags['author'] = author;
            console.log('Author:', author);
        }

        // Extraer etiquetas de aplicación
        const appName = $('meta[name="application-name"]').attr('content');
        if (appName) {
            metaTags['application-name'] = appName;
            console.log('Application-Name:', appName);
        }
        const msTileImage = $('meta[name="msapplication-TileImage"]').attr('content');
        if (msTileImage) {
            metaTags['msapplication-TileImage'] = msTileImage;
            console.log('MSApplication-TileImage:', msTileImage);
        }
        const msTileColor = $('meta[name="msapplication-TileColor"]').attr('content');
        if (msTileColor) {
            metaTags['msapplication-TileColor'] = msTileColor;
            console.log('MSApplication-TileColor:', msTileColor);
        }

        // Extraer etiquetas de verificación
        const googleVerification = $('meta[name="google-site-verification"]').attr('content');
        if (googleVerification) {
            metaTags['google-site-verification'] = googleVerification;
            console.log('Google-Site-Verification:', googleVerification);
        }
        const yandexVerification = $('meta[name="yandex-verification"]').attr('content');
        if (yandexVerification) {
            metaTags['yandex-verification'] = yandexVerification;
            console.log('Yandex-Verification:', yandexVerification);
        }
        const msvalidate = $('meta[name="msvalidate.01"]').attr('content');
        if (msvalidate) {
            metaTags['msvalidate.01'] = msvalidate;
            console.log('MSValidate.01:', msvalidate);
        }
        const alexaVerifyID = $('meta[name="alexaVerifyID"]').attr('content');
        if (alexaVerifyID) {
            metaTags['alexaVerifyID'] = alexaVerifyID;
            console.log('AlexaVerifyID:', alexaVerifyID);
        }

        // Extraer etiquetas de vista
        const viewport = $('meta[name="viewport"]').attr('content');
        if (viewport) {
            metaTags['viewport'] = viewport;
            console.log('Viewport:', viewport);
        }

        // Extraer etiquetas de generador
        const generator = $('meta[name="generator"]').attr('content');
        if (generator) {
            metaTags['generator'] = generator;
            console.log('Generator:', generator);
        }

        // Extraer íconos
        const icons = findIcons($);
        metaTags['icons'] = icons;
        console.log('Icons:', icons);

        res.json({ metaTags });
    } catch (error) {
        console.error('Error fetching URL:', error);
        res.status(500).json({ error: error.message });
    }
});

function ensureHttps(url) {
    if (!url) return url; // Retorna la URL si es nula o indefinida.

    // Si la URL comienza con "//", agregar "https:" al principio.
    if (url.startsWith("//")) {
        return "https:" + url;
    }

    // Si la URL ya comienza con "https://", retornarla sin cambios.
    if (url.startsWith("https://")) {
        return url;
    }

    // Si la URL comienza con "http://", reemplazar "http" por "https".
    if (url.startsWith("http://")) {
        return url.replace("http://", "https://");
    }

    // Si la URL no comienza con ningún protocolo, asumir "https://" como predeterminado.
    return "https://" + url;
}

function findIcons($) {
    let icons = {};

    $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').each((index, elem) => {
        const rel = $(elem).attr('rel');
        let href = $(elem).attr('href');

        href = ensureHttps(href); // Asegurar que la URL tenga el prefijo "https://"

        icons[rel] = href; // Agregamos el ícono al objeto icons
    });

    // Buscar msapplication-TileImage como parte de los íconos
    const msTileImage = $('meta[name="msapplication-TileImage"]').attr('content');
    if (msTileImage) {
        icons['msapplication-TileImage'] = ensureHttps(msTileImage); // Asegurar que la URL tenga el prefijo "https://"
    }

    return icons;
}

// Servir la página HTML y el archivo JavaScript
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});