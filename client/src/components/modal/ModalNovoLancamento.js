import React from "react";
import Modal from "react-modal";
import api from "../../services/api";
import moment from "moment";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

export default function ModalNovoLancamento({ isOpen, handleFecharModal, id, reloadAll, dataSelecionada }) {
    const [lancamento, setLancamento] = React.useState({});
    const [tipo, setTipo] = React.useState("");
    const [descricao, setDescricao] = React.useState("");
    const [categoria, setCategoria] = React.useState("");
    const [valor, setValor] = React.useState("");
    const [data, setData] = React.useState(moment().format("DD-MM-YYYY"));

    function afterOpenModal() {}

    function closeModal() {
        document.querySelector("#novoLancamento").style.display = "inline";
        document.querySelector("#previous").style.display = "inline";
        document.querySelector("#next").style.display = "inline";
        handleFecharModal(false);
    }

    React.useEffect(() => {
        if (id && id !== 0) {
            const retornarLancamento = async () => {
                const objLancamento = await api({
                    method: "get",
                    url: `api/transaction/lancamento/${id}`,
                });
                setTipo(objLancamento.data.type);
                setDescricao(objLancamento.data.description);
                setCategoria(objLancamento.data.category);
                setValor(objLancamento.data.value);
                setData(moment(objLancamento.data.yearMonthDay).format("DD-MM-YYYY"));
                setLancamento(objLancamento.data);
            };
            retornarLancamento();
        } else {
            setTipo("");
            setDescricao("");
            setCategoria("");
            setValor("");
            setData(moment().format("DD-MM-YYYY"));
        }
    }, [id]);

    const handleInputTipo = (e) => {
        setTipo(e.target.value);
    };
    const handleInputDescricao = (e) => {
        console.log("adsfsdfsd");
        setDescricao(e.target.value);
    };
    const handleInputCategoria = (e) => {
        setCategoria(e.target.value);
    };
    const handleInputValor = (e) => {
        setValor(e.target.value);
    };
    const handleInputData = (e) => {
        setData(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newData = data.split("-");

        const obj = {
            category: categoria,
            day: parseInt(newData[0]),
            description: descricao,
            month: parseInt(newData[1]),
            type: tipo,
            value: parseInt(valor),
            year: parseInt(newData[2]),
            yearMonth: newData[2] + "-" + newData[1],
            yearMonthDay: newData[2] + "-" + newData[1] + "-" + newData[0],
            _id: id,
        };

        if (id === 0) {
            try {
                await api({
                    method: "post",
                    data: obj,
                    url: `api/transaction/lancamento`,
                });
                alert("Lançamento salvo com Sucesso!");
                reloadAll(dataSelecionada);
                closeModal();
            } catch (error) {
                alert(error);
            }
        } else {
            try {
                await api({
                    method: "put",
                    data: obj,
                    url: `api/transaction/lancamento`,
                });
                alert("Alterado com Sucesso!");
                reloadAll(dataSelecionada);
                closeModal();
            } catch (error) {
                alert(error);
            }
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Example Modal"
        >
            <div style={{ width: "700px" }}>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col s10">
                            <h4>{id === 0 ? "Inclusão de lançamento" : "Alteração de lançamento"}</h4>
                        </div>
                        <div className="col s2" style={{ marginTop: "24px", textAlign: "right" }}>
                            <button className="waves-effect waves-light btn-small red" onClick={closeModal}>
                                X
                            </button>
                        </div>
                    </div>
                    <fieldset style={{ border: "1px solid #ccc", padding: "10px" }}>
                        <div className="row">
                            <div className="col s6 right-align">
                                <label>
                                    <input
                                        onChange={handleInputTipo}
                                        name="tipo"
                                        type="radio"
                                        value="-"
                                        checked={tipo === "-"}
                                    />
                                    <span style={{ color: "red", fontWeight: "bold" }}>Despesa</span>
                                </label>
                            </div>
                            <div className="col s6 left-align">
                                <label>
                                    <input
                                        name="tipo"
                                        onChange={handleInputTipo}
                                        type="radio"
                                        value="+"
                                        checked={tipo === "+"}
                                    />
                                    <span style={{ color: "green", fontWeight: "bold" }}>Receita</span>
                                </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <input
                                    value={descricao}
                                    onChange={handleInputDescricao}
                                    id="descricao"
                                    type="text"
                                    className="validate"
                                />
                                <label className="active" htmlFor="descricao">
                                    Descrição
                                </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <input
                                    value={categoria}
                                    onChange={handleInputCategoria}
                                    id="categoria"
                                    type="text"
                                    className="validate"
                                />
                                <label className="active" htmlFor="categoria">
                                    Categoria
                                </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s6">
                                <input
                                    id="valor"
                                    value={valor}
                                    onChange={handleInputValor}
                                    type="text"
                                    className="validate"
                                />
                                <label className="active" htmlFor="valor">
                                    Valor
                                </label>
                            </div>

                            <div className="input-field col s6">
                                <input
                                    value={data}
                                    onChange={handleInputData}
                                    id="data"
                                    type="text"
                                    className="validate"
                                />
                                <label className="active" htmlFor="data">
                                    Data
                                </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12 right-align">
                                <button className="waves-effect waves-light btn">
                                    {id === 0 ? "Salvar" : "Alterar"}
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </Modal>
    );
}
