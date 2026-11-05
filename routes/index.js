var express = require('express');
var router = express.Router();
var db = require('../database/sqlite');

const NIVEIS = {
  'iniciante': 'Iniciante',
  'iniciante-avancado': 'Iniciante Avançado',
  'intermediario': 'Intermediário',
  'intermediario-avancado': 'Intermediário Avançado',
  'profissional': 'Profissional / Mestre'
};

/* GET Home */
router.get('/', function(req, res) {
  db.all("SELECT * FROM guitarras", [], (err, rows) => {
    res.render('index', { 
      title: 'GuitarGuide - Home', 
      guitarras: rows || []
    });
  });
});

/* GET API de Busca de Guitarras (JSON) */
router.get('/api/guitarras/busca', function(req, res) {
  const termoBusca = req.query.q || '';
  let sql = "SELECT * FROM guitarras";
  let params = [];

  if (termoBusca) {
    sql += " WHERE nome LIKE ? OR descricao LIKE ?";
    params = [`%${termoBusca}%`, `%${termoBusca}%`];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar dados." });
    }
    res.json(rows || []);
  });
});

/* GET Lista de Níveis */
router.get('/niveis', function(req, res) {
  res.render('niveis', { title: 'Níveis de Guitarras', niveis: NIVEIS });
});

/* GET Guitarras por Nível */
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
    res.render('guitarras', { title: 'Todas as Guitarras', guitarras: rows || [] });
  });
});

/* POST Like / Dislike na Guitarra (via API) */
router.post('/guitarra/:id/reacao', function(req, res) {
  const { id } = req.params;
  const { tipo } = req.body;
  const campo = tipo === 'like' ? 'likes' : 'dislikes';

  db.run(`UPDATE guitarras SET ${campo} = ${campo} + 1 WHERE id = ?`, [id], (err) => {
    if (err) return res.status(500).json({ error: "Erro no banco" });
    
    db.all("SELECT likes, dislikes FROM guitarras WHERE id = ?", [id], (err, rows) => {
      res.json(rows[0] || { likes: 0, dislikes: 0 });
    });
  });
});

module.exports = router;