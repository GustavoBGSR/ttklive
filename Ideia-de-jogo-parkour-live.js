// server.js - Esse é o tradutor TikTok -> Roblox
const express = require('express');
const app = express();
const { WebcastPushConnection } = require('tiktok-live-connector');

let filaEventos = []; // Roblox vai ler isso

let tiktok = new WebcastPushConnection('minguadodelicioso');
tiktok.connect();

tiktok.on('chat', data => {
  filaEventos.push({ tipo: 'ENTRAR', user: data.uniqueId })
})
tiktok.on('like', data => {
  filaEventos.push({ tipo: 'LIKE', user: data.uniqueId, qtd: data.likeCount })
})
tiktok.on('gift', data => {
  filaEventos.push({ tipo: 'NITRO', user: data.uniqueId, valor: data.diamondCount })
})

// Roblox vai chamar essa rota a cada 1 segundo
app.get('/eventos', (req, res) => {
  res.json(filaEventos);
  filaEventos = []; // limpa depois de enviar
});

app.listen(3000);
