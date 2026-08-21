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

## Ajustando o fluxo de perguntas

Toda a lógica de decisão vive em `script.js`, no objeto `questions`. Cada
pergunta é um nó com um `text`, um `helper` opcional e uma lista de
`answers`. Cada resposta aponta para o próximo nó (`next: "id_do_no"`) ou
para um resultado final (`next: "outcome:aja"`, por exemplo).

Os seis resultados possíveis vivem no objeto `outcomes`: **Aja agora**,
**Planeje**, **Investigue**, **Prepare-se**, **Aguarde** e **Deixe ir**.
Para mudar o texto ou o ícone de um resultado, edite o objeto correspondente.

Para adicionar uma pergunta nova, basta criar um novo nó em `questions` e
apontar alguma resposta existente para o `id` dele.

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
