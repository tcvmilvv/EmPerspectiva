# Vamos olhar para isso com calma

Um pequeno guia de decisão pessoal, inspirado na Worry Tree / Worry Flow.
Página estática (HTML + CSS + JavaScript puro), sem backend, sem banco de
dados e sem login — cada reflexão é uma sessão temporária, nada é salvo.

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex: `worry-guide`).
2. Envie estes três arquivos (`index.html`, `style.css`, `script.js`) para a
   raiz do repositório.
3. No repositório, vá em **Settings → Pages**.
4. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
5. Salve. Em alguns minutos o site estará disponível em:
   `https://SEU-USUARIO.github.io/worry-guide/`

## Como rodar localmente

Basta abrir o arquivo `index.html` em qualquer navegador. Não é necessário
nenhum servidor, build step ou instalação.

## Estrutura

```
worry-guide/
├── index.html   → estrutura das telas (home, pergunta, resultado)
├── style.css    → identidade visual (papel, Permanent Marker, Figtree)
└── script.js    → árvore de decisão e máquina de estados
```

## O fluxo de perguntas

Toda a lógica vive em `script.js`, no objeto `nodes`. Cada nó tem um
`kind`:

- **`choice`** — pergunta com opções em cartão (com `title` e, opcionalmente,
  `subtitle`). Cada opção aponta para o próximo nó via `next: "id_do_no"`.
- **`text`** — um ou mais campos de texto livre (`inputs`), com um botão
  "Continuar" que leva ao próximo nó. As respostas ficam guardadas em
  memória (`session`) e podem ser reaproveitadas depois (por exemplo, o
  "próximo passo" digitado aparece de volta na tela de resultado "Fazer
  agora").
- **`terminal`** — tela final de um caminho, com texto de fechamento e
  botões (normalmente "Voltar ao início").

O fluxo segue o roteiro tela a tela: identificar a situação → (separar fato
de suposição, se for algo acontecendo agora) → peso/impacto → urgência →
controle → existe uma ação possível → resultado. Os quatro resultados
possíveis são **Fazer agora**, **Planeje**, **Aguarde** e **Deixe ir** (este
último passando por "não há ação" antes).

**Nota:** apenas o ramo "Algo está acontecendo agora" tinha todas as telas
detalhadas na conversa original. Os ramos "pode acontecer no futuro",
"preciso tomar uma decisão", "aconteceu e ainda penso nisso" e "não sei
exatamente" foram encaixados na mesma sequência de peso/urgência/controle/
ação por consistência — vale revisar se esse encaixe faz sentido ou se cada
um merece uma tela de entrada própria.

Para adicionar uma pergunta nova, crie um novo nó em `nodes` e aponte
alguma resposta existente (`next`) para o `id` dele.

## Ajustando a identidade visual

As cores, fontes e espaçamentos ficam centralizados no início de
`style.css`, na seção `:root`. A paleta atual:

| Uso | Cor |
|---|---|
| Fundo | `#E8E0D2` |
| Cartões | `#F8F5EE` |
| Texto | `#34312C` |
| Texto secundário | `#716C63` |
| Destaque | `#D9A83E` |
| Borda | `#CFC5B5` |

As perguntas usam a fonte **Permanent Marker** (tom manuscrito) e o restante
da interface usa **Figtree** (legibilidade), carregadas via Google Fonts.
