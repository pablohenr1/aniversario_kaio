let chosenStatus = null;

function selectChoice(status) {
  chosenStatus = status;
  document.getElementById('btnYes').classList.toggle('selected', status === 'yes');
  document.getElementById('btnYes').classList.toggle('yes', status === 'yes');
  document.getElementById('btnNo').classList.toggle('selected', status === 'no');
  document.getElementById('btnNo').classList.toggle('no', status === 'no');
  checkFormValid();
}

function checkFormValid() {
  const name = document.getElementById('nameInput').value.trim();
  document.getElementById('submitBtn').disabled = !(name && chosenStatus);
}

document.getElementById('nameInput').addEventListener('input', checkFormValid);

async function submitRsvp() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name || !chosenStatus) return;

  const submitBtn = document.getElementById('submitBtn');
  const formMsg = document.getElementById('formMsg');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';
  formMsg.textContent = '';

  try {
    await db.collection('rsvps').add({
      name: name,
      status: chosenStatus,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    document.getElementById('formStep').classList.add('hidden');
    document.getElementById('confirmedStep').classList.remove('hidden');
    document.getElementById('confirmedMsg').textContent = chosenStatus === 'yes'
      ? `Obrigado, ${name}! Sua presença está confirmada. Te esperamos lá 🥃`
      : `Obrigado por avisar, ${name}. Sentiremos sua falta!`;

  } catch (err) {
    console.error(err);
    formMsg.textContent = 'Não foi possível enviar agora. Verifique sua internet e tente novamente.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirmar';
  }
}
