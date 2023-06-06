const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("ProFiis:rows")) || []
    },

    set(rows) {
        localStorage.setItem("ProFiis:rows", JSON.stringify(rows))
    }
}

const DOM = {
    rowsContainer: document.querySelector('tbody'),

    addRow() {
        DOM.rowsContainer.innerHTML += this.innerHTMLRow()
    },

    finishRow(row, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLFinishedRow(row)
        tr.dataset.index = index

        DOM.rowsContainer.appendChild(tr)
    },

    innerHTMLFinishedRow(row) {
        const html = `
        <tr>
                            <td>${row.nomeFundo.toUpperCase()}</td>
                            <td>${row.numCotas}</td>
                            <td>${Utils.formatCurrency(row.cotacao)}</td>
                            <td>${Utils.formatCurrency(row.ultimoRendimento)}</td>
                            <td><img src="./Images/editIcon.png" alt="Editar Fundo"></td>
                        </tr>
        `
        return html
    },

    innerHTMLRow() {
        const html = `
        <form action="" onsubmit="Form.submit(event)">
        <tr>
            <td><input id="nomeFundo"        type="text"       placeholder="NOME"></td>
            <td><input id="numCotas"         type="number"     placeholder="50"      step= "1"></td>
            <td><input id="cotacao"          type="number"     placeholder="10,99"   step= "0.01"></td>
            <td><input id="ultimoRendimento" type="number"     placeholder="0,12"    step= "0.01"></td>
            <div id="salvarDeletar">
                <td id="opcoesSalvarDeletar">
                    <button type="submit"><img src="./Images/saveIcon.png" alt="Salvar Alterações"></button>
                    <img onclick="DOM.deleteRow(this)" src="./Images/deleteIcon.png" alt="Deletar fundo">
                </td>
            </div>
        </tr>
         </form>
        `
        return html
    },

    deleteAll() {
        let text = "Você tem certeza que deseja excluir todos os fundos?";
        if (confirm(text) == true) {
            Row.all = []
        }
        App.reload()
    },

    deleteRow() {
        document.querySelector("form").innerHTML = ""
        App.reload()
    },


    updateBalance() {
        document
            .getElementById('patrimonioTotal')
            .innerHTML = Utils.formatCurrency(Row.total())
        document
            .getElementById('rendimentoDoMes')
            .innerHTML = Utils.formatCurrency(Row.rendimentoTotal())
        if (Row.total > 0){
            document
            .getElementById('dividendYield')
            .innerHTML = `${(Row.rendimentoTotal() / Row.total() * 100).toFixed(2).toString().replace(".",",")} %`
        }
    },

    clearRows() {
        DOM.rowsContainer.innerHTML = ""
    }

}

const Row = {
    all: Storage.get(),

    add(row){
        Row.all.push(row)

        App.reload()
    },

    remove(index) {
        Row.all.splice(index, 1)

        App.reload()
    },

    total() {
        let total = 0;
        Row.all.forEach(row => {
            total += row.numCotas * row.cotacao;
        })
        return total;
    },

    rendimentoTotal(){
        let total = 0;
        Row.all.forEach(row => {
            total += row.numCotas * row.ultimoRendimento;
        })
        return total;
    }
}

const PageStyles = {
    darkMode() {
        document.getElementById("pagestyle").href = "./Styles/darkStyle.css"

        document.getElementById("upperOptions").innerHTML = 
        `
            <img onclick="PageStyles.lightMode()" src="./Images/sunIcon.png" alt="Modo claro">
            <img src="./Images/infoIcon.png" alt="Mais informações">
            <img src="./Images/userIcon.png" alt="Perfil do Usuário">
        `
    },

    lightMode() {
        document.getElementById("pagestyle").href = "./Styles/style.css"

        document.getElementById("upperOptions").innerHTML = 
        `
            <img onclick="PageStyles.darkMode()" src="./Images/moonIcon.png" alt="Modo claro">
            <img src="./Images/infoIcon.png" alt="Mais informações">
            <img src="./Images/userIcon.png" alt="Perfil do Usuário">
        `
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        
        return value
    },

    formatCurrency(value) {
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

       return value
    }
}

const Form = {
    nomeFundo: document.querySelector('#nomeFundo'),
    numCotas: document.querySelector('#numCotas'),
    cotacao: document.querySelector('#cotacao'),
    ultimoRendimento: document.querySelector('#ultimoRendimento'),

    getValues(){
        return{
            nomeFundo: Form.nomeFundo.value,
            numCotas: Form.numCotas.value,
            cotacao: Form.cotacao.value,
            ultimoRendimento: Form.ultimoRendimento.value
        }
    },

    validateFields() {
        const { nomeFundo, numCotas, cotacao, ultimoRendimento } = Form.getValues()
        if( nomeFundo.trim() === "" || 
            numCotas.trim() === "" || 
            cotacao.trim() === "" ||
            ultimoRendimento.trim() === "") {
                throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { nomeFundo, numCotas, cotacao, ultimoRendimento } = Form.getValues()
        
        cotacao = Utils.formatAmount(cotacao)
        ultimoRendimento = Utils.formatAmount(ultimoRendimento)


        return {
            nomeFundo, 
            numCotas, 
            cotacao, 
            ultimoRendimento
        }
    },

    clearFields() {
        Form.nomeFundo.value = ""
        Form.numCotas.value = ""
        Form.cotacao.value = ""
        Form.ultimoRendimento.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const row = Form.formatValues()
            Row.add(row)
            Form.clearFields()
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        Row.all.forEach(DOM.finishRow)
        
        DOM.updateBalance()

        Storage.set(Row.all)
    },
    reload() {
        DOM.clearRows()
        App.init()
    },
}

App.init()
