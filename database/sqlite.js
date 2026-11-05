const initSqlJs = require('sql.js');

let dbInstance = null;

initSqlJs().then(SQL => {
  dbInstance = new SQL.Database();
  
  // 1. Tabela de Guitarras (com likes/dislikes)
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS guitarras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      nivel TEXT NOT NULL,
      descricao TEXT NOT NULL,
      imagem TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      dislikes INTEGER DEFAULT 0
    );
  `);

  // 2. Tabela de Comentários
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS comentarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guitarra_id INTEGER NOT NULL,
      autor TEXT NOT NULL,
      texto TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      dislikes INTEGER DEFAULT 0,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (guitarra_id) REFERENCES guitarras(id)
    );
  `);

  dbInstance.run("DELETE FROM guitarras;");

  const guitarrasIniciais = [
    ['Tagima TG-530', 950.00, 'iniciante', 'Excelente opção para quem está a dar os primeiros passos. Corpo em Basswood e braço em Maple.', 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&auto=format&fit=crop', 12, 1],
    ['Squier Bullet Stratocaster', 1800.00, 'iniciante-avancado', 'Tonalidade clássica da Fender com ótimo custo-benefício para estudantes em evolução.', 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&auto=format&fit=crop', 25, 2],
    ['Epiphone Les Paul Standard 60s', 4200.00, 'intermediario', 'Corpo em Mogno com captadores ProBucker, proporcionando o som clássico do rock.', 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&auto=format&fit=crop', 40, 0],
    ['Ibanez RG550', 7900.00, 'intermediario-avancado', 'Ideal para estilos rápidos e solos precisos. Equipada com ponte Floyd Rose e braço Super Wizard.', 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&auto=format&fit=crop', 18, 3],
    ['Fender American Professional II', 14500.00, 'profissional', 'Padrão de indústria para músicos exigentes. Captadores V-Mod II e acabamento impecável.', 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&auto=format&fit=crop', 55, 1]
  ];

  guitarrasIniciais.forEach(guitarra => {
    dbInstance.run(
      "INSERT INTO guitarras (nome, preco, nivel, descricao, imagem, likes, dislikes) VALUES (?, ?, ?, ?, ?, ?, ?);",
      guitarra
    );
  });

  console.log("Banco de dados atualizado com comentários e curtidas!");
}).catch(err => {
  console.error("Erro no SQLite:", err);
});

module.exports = {
  all: (sql, params, callback) => {
    if (typeof params === 'function') { callback = params; params = []; }
    if (!dbInstance) return callback && callback(new Error("DB não pronto"));
    try {
      const stmt = dbInstance.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) results.push(stmt.getAsObject());
      stmt.free();
      if (callback) callback(null, results);
    } catch (err) { if (callback) callback(err, null); }
  },
  run: (sql, params, callback) => {
    if (typeof params === 'function') { callback = params; params = []; }
    if (!dbInstance) return callback && callback(new Error("DB não pronto"));
    try {
      dbInstance.run(sql, params);
      if (callback) callback(null);
    } catch (err) { if (callback) callback(err); }
  }
};