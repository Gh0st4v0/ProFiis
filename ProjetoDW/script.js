const DOM = {
    rowsContainer: document.querySelector('tbody'),

    addRow(index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLRow()
        tr.dataset.index = index

        DOM.rowsContainer.appendChild(tr)
    },

    innerHTMLRow() {
        const html = `
        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><img src="./Images/editIcon.png" alt="Editar Fundo"></td>
                        </tr>
        `
        return html
    },

    deleteAll(){
        let text = "Você tem certeza que deseja excluir todos os fundos?";
        if (confirm(text) == true) {
            DOM.rowsContainer.innerHTML = ""
        }
    }
}

