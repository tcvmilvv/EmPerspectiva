// =================================================================
// Sessão — respostas guardadas apenas em memória, nada é salvo.
// =================================================================

let session = {};
let history = [];      // pilha de ids de nós visitados (para "voltar")
let currentId = null;

// =================================================================
// Árvore de nós
// kinds: 'choice' | 'text' | 'terminal'
// =================================================================

const nodes = {

  // ---------------------------------------------------------- TELA 2
  start: {
    kind: "choice",
    title: "Primeiro, vamos entender o que está acontecendo.",
    paragraphs: [
      "Não precisamos resolver nada ainda. Só precisamos descobrir que tipo de situação você está enfrentando.",
    ],
    question: "Qual dessas opções se aproxima mais do que está acontecendo?",
    options: [
      {
        title: "Algo está acontecendo agora.",
        subtitle: "Existe uma situação concreta que está me preocupando.",
        next: "current_clarity",
      },
      {
        title: "Algo pode acontecer no futuro.",
        subtitle: "Estou preocupada com uma possibilidade ou com algo que pode dar errado.",
        next: "impact",
      },
      {
        title: "Preciso tomar uma decisão.",
        subtitle: "Existe uma escolha que preciso fazer, mas não sei exatamente como seguir.",
        next: "impact",
      },
      {
        title: "Algo aconteceu e continuo pensando nisso.",
        subtitle: "A situação já passou, mas minha cabeça continua voltando para ela.",
        next: "impact",
      },
      {
        title: "Não sei exatamente.",
        subtitle: "Só sei que alguma coisa está me preocupando.",
        next: "clarify_text",
      },
    ],
  },

  // ---------------------------------------------------------- TELA 3
  current_clarity: {
    kind: "choice",
    title: "Vamos separar o que está acontecendo do que você está imaginando.",
    paragraphs: [
      "Quando estamos preocupados, fatos, interpretações e possibilidades podem acabar se misturando.",
      "Antes de pensar em uma solução, vamos tentar olhar para a situação com um pouco mais de clareza.",
    ],
    question: "Você consegue identificar qual é o problema concreto?",
    options: [
      { title: "Sim, sei exatamente qual é o problema.", next: "impact" },
      {
        title: "Mais ou menos.",
        subtitle: "Tenho uma ideia, mas ainda está tudo meio confuso.",
        next: "clarify_text",
      },
      {
        title: "Não tenho certeza.",
        subtitle: "Sei que alguma coisa está me preocupando, mas não consigo dizer exatamente o quê.",
        next: "clarify_text",
      },
    ],
  },

  // ---------------------------------------------------------- TELA 4
  clarify_text: {
    kind: "text",
    title: "Tudo bem não ter certeza ainda.",
    paragraphs: [
      "Às vezes, a preocupação aparece antes de conseguirmos colocar em palavras o que realmente está acontecendo.",
      "Vamos separar duas coisas.",
    ],
    inputs: [
      {
        id: "fact",
        label: "O que você sabe com certeza?",
        helper: "Pense apenas no que aconteceu ou no que você consegue observar.",
      },
      {
        id: "assumption",
        label: "E o que você está supondo que pode acontecer?",
      },
    ],
    continueLabel: "Continuar",
    next: "impact",
  },

  // ---------------------------------------------------------- TELA 5
  impact: {
    kind: "choice",
    title: "Agora, vamos entender o peso dessa preocupação.",
    paragraphs: [
      "Nem tudo que nos preocupa tem o mesmo peso.",
      "Uma coisa pode ocupar muito espaço na nossa cabeça e, ainda assim, ter consequências pequenas. Outra pode parecer tranquila agora, mas ter consequências importantes. Vamos olhar para isso separadamente.",
    ],
    question: "Se nada for feito, qual seria o impacto dessa situação?",
    options: [
      {
        title: "Pequeno",
        subtitle: "Seria desagradável ou inconveniente, mas eu conseguiria lidar com isso.",
        next: "urgency",
      },
      {
        title: "Moderado",
        subtitle: "Poderia trazer algumas consequências importantes.",
        next: "urgency",
      },
      {
        title: "Grande",
        subtitle: "Poderia causar consequências significativas para mim ou para outras pessoas.",
        next: "urgency",
      },
      {
        title: "Muito grande",
        subtitle: "As consequências seriam muito sérias e precisam de atenção.",
        next: "urgency",
      },
    ],
  },

  // ---------------------------------------------------------- TELA 6
  urgency: {
    kind: "choice",
    title: "E quanto à urgência?",
    paragraphs: [
      "Algo pode ser importante sem precisar ser resolvido agora.",
      "Vamos separar o que realmente tem prazo da sensação de que precisamos resolver tudo imediatamente.",
    ],
    question: "Quando essa situação precisa ser resolvida?",
    options: [
      { title: "Agora.", next: "urgency_check" },
      { title: "Hoje.", next: "urgency_check" },
      { title: "Nos próximos dias.", next: "urgency_check" },
      { title: "Em algum momento, mas não agora.", next: "control" },
      { title: "Não existe um prazo real.", next: "control" },
    ],
  },

  urgency_check: {
    kind: "choice",
    title: "Vale a pena checar uma coisa.",
    paragraphs: [
      "Às vezes sentimos que algo precisa ser resolvido agora, mas isso nem sempre corresponde a um prazo real.",
    ],
    question: "Existe algum prazo ou consequência concreta que torna isso urgente?",
    options: [
      { title: "Sim.", next: "control" },
      { title: "Não.", next: "control" },
      { title: "Não tenho certeza.", next: "control" },
    ],
  },

  // ---------------------------------------------------------- TELA 7
  control: {
    kind: "choice",
    title: "Agora, vamos olhar para o que está ao seu alcance.",
    paragraphs: [
      "Você não precisa controlar tudo para poder fazer alguma coisa.",
      "Às vezes podemos agir diretamente. Às vezes podemos apenas influenciar o resultado. E às vezes precisamos aceitar que determinada parte da situação não depende de nós.",
    ],
    question: "Qual dessas opções descreve melhor o seu grau de controle?",
    options: [
      {
        title: "Posso agir diretamente.",
        subtitle: "Existe algo que depende principalmente de mim.",
        next: "action",
      },
      {
        title: "Posso influenciar, mas não controlar.",
        subtitle: "Posso fazer alguma diferença, mas o resultado não depende só de mim.",
        next: "action",
      },
      {
        title: "Depende principalmente de outra pessoa.",
        subtitle: "Minha ação depende da decisão ou resposta de alguém.",
        next: "action",
      },
      {
        title: "Depende de algo que ainda não aconteceu.",
        subtitle: "Preciso esperar um evento ou uma informação.",
        next: "action",
      },
      {
        title: "Não está sob meu controle.",
        subtitle: "Não existe uma ação minha que possa mudar o resultado.",
        next: "action",
      },
    ],
  },

  // ---------------------------------------------------------- TELA 8
  action: {
    kind: "choice",
    title: "Existe algo útil que você possa fazer?",
    paragraphs: [
      "Agora que entendemos melhor a situação, vamos voltar para aquilo que está ao seu alcance.",
      "Você não precisa encontrar uma solução completa. Estamos procurando apenas algo que possa realmente ajudar.",
    ],
    options: [
      { title: "Sim, sei o que posso fazer.", next: "next_step_text" },
      { title: "Talvez, mas ainda não sei exatamente o quê.", next: "maybe_step_text" },
      { title: "Não, não existe nada que eu possa fazer agora.", next: "no_action" },
    ],
  },

  // ---------------------------------------------------------- TELA 9
  next_step_text: {
    kind: "text",
    title: "Vamos encontrar o próximo passo.",
    paragraphs: ["Você não precisa resolver tudo de uma vez."],
    inputs: [
      { id: "nextStep", label: "Qual é a menor ação concreta que faria essa situação avançar?", placeholder: "Meu próximo passo é..." },
    ],
    continueLabel: "Continuar",
    next: "next_step_can",
  },

  next_step_can: {
    kind: "choice",
    title: "Só mais uma coisa.",
    paragraphs: [],
    question: "Você consegue fazer isso agora?",
    options: [
      { title: "Sim.", next: "result_fazer_agora" },
      { title: "Não.", next: "planejar_when" },
    ],
  },

  // ramo "talvez" (extensão nossa, não detalhada no roteiro original)
  maybe_step_text: {
    kind: "text",
    title: "Vamos deixar isso um pouco mais claro.",
    paragraphs: [
      "Você não sabe exatamente o que fazer ainda, e tudo bem. Às vezes o próximo passo é só entender melhor as opções.",
    ],
    inputs: [
      { id: "maybeStep", label: "O que você imagina que poderia ajudar, mesmo que ainda não esteja totalmente claro?" },
    ],
    continueLabel: "Continuar",
    next: "planejar_when",
  },

  // ---------------------------------------------------------- RESULTADO: Fazer agora
  result_fazer_agora: {
    kind: "terminal",
    eyebrow: "agora ficou mais claro",
    title: "Você encontrou algo que está ao seu alcance.",
    paragraphs: [
      "Não é preciso resolver tudo neste momento.",
      "Existe um próximo passo claro — e você pode começar por ele.",
    ],
    highlight: { label: "Seu próximo passo", valueId: "nextStep" },
    buttons: [
      { label: "Voltar ao início", action: "restart", primary: true },
    ],
  },

  // ---------------------------------------------------------- RESULTADO: Planejar
  planejar_when: {
    kind: "choice",
    eyebrow: "agora ficou mais claro",
    title: "Você não precisa carregar isso na cabeça até poder agir.",
    paragraphs: [
      "A situação tem um próximo passo, mas ele não precisa acontecer agora.",
      "Definir quando você vai cuidar disso permite que você deixe essa preocupação em pausa por enquanto.",
    ],
    question: "Quando você pretende fazer isso?",
    options: [
      { title: "Hoje mais tarde", next: "planejar_final" },
      { title: "Amanhã", next: "planejar_final" },
      { title: "Nesta semana", next: "planejar_final" },
      { title: "Em uma data específica", next: "planejar_final" },
      { title: "Quando algo acontecer", next: "planejar_final" },
    ],
  },

  planejar_final: {
    kind: "terminal",
    eyebrow: "agora ficou mais claro",
    title: "Planeje.",
    paragraphs: ["Até lá, você não precisa resolver isso novamente."],
    buttons: [
      { label: "Voltar ao início", action: "restart", primary: true },
    ],
  },

  // ---------------------------------------------------------- RESULTADO: Não há ação
  no_action: {
    kind: "choice",
    eyebrow: "agora ficou mais claro",
    title: "Por enquanto, não há uma ação para tomar.",
    paragraphs: [
      "Você olhou para a situação e identificou o que está — e o que não está — sob seu controle.",
      "Neste momento, não existe uma ação que possa mudar o resultado.",
      "Isso não significa que a situação não importa. Significa apenas que continuar tentando resolvê-la agora não está acrescentando nada.",
    ],
    question: "Existe algum acontecimento ou informação que faria sentido esperar?",
    options: [
      { title: "Sim.", next: "aguardar_text" },
      { title: "Não.", next: "deixar_ir" },
    ],
  },

  // ---------------------------------------------------------- RESULTADO: Aguardar
  aguardar_text: {
    kind: "text",
    title: "Por enquanto, é hora de esperar.",
    paragraphs: [
      "Não há uma ação útil para tomar agora, mas isso pode mudar quando algo acontecer.",
      "Você não precisa ficar verificando essa preocupação o tempo todo.",
    ],
    inputs: [
      { id: "waitFor", label: "O que precisa acontecer para que você volte a olhar para isso?" },
    ],
    continueLabel: "Continuar",
    next: "aguardar_final",
  },

  aguardar_final: {
    kind: "terminal",
    eyebrow: "agora ficou mais claro",
    title: "Aguarde.",
    paragraphs: ["Até lá, você pode voltar sua atenção para o que está acontecendo agora."],
    buttons: [
      { label: "Voltar ao início", action: "restart", primary: true },
    ],
  },

  // ---------------------------------------------------------- RESULTADO: Deixar ir
  deixar_ir: {
    kind: "choice",
    eyebrow: "agora ficou mais claro",
    title: "Você chegou ao limite do que pode fazer por enquanto.",
    paragraphs: [
      "Essa situação pode continuar sendo importante para você.",
      "Mas você já olhou para ela, identificou o que está sob seu controle e não encontrou uma ação que possa mudar o resultado neste momento.",
      "Você não precisa continuar tentando resolver mentalmente algo que não tem uma solução disponível agora.",
    ],
    question: "Para onde você gostaria de direcionar sua atenção?",
    options: [
      { title: "Voltar ao que eu estava fazendo.", next: "deixar_ir_final" },
      { title: "Fazer uma pausa.", next: "deixar_ir_final" },
      { title: "Cuidar de outra coisa que está ao meu alcance.", next: "deixar_ir_final" },
      { title: "Simplesmente seguir com o meu dia.", next: "deixar_ir_final" },
    ],
  },

  deixar_ir_final: {
    kind: "terminal",
    eyebrow: "agora ficou mais claro",
    title: "Deixe ir.",
    paragraphs: ["Voltar ao presente é, por si só, uma resposta válida para essa preocupação agora."],
    buttons: [
      { label: "Voltar ao início", action: "restart", primary: true },
    ],
  },
};

