const express = require('express');
const router = express.Router();

const ConsultaController = require('./controllers/ConsultaController');
const DataController = require('./controllers/DataController');

router.get('/consulta', ConsultaController.buscarTodas);
router.get('/consulta/:codigo', ConsultaController.buscarUma);
router.post('/consulta', ConsultaController.inserir);
router.put('/consulta/:codigo', ConsultaController.alterar);
router.delete('/consulta/:codigo', ConsultaController.excluir);
router.get('/:chave',DataController.dados);

module.exports = router;
