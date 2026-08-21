// ---------------------------------------------------------------
// Árvore de decisão
// Cada nó é uma pergunta. Cada resposta aponta para o próximo nó
// ou para um resultado final (outcome:xxx).
// ---------------------------------------------------------------

const questions = {
  start: {
    text: "O que está acontecendo?",
    helper: "Escolha a opção que mais se aproxima da sua situação.",
    answers: [
      { text: "Algo está acontecendo agora", next: "current_control" },
      { text: "Algo pode acontecer no futuro", next: "future_prep" },
      { text: "Preciso tomar uma decisão", next: "decision_info" },
      { text: "Aconteceu e ainda penso nisso", next: "past_action" },
    ],
  },

  current_control: {
    text: "Você tem controle sobre a situação agora?",
    helper: "",
    answers: [
      { text: "Sim, posso agir", next: "current_action" },
      { text: "Só em parte", next: "outcome:planeje" },
      { text: "Não, está fora do meu alcance", next: "outcome:aguarde" },
    ],
  },

  current_action: {
    text: "Existe algo concreto que você pode fazer agora?",
    helper: "",
    answers: [
      { text: "Sim, sei exatamente o quê", next: "outcome:aja" },
      { text: "Não, mas sei que existe um caminho", next: "current_urgency" },
    ],
  },

  current_urgency: {
    text: "Isso precisa ser resolvido logo?",
    helper: "",
    answers: [
      { text: "Sim, é urgente", next: "outcome:investigue" },
      { text: "Não, posso pensar com calma", next: "outcome:planeje" },
    ],
  },

  future_prep: {
    text: "Existe algo que você pode fazer agora para se preparar?",
    helper: "",
    answers: [
      { text: "Sim", next: "future_timing" },
      { text: "Ainda não sei", next: "outcome:investigue" },
    ],
  },

  future_timing: {
    text: "Vale a pena fazer isso agora ou pode esperar?",
    helper: "",
    answers: [
      { text: "Melhor fazer agora", next: "outcome:aja" },
      { text: "Pode esperar um pouco", next: "outcome:prepare" },
    ],
  },

  decision_info: {
    text: "Você tem informação suficiente para decidir?",
    helper: "",
    answers: [
      { text: "Sim, tenho o que preciso", next: "decision_urgency" },
      { text: "Não, ainda falta entender algo", next: "outcome:investigue" },
    ],
  },

  decision_urgency: {
    text: "Essa decisão precisa ser tomada logo?",
    helper: "",
    answers: [
      { text: "Sim, o prazo está próximo", next: "outcome:aja" },
      { text: "Não, ainda há tempo", next: "outcome:planeje" },
    ],
  },

  past_action: {
    text: "Existe algo prático que você ainda pode fazer sobre isso?",
    helper: "",
    answers: [
      { text: "Sim, ainda dá tempo", next: "outcome:planeje" },
      { text: "Não, já passou", next: "outcome:deixeir" },
    ],
  },
};

const outcomes = {
  aja: {
    icon: "🟠",
    title: "Aja agora",
    desc: "Existe algo concreto que você pode fazer, e o momento é agora. O próximo passo já está claro — o que falta é começar.",
  },
  planeje: {
    icon: "🗓️",
    title: "Planeje",
    desc: "Você sabe o que precisa ser feito, mas isso não precisa acontecer agora. Vale reservar um momento específico para cuidar disso, e soltar essa tarefa da cabeça até lá.",
  },
  investigue: {
    icon: "🔍",
    title: "Investigue",
    desc: "Ainda falta entender melhor a situação antes de agir ou decidir. Buscar mais informação é o próximo passo mais útil agora.",
  },
  prepare: {
    icon: "🌱",
    title: "Prepare-se",
    desc: "Isso ainda não aconteceu, mas você já pode se preparar com calma, sem pressa e sem precisar resolver tudo hoje.",
  },
  aguarde: {
    icon: "🌾",
    title: "Aguarde",
    desc: "No momento não há nada útil que você possa fazer. Esperar não é fracassar — às vezes é a resposta mais honesta.",
  },
  deixeir: {
    icon: "🕊️",
    title: "Deixe ir",
    desc: "Não há ação disponível nem controle sobre isso agora. Talvez o cuidado possível, hoje, seja soltar esse peso.",
  },
};

// ---------------------------------------------------------------
// Estado
// ---------------------------------------------------------------

let history = []; // pilha de ids de nós visitados (para "voltar")
let currentNode = null;

// ---------------------------------------------------------------
// Elementos
// ---------------------------------------------------------------

const screens = {
  home: document.getElementById("screen-home"),
  question: document.getElementById("screen-question"),
  result: document.getElementById("screen-result"),
};

const progressLabel = document.getElementById("progressLabel");
const questionTitle = document.getElementById("questionTitle");
const questionHelper = document.getElementById("questionHelper");
const answersList = document.getElementById("answersList");

const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultDesc = document.getElementById("resultDesc");

const btnStart = document.getElementById("btnStart");
const btnBack = document.getElementById("btnBack");
const btnRestart = document.getElementById("btnRestart");
const btnAnother = document.getElementById("btnAnother");

// ---------------------------------------------------------------
// Navegação entre telas
// ---------------------------------------------------------------

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.dataset.active = key === name ? "true" : "false";
  });
  btnBack.hidden = !(name === "question" && history.length > 0);
  btnRestart.hidden = name === "home";
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function renderQuestion(nodeId) {
  currentNode = nodeId;
  const node = questions[nodeId];

  progressLabel.textContent = `passo ${history.length + 1}`;
  questionTitle.textContent = node.text;
  questionHelper.textContent = node.helper || "";
  questionHelper.style.display = node.helper ? "block" : "none";

  answersList.innerHTML = "";
  node.answers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.className = "answer-card";
    btn.textContent = answer.text;
    btn.addEventListener("click", () => handleAnswer(answer.next));
    answersList.appendChild(btn);
  });

  showScreen("question");
}

function renderResult(outcomeKey) {
  const outcome = outcomes[outcomeKey];
  resultIcon.textContent = outcome.icon;
  resultTitle.textContent = outcome.title;
  resultDesc.textContent = outcome.desc;
  showScreen("result");
}

function handleAnswer(next) {
  history.push(currentNode);
  if (next.startsWith("outcome:")) {
    const key = next.split(":")[1];
    renderResult(key);
  } else {
    renderQuestion(next);
  }
}

function goBack() {
  if (history.length === 0) return;
  const previous = history.pop();
  renderQuestion(previous);
}

function restart() {
  history = [];
  currentNode = null;
  showScreen("home");
}

// ---------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------

btnStart.addEventListener("click", () => {
  history = [];
  renderQuestion("start");
});

btnBack.addEventListener("click", goBack);
btnRestart.addEventListener("click", restart);
btnAnother.addEventListener("click", restart);

// Estado inicial
showScreen("home");
