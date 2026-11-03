const initSqlJs = require('sql.js');

let dbInstance = null;

// Inicializa o SQLite em WebAssembly (compatível com o navegador)
initSqlJs().then((SQL) => {
  dbInstance = new SQL.Database();
  
  // Criação da tabela guitarras com as colunas adicionais para o blog
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS guitarras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      preco REAL,
      nivel TEXT,
      descricao TEXT,
      imagem TEXT
    );
  `);

  // Popula o banco com guitarras de cada nível de experiência
  const check = dbInstance.exec("SELECT COUNT(*) as count FROM guitarras");
  if (check.length > 0 && check[0].values[0][0] === 0) {
    dbInstance.run(`
      INSERT INTO guitarras (nome, preco, nivel, descricao, imagem) VALUES 
      ('Tagima TG-530', 950.00, 'iniciante', 'Excelente custo-benefício estilo Stratocaster para quem está começando.', 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=400'),
      ('Squier Bullet Strat', 1800.00, 'iniciante-avancado', 'Qualidade Fender com preço acessível e boa tocabilidade.', 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400'),
      ('Epiphone Les Paul Standard', 4200.00, 'intermediario', 'Corpo encorpado e captadores Humbucker ideais para Rock e Blues.', 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400'),
      ('Fender Player Stratocaster', 7500.00, 'intermediario-avancado', 'Guitarra versátil, acabamento profissional e timbre clássico.', 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=400'),
      ('Gibson Les Paul Custom', 25000.00, 'profissional', 'O topo de linha em sonoridade e acabamento para palcos e estúdios.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400');
    `);
  }

  console.log("Banco de dados ready no StackBlitz via sql.js!");
}).catch(err => {
  console.error("Erro ao carregar o sql.js:", err);
});

// Exporta as funções .all() e .run() simuladas para compatibilidade
module.exports = {
  all: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    if (!dbInstance) {
      return callback(new Error("O banco de dados ainda está a carregar..."), null);
    }

    try {
      const stmt = dbInstance.prepare(sql);
      if (Array.isArray(params) && params.length > 0) stmt.bind(params);
      
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      callback(null, results);
    } catch (err) {
      callback(err, null);
    }
  },

  run: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    if (!dbInstance) {
      if (callback) callback(new Error("O banco de dados ainda está a carregar..."));
      return;
    }

    try {
      dbInstance.run(sql, params);
      if (callback) callback(null);
    } catch (err) {
      if (callback) callback(err);
    }
  }
};