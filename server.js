const express = require('express');
const cors = require('cors');
const { WebcastPushConnection } = require('tiktok-live-connector');

const app = express();
app.use(cors());
app.use(express.json());

let filaEventos = [];
let USERNAME_TIKTOK = "minguadodelicioso"; // troca pelo seu @

let tiktokConnection = new WebcastPushConnection(USERNAME_TIKTOK);

tiktokConnection.connect().then(state => {
    console.log(`Conectado na live do @${USERNAME_TIKTOK}`);
}).catch(err => console.error('Erro ao conectar:', err));

tiktokConnection.on('chat', data => {
    filaEventos.push({ tipo: 'ENTRAR', user: data.uniqueId });
});

tiktokConnection.on('like', data => {
    filaEventos.push({ tipo: 'LIKE', user: data.uniqueId, qtd: data.likeCount });
});

tiktokConnection.on('gift', data => {
    filaEventos.push({ tipo: 'NITRO', user: data.uniqueId, valor: data.diamondCount * data.repeatCount });
});

app.get('/eventos', (req, res) => {
    res.json(filaEventos);
    filaEventos = [];
});

app.get('/', (req, res) => {
    res.send('Esgrima Race Server ON - Live: @' + USERNAME_TIKTOK);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server rodando na porta ' + PORT));
