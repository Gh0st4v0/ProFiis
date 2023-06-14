const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("ProFiis:rows")) || []
    },

    set(rows) {
        localStorage.setItem("ProFiis:rows", JSON.stringify(rows))
    }
}

const Modal = {
    activateModal(){
        document
            .querySelector('.modal')
            .classList
            .remove('inactive')
    },

    closeModal(){
        document
            .querySelector('.modal')
            .classList
            .add('inactive')
    }
}

const DOM = {
    rowsContainer: document.querySelector('tbody'),

    finishRow(row, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLFinishedRow(row,index)
        tr.dataset.index = index

        DOM.rowsContainer.appendChild(tr)
    },

    innerHTMLFinishedRow(row,index) {
        const html = `
        <tr>
                            <td>${row.nomeFundo.toUpperCase()}</td>
                            <td>${row.numCotas}</td>
                            <td>${Utils.formatCurrency(row.cotacao)}</td>
                            <td>${Utils.formatCurrency(row.ultimoRendimento)}</td>
                            <td><img src="./Images/deleteIcon.png" alt="Editar Fundo" onclick="Row.remove(${index})"></td>
                        </tr>
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
        if (Row.total() > 0){
        value = Row.rendimentoTotal()/Row.total()
        document
            .getElementById('dividendYield')
            .innerHTML = Utils.formatPercentage(value)
        }
        else{
            document
            .getElementById('dividendYield')
            .innerHTML = "0,00%"
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
    },

    formatPercentage(value) {
        num = `${Number(value*100).toFixed(2)}%`;

        return num
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
            Modal.closeModal()
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
