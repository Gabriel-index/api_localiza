// Configuração incial do mapa

const mapa = L.map('mapa').setView([-14.235, -51.9253], 4);

L.tileLayer('https://{s}.tile.openstreeetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}). addTo(mapa);

let marcador;

const inputCep = document.getElementById('cep');
const btnBuscar = document.getElementById('btnBuscar')
const btnLocalizacao = document.getElementById('btnLocalizacao')
const mensagem =  document.getElementById('mensagem');

// Buscar CEP
btnBuscar.addEventListener('click', async () => {
    const cep = inputCep.value.trim();
    mensagem.textContent = '';
    if(!cep) {
        mensagem.textContent = 'Informe um CEP';
        return;
    }
    try {
        // Nossa aplicação frontend vai fazer a consulta para a nossa API
        const resposta =  await fetch(`http://localhost:3000/localizacao/cep/${cep}/coordenadas`);

        const dados = await resposta.json()
        if(!resposta.ok) {
            throw new Error(dados.mensagem || "Não foi possível realizar a consulta");
        }
        // Vamos mostrar os dados na tela 
        // preencher informações(dados)
        // ainda não criamos
        // Vamos atualizar o mapa com as novas informações
        // Atualizar mapa(
        // dados.latitude,
        // dados.longitude,
        // `${dados.logradouro} - ${dados.cidade}`
        // );
    } catch(erro) {
        mensagem.textContent = erro.mensage;
    };
});