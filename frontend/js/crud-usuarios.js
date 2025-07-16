const API_URL = 'http://localhost:3000/index/usuarios';

document.addEventListener('DOMContentLoaded', () => {
  cargarUsuarios();

  document.getElementById('addUsuarioForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const data = {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      telefono: form.telefono.value.trim(),
      direccion: form.direccion.value.trim(),
      tiene_patio: form.tiene_patio.checked,
      tiene_mas_mascotas: form.tiene_mas_mascotas.checked
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al agregar usuario');
      }
      form.reset();
      cargarUsuarios();
    } catch (error) {
      alert(error.message);
    }
  });
});

async function cargarUsuarios() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al cargar usuarios');
    const usuarios = await res.json();
    const tbody = document.querySelector('#usuariosTable tbody');
    tbody.innerHTML = '';

    usuarios.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td>${user.telefono}</td>
        <td>${user.direccion}</td>
        <td>${user.tiene_patio ? 'Sí' : 'No'}</td>
        <td>${user.tiene_mas_mascotas ? 'Sí' : 'No'}</td>
        <td>
          <button class="button is-small is-warning" onclick="editarUsuario(${user.id}, '${escapeHtml(user.nombre)}', '${escapeHtml(user.email)}', '${escapeHtml(user.telefono)}', '${escapeHtml(user.direccion)}', ${user.tiene_patio}, ${user.tiene_mas_mascotas})">Editar</button>
          <button class="button is-small is-danger" onclick="eliminarUsuario(${user.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    alert('No se pudieron cargar los usuarios.');
    console.error(error);
  }
}

async function eliminarUsuario(id) {
  if (confirm('¿Eliminar este usuario?')) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar usuario');
      cargarUsuarios();
    } catch (error) {
      alert(error.message);
    }
  }
}

async function editarUsuario(id, nombreActual, emailActual, telefonoActual, direccionActual, patioActual, masMascotasActual) {
  const nuevoNombre = prompt('Nuevo nombre:', nombreActual);
  if (!nuevoNombre) return alert('Nombre es obligatorio.');

  const nuevoEmail = prompt('Nuevo email:', emailActual);
  if (!nuevoEmail) return alert('Email es obligatorio.');

  const nuevoTelefono = prompt('Nuevo teléfono:', telefonoActual);
  if (!nuevoTelefono) return alert('Teléfono es obligatorio.');

  const nuevaDireccion = prompt('Nueva dirección:', direccionActual);
  if (!nuevaDireccion) return alert('Dirección es obligatoria.');

  const nuevoTienePatio = confirm('¿Tiene patio? OK = Sí, Cancelar = No');
  const nuevoTieneMasMascotas = confirm('¿Tiene más mascotas? OK = Sí, Cancelar = No');

  const data = {
    nombre: nuevoNombre.trim(),
    email: nuevoEmail.trim(),
    telefono: nuevoTelefono.trim(),
    direccion: nuevaDireccion.trim(),
    tiene_patio: nuevoTienePatio,
    tiene_mas_mascotas: nuevoTieneMasMascotas
  };

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar usuario');
    }
    cargarUsuarios();
  } catch (error) {
    alert(error.message);
  }
}

function escapeHtml(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
