const API_MASCOTAS = 'http://localhost:3000/index/mascotas';

let mascotas = [];
let editandoId = null; // Para saber si estamos editando

document.addEventListener('DOMContentLoaded', () => {
  cargarMascotas();

  const form = document.getElementById('form-mascota');
  form.addEventListener('submit', manejarEnvioFormulario);

  document.getElementById('btn-cancelar').addEventListener('click', resetearFormulario);
});

async function cargarMascotas() {
  try {
    const res = await fetch(API_MASCOTAS);
    if (!res.ok) throw new Error('Error al cargar mascotas');
    mascotas = await res.json();
    mostrarMascotasEnTabla(mascotas);
  } catch (error) {
    console.error(error);
    alert('No se pudieron cargar las mascotas');
  }
}

function mostrarMascotasEnTabla(mascotas) {
  const tbody = document.getElementById('tabla-mascotas-body');
  tbody.innerHTML = '';

  mascotas.forEach(mascota => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${mascota.id}</td>
      <td>${mascota.nombre}</td>
      <td>${mascota.especie}</td>
      <td>${mascota.edad_estimada}</td>
      <td>${mascota.tamaño}</td>
      <td>${mascota.esta_vacunado ? 'Sí' : 'No'}</td>
      <td>${mascota.descripcion}</td>
      <td>${mascota.id_cuidador ?? ''}</td>
      <td>
        <button class="button is-warning btn-editar" data-id="${mascota.id}">Editar</button>
  			<button class="button is-danger btn-eliminar" data-id="${mascota.id}">Eliminar</button>
			</td>

    `;
    tbody.appendChild(tr);
  });

  // Agregar eventos a botones
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => cargarMascotaEnFormulario(btn.dataset.id));
  });

  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => eliminarMascota(btn.dataset.id));
  });
}

async function cargarMascotaEnFormulario(id) {
  try {
    const res = await fetch(`${API_MASCOTAS}/${id}`);
    if (!res.ok) throw new Error('No se encontró la mascota');
    const mascota = await res.json();

    editandoId = mascota.id;

    const form = document.getElementById('form-mascota');
    form.nombre.value = mascota.nombre;
    form.especie.value = mascota.especie;
    form.edad_estimada.value = mascota.edad_estimada;
    form.tamaño.value = mascota.tamaño;
    form.esta_vacunado.checked = mascota.esta_vacunado;
    form.descripcion.value = mascota.descripcion;
    form.id_cuidador.value = mascota.id_cuidador || '';

    document.getElementById('btn-submit').textContent = 'Actualizar Mascota';
    document.getElementById('btn-cancelar').style.display = 'inline-block';
  } catch (error) {
    alert(error.message);
  }
}

async function manejarEnvioFormulario(e) {
  e.preventDefault();

  const form = e.target;

  const datos = {
    nombre: form.nombre.value.trim(),
    especie: form.especie.value.trim(),
    edad_estimada: parseInt(form.edad_estimada.value, 10),
    tamaño: form.tamaño.value.trim(),
    esta_vacunado: form.esta_vacunado.checked,
    imagen:null,
    descripcion: form.descripcion.value.trim(),
    id_cuidador: form.id_cuidador.value ? parseInt(form.id_cuidador.value, 10) : null,
  };

  // Validaciones básicas
  if (!datos.nombre || !datos.especie || isNaN(datos.edad_estimada) || !datos.tamaño || !datos.descripcion) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }

  try {
    let res;
    if (editandoId) {
      // Actualizar
      res = await fetch(`${API_MASCOTAS}/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
    } else {
      // Crear
      res = await fetch(API_MASCOTAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
    }

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Error en la petición');
    }

    alert(editandoId ? 'Mascota actualizada' : 'Mascota creada');
    resetearFormulario();
    cargarMascotas();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function eliminarMascota(id) {
  if (!confirm('¿Seguro que querés eliminar esta mascota?')) return;

  try {
    const res = await fetch(`${API_MASCOTAS}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('No se pudo eliminar');

    alert('Mascota eliminada');
    cargarMascotas();
  } catch (error) {
    alert('Error al eliminar: ' + error.message);
  }
}

function resetearFormulario() {
  editandoId = null;
  const form = document.getElementById('form-mascota');
  form.reset();
  document.getElementById('btn-submit').textContent = 'Crear Mascota';
  document.getElementById('btn-cancelar').style.display = 'none';
}
