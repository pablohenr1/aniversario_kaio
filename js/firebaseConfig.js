// ============================================================
// CONFIGURAÇÃO DO FIREBASE
// ============================================================
// 1. Acesse https://console.firebase.google.com
// 2. Crie um projeto novo (ex: "rsvp-kaio")
// 3. Dentro do projeto: clique no ícone "</>" (Web) para criar um app Web
// 4. Copie o objeto "firebaseConfig" que aparece e cole abaixo, substituindo
//    o objeto de exemplo
// 5. Ative o Firestore: menu lateral > Build > Firestore Database > Create database
//    (escolha "Start in production mode" e a região "southamerica-east1")
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyBSr3skkT1XG2GuqzszYy44vyC6oorD5Bk",
  authDomain: "aniversariokaio-7368b.firebaseapp.com",
  projectId: "aniversariokaio-7368b",
  storageBucket: "aniversariokaio-7368b.firebasestorage.app",
  messagingSenderId: "911950150447",
  appId: "1:911950150447:web:0f763d63e7cb1da7ef7fda",
  measurementId: "G-9VR1H3EP49"
};

// Inicializa o Firebase e o Firestore (usando a versão modular via CDN)
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
