# Convite para padrinhos e madrinhas — Carlos & Amanda

Site de convite em **Vue 3 + Vite**. O visitante vê um envelope fechado; ao tocar nele, o envelope abre e revela o convite: apresentação do casal, fotos, a carta, o versículo e, no final, **a pergunta**:

> Vocês aceitam ser nossos padrinhos e madrinhas de casamento? 💍🤍

- **Sim! ❤️** abre o WhatsApp com a mensagem de aceitação já preenchida (a pessoa revisa e envia).
- **Não 🥺** foge de verdade: no celular, quando o dedo encosta; no computador, quando o cursor chega perto. Ele nunca sai da área do cartão nem fica por cima do "Sim".

O site é único e coletivo (um só link para todos os padrinhos e madrinhas).

## Como rodar

Precisa do [Node.js](https://nodejs.org) (versão 18 ou mais nova).

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente `http://localhost:5173`).

Para gerar a versão final para publicar:

```bash
npm run build
```

A pasta `dist/` gerada é o site pronto. Pode subir em qualquer hospedagem (Netlify, Vercel, GitHub Pages, etc.).

## O que você precisa conferir

1. **Número do WhatsApp** (`src/config/invite.js`, bloco `whatsapp`). Hoje está `+55 31 9089-6457`. Esse número tem só 8 dígitos depois do DDD; celulares do Brasil costumam ter 9 (começando com 9, por exemplo `+55 31 99089-6457`). Teste o link com o seu celular e, se o WhatsApp disser que o número não existe, ajuste ali.
2. **Datas e locais** (blocos `ceremony` e `dinner`). Foram mantidos do convite anterior. Se não quiser mostrar essa parte para os padrinhos, coloque `showEvents: false`.
3. **Fotos** em `public/images/` (veja abaixo).

## Como trocar a foto da pergunta final (alianças)

A imagem que aparece acima da pergunta é o arquivo `public/images/aliancas.jpg`. Para trocar:

1. Coloque a nova imagem em `public/images/` (pode substituir o `aliancas.jpg` mantendo o nome, ou usar outro nome).
2. Em `src/config/invite.js`, no bloco `question`, ajuste:

```js
image: 'images/aliancas.jpg',
imageAlt: 'Descrição da imagem',
```

Se deixar `image: ''` (ou o arquivo não existir), o site mostra a ilustração das alianças desenhada no código (`RingsArt.vue`). O ideal é uma imagem horizontal, com cerca de 700 a 1400 px de largura.

## Como editar textos, versículo e mensagem do WhatsApp

Tudo fica em **`src/config/invite.js`**:

| O que mudar | Onde |
|---|---|
| Frase de boas-vindas, título e frase curta do topo | `welcome`, `headline`, `tagline` |
| Texto da carta | `letter` |
| Versículo e frase complementar | `verse` |
| Pergunta final, textos dos botões e mensagens do "Não" | `question` |
| Número e mensagem do WhatsApp | `whatsapp` |

O número pode ser escrito do jeito que preferir (`+55 31 9089-6457`): o site converte sozinho para o formato do link (`https://wa.me/55...`). A mensagem é codificada automaticamente, inclusive os emojis.

## Como trocar as fotos

1. Copie as fotos para a pasta **`public/images/`**.
2. Em `src/config/invite.js`, ajuste o bloco `photos`:

```js
photos: {
  main: 'images/foto.pre.jpeg',
  gallery: ['images/f.jpeg', 'images/fot.jpeg', 'images/fo.jpeg']
}
```

Dicas:

- O caminho **não** começa com `/` e **não** inclui `public` (use `images/nome.jpg`).
- Para mostrar só a foto principal, deixe `gallery: []`.
- As fotos **não são cortadas**: aparecem inteiras, com a proporção original.
- Se uma foto não existir, o site **não quebra**: aparece um espaço reservado dourado.

## Estrutura do projeto

```
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── images/                  ← fotos do casal e imagem das alianças
└── src/
    ├── main.js
    ├── App.vue                  ← troca entre envelope e convite
    ├── style.css                ← cores e fontes globais
    ├── config/
    │   └── invite.js            ← textos, versículo, WhatsApp e fotos
    ├── utils/
    │   ├── whatsapp.js          ← monta o link wa.me
    │   └── escape.js            ← cálculo de onde o "Não" foge
    ├── directives/
    │   └── reveal.js            ← aparecer suavemente ao rolar a página
    └── components/
        ├── EnvelopeScreen.vue   ← tela 1: envelope animado
        ├── InvitationPage.vue   ← tela 2: convite completo
        ├── FinalQuestion.vue    ← a pergunta final (Sim / Não fujão)
        ├── RingsArt.vue         ← ilustração das alianças
        ├── PhotoFrame.vue       ← moldura de foto
        ├── Floral.vue           ← ornamento floral
        └── Divider.vue          ← divisor dourado
```

## Personalização rápida

- **Cores:** variáveis no topo de `src/style.css` (`--gold`, `--ivory`, etc.).
- **Fontes:** *Great Vibes* (cursiva) e *Cormorant Garamond* (texto), já incluídas no projeto (funcionam sem internet).
- **Velocidade do "Não":** em `FinalQuestion.vue`, `PROXIMITY` (distância em que ele foge no computador) e a transição `.arena.ready .slot`.
- **Voltar ao envelope:** o botão no fim da página. Para removê-lo, apague a linha `<button class="back" ...>` em `InvitationPage.vue`.
- **Movimento reduzido:** quem ativa "reduzir movimento" no aparelho vê as animações encurtadas, e o "Não" continua fugindo (só que sem deslizar).
