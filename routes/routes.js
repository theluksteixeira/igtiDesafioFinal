const express = require("express");
const transactionRouter = express.Router();
const Service = require("../services/transactionService.js");

transactionRouter.get("/:yearMonth", Service.index);
transactionRouter.get("/lancamento/:idLancamento", Service.indexOne);
transactionRouter.put("/lancamento", Service.updateOne);
transactionRouter.delete("/lancamento/:idLancamento", Service.deleteOne);
transactionRouter.post("/lancamento", Service.save);

module.exports = transactionRouter;
