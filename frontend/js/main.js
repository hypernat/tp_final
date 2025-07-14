
const API_ADOPCIONES = 'http://localhost:3000/index/formularios_adopcion';
const API_USUARIOS = 'http://localhost:3000/index/usuarios';
const API_MASCOTAS = 'http://localhost:3000/index/mascotas';


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('mascota-form');
  const msg = document.getElementById('form-msg');
  const params = new URLSearchParams(window.location.search);
  const id_mascota = params.get('id');



  if (!id_mascota) {
    msg.textContent = 'No se especificó la mascota a adoptar.';
    msg.className = 'has-text-danger';
    form.style.display = 'none';
    return;
  }

  // Traer datos de la mascota para obtener id cuidador/refugio
 fetch(`http://localhost:3000/index/mascotas/${id_mascota}`)
  .then(res => res.json())
  .then(data => {
    form.id_mascota.value = data.id;

    // Validar id_cuidador:
    const idCuidador = data.refugio_id || data.cuidador_id || null;

    if (!idCuidador || idCuidador === 0) {
      msg.textContent = 'La mascota no tiene un cuidador válido.';
      msg.className = 'has-text-danger';
      form.style.display = 'none'; // o deshabilitar el botón enviar
      return;
    }

    form.id_cuidador.value = idCuidador;
  })
  .catch(() => {
    msg.textContent = 'No se pudo cargar la información de la mascota.';
    msg.className = 'has-text-danger';
    form.style.display = 'none';
  });

  form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const idCuidador = Number(formData.get('id_cuidador'));

  if (!idCuidador || idCuidador === 0) {
    msg.textContent = 'La mascota no tiene un cuidador válido asignado.';
    msg.className = 'has-text-danger';
    return; // No seguimos con el envío
  }

  const datosUsuario = {
    nombre: formData.get('nombre'),
    email: formData.get('email'),
    telefono: formData.get('telefono'),
    direccion: formData.get('direccion'),
    tiene_patio: formData.get('tiene_patio') === 'on',
    tiene_mas_mascotas: formData.get('tiene_mas_mascotas') === 'on',
  };

  try {
    // Crear usuario
    const resUsuario = await fetch(API_USUARIOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosUsuario)
    });

    if (!resUsuario.ok) throw new Error('Error creando usuario');

    const { id: id_usuario } = await resUsuario.json();

    // Crear formulario de adopción
    const datosAdopcion = {
      id_usuario,
      id_mascota: Number(formData.get('id_mascota')),
      id_cuidador: idCuidador,
      // comentario: formData.get('comentario'),
    };

    const resAdopcion = await fetch(API_ADOPCIONES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosAdopcion),
    });

    if (!resAdopcion.ok) throw new Error('Error creando adopción');

    msg.textContent = 'Solicitud enviada correctamente';
    msg.className = 'has-text-success';
    form.reset();

  } catch (error) {
    console.error(error);
    msg.textContent = 'Hubo un error enviando la solicitud.';
    msg.className = 'has-text-danger';
  }
});

});





// const API_URL = 'http://localhost:3000/api/mascotas';

// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('mascota-form');
//   const msg = document.getElementById('form-msg');

//   if (form) {
//     form.addEventListener('submit', async (e) => {
//       e.preventDefault();

//       // Recolectar los datos del formulario
//       const data = Object.fromEntries(new FormData(form).entries());
//       data.edad = Number(data.edad);
//       data.refugio_id = Number(data.refugio_id);

//       try {
//         // Hacer POST al endpoint de la API REST
//         const response = await fetch(API_URL, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(data)
//         });

//         if (response.ok) {
//           msg.textContent = 'Mascota registrada correctamente 🐾';
//           msg.classList.remove('has-text-danger');
//           msg.classList.add('has-text-success');
//           form.reset();
//           // redireccionar después de unos segundos
//           setTimeout(() => {
//             window.location.href = 'index.html#mascotas';
//           }, 1500);
//         } else {
//           const error = await response.json();
//           msg.textContent = `Error: ${error.error || 'No se pudo registrar la mascota.'}`;
//           msg.classList.remove('has-text-success');
//           msg.classList.add('has-text-danger');
//         }
//       } catch (err) {
//         console.error('Error de conexión:', err);
//         msg.textContent = 'Error de conexión con el servidor.';
//         msg.classList.remove('has-text-success');
//         msg.classList.add('has-text-danger');
//       }
//     });
//   }
// });
