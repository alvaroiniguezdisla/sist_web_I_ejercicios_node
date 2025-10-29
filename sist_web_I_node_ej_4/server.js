// server.js
// ===============================================
// Ejercicio 4 - Web Scraping con Node.js
// - Crea un servidor HTTP
// - Descarga periódicamente HTML de webs
// - Procesa datos con cheerio
// - Guarda histórico en CSV
// ===============================================

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio'); // Librería para manipular HTML

// === CONFIGURACIÓN ===
const PORT = 3000;
const SCRAPE_INTERVAL_MS = 60000; // Cada 60 segundos
const URLS_FILE = path.join(__dirname, 'urls.txt');
const CSV_FILE = path.join(__dirname, 'data.csv');

// === Función auxiliar para decidir entre http o https ===
function getModule(url) {
  return url.startsWith('https') ? https : http;
}

// === Descargar el HTML de una URL ===
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const mod = getModule(url);
    mod.get(url, (resp) => {
      if (resp.statusCode >= 400) {
        reject(new Error(`Error ${resp.statusCode} en ${url}`));
        resp.resume();
        return;
      }
      let data = '';
      resp.on('data', (chunk) => (data += chunk));
      resp.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

// === Procesar el HTML para extraer datos específicos ===
function extractInfo(url, html) {
  const $ = cheerio.load(html);
  const title = ($('title').first().text() || '').trim();
  const h1 = ($('h1').first().text() || '').trim();
  const firstParagraph = ($('p').first().text() || '').replace(/\s+/g, ' ').trim();
  const links = $('a[href]').length;
  const images = $('img[src]').length;
  return { url, title, h1, firstParagraph, links, images };
}

// === Asegurar cabecera del CSV ===
function ensureCSVHeader() {
  if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(
      CSV_FILE,
      'timestamp;url;title;h1;first_paragraph;links;images\n',
      'utf8'
    );
  }
}

// === Guardar una fila en CSV ===
function appendToCSV(row) {
  const line = [
    new Date().toISOString(),
    row.url,
    row.title.replaceAll(';', ','),
    row.h1.replaceAll(';', ','),
    row.firstParagraph.replaceAll(';', ','),
    row.links,
    row.images
  ].join(';') + '\n';
  fs.appendFileSync(CSV_FILE, line, 'utf8');
}

// === Leer URLs del fichero ===
function readURLs() {
  if (!fs.existsSync(URLS_FILE)) return [];
  return fs
    .readFileSync(URLS_FILE, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

// === Scraping de todas las URLs ===
async function scrapeAll() {
  const urls = readURLs();
  if (urls.length === 0) {
    console.log('[SCRAPER] No hay URLs en urls.txt');
    return;
  }

  console.log(`[SCRAPER] Inicio ${new Date().toLocaleTimeString()}`);
  ensureCSVHeader();

  for (const url of urls) {
    try {
      const html = await fetchHTML(url);
      const info = extractInfo(url, html);
      appendToCSV(info);
      console.log(`[OK] ${url} → ${info.title}`);
      await new Promise((r) => setTimeout(r, 500)); // pequeña pausa
    } catch (err) {
      console.error(`[ERROR] ${url}: ${err.message}`);
      appendToCSV({ url, title: 'ERROR', h1: '', firstParagraph: '', links: 0, images: 0 });
    }
  }

  console.log(`[SCRAPER] Fin ${new Date().toLocaleTimeString()}`);
}

// === Convertir CSV a HTML (para visualizar) ===
function renderCSVasHTML(csv) {
  const [header, ...rows] = csv.trim().split('\n');
  const ths = header.split(';').map((h) => `<th>${h}</th>`).join('');
  const trs = rows
    .map((r) => {
      const tds = r.split(';').map((c) => `<td>${c}</td>`).join('');
      return `<tr>${tds}</tr>`;
    })
    .join('');

  return `
    <h1>Resultados de scraping</h1>
    <p>
      <a href="/scrape">Lanzar scraping manual</a> |
      Intervalo automático: ${SCRAPE_INTERVAL_MS / 1000}s
    </p>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead><tr>${ths}</tr></thead>
      <tbody>${trs}</tbody>
    </table>
  `;
}

// === Crear servidor HTTP ===
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (req.url.startsWith('/scrape')) {
    scrapeAll().then(() => {
      res.end('<h2>Scraping ejecutado. Vuelve a / para ver resultados.</h2>');
    });
    return;
  }

  if (!fs.existsSync(CSV_FILE)) {
    res.end('<h2>No hay datos aún. Ejecuta <code>npm run scrape:once</code></h2>');
    return;
  }

  const csv = fs.readFileSync(CSV_FILE, 'utf8');
  res.end(renderCSVasHTML(csv));
});

// === Arrancar servidor y scraping automático ===
server.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

if (process.argv.includes('--once')) {
  scrapeAll().then(() => process.exit(0));
} else {
  setInterval(scrapeAll, SCRAPE_INTERVAL_MS); // ejecuta cada minuto
  scrapeAll(); // primera pasada inmediata
}
