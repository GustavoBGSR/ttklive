const express = require('express');
const { WebcastPushConnection } = require('tiktok-live-connector');

const app = express();
const PORT = process.env.PORT || 10000;
const TIKTOK_USER = process.env.TIKTOK_USERNAME || "minguadodelicioso";

let comandos = [];
let likes = {};

console.log(`Tentando conectar na live @${TIKTOK_USER}`);

let connection = new WebcastPushConnection(TIKTOK_USER, {
    enableExtendedGiftInfo: true
});

async function connect() {
    try {
        const state = await connection.connect();
        console.log(`✅ CONECTADO @${TIKTOK_USER} - Room ID: ${state.roomId}`);
    } catch (err) {
        console.error("Erro ao conectar, tentando de novo em 5s...", err);
        setTimeout(connect, 5000);
    }
}
connect();

connection.on('chat', data => {
    const tiktokUser = data.uniqueId;
    let msg = data.comment.trim().replace(/@/g, "");
    
    if (msg.length < 3 || msg.length > 25) return;
    if (msg.includes(" ")) return; // só aceita nick sem espaço
    
    console.log(`[CHAT] ${tiktokUser}: ${msg}`);
    comandos.push({ tiktok: tiktokUser, roblox: msg });
});

connection.on('like', data => {
    const user = data.uniqueId;
    if (!likes[user]) likes[user] = 0;
    likes[user] += data.likeCount || 1;
});

connection.on('disconnected', () => {
    console.log("Desconectado, reconectando...");
    setTimeout(connect, 5000);
});

// Rota que o Roblox lê
app.get('/data', (req, res) => {
    res.json({ comandos: comandos, likes: likes });
    comandos = [];
    likes = {};
});

app.get('/', (req, res) => {
    res.send(`Esgrima Race Server ON - Live: @${TIKTOK_USER} - Comandos: ${comandos.length}`);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
