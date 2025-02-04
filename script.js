let text = document.getElementById('tarefa');
let resultado = document.getElementById('res');
let dateInput = document.getElementById('date');
let timeInput = document.getElementById('time'); // Referência ao campo de hora

// Recuperar as tarefas armazenadas no localStorage
let tarefinhas = JSON.parse(localStorage.getItem('tarefas')) || [];

// Função para agrupar as tarefas por data
function agruparTarefasPorData() {
    let tarefasPorData = {};

    tarefinhas.forEach(tarefa => {
        if (!tarefasPorData[tarefa.data]) {
            tarefasPorData[tarefa.data] = [];
        }
        tarefasPorData[tarefa.data].push(tarefa);
    });

    return tarefasPorData;
}

// Função para renderizar as tarefas
function renderizarTarefas(dataSelecionada = null) {
    resultado.innerHTML = '';

    // Agrupar as tarefas por data
    const tarefasAgrupadas = agruparTarefasPorData();

    // Se uma data for selecionada, filtramos para mostrar apenas as tarefas dessa data
    if (dataSelecionada) {
        if (tarefasAgrupadas[dataSelecionada]) {
            tarefasAgrupadas[dataSelecionada].forEach(tarefa => {
                criarTarefaElement(tarefa);
            });
        }
    } else {
        // Se nenhuma data foi selecionada, renderizamos todas as tarefas
        Object.keys(tarefasAgrupadas).forEach(data => {
            let dataDiv = document.createElement('div');
            dataDiv.classList.add('data-tarefa');
            dataDiv.textContent = `Data: ${data}`;

            resultado.appendChild(dataDiv);

            tarefasAgrupadas[data].forEach(tarefa => {
                criarTarefaElement(tarefa);
            });
        });
    }
}

// Função para criar o elemento da tarefa
function criarTarefaElement(tarefa) {
    let tarefaDiv = document.createElement('div');
    tarefaDiv.classList.add('tarefa');
    if (tarefa.concluida) {
        tarefaDiv.classList.add('tarefa-concluida');
    }

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('form-check-input', 'checkbox-tarefa');
    checkbox.name = 'checkbox';
    checkbox.id = `check-${tarefa.id}`;
    checkbox.checked = tarefa.concluida;

    let tarefaTexto = document.createElement('span');
    tarefaTexto.classList.add('tarefa-texto');
    tarefaTexto.textContent = tarefa.texto;

    let tarefaHora = document.createElement('span');
    tarefaHora.classList.add('tarefa-hora');
    tarefaHora.textContent = ` - Hora: ${tarefa.hora}`;  // Exibindo a hora

    let botaoRemover = document.createElement('img');
    botaoRemover.classList.add('removis', 'ms-auto');  // Alteração aqui: 'ms-auto' para alinhar à direita
    botaoRemover.src = 'lixo.png';
    botaoRemover.alt = 'Remover tarefa';
    botaoRemover.style.cursor = 'pointer';
    botaoRemover.onclick = () => removerTarefa(tarefa.id);

    tarefaDiv.appendChild(checkbox);
    tarefaDiv.appendChild(tarefaTexto);
    tarefaDiv.appendChild(tarefaHora); // Adicionando a hora à tarefa
    tarefaDiv.appendChild(botaoRemover);

    resultado.appendChild(tarefaDiv);
    checkbox.onclick = () => atualizarTarefaConcluida(tarefa.id);
}

// Função para adicionar a tarefa
function adicionar() {
    const dataSelecionada = dateInput.value;
    const horaSelecionada = timeInput.value; // Obter a hora selecionada
    if (dataSelecionada.trim() === '') {
        alert('Selecione uma data');
        return;
    }

    if (horaSelecionada.trim() === '') {
        alert('Selecione uma hora');
        return;
    }

    if (text.value.trim() === '') {
        alert('Não há nenhuma tarefa no campo');
        return;
    }

    const tarefaId = Date.now();

    tarefinhas.push({
        id: tarefaId,
        texto: text.value,
        hora: horaSelecionada, // Armazenando a hora
        concluida: false,
        data: dataSelecionada
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefinhas));
    renderizarTarefas(dataSelecionada); // Atualiza a tela para mostrar tarefas dessa data
    text.value = '';
    timeInput.value = ''; // Limpa o campo de hora
}

// Função para atualizar a tarefa como concluída ou não
function atualizarTarefaConcluida(tarefaId) {
    let tarefa = tarefinhas.find(t => t.id === tarefaId);
    tarefa.concluida = !tarefa.concluida;
    localStorage.setItem('tarefas', JSON.stringify(tarefinhas));
    renderizarTarefas(); // Atualiza a tela
}

// Função para remover a tarefa
function removerTarefa(tarefaId) {
    tarefinhas = tarefinhas.filter(t => t.id !== tarefaId);
    localStorage.setItem('tarefas', JSON.stringify(tarefinhas));
    renderizarTarefas(); // Atualiza a tela
}

// Função para obter a data atual no formato 'YYYY-MM-DD'
function obterDataAtual() {
    let data = new Date();
    let ano = data.getFullYear();
    let mes = String(data.getMonth() + 1).padStart(2, '0');
    let dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// Evento de mudança da data selecionada
dateInput.addEventListener('change', () => {
    const dataSelecionada = dateInput.value;
    renderizarTarefas(dataSelecionada); // Exibe as tarefas dessa data
});

// Renderizar as tarefas ao carregar a página
let dataAtual = obterDataAtual();
dateInput.value = dataAtual;  // Preencher o campo de data com a data atual
renderizarTarefas(dataAtual);  // Exibir as tarefas para o dia atual