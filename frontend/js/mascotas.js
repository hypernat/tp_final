let mascotas = [];
let cuidadores = [];


async function cargarTarjetas() {
  const contenedor = document.getElementById('contenedor-mascotas');

  try {
    const plantilla = await fetch('tarjetas.html').then(r => r.text());
    mascotas = await fetch('http://localhost:3000/index/mascotas').then(r => r.json());
    cuidadores = await fetch('http://localhost:3000/index/cuidadores').then(r => r.json());


    mascotas.forEach(mascota => {
      const cuidador = cuidadores.find(c => c.id === mascota.id_cuidador);
      const nombreCuidador = cuidador ? cuidador.nombre : 'Desconocido';
      const emailCuidador = cuidador ? cuidador.email : 'No disponible';
      const disponibilidadCuidador = cuidador ? cuidador.disponibilidad_horaria : 'No disponible';

      console.log('Insertando tarjeta para:', mascota.nombre);

      let rutaImagen = mascota.imagen ? mascota.imagen.replace(/^\/+/, '') : '';
      if (rutaImagen && !rutaImagen.startsWith('imagenes/')) {
        rutaImagen = 'imagenes/' + rutaImagen;
      }
      if (!rutaImagen) {
        rutaImagen = 'https://via.placeholder.com/300';
      }

      let html = plantilla
        .replace(/{{id}}/g, mascota.id) 
        .replace(/{{imagen}}/g, rutaImagen)
        .replace(/{{nombre}}/g, mascota.nombre)
        .replace(/{{edad_estimada}}/g, mascota.edad_estimada)
        .replace(/{{especie}}/g, mascota.especie)
        .replace(/{{descripcion}}/g, mascota.descripcion)
        .replace(/{{tamaño}}/g, mascota.tamaño)
        .replace(/{{esta_vacunado}}/g, mascota.esta_vacunado ? 'Sí' : 'No')
        .replace(/{{cuidador}}/g, nombreCuidador)
        .replace(/{{email}}/g, emailCuidador)
        .replace(/{{disponibilidad}}/g, disponibilidadCuidador);


      contenedor.insertAdjacentHTML('beforeend', html);
    });

    
    document.querySelectorAll('.btn-ver-mas').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('modal-nombre').textContent = btn.dataset.nombre;
        document.getElementById('modal-imagen').src = btn.dataset.imagen;
        document.getElementById('modal-imagen').alt = btn.dataset.nombre;
        document.getElementById('modal-edad').textContent = btn.dataset.edad;
        document.getElementById('modal-especie').textContent = btn.dataset.especie;
        document.getElementById('modal-descripcion').textContent = btn.dataset.descripcion;
        document.getElementById('modal-tamano').textContent = btn.dataset.tamano;
        document.getElementById('modal-vacunado').textContent = btn.dataset.vacunado;
        document.getElementById('modal-cuidador').textContent = btn.dataset.cuidador || 'No asignado';
        document.getElementById('modal-email').textContent = btn.dataset.email || 'No disponible';
        document.getElementById('modal-disponibilidad').textContent = btn.dataset.disponibilidad || 'No disponible';

        document.getElementById('modal-mascota').classList.add('is-active');
      });
    });

  } catch (error) {
    console.error('Error cargando tarjetas:', error);
    contenedor.innerHTML = `<p class="has-text-danger">No se pudieron cargar las mascotas.</p>`;
  }
}
// Eventos para cerrar el modal


document.querySelector('.modal-close').addEventListener('click', cerrarModal);
document.querySelector('.modal-background').addEventListener('click', cerrarModal);

document.addEventListener('DOMContentLoaded', () => {
  cargarTarjetas();

  document.querySelector('.modal-close').addEventListener('click', cerrarModal);
  document.querySelector('.modal-background').addEventListener('click', cerrarModal);
  
  // Delegación para btn-adoptar: 
  // Esperar que las tarjetas se carguen antes de asignar eventos
  document.getElementById('contenedor-mascotas').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-adoptar')) {
      const idMascotaSeleccionada = Number(e.target.dataset.id);
      const mascota = mascotas.find(m => m.id === idMascotaSeleccionada);
      const cuidador = cuidadores.find(c => c.id === mascota.id_cuidador);
      const idCuidador = cuidador ? cuidador.id : null;
      
      if (!cuidador || idCuidador === 0) {
        alert('La mascota no tiene un cuidador válido asignado.');
        return;
      }

      const usuarioId = 1; // Reemplazá por el id del usuario real

      fetch('http://localhost:3000/index/formularios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_mascota: mascota.id,
          id_usuario: usuarioId,
          id_cuidador: idCuidador,
        }),
      })
      .then(res => {
        if (!res.ok) throw new Error('Error al enviar la adopción');
        return res.json();
      })
      .then(data => {
        alert('Solicitud de adopción enviada con éxito');
      })
      .catch(error => {
        console.error(error);
        alert('Error enviando la solicitud de adopción');
      });
    }
  });
});

function cerrarModal() {
            document.getElementById('modal-mascota').classList.remove('is-active');
          }