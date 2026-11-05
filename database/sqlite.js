const initSqlJs = require('sql.js');

let dbInstance = null;

// Inicializa a base de dados em memória via sql.js
initSqlJs().then(SQL => {
  dbInstance = new SQL.Database();
  
  // Criar tabela de guitarras
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS guitarras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      nivel TEXT NOT NULL,
      descricao TEXT NOT NULL,
      imagem TEXT NOT NULL
    );
  `);

  // Limpar dados anteriores para evitar duplicações
  dbInstance.run("DELETE FROM guitarras;");

  // Inserir guitarras de exemplo para popular o catálogo
  const guitarrasIniciais = [
    [
      'Tagima TG-530', 
      950.00, 
      'iniciante', 
      'Excelente opção para quem está a dar os primeiros passos. Corpo em Basswood e braço em Maple.', 
      'https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&auto=format&fit=crop'
    ],
    [
      'Squier Bullet Stratocaster', 
      1800.00, 
      'iniciante-avancado', 
      'Tonalidade clássica da Fender com ótimo custo-benefício para estudantes em evolução.', 
      'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&auto=format&fit=crop'
    ],
    [
      'Epiphone Les Paul Standard 60s', 
      4200.00, 
      'intermediario', 
      'Corpo em Mogno com captadores ProBucker, proporcionando o som clássico do rock.', 
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&auto=format&fit=crop'
    ],
    [
      'Ibanez RG550', 
      7900.00, 
      'intermediario-avancado', 
      'Ideal para estilos rápidos e solos precisos. Equipada com ponte Floyd Rose e braço Super Wizard.', 
      'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&auto=format&fit=crop'
    ],
    [
      'Fender American Professional II', 
      14500.00, 
      'profissional', 
      'Padrão de indústria para músicos exigentes. Captadores V-Mod II e acabamento impecável.', 
      'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&auto=format&fit=crop'
    ]
  ];

  guitarrasIniciais.forEach(guitarra => {
    dbInstance.run(
      "INSERT INTO guitarras (nome, preco, nivel, descricao, imagem) VALUES (?, ?, ?, ?, ?);",
      guitarra
    );
  });

  console.log("Banco de dados SQLite populado com sucesso!");
}).catch(err => {
  console.error("Erro ao inicializar o banco de dados:", err);
});

// Wrapper para simular o comportamento de callbacks do sqlite3 no Node.js
module.exports = {
  all: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    if (!dbInstance) {
      if (callback) callback(new Error("Banco de dados ainda a carregar..."));
      return;
    }

    try {
      const stmt = dbInstance.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      if (callback) callback(null, results);
    } catch (err) {
      if (callback) callback(err, null);
    }
  },

  run: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    if (!dbInstance) {
      if (callback) callback(new Error("Banco de dados ainda a carregar..."));
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
