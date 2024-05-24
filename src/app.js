require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes');

const server = express();
server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Servir arquivos estáticos da pasta 'public'
server.use(express.static(path.join(__dirname, '../public')));

// Roteamento das APIs
server.use('/api', routes);
server.use('/data', routes);

// Rota para a página de consultas
server.use('/pgconsultas', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/consulta.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
