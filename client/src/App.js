import React from "react";
import moment from "moment";
import ModalNovoLancamento from "./components/modal/ModalNovoLancamento";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import api from "./services/api";

export default function App() {
    const [filter, setFilter] = React.useState("2019-01");
    const [open, setOpen] = React.useState(false);
    const [transactions, setTransactions] = React.useState([]);
    const [transactionOriginal, setTransactionOriginal] = React.useState([]);
    const [totalLancamento, setTotalLancamento] = React.useState(0);
    const [receita, setReceita] = React.useState("0,00");
    const [despesa, setDespesa] = React.useState("0,00");
    const [saldo, setSaldo] = React.useState("0,00");
    const [idLancamento, setIdLancamento] = React.useState(0);

    React.useEffect(() => {
        const retornarTransaction = async () => {
            reloadAll(filter);
        };
        retornarTransaction();
    }, []);

    const convertNumberToMonthName = (numMes) => {
        switch (numMes) {
            case 1:
                return "Jan";
            case 2:
                return "Fev";
            case 3:
                return "Mar";
            case 4:
                return "Abr";
            case 5:
                return "Mai";
            case 6:
                return "Jun";
            case 7:
                return "Jul";
            case 8:
                return "Ago";
            case 9:
                return "Set";
            case 10:
                return "Out";
            case 11:
                return "Nov";
            case 12:
                return "Dez";
            default:
                return "";
        }
    };

    let arrayAnoMes = [];
    const listMesAno = () => {
        for (let ano = 2019; ano <= 2021; ano++) {
            for (let mes = 1; mes <= 12; mes++) {
                const newMes = convertNumberToMonthName(mes);
                arrayAnoMes.push({
                    label: `${newMes}-${ano}`,
                    value: `${ano}-${mes < 10 ? "0" + mes : mes}`,
                });
            }
        }
    };
    listMesAno();

    const handleNextMonth = (e) => {
        if (document.querySelector("#comboMesAno").value === "2021-12") {
            e.target.disabled = true;
        } else {
            setFilter(moment(document.querySelector("#comboMesAno").value).add(1, "month").format("YYYY-MM"));
            reloadAll(moment(document.querySelector("#comboMesAno").value).add(1, "month").format("YYYY-MM"));
            document.querySelector("#previous").disabled = false;
        }
    };

    const handlePreviousMonth = (e) => {
        if (document.querySelector("#comboMesAno").value === "2019-01") {
            e.target.disabled = true;
        } else {
            setFilter(moment(document.querySelector("#comboMesAno").value).subtract(1, "month").format("YYYY-MM"));
            reloadAll(moment(document.querySelector("#comboMesAno").value).subtract(1, "month").format("YYYY-MM"));
            document.querySelector("#next").disabled = false;
        }
    };

    const reloadAll = async (filter) => {
        const listTransaction = await api({
            method: "get",
            url: `api/transaction/${filter}`,
        });

        setTotalLancamento(listTransaction.data.length);
        setTransactions(listTransaction.data);
        setTransactionOriginal(listTransaction.data);

        const totalReceita = listTransaction.data
            .filter((transaction) => transaction.type === "+")
            .reduce((a, b) => {
                return a + b.value;
            }, 0);
        setReceita(
            Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(totalReceita)
        );

        const totalDespesas = listTransaction.data
            .filter((transaction) => transaction.type === "-")
            .reduce((a, b) => {
                return a + b.value;
            }, 0);
        setDespesa(
            Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(totalDespesas)
        );

        setSaldo(
            Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalReceita - totalDespesas)
        );
    };

    const handleSelect = async (e) => {
        e.preventDefault();
        setFilter(e.target.value);

        reloadAll(e.target.value);
        document.querySelector("#previous").disabled = false;
        document.querySelector("#next").disabled = false;
    };

    const esconderBotoes = () => {
        document.querySelector("#novoLancamento").style.display = "none";
        document.querySelector("#previous").style.display = "none";
        document.querySelector("#next").style.display = "none";
    };

    const handleNovoLancamento = () => {
        esconderBotoes();
        setIdLancamento(0);
        setOpen(true);
    };

    const handleFecharModal = (flag) => {
        setOpen(flag);
    };

    const handleEditar = (id) => {
        esconderBotoes();
        setOpen(true);
        setIdLancamento(id);
    };

    const handleExluir = async (id) => {
        try {
            await api({
                method: "delete",
                url: `api/transaction/lancamento/${id}`,
            });
            alert("Registro removido com Sucesso!");
            reloadAll(document.querySelector("#comboMesAno").value);
        } catch (error) {
            alert(error);
        }
    };

    const handleFilter = (e) => {
        if (e.target.value != "") {
            const newTransactions = transactionOriginal.filter((transaction) => {
                return e.target.value === transaction.description;
            });
            setTransactions(newTransactions);
        } else {
            setTransactions(transactionOriginal);
        }
    };

    return (
        <div className="container">
            <h1 className="center-align">Controle financeiro Pessoal</h1>
            <div className="row">
                <div className="col s4 right-align">
                    <input
                        onClick={handlePreviousMonth}
                        className="waves-effect waves-light btn"
                        type="button"
                        value="<"
                        id="previous"
                    />
                </div>
                <div className="col s4">
                    <select id="comboMesAno" value={filter} onChange={handleSelect} className="browser-default">
                        {arrayAnoMes.map((mesAno, index) => {
                            return (
                                <option key={index} value={mesAno.value}>
                                    {mesAno.label}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="col s4 left-align">
                    <input
                        className="waves-effect waves-light btn"
                        type="button"
                        value=">"
                        onClick={handleNextMonth}
                        id="next"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col s3">Lançamentos: {totalLancamento}</div>
                <div className="col s3">Receitas: {receita}</div>
                <div className="col s3">Despesas: {despesa}</div>
                <div className="col s3">Saldo: {saldo}</div>
            </div>
            <div className="row">
                <div className="col s3">
                    <input
                        id="novoLancamento"
                        onClick={handleNovoLancamento}
                        className="waves-effect waves-light btn"
                        type="button"
                        value="+ NOVO LANÇAMENTO"
                    />
                </div>
                <div className="col s9">
                    <input id="inputFilter" onChange={handleFilter} type="text" placeholder="filter" />
                </div>
            </div>
            <div className="row">
                <div className="col s12">
                    <table>
                        <tbody>
                            {transactions.map((transaction, index) => {
                                const color = transaction.type === "-" ? "pink" : "#9fd9d3";
                                return (
                                    <tr key={index} style={{ backgroundColor: color }}>
                                        <td> {transaction.day}</td>
                                        <td>
                                            <b> {transaction.category}</b> <br />
                                            <span>{transaction.description}</span>
                                        </td>
                                        <td>
                                            {Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(transaction.value)}
                                        </td>
                                        <td>
                                            <button onClick={() => handleEditar(transaction._id)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleExluir(transaction._id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <ModalNovoLancamento
                isOpen={open}
                reloadAll={reloadAll}
                dataSelecionada={filter}
                id={idLancamento}
                handleFecharModal={handleFecharModal}
            />
        </div>
    );
}
