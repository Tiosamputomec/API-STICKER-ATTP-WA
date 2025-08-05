// Projeto: ATTP do Samziinwins
// Gera um gifzão com texto coloridão animado 🌀

const express = require('express');
const { createCanvas } = require('canvas');
const GIFEncoder = require('gif-encoder-2');

const app = express();
const PORT = process.env.PORT || 3000;

// Função pra gerar cor de arco-íris boladona
function corArcoIris(frame, total) {
  const hue = Math.floor((360 / total) * frame);
  return `hsl(${hue}, 100%, 50%)`;
}

// Função pra quebrar o textão em linhas, se não cabe tudo de uma vez
function quebrarTexto(ctx, texto, x, y, maxLarg, alturaLinha) {
  const palavras = texto.split(' ');
  let linha = '';
  const linhas = [];

  for (let i = 0; i < palavras.length; i++) {
    const tentativa = linha + palavras[i] + ' ';
    const largura = ctx.measureText(tentativa).width;

    if (largura > maxLarg && i > 0) {
      linhas.push(linha);
      linha = palavras[i] + ' ';
    } else {
      linha = tentativa;
    }
  }

  linhas.push(linha);

  const yInicio = y - ((linhas.length - 1) * alturaLinha) / 2;

  linhas.forEach((l, i) => {
    ctx.fillText(l.trim(), x, yInicio + i * alturaLinha);
  });
}

// Rota principal - acessa tipo: /attp?text=Fala%20tu
app.get('/attp', (req, res) => {
  const texto = req.query.text || 'Manda o textin aí';
  const larg = 512;
  const alt = 512;
  const frames = 30;

  const encoder = new GIFEncoder(larg, alt);
  encoder.setRepeat(0); // loop infinito, pq é brabo
  encoder.setDelay(50); // tempo entre os quadros (50ms)
  encoder.start();

  const canvas = createCanvas(larg, alt);
  const ctx = canvas.getContext('2d');

  ctx.font = 'bold 60px Comic Sans MS'; // fonte clássica dos memes kkk
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Vai gerando os quadros do gif na moral
  for (let i = 0; i < frames; i++) {
    ctx.clearRect(0, 0, larg, alt);
    ctx.fillStyle = corArcoIris(i, frames);
    quebrarTexto(ctx, texto, larg / 2, alt / 2, 460, 70);
    encoder.addFrame(ctx);
  }

  encoder.finish();

  const gifzao = encoder.out.getData();
  res.set('Content-Type', 'image/gif');
  res.send(gifzao);
});

// Sobe o servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor ATTP do Samziinwins tá ON na porta ${PORT}`);
});
