# RSVP — Aniversário do Kaio

Projeto simples de confirmação de presença: um formulário para os convidados
e um dashboard ao vivo para o Kaio acompanhar quem confirmou. Usa o
**Firebase (Firestore)** como banco de dados — plano gratuito (Spark) é mais
que suficiente pra esse uso.

## Estrutura do projeto

```
rsvp-project/
├── index.html          → formulário que você manda para os convidados
├── dashboard.html       → painel que só o Kaio acessa (mostra a lista ao vivo)
├── css/
│   └── style.css
├── js/
│   ├── firebaseConfig.js  → onde você cola a config do seu projeto Firebase
│   ├── form.js             → lógica do formulário
│   └── dashboard.js        → lógica do dashboard (tempo real via onSnapshot)
└── README.md
```

## Passo 1 — Criar o projeto no Firebase

1. Acesse **https://console.firebase.google.com**
2. Clique em **Adicionar projeto**, dê um nome (ex: `rsvp-kaio`) e siga o assistente (pode desativar o Google Analytics, não precisa).
3. Quando o projeto abrir, clique no ícone **`</>`** (Web) para registrar um app Web.
4. Dê um apelido pro app (ex: `rsvp-web`) e clique em **Registrar app**.
5. O Firebase vai te mostrar um objeto `firebaseConfig` parecido com este:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "rsvp-kaio.firebaseapp.com",
  projectId: "rsvp-kaio",
  storageBucket: "rsvp-kaio.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

Copie esse objeto inteiro.

## Passo 2 — Colar a configuração no projeto

Abra `js/firebaseConfig.js` e substitua o objeto de exemplo pelo que você copiou do Firebase.

## Passo 3 — Ativar o Firestore

No menu lateral do Firebase: **Build** → **Firestore Database** → **Create database**.
- Escolha **Start in production mode**.
- Região: `southamerica-east1` (São Paulo).

## Passo 4 — Configurar as regras de segurança

Ainda no Firestore, vá na aba **Rules** e substitua pelo seguinte:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rsvps/{document} {
      allow create: if true;   // qualquer convidado pode confirmar presença
      allow read: if true;     // o dashboard consegue ler a lista
      allow update, delete: if false; // ninguém edita ou apaga pelo site
    }
  }
}
```

Clique em **Publish**.

> A coleção `rsvps` é criada sozinha automaticamente na primeira vez que
> alguém confirmar presença pelo formulário — não precisa criar nada manualmente.

## Passo 5 — Rodar localmente

Assim como antes, não dá pra abrir o `index.html` com duplo clique (o navegador
bloqueia módulos ao abrir arquivo direto do disco).

**Opção A — VS Code (recomendado, já que você já usa):**
1. Abra a pasta `rsvp-project` no VS Code.
2. Instale a extensão **Live Server**.
3. Clique com o botão direito em `index.html` → **Open with Live Server**.
4. Faça o mesmo com `dashboard.html` (ou troque a URL na aba do navegador).

**Opção B — terminal:**
```
cd rsvp-project
python -m http.server 8000
```
Acesse `http://localhost:8000/index.html` e `http://localhost:8000/dashboard.html`.

## Passo 6 — Publicar de verdade (pra mandar pro pessoal)

Quando testar e estiver tudo certo, suba a pasta inteira numa hospedagem gratuita:

- **Firebase Hosting** (já que você está no ecossistema Firebase):
  ```
  npm install -g firebase-tools
  firebase login
  firebase init hosting
  firebase deploy
  ```
- **Netlify** (mais simples, arrasta a pasta): https://app.netlify.com/drop
- **Vercel**: https://vercel.com

Isso te dá dois links reais:
- `seusite.com/index.html` → manda pro grupo/convidados
- `seusite.com/dashboard.html` → só você acessa, pra ver quem confirmou ao vivo

## Como funciona o tempo real

O dashboard usa `onSnapshot` do Firestore — ele fica "escutando" a coleção
`rsvps` e atualiza a tela sozinho a cada nova confirmação, sem precisar
apertar em nenhum botão nem recarregar a página.

## Nota de segurança

As regras acima deixam qualquer pessoa com o link do site inserir e ler
confirmações — não tem senha. Pra um convite de aniversário isso é normal e
suficiente. Se um dia quiser mais controle (por exemplo, exigir login pra ver
o dashboard), dá pra evoluir usando o **Firebase Authentication**.
