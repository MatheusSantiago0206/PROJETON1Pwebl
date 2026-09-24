const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/guitarras.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS niveis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco_min REAL,
            preco_max REAL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS guitarras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            marca TEXT NOT NULL,
            preco REAL,
            tipo TEXT,
            descricao TEXT,
            nivel_id INTEGER,
            FOREIGN KEY (nivel_id) REFERENCES niveis(id)
        )
    `);

});

module.exports = db;