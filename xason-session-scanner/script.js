async function getCode() {
  const number = document.getElementById('numberInput').value;
  const result = document.getElementById('result');

  result.textContent = 'Generating pairing code...';

  try {
    const res = await fetch(`/generate?number=${number}`);
    const data = await res.json();
    
    if (data && data.pairingCode) {
      result.textContent = `Pairing Code:\n${data.pairingCode}`;
    } else {
      result.textContent = `Error: ${data.error || 'Unknown error'}`;
    }
  } catch (err) {
    result.textContent = `Request failed: ${err.message}`;
  }
}
