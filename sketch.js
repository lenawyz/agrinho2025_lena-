//feito com IA.prompt: elabore um codigo em javascript para o p5js com o tema agricultura sutentavel. o jogo deve ter personagens que ganham pontos apos plantarem alimentos de maneira saudavel. 

let fazendeiroX;
let fazendeiroY;
let fazendeiroTamanho = 40;
let pontos = 0;

let plantas = [];
let maxPlantasNaTela = 10;
let plantasPlantadasTotal = 0;
let objetivoPlantas = 100;

let plantasPerdidas = 0;
let limitePlantasPerdidas = 10;

let pragas = [];
let maxPragas = 3;
let pragaTamanho = 30;
let velocidadePraga = 0.8;

let ultimoAparecimentoPraga = 0;
let intervaloAparecimentoPraga = 5000;

let jogoAcabou = false; // Variável para controlar se o jogo terminou

function setup() {
  createCanvas(600, 400); // Mantenha um tamanho de canvas padrão, se desejar alterar, ajuste os tamanhos de fonte proporcionalmente
  resetGame(); // Chama a função para configurar o estado inicial do jogo
}

function draw() {
  background(135, 206, 235); // Céu azul
  drawChao();

  // Desenha o fazendeiro
  text('👨‍🌾', fazendeiroX, fazendeiroY);

  // Desenha as plantas existentes
  for (let i = plantas.length - 1; i >= 0; i--) {
    text('🌿', plantas[i].x, plantas[i].y);
  }

  // Se o jogo não acabou, atualiza as pragas e movimenta o fazendeiro
  if (!jogoAcabou) {
    // Desenha e move as pragas
    for (let i = pragas.length - 1; i >= 0; i--) {
      text('🐛', pragas[i].x, pragas[i].y);
      pragas[i].y += velocidadePraga;

      if (pragas[i].y > height) {
        pragas.splice(i, 1);
      }
    }

    // Verifica colisões entre pragas e plantas
    for (let i = pragas.length - 1; i >= 0; i--) {
      for (let j = plantas.length - 1; j >= 0; j--) {
        let d = dist(pragas[i].x, pragas[i].y, plantas[j].x, plantas[j].y);
        if (d < (pragaTamanho / 2 + fazendeiroTamanho / 2) - 10) {
          plantas.splice(j, 1);
          pragas.splice(i, 1);
          pontos -= 5;
          plantasPerdidas++;
          break;
        }
      }
    }

    // Verifica colisão entre fazendeiro e pragas (espantar praga)
    for (let i = pragas.length - 1; i >= 0; i--) {
      let d = dist(fazendeiroX, fazendeiroY, pragas[i].x, pragas[i].y);
      if (d < (fazendeiroTamanho / 2 + pragaTamanho / 2) - 10) {
        pragas.splice(i, 1);
        pontos += 15;
      }
    }

    // Aparecimento de novas pragas
    if (millis() - ultimoAparecimentoPraga > intervaloAparecimentoPraga && pragas.length < maxPragas) {
      let xAleatorio = random(width / 4, width * 3 / 4);
      pragas.push({ x: xAleatorio, y: 0 });
      ultimoAparecimentoPraga = millis(); // Correção aqui: era 'ultimoAaparecimentoPraga'
      intervaloAaparecimentoPraga = random(3000, 7000); // Correção aqui: era 'intervaloAaparecimentoPraga'
    }

    movimentaFazendeiro();
  }

  // Mostra os pontos e contadores
  fill(0);
  textSize(20);
  text('Pontos: ' + pontos, 80, 30);
  text('Plantas: ' + plantasPlantadasTotal + '/' + objetivoPlantas, 90, 60);
  text('Perdidas: ' + plantasPerdidas + '/' + limitePlantasPerdidas, 95, 90);

  // Verifica a condição de vitória
  if (plantasPlantadasTotal >= objetivoPlantas && !jogoAcabou) {
    jogoAcabou = true;
  }

  // Verifica a condição de derrota
  if (plantasPerdidas >= limitePlantasPerdidas && !jogoAcabou) {
    jogoAcabou = true;
  }

  // Exibe a mensagem de vitória ou derrota se o jogo acabou
  if (jogoAcabou) {
    if (plantasPlantadasTotal >= objetivoPlantas) {
      exibirMensagemVitoria();
    } else {
      exibirMensagemDerrota();
    }
  }
}

function drawChao() {
  fill(139, 69, 19); // Cor de terra
  rect(0, height - 80, width, 80);
}

function movimentaFazendeiro() {
  let velocidade = 5;

  if (keyIsDown(LEFT_ARROW)) {
    fazendeiroX -= velocidade;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    fazendeiroX += velocidade;
  }
  if (keyIsDown(UP_ARROW)) {
    fazendeiroY -= velocidade;
  }
  if (keyIsDown(DOWN_ARROW)) {
    fazendeiroY += velocidade;
  }

  fazendeiroX = constrain(fazendeiroX, fazendeiroTamanho / 2, width - fazendeiroTamanho / 2);
  fazendeiroY = constrain(fazendeiroY, height - 80 + fazendeiroTamanho / 2, height - fazendeiroTamanho / 2 - 10);
}

function keyPressed() {
  if (!jogoAcabou && key === ' ') {
    if (plantas.length < maxPlantasNaTela && fazendeiroY > height - 80) {
      plantas.push({ x: fazendeiroX, y: fazendeiroY + fazendeiroTamanho / 2 + 5 });
      pontos += 10;
      plantasPlantadasTotal++;
    }
  }
}

function mousePressed() {
  if (jogoAcabou) {
    resetGame();
  }
}

function resetGame() {
  fazendeiroX = width / 2;
  fazendeiroY = height - fazendeiroTamanho / 2 - 10;
  pontos = 0;
  plantas = [];
  plantasPlantadasTotal = 0;
  plantasPerdidas = 0;
  pragas = [];
  ultimoAaparecimentoPraga = millis(); // Correção aqui: era 'ultimoAaparecimentoPraga'
  jogoAcabou = false;
}

function exibirMensagemVitoria() {
  fill(0, 150, 0, 200);
  // Centraliza o retângulo e ajusta a altura para caber o texto
  rect(0, height / 2 - 60, width, 120);

  fill(255);
  textSize(40); // Fonte ligeiramente menor
  text('VOCÊ GANHOU!', width / 2, height / 2 - 25); // Ajuste fino da posição Y
  textSize(18); // Fonte menor para os detalhes
  text('Plantas plantadas: ' + plantasPlantadasTotal, width / 2, height / 2 + 5); // Ajuste fino da posição Y
  text('Clique para reiniciar', width / 2, height / 2 + 30); // Ajuste fino da posição Y
}

function exibirMensagemDerrota() {
  fill(150, 0, 0, 200);
  // Centraliza o retângulo e ajusta a altura para caber o texto
  rect(0, height / 2 - 60, width, 120);

  fill(255);
  textSize(40); // Fonte ligeiramente menor
  text('VOCÊ PERDEU!', width / 2, height / 2 - 25); // Ajuste fino da posição Y
  textSize(18); // Fonte menor para os detalhes
  text('Plantas perdidas: ' + plantasPerdidas + '/' + limitePlantasPerdidas, width / 2, height / 2 + 5); // Ajuste fino da posição Y
  text('Clique para reiniciar', width / 2, height / 2 + 30); // Ajuste fino da posição Y
}
