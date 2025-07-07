const API_URL = 'http://localhost:3000/api/mascotas';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('mascota-form');
  const msg = document.getElementById('form-msg');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Recolectar los datos del formulario
      const data = Object.fromEntries(new FormData(form).entries());
      data.edad = Number(data.edad);
      data.refugio_id = Number(data.refugio_id);

      try {
        // Hacer POST al endpoint de la API REST
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          msg.textContent = 'Mascota registrada correctamente 🐾';
          msg.classList.remove('has-text-danger');
          msg.classList.add('has-text-success');
          form.reset();
          // redireccionar después de unos segundos
          setTimeout(() => {
            window.location.href = 'index.html#mascotas';
          }, 1500);
        } else {
          const error = await response.json();
          msg.textContent = `Error: ${error.error || 'No se pudo registrar la mascota.'}`;
          msg.classList.remove('has-text-success');
          msg.classList.add('has-text-danger');
        }
      } catch (err) {
        console.error('Error de conexión:', err);
        msg.textContent = 'Error de conexión con el servidor.';
        msg.classList.remove('has-text-success');
        msg.classList.add('has-text-danger');
      }
    });
  }
});
