const express = require("express");

const router = express.Router();

const db = require("../database/sqlite");

router.get("/", (req, res) => {

    db.all("SELECT * FROM guitarras", [], (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: erro.message
            });
        }

        res.json(resultados);
    });

});

module.exports = router;