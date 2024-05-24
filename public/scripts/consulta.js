document.addEventListener('DOMContentLoaded', carregarConsultas);

async function carregarConsultas() {
    const response = await fetch('/api/consulta');
    const consultas = await response.json();
    const consultasList = document.getElementById('consultasList');
    consultasList.innerHTML = '';
    consultas.result.forEach(consulta => {
        const li = document.createElement('li');
        li.textContent = consulta.chave;
        li.onclick = () => carregarConsultaDetalhes(consulta.chave);
        consultasList.appendChild(li);
    });
}

async function carregarConsultaDetalhes(chave) {
    const response = await fetch(`/api/consulta/${chave}`);
    var consulta = await response.json();
    consulta = consulta.result;

    // Verificação para garantir que parametros é um array
    if (typeof consulta.parametros === 'string') {
        try {
            consulta.parametros = JSON.parse(consulta.parametros);
        } catch (e) {
            console.error('Erro ao analisar os parâmetros:', e);
            consulta.parametros = [];
        }
    }

    if (!Array.isArray(consulta.parametros)) {
        consulta.parametros = [];
    }

    editarConsulta(consulta);
}

function adicionarParametro() {
    const parametrosDiv = document.getElementById('parametros');
    const novoParametroDiv = document.createElement('div');
    novoParametroDiv.className = 'parametro';
    novoParametroDiv.innerHTML = `
        <input type="text" placeholder="Variável" class="parametro-variavel">
        <input type="text" placeholder="Valor Default" class="parametro-valor">
        <button type="button" onclick="removerParametro(this)">Remover</button>
    `;
    parametrosDiv.appendChild(novoParametroDiv);
}

function removerParametro(button) {
    button.parentElement.remove();
}

async function executarRota() {
    const chave = document.getElementById('chave').value;
    const response = await fetch('/data/' + chave);
    const consultas = await response.json();
    const transformado = syntaxHighlight(JSON.stringify(consultas, null, 2));
    const consultasList = document.getElementById('resultadoJson');
    consultasList.innerHTML = transformado;
}

function novaConsulta() {
    document.getElementById('chave').value = '';
    document.getElementById('chave').disabled = false;
    document.getElementById('consultaSQL').value = '';
    document.getElementById('codigoJS').value = 'result = data';
    document.getElementById('baseDeDados').selectedIndex = -1;
    document.getElementById('resultadoJson').innerHTML = '';
    document.getElementById('excluirBtn').style.display = 'none';
    document.getElementById('executarBtn').style.display = 'none';
    document.getElementById('parametros').innerHTML = ''; // Limpar parâmetros
}

async function editarConsulta(consulta) {
    document.getElementById('chave').value = consulta.chave;
    document.getElementById('chave').disabled = true;
    document.getElementById('consultaSQL').value = consulta.consulta;
    document.getElementById('codigoJS').value = consulta.tratamento;
    const baseDeDadosElement = document.getElementById('baseDeDados');
    Array.from(baseDeDadosElement.options).forEach(option => {
        option.selected = consulta.baseDeDados.includes(option.value);
    });

    // Limpar parâmetros existentes
    const parametrosDiv = document.getElementById('parametros');
    parametrosDiv.innerHTML = '';

    // Carregar parâmetros
    if (Array.isArray(consulta.parametros)) {
        consulta.parametros.forEach(param => {
            const novoParametroDiv = document.createElement('div');
            novoParametroDiv.className = 'parametro';
            novoParametroDiv.innerHTML = `
                <input type="text" placeholder="Variável" class="parametro-variavel" value="${param.variavel}">
                <input type="text" placeholder="Valor Default" class="parametro-valor" value="${param.valor}">
                <button type="button" onclick="removerParametro(this)">Remover</button>
            `;
            parametrosDiv.appendChild(novoParametroDiv);
        });
    }

    document.getElementById('excluirBtn').style.display = 'inline';
    document.getElementById('executarBtn').style.display = 'inline';
}


async function salvarConsulta(event) {
    event.preventDefault();
    const chave = document.getElementById('chave').value;
    const consulta = document.getElementById('consultaSQL').value;
    const tratamento = document.getElementById('codigoJS').value;
    const baseDeDados = Array.from(document.getElementById('baseDeDados').selectedOptions).map(option => option.value);

    // Coletar parâmetros
    const parametrosDivs = document.getElementsByClassName('parametro');
    const parametros = Array.from(parametrosDivs).map(div => ({
        variavel: div.querySelector('.parametro-variavel').value,
        valor: div.querySelector('.parametro-valor').value
    }));

    if (!/^[A-Za-z0-9]+$/.test(chave)) {
        alert('A chave deve conter apenas letras e números.');
        return;
    }

    if (baseDeDados.length === 0) {
        alert('Selecione pelo menos uma base de dados.');
        return;
    }

    const dados = { chave, consulta, tratamento, baseDeDados, parametros };

    let response;
    if (document.getElementById('chave').disabled) {
        response = await fetch(`/api/consulta/${chave}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
    } else {
        response = await fetch('/api/consulta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
    }

    if (response.ok) {
        carregarConsultas();
        editarConsulta({ chave, consulta, tratamento, baseDeDados, parametros });
        executarRota();
    } else {
        alert('Erro ao salvar consulta');
    }
}

async function deletarConsulta() {
    const chave = document.getElementById('chave').value;
    if (chave) {
        const response = await fetch(`/api/consulta/${chave}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            carregarConsultas();
            novaConsulta();
        } else {
            alert('Erro ao excluir consulta');
        }
    } else {
        alert('Selecione uma consulta para excluir');
    }
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:\s*)?|\b(true|false|null)\b|\b\d+\b)/g, function (match) {
        var cls = 'json-value';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
