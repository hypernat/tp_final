const API_FORMULARIOS = 'http://localhost:3000/index/formularios';
const API_MASCOTAS = 'http://localhost:3000/index/mascotas';
const API_USUARIOS = 'http://localhost:3000/index/usuarios';

document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('solicitudes-container');

  try {
    const formularios = await fetch(API_FORMULARIOS).then(r => r.json());

    if (!Array.isArray(formularios)) {
      contenedor.innerHTML = '<p>No hay formularios disponibles.</p>';
      return;
    }

    for (const formulario of formularios) {
      if (formulario.estado !== 'pendiente') continue;

      const mascota = await fetch(`${API_MASCOTAS}/${formulario.id_mascota}`).then(r => r.json());
      const usuario = await fetch(`${API_USUARIOS}/${formulario.id_usuario}`).then(r => r.json());

      const div = document.createElement('div');
      div.className = 'tarjeta-formulario';
      div.innerHTML = `
        <h3>Solicitud #${formulario.id}</h3>
        <p><strong>Mascota:</strong> ${mascota.nombre}</p>
        <p><strong>Usuario:</strong> ${usuario.nombre}</p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Comentario:</strong> ${formulario.comentario || '(sin comentario)'}</p>
        <button data-id="${formulario.id}" class="btn-aceptar">Aceptar</button>
        <button data-id="${formulario.id}" class="btn-rechazar">Rechazar</button>
        <hr/>
      `;
      contenedor.appendChild(div);
    }

    contenedor.addEventListener('click', async (e) => {
      if (!e.target.dataset.id) return;

      const id = e.target.dataset.id;
      const nuevoEstado = e.target.classList.contains('btn-aceptar') ? 'aceptado' : 'rechazado';

      const confirmacion = confirm(`¿Seguro que querés marcar el formulario #${id} como ${nuevoEstado}?`);
        if (!confirmacion) return;

        try {
        // obtener el formulario completo para tener todos los datos necesarios
        
        const fullFormulario = await fetch(`${API_FORMULARIOS}/${id}`).then(r => r.json());
        
        const body = {
            fecha: new Date().toISOString().split('T')[0],
            estado: nuevoEstado,
            id_usuario: fullFormulario.id_usuario,
            id_mascota: fullFormulario.id_mascota,
            id_cuidador: fullFormulario.id_cuidador,
            comentario: fullFormulario.comentario
        };

        
        const res = await fetch(`${API_FORMULARIOS}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
            const text = await res.text(); 
            console.error('Error backend:', text);
            throw new Error('No se pudo actualizar el formulario');
        }


        alert(`Formulario #${id} actualizado como ${nuevoEstado}`);
        location.reload();
      } catch (error) {
        console.error(error);
        alert('Hubo un error actualizando el formulario.');
      }
    });

    } catch (err) {
    console.error('Error cargando formularios:', err);
    contenedor.innerHTML = '<p>Error al cargar los formularios.</p>';
}
});
