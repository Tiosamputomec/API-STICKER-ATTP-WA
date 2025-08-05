const express = require('express');
const { createCanvas } = require('canvas');
const GIFEncoder = require('gif-encoder-2');

const app = express();
const PORT = process.env.PORT || 3000;

// генерирует RGB
function rainbowColor(frame, totalFrames) {
  const hue = Math.round((360 / totalFrames) * frame);
  return `hsl(${hue}, 100%, 50%)`;
}

app.get('/attp', (req, res) => {
  const text = req.query.text || 'Type here:';
  const width = 512;
  const height = 512;
  const totalFrames = 30; 

  const encoder = new GIFEncoder(width, height, 'neuquant', true);
  encoder.setDelay(50); 
  encoder.setRepeat(0); 
  encoder.start();

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Нарисуйте анимацию
  for (let i = 0; i < totalFrames; i++) {
    ctx.clearRect(0, 0, width, height);

    // шрифт
    ctx.font = 'bold 70px "Comic Sans MS"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = rainbowColor(i, totalFrames);

    wrapText(ctx, text, width / 2, height / 2, 480, 80);

    encoder.addFrame(ctx);
  }

  encoder.finish();

  const buffer = encoder.out.getData();
  res.set('Content-Type', 'image/gif');
  res.send(buffer);
});

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let testLine = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  
  const startY = y - (lineHeight * (lines.length - 1)) / 2;

  for (let k in lines) {
    context.fillText(lines[k].trim(), x, startY + (k * lineHeight));
  }
}

app.listen(PORT, () => {
  console.log(`API de ATTP rodando na porta ${PORT}`);
});
