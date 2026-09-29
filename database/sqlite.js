const initSqlJs = require('sql.js');

let dbInstance = null;

// Inicializa o SQLite em WebAssembly (compatível com o navegador)
initSqlJs().then((SQL) => {
  dbInstance = new SQL.Database();
  
  // Criação da tabela guitarras e inserção de dados de teste
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS guitarras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      preco REAL
    );
  `);

  // Opcional: insere um dado de teste se a tabela estiver vazia
  const check = dbInstance.exec("SELECT COUNT(*) as count FROM guitarras");
  if (check.length > 0 && check[0].values[0][0] === 0) {
    dbInstance.run("INSERT INTO guitarras (nome, preco) VALUES ('Fender Stratocaster', 4500.00)");
  }

  console.log("Banco de dados ready no StackBlitz via sql.js!");
}).catch(err => {
  console.error("Erro ao carregar o sql.js:", err);
});

// Exporta as funções .all() e .run() simuladas para compatibilidade
module.exports = {
  all: (sql, params, callback) => {
    // Se a rota não passar 'params', ajusta os argumentos
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