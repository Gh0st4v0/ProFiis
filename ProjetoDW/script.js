

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
            <td><input class="nomeFundo"        type="text"     placeholder="NOME"></td>
            <td><input class="numCotas"         type="number"   placeholder="50"></td>
            <td><input class="cotacao"          type="text"     placeholder="10,99"></td>
            <td><input class="ultimoRendimento" type="text"     placeholder="0,12"></td>
            <div id="salvarDeletar">
                <td id="opcoesSalvarDeletar">
                    <img src="./Images/saveIcon.png" alt="Salvar Alterações">
                    <img onclick="DOM.deleteRow(this)" src="./Images/deleteIcon.png" alt="Deletar fundo">
                </td>
            </div>
        </tr>
        `
        return html
    },

    deleteAll() {
        let text = "Você tem certeza que deseja excluir todos os fundos?";
        if (confirm(text) == true) {
            DOM.rowsContainer.innerHTML = ""
        }
    },

    deleteRow(btn) {
        var row = btn.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }
}

const PageStyles = {
    darkMode() {
        document.getElementById("headOfPage").innerHTML =
            `
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ProFiis</title>
        <link id="pagestyle" rel="stylesheet" href="./Styles/darkStyle.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,500;1,600&display=swap"
        rel="stylesheet">
        `

        document.getElementById("upperOptions").innerHTML = 
        `
            <img onclick="PageStyles.lightMode()" src="./Images/sunIcon.png" alt="Modo claro">
            <img src="./Images/infoIcon.png" alt="Mais informações">
            <img src="./Images/userIcon.png" alt="Perfil do Usuário">
        `
    },

    lightMode() {
        document.getElementById("headOfPage").innerHTML =
            `
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ProFiis</title>
        <link id="pagestyle" rel="stylesheet" href="./Styles/style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,500;1,600&display=swap"
        rel="stylesheet">
        `

        document.getElementById("upperOptions").innerHTML = 
        `
            <img onclick="PageStyles.darkMode()" src="./Images/moonIcon.png" alt="Modo claro">
            <img src="./Images/infoIcon.png" alt="Mais informações">
            <img src="./Images/userIcon.png" alt="Perfil do Usuário">
        `
    }
}

