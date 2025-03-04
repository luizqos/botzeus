const express = require("express");

const healthRouter = require("./routes/health");
const usersRouter = require("./routes/user");

const router = express.Router();

// Definição das rotas
router.use("/api/health", healthRouter);
router.use("/api/users", usersRouter);

module.exports = router;
