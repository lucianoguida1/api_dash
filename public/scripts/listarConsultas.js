document.addEventListener('DOMContentLoaded', carregarConsultas);

async function carregarConsultas() {
    const response = await fetch('/api/consulta');
    const consultas = await response.json();
    const consultasList = document.getElementById('consultasList');
    consultasList.innerHTML = '';
    consultas.result.forEach(consulta => {
        const li = document.createElement('li');
        li.textContent = consulta.chave;
        li.onclick = () => exibirConsulta(consulta.chave);
        consultasList.appendChild(li);
    });
}

async function exibirConsulta(chave) {
    const response = await fetch(`/api/consulta/${chave}`);
    var consulta = await response.json();
    consulta = consulta.result;

    document.getElementById('consultaTitulo').textContent = `Chave: ${consulta.chave}`;
    document.getElementById('consultaLink').href = `/api/${consulta.chave}`;
    document.getElementById('consultaLink').innerHTML = `/api/${consulta.chave}`;

    const parametrosList = document.getElementById('parametrosList');
    parametrosList.innerHTML = '';

    if (typeof consulta.parametros === 'string') {
        try {
            consulta.parametros = JSON.parse(consulta.parametros);
        } catch (e) {
            console.error('Erro ao analisar os parâmetros:', e);
            consulta.parametros = [];
        }
    }

    if (Array.isArray(consulta.parametros)) {
        consulta.parametros.forEach(param => {
            const paramDiv = document.createElement('div');
            paramDiv.className = 'parametro';
            paramDiv.innerHTML = `<strong>Variável:</strong> ${param.variavel}, <strong>Valor Default:</strong> ${param.valor}`;
            parametrosList.appendChild(paramDiv);
        });
    }

    const resultadoResponse = await fetch(`/api/${chave}`);
    const resultadoJson = await resultadoResponse.json();
    const resultadoDiv = document.getElementById('resultadoJson');
    resultadoDiv.innerHTML = syntaxHighlight(JSON.stringify(resultadoJson, null, 2));
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
