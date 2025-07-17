const API_ADOPCIONES = 'http://localhost:3000/index/formularios';
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
    const idCuidador = data.id_cuidador || null;

    if (!idCuidador || idCuidador === 0) {
      msg.textContent = 'La mascota no tiene un cuidador válido.';
      msg.className = 'has-text-danger';
      form.style.display = 'none'; 
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
    body: JSON.stringify(datosUsuario),
    });

    const respuestaUsuario = await resUsuario.json();
    console.log('Respuesta usuario:', respuestaUsuario);

    if (!resUsuario.ok) {
     throw new Error(respuestaUsuario.error || 'Error creando usuario');
    }

    const id_usuario = respuestaUsuario;

    

    

    // Crear formulario de adopción
    const datosAdopcion = {
       fecha: new Date().toISOString().split('T')[0],  
       estado: 'pendiente',                            
       id_usuario:id_usuario.id,
       id_mascota: Number(formData.get('id_mascota')),
       id_cuidador: idCuidador,
       comentario: formData.get('comentario') || null,
};

console.log('Datos a enviar:', datosAdopcion);

    const resAdopcion = await fetch(API_ADOPCIONES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosAdopcion),
    });

    const respuestaJson = await resAdopcion.json();
    console.log('Respuesta del backend:', respuestaJson);


    if (!resAdopcion.ok) throw new Error('Error creando adopción');

    mostrarToast('Formulario enviado con éxito', 'is-success');
    form.reset();

  } catch (error) {
    console.error(error);
    mostrarToast(error.message, 'is-danger');
  }
});

});

function mostrarToast(mensaje, tipo = 'is-success') {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  
  toast.className = `notification ${tipo} is-light`;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000); // desaparece a los 3 segundos
}





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
