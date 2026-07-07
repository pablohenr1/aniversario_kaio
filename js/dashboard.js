function updateStats(rows) {
  document.getElementById('statTotal').textContent = rows.length;
  document.getElementById('statYes').textContent = rows.filter(r => r.status === 'yes').length;
  document.getElementById('statNo').textContent = rows.filter(r => r.status === 'no').length;
}

function formatTime(timestamp) {
  try {
    if (!timestamp || !timestamp.toDate) return 'agora mesmo';
    const d = timestamp.toDate();
    return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderGuestList(rows) {
  const listEl = document.getElementById('guestList');
  const emptyEl = document.getElementById('emptyState');
  const lastUpdatedEl = document.getElementById('lastUpdated');

  if (rows.length === 0) {
    listEl.innerHTML = '';
    emptyEl.classList.remove('hidden');
  } else {
    emptyEl.classList.add('hidden');
    listEl.innerHTML = rows.map(row => `
      <div class="guest-row">
        <span class="name">${escapeHtml(row.name)}<span class="time">${formatTime(row.createdAt)}</span></span>
        <span class="tag ${row.status}">${row.status === 'yes' ? 'Confirmado' : 'Não vai'}</span>
      </div>
    `).join('');
  }

  updateStats(rows);
  lastUpdatedEl.innerHTML = '<span class="live-dot"></span>Ao vivo · última atualização às ' + new Date().toLocaleTimeString('pt-BR');
}

// Busca manual (usada pelo botão "Atualizar lista")
function loadDashboard() {
  document.getElementById('guestList').innerHTML = '<p class="loading-state">Carregando...</p>';

  db.collection('rsvps').orderBy('createdAt', 'desc').get()
    .then((snapshot) => {
      const rows = snapshot.docs.map(doc => doc.data());
      renderGuestList(rows);
    })
    .catch((err) => {
      console.error(err);
      document.getElementById('guestList').innerHTML =
        '<p class="loading-state">Erro ao carregar respostas. Verifique a configuração do Firebase.</p>';
    });
}

// Escuta o Firestore em tempo real: qualquer nova confirmação aparece
// automaticamente aqui, sem precisar apertar em nada.
db.collection('rsvps').orderBy('createdAt', 'desc')
  .onSnapshot((snapshot) => {
    const rows = snapshot.docs.map(doc => doc.data());
    renderGuestList(rows);
  }, (err) => {
    console.error(err);
    document.getElementById('guestList').innerHTML =
      '<p class="loading-state">Erro ao carregar respostas. Verifique a configuração do Firebase.</p>';
  });
