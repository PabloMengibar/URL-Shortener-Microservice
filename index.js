require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const shortid = require('shortid');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const originalUrls = {}; // Almacena las URLs originales
const shortUrls = {}; // Almacena las URLs acortadas

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Endpoint para acortar URLs
app.post('/api/shorturl', function(req, res) {
  const { url } = req.body;

  // Verifica si la URL es válida
  if (!validUrl.isUri(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Genera un ID corto único
  const shortId = shortid.generate();

  // Almacena la URL original y la URL corta en los objetos correspondientes
  originalUrls[shortId] = url;
  shortUrls[url] = shortId;

  // Retorna la URL original y la URL corta
  res.json({ original_url: url, short_url: shortId });
});

// Endpoint para redirigir a la URL original
app.get('/api/shorturl/:short_url', function(req, res) {
  const { short_url } = req.params;

  // Verifica si el ID corto existe
  if (!originalUrls.hasOwnProperty(short_url)) {
    return res.json({ error: 'invalid short url' });
  }

  // Obtiene la URL original y redirige al usuario
  const originalUrl = originalUrls[short_url];
  res.redirect(originalUrl);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
