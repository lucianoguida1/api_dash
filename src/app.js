require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes');
const corsOptions = {
    origin: '*', // Permitir apenas este domínio
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permitir apenas esses métodos
    allowedHeaders: ['Content-Type', 'Authorization'], // Permitir apenas esses cabeçalhos
    credentials: true // Se você precisar permitir credenciais (cookies, autorização)
};

const server = express();
server.use(cors(corsOptions));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Servir arquivos estáticos da pasta 'public'
server.use(express.static(path.join(__dirname, '../public')));

// Roteamento das APIs
server.use('/api', routes);

// Rota para a página de consultas
server.use('/pgconsultas', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/consulta.html'));
});
server.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/listarConsultas.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
