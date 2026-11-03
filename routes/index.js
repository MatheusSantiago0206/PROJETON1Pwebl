var express = require('express');
var router = express.Router();
var db = require('../database/sqlite');

// Mapeamento dos níveis para exibição
const NIVEIS = {
  'iniciante': 'Iniciante',
  'iniciante-avancado': 'Iniciante Avançado',
  'intermediario': 'Intermediário',
  'intermediario-avancado': 'Intermediário Avançado',
  'profissional': 'Profissional / Mestre'
};

/* GET Página Inicial (Home) */
router.get('/', function(req, res) {
  db.all("SELECT * FROM guitarras", [], (err, rows) => {
    // Garante que 'guitarras' é sempre enviado, mesmo se houver erro ou estiver vazio
    res.render('index', { 
      title: 'GuitarGuide - Home', 
      guitarras: rows || [] 
    });
  });
});

/* GET Lista de Níveis */
router.get('/niveis', function(req, res) {
  res.render('niveis', { 
    title: 'Níveis de Guitarras', 
    niveis: NIVEIS 
  });
});

/* GET Guitarras por Nível Específico */
router.get('/niveis/:nivelId', function(req, res) {
  const nivel = req.params.nivelId;
  db.all("SELECT * FROM guitarras WHERE nivel = ?", [nivel], (err, rows) => {
    res.render('guitarras_nivel', { 
      title: `Guitarras - ${NIVEIS[nivel] || nivel}`, 
      guitarras: rows || [], 
      nomeNivel: NIVEIS[nivel] || nivel 
    });
  });
});

/* GET Todas as Guitarras */
router.get('/guitarras', function(req, res) {
  db.all("SELECT * FROM guitarras", [], (err, rows) => {
    res.render('guitarras', { 
      title: 'Todas as Guitarras', 
      guitarras: rows || [] 
    });
  });
});

module.exports = router;