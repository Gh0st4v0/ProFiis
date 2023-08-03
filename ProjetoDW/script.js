var DarkMode
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

        localStorage.setItem('dark-mode', 'dark')
    },

    lightMode() {
        document.getElementById("pagestyle").href = "./Styles/style.css"

        document.getElementById("upperOptions").innerHTML = 
        `
            <img onclick="PageStyles.darkMode()" src="./Images/moonIcon.png" alt="Modo claro">
            <img src="./Images/infoIcon.png" alt="Mais informações">
            <img src="./Images/userIcon.png" alt="Perfil do Usuário">
        `
        localStorage.setItem('dark-mode', 'light')
    },

    previousStyle(){
        if (localStorage.getItem('dark-mode')){
            darkMode = localStorage.getItem('dark-mode')
        } else{
            darkMode = 'light'
        }
        
        localStorage.setItem('dark-mode', darkMode)
        
        if (localStorage.getItem('dark-mode') == 'dark'){
            PageStyles.darkMode()
        } else{
            PageStyles.lightMode()
        }
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

const Calcula = {
    dislplayCotas(rows){
        text = rows.row.numCotas
        return text
    }
}

const Simula ={
    saldo: 0,
    aporteMensal: document.querySelector('#aporteMensal'),
    aporteEspecial: document.querySelector('#aporteEspecial'),
    periodoDeInvestimento: document.querySelector('#periodoDeInvestimento'),
    correcaoAporte: document.querySelector('#correcaoAporte'),
    frequenciaEspecial: document.querySelector('#frequenciaEspecial'),

    getValues(){
        return{
            aporteMensal: Simula.aporteMensal.value,
            aporteEspecial: Simula.aporteEspecial.value,
            periodoDeInvestimento: Simula.periodoDeInvestimento.value,
            correcaoAporte: Simula.correcaoAporte.value,
            frequenciaEspecial: Simula.frequenciaEspecial.value
        }
    },

    validateFields() {
        const { aporteMensal, aporteEspecial, periodoDeInvestimento, correcaoAporte, frequenciaEspecial} = Simula.getValues()
        if( aporteMensal.trim()          === "" || 
            aporteEspecial.trim()        === "" || 
            periodoDeInvestimento.trim() === "" ||
            correcaoAporte.trim()        === "" ||
            frequenciaEspecial.trim()    === "") {
                throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { aporteMensal, aporteEspecial, periodoDeInvestimento, correcaoAporte, frequenciaEspecial } = Simula.getValues()
        
        aporteMensal = Utils.formatAmount(aporteMensal)
        aporteEspecial = Utils.formatAmount(aporteEspecial)


        return {
            aporteMensal,
            aporteEspecial,
            periodoDeInvestimento,
            correcaoAporte,
            frequenciaEspecial
        }
    },

    clearFields() {
        Simula.aporteMensal.value = ""
        Simula.aporteEspecial.value = ""
        Simula.periodoDeInvestimento.value = ""
        Simula.correcaoAporte.value = ""
        Simula.frequenciaEspecial.value = ""
    },

    patrimonioTotal(rows){
        let total = 0;
        rows.forEach(row => {
            total += row.numCotas * row.cotacao;
        })
        return total;
    },

    patrimonioIndividual(row){
        return row.numCotas * row.cotacao
    },

    dividendoTotal(rows){
        let total = 0;
        rows.forEach(row => {
            total += row.numCotas * row.ultimoRendimento
        })
        return total;
    },

    valorAlvo(saldo, rows){
        if (rows.length == 0){
            throw new Error ("Por favor, adicione ao menos um fundo!")
        }
        else return saldo / rows.length
    },

    compensarDiferenca(valorIdeal, aporteComDividendos, row, denominador){
        var aporteDividido = aporteComDividendos/denominador
        var diferenca = valorIdeal - Simula.patrimonioIndividual(row)
        var valorDisponibilizado = aporteDividido + diferenca
        if (valorDisponibilizado <= 0) return 0
        else return valorDisponibilizado
    },
    activateModal(){
        document
            .querySelector('.modalSimula')
            .classList
            .remove('inactive')
    },

    closeModal(){
        document
            .querySelector('.modalSimula')
            .classList
            .add('inactive')
    },

    runSimulation(rows, simulation){

        //delcaração das variaveis 
        var periodoDeInvestimento = simulation.periodoDeInvestimento
        var aporteMensal = simulation.aporteMensal
        var aporteEspecial = simulation.aporteEspecial
        var correcaoAporte = simulation.correcaoAporte
        var frequenciaEspecial = simulation.frequenciaEspecial
        var saldoRestante = 0
        var totalInvestidoBolso = 0
        var totalInvestidoDividendos = 0

        //looping que faz a simulação de compra todos os meses
        for (i = 0; i < periodoDeInvestimento; i++){
            var valorIdeal = Simula.patrimonioTotal(rows)/rows.length
            var aporteComDividendos = aporteMensal+Simula.dividendoTotal(rows)
            var arrayDoMes = []
            var mediaDeInvestimentos = 0
            var denominador = 0
            var numerador = 0
            saldoRestante += aporteComDividendos
            totalInvestidoBolso += aporteMensal
            totalInvestidoDividendos += Simula.dividendoTotal(rows)
            if (i % frequenciaEspecial == 0 && i > 0){
                saldoRestante += aporteEspecial
                totalInvestidoBolso += aporteEspecial
            }
            var restoDaTransacao = 0

            for (j = 0; j < rows.length; j++){
                if (Simula.patrimonioIndividual(rows[j]) > valorIdeal+(saldoRestante/rows.length))
                    arrayDoMes[j] = false
                else arrayDoMes[j] = true
            }

            for(k = 0; k < rows.length; k++){
                if (arrayDoMes[k] == true){
                    denominador += 1
                    numerador += Simula.patrimonioIndividual(rows[k])
                    mediaDeInvestimentos = numerador/denominador
                }
            }
            console.log(numerador, denominador, mediaDeInvestimentos)
            console.log(arrayDoMes)

            //compra primaria
            for(l = 0; l < rows.length; l++){
                var row = rows[l]
                valorDisponibilizado = Simula.compensarDiferenca(mediaDeInvestimentos, saldoRestante, row, denominador)
                //console.log("valor disponibilizado para o",row.nomeFundo,":",Utils.formatCurrency(valorDisponibilizado), parseInt(valorDisponibilizado/row.cotacao),"cotas compradas")
                rows[l].numCotas += parseInt(valorDisponibilizado/row.cotacao)
                restoDaTransacao += valorDisponibilizado % row.cotacao
            }
            //fazer um bubblesort para saber os fundos mais distantes do valor alvo (para baixo), comprar na ordem residual dps
            for (var m = 0; m < rows.length; m++) {
                for (var n = 0; n < (rows.length - m - 1); n++) {
                    if (valorDisponibilizado % rows[n].cotacao > valorDisponibilizado % rows[n + 1].cotacao) {
                        var temp = rows[n]
                        rows[n] = rows[n + 1]
                        rows[n + 1] = temp
                    }
                }
            }
            for(o = 0; o < rows.length; o++){
                if(parseInt(restoDaTransacao/rows[o].cotacao) > 0){
                    rows[o].numCotas += parseInt(restoDaTransacao/rows[o].cotacao)
                    restoDaTransacao -= parseInt(restoDaTransacao/rows[o].cotacao)*rows[o].cotacao
                }
            }
            console.log("Sobra",Utils.formatCurrency(restoDaTransacao))
            console.log(rows)
            saldoRestante = restoDaTransacao
            restoDaTransacao = 0
            if (i % 12 == 0 && i > 0){
                aporteMensal += (aporteMensal*correcaoAporte)/100
            }
        }
        
        document.getElementById("simulaPatrimonio").innerHTML = Utils.formatCurrency(Simula.patrimonioTotal(rows))
        document.getElementById("simulaRendimento").innerHTML = Utils.formatCurrency(Simula.dividendoTotal(rows))
        document.getElementById("simulaTotalDividendos").innerHTML = Utils.formatCurrency(totalInvestidoDividendos)
        document.getElementById("simulaTotalInvestido").innerHTML = Utils.formatCurrency(totalInvestidoBolso)
    },

    submit(event) {
        event.preventDefault()

        try {
            var rows = JSON.parse(localStorage.getItem('ProFiis:rows'))
            Simula.validateFields()
            const simulation = Simula.formatValues()
            Simula.runSimulation(rows, simulation)
            Simula.clearFields()
            Simula.activateModal()
        } catch (error) {
            alert(error.message)
        }
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
        numCotas = Number(numCotas)


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
        PageStyles.previousStyle()
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