// =================================================================
// Elementos fixos
// =================================================================

const screens = {
  home: document.getElementById("screen-home"),
  node: document.getElementById("screen-node"),
};

const homeText = document.getElementById("homeText");
homeText.innerHTML = `
  <p>Tem alguma coisa ocupando a sua cabeça?</p>
  <p>Nem toda preocupação precisa ser resolvida da mesma maneira. Algumas pedem uma ação, outras precisam de tempo, informação ou planejamento. E algumas estão fora do nosso controle.</p>
  <p>Vamos entender o que essa preocupação está pedindo de você.</p>
`;

const btnBack = document.getElementById("btnBack");
const btnRestart = document.getElementById("btnRestart");
const btnStart = document.getElementById("btnStart");

// =================================================================
// Navegação
// =================================================================

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.dataset.active = key === name ? "true" : "false";
  });
  btnBack.hidden = !(name === "node" && history.length > 0);
  btnRestart.hidden = name === "home";
  window.scrollTo({ top: 0 });
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

function renderNode(id) {
  currentId = id;
  const node = nodes[id];
  const container = screens.node;

  let html = "";

  if (node.eyebrow) {
    html += `<p class="eyebrow">${esc(node.eyebrow)}</p>`;
  } else {
    html += `<p class="progress">passo ${history.length + 1}</p>`;
  }

  html += `<h2 class="handwritten question-title">${esc(node.title)}</h2>`;

  (node.paragraphs || []).forEach((p) => {
    html += `<p class="body-text" style="margin-bottom:12px;">${esc(p)}</p>`;
  });

  if (node.kind === "choice") {
    if (node.question) {
      html += `<p class="question-label">${esc(node.question)}</p>`;
    }
    html += `<div class="answers">`;
    node.options.forEach((opt, idx) => {
      html += `<button class="answer-card" data-idx="${idx}">
        <span class="answer-title">${esc(opt.title)}</span>
        ${opt.subtitle ? `<span class="answer-subtitle">${esc(opt.subtitle)}</span>` : ""}
      </button>`;
    });
    html += `</div>`;
  }

  if (node.kind === "text") {
    html += `<div class="text-fields">`;
    node.inputs.forEach((inp) => {
      const val = session[inp.id] || "";
      html += `<div class="field">
        <label class="field-label" for="f-${inp.id}">${esc(inp.label)}</label>
        ${inp.helper ? `<span class="field-helper">${esc(inp.helper)}</span>` : ""}
        <textarea id="f-${inp.id}" placeholder="${esc(inp.placeholder || "")}">${esc(val)}</textarea>
      </div>`;
    });
    html += `</div>`;
    html += `<button class="btn-primary" id="btnContinueText">${esc(node.continueLabel || "Continuar")}</button>`;
  }

  if (node.kind === "terminal") {
    if (node.highlight) {
      const value = session[node.highlight.valueId] || "";
      html += `<div class="highlight-box">
        <span class="highlight-label">${esc(node.highlight.label)}</span>
        <span class="highlight-value">${esc(value)}</span>
      </div>`;
    }
    html += `<div class="btn-row">`;
    node.buttons.forEach((btn, idx) => {
      const cls = btn.primary ? "btn-primary" : "btn-secondary";
      html += `<button class="${cls}" data-action="${btn.action}" data-idx="${idx}">${esc(btn.label)}</button>`;
    });
    html += `</div>`;
  }

  container.innerHTML = html;
  showScreen("node");

  // liga os eventos depois de inserir no DOM
  if (node.kind === "choice") {
    container.querySelectorAll(".answer-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const opt = node.options[Number(btn.dataset.idx)];
        history.push(id);
        renderNode(opt.next);
      });
    });
  }

  if (node.kind === "text") {
    container.querySelector("#btnContinueText").addEventListener("click", () => {
      node.inputs.forEach((inp) => {
        const el = container.querySelector(`#f-${inp.id}`);
        session[inp.id] = el.value.trim();
      });
      history.push(id);
      renderNode(node.next);
    });
  }

  if (node.kind === "terminal") {
    container.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.action === "restart") restart();
      });
    });
  }
}

function goBack() {
  if (history.length === 0) return;
  const previous = history.pop();
  renderNode(previous);
}

function restart() {
  session = {};
  history = [];
  currentId = null;
  showScreen("home");
}

// =================================================================
// Eventos fixos
// =================================================================

btnStart.addEventListener("click", () => {
  history = [];
  renderNode("start");
});

btnBack.addEventListener("click", goBack);
btnRestart.addEventListener("click", restart);

// Estado inicial
showScreen("home");
