const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const TransactionModel = require("../models/TransactionModel");

const index = async (req, res) => {
    const { yearMonth } = req.params;
    const transaction = await TransactionModel.find({ yearMonth: yearMonth }).sort({ day: "asc" });
    return res.json(transaction);
};

const indexOne = async (req, res) => {
    const { idLancamento } = req.params;
    const transaction = await TransactionModel.find({ _id: idLancamento });
    return res.json(transaction[0]);
};

const deleteOne = async (req, res) => {
    const { idLancamento } = req.params;
    const transaction = await TransactionModel.findByIdAndDelete({ _id: idLancamento });
    return res.json(transaction);
};

const updateOne = async (req, res) => {
    const { category, day, description, month, type, value, year, yearMonth, yearMonthDay, _id } = req.body;
    const obj = {
        category,
        day,
        description,
        month,
        type,
        value,
        year,
        yearMonth,
        yearMonthDay,
    };
    const lancamento = await TransactionModel.findByIdAndUpdate(_id, obj);
    return res.json(lancamento);
};

const save = async (req, res) => {
    const { category, day, description, month, type, value, year, yearMonth, yearMonthDay } = req.body;

    let transaction = new TransactionModel();

    transaction.category = category;
    transaction.day = day;
    transaction.description = description;
    transaction.month = month;
    transaction.type = type;
    transaction.value = value;
    transaction.year = year;
    transaction.yearMonth = yearMonth;
    transaction.yearMonthDay = yearMonthDay;

    const lancamento = await transaction.save();
    return res.json(lancamento);
};

module.exports = { index, indexOne, updateOne, deleteOne, save };
