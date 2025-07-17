const API_URL = 'http://localhost:3000/index/formularios';

// Cargar y mostrar todos los formularios
async function cargarFormularios() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al cargar formularios');
    const formularios = await res.json();
    const tbody = document.querySelector('#formulariosTable tbody');
    tbody.innerHTML = '';

    formularios.forEach((form) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${form.id}</td>
        <td>${form.fecha}</td>
        <td>${form.estado}</td>
        <td>${form.id_mascota}</td>
        <td>${form.id_usuario}</td>
        <td>${form.id_cuidador}</td>
        <td>${form.comentario || ''}</td>
        <td>
          <button class="button is-small is-warning" onclick="editarFormulario(${form.id})">Editar</button>
          <button class="button is-small is-danger" onclick="eliminarFormulario(${form.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    alert('No se pudo cargar los formularios.');
    console.error(error);
  }
}

// Manejo del formulario agregar/editar
const formularioForm = document.getElementById('formularioForm');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

formularioForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('form-id').value;
  const fecha = document.getElementById('form-fecha').value;
  const estado = document.getElementById('form-estado').value;
  const id_mascota = Number(document.getElementById('form-id-mascota').value);
  const id_usuario = Number(document.getElementById('form-id-usuario').value);
  const id_cuidador = Number(document.getElementById('form-id-cuidador').value);
  const comentario = document.getElementById('form-comentario').value;

  if (!fecha || !estado || !id_mascota || !id_usuario || !id_cuidador || !comentario) {
    alert('Por favor, complete todos los campos obligatorios.');
    return;
  }

  const data = {
    fecha,
    estado,
    id_mascota,
    id_usuario,
    id_cuidador,
    comentario,
  };

  try {
    let res;
    if (id) {
      // Editar formulario
      res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      // Crear formulario
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error desconocido');
    }

    // Reset formulario y recargar tabla
    formularioForm.reset();
    document.getElementById('form-id').value = '';
    formTitle.textContent = 'Agregar nuevo formulario';
    submitBtn.textContent = 'Agregar';
    cancelEditBtn.style.display = 'none';

    cargarFormularios();
  } catch (error) {
    alert('Error al guardar el formulario: ' + error.message);
    console.error(error);
  }
});

// Editar formulario: carga datos en el formulario para editar
async function editarFormulario(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Formulario no encontrado');
    const form = await res.json();

    document.getElementById('form-id').value = form.id;
    document.getElementById('form-fecha').value = form.fecha;
    document.getElementById('form-estado').value = form.estado;
    document.getElementById('form-id-mascota').value = form.id_mascota;
    document.getElementById('form-id-usuario').value = form.id_usuario;
    document.getElementById('form-id-cuidador').value = form.id_cuidador;
    document.getElementById('form-comentario').value = form.comentario || '';

    formTitle.textContent = 'Editar formulario ID ' + form.id;
    submitBtn.textContent = 'Guardar cambios';
    cancelEditBtn.style.display = 'inline-block';
  } catch (error) {
    alert('No se pudo cargar el formulario para editar');
    console.error(error);
  }
}

// Cancelar edición y reset formulario
cancelEditBtn.addEventListener('click', () => {
  formularioForm.reset();
  document.getElementById('form-id').value = '';
  formTitle.textContent = 'Agregar nuevo formulario';
  submitBtn.textContent = 'Agregar';
  cancelEditBtn.style.display = 'none';
});

// Eliminar formulario
async function eliminarFormulario(id) {
  if (!confirm('¿Está seguro que desea eliminar este formulario?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar');
    cargarFormularios();
  } catch (error) {
    alert('No se pudo eliminar el formulario.');
    console.error(error);
  }
}

// Carga inicial
document.addEventListener('DOMContentLoaded', cargarFormularios);
