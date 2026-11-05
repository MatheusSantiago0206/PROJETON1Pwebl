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

/* GET Home (com busca) */
router.get('/', function(req, res) {
  const termoBusca = req.query.busca || '';
  let sql = "SELECT * FROM guitarras";
  let params = [];

  if (termoBusca) {
    sql += " WHERE nome LIKE ? OR descricao LIKE ?";
    params = [`%${termoBusca}%`, `%${termoBusca}%`];
  }

  db.all(sql, params, (err, rows) => {
    res.render('index', { 
      title: 'GuitarGuide - Home', 
      guitarras: rows || [],
      busca: termoBusca
    });
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

/* POST Like / Dislike na Guitarra (Post) */
router.post('/guitarra/:id/reacao', function(req, res) {
  const { id } = req.params;
  const { tipo } = req.body; // 'like' ou 'dislike'
  const campo = tipo === 'like' ? 'likes' : 'dislikes';

  db.run(`UPDATE guitarras SET ${campo} = ${campo} + 1 WHERE id = ?`, [id], () => {
    res.redirect('back');
  });
});

/* POST Adicionar Comentário */
router.post('/guitarra/:id/comentar', function(req, res) {
  const { id } = req.params;
  const { autor, texto } = req.body;

  if (autor && texto) {
    db.run("INSERT INTO comentarios (guitarra_id, autor, texto) VALUES (?, ?, ?)", [id, autor, texto], () => {
      res.redirect('back');
    });
  } else {
    res.redirect('back');
  }
});

/* POST Like / Dislike no Comentário */
router.post('/comentario/:id/reacao', function(req, res) {
  const { id } = req.params;
  const { tipo } = req.body;
  const campo = tipo === 'like' ? 'likes' : 'dislikes';

  db.run(`UPDATE comentarios SET ${campo} = ${campo} + 1 WHERE id = ?`, [id], () => {
    res.redirect('back');
  });
});

module.exports = router;