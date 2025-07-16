const API_CUIDADORES = 'http://localhost:3000/index/cuidadores';

async function cargarCuidadores() {
  const res = await fetch(API_CUIDADORES);
  const cuidadores = await res.json();
  const tbody = document.querySelector('#cuidadoresTable tbody');
  tbody.innerHTML = '';
  cuidadores.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.email}</td>
      <td>${c.tipo}</td>
      <td>${c.animales_a_cargo}</td>
      <td>${c.disponibilidad_horaria}</td>
      <td>
        <button class="button is-small is-warning" onclick="editarCuidador(${c.id}, '${c.nombre}', '${c.email}', '${c.tipo}', ${c.animales_a_cargo}, '${c.disponibilidad_horaria}')">Editar</button>
        <button class="button is-small is-danger" onclick="eliminarCuidador(${c.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addCuidadorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      tipo: form.tipo.value,
      animales_a_cargo: Number(form.animales_a_cargo.value),
      disponibilidad_horaria: form.disponibilidad_horaria.value
    };
    await fetch(API_CUIDADORES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    form.reset();
    cargarCuidadores();
  });

  cargarCuidadores();
});

async function eliminarCuidador(id) {
  if (confirm('¿Eliminar este cuidador?')) {
    await fetch(`${API_CUIDADORES}/${id}`, { method: 'DELETE' });
    cargarCuidadores();
  }
}

async function editarCuidador(id, nombre, email, tipo, animales_a_cargo, disponibilidad_horaria) {
  const nuevoNombre = prompt('Nuevo nombre:', nombre);
  const nuevoEmail = prompt('Nuevo email:', email);
  const nuevoTipo = prompt('Nuevo tipo:', tipo);
  const nuevosAnimales = prompt('Nuevos animales a cargo:', animales_a_cargo);
  const nuevaDisp = prompt('Nueva disponibilidad horaria:', disponibilidad_horaria);

  if (nuevoNombre && nuevoEmail && nuevoTipo && nuevosAnimales && nuevaDisp) {
    await fetch(`${API_CUIDADORES}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nuevoNombre,
        email: nuevoEmail,
        tipo: nuevoTipo,
        animales_a_cargo: parseInt(nuevosAnimales),
        disponibilidad_horaria: nuevaDisp
      })
    });
    cargarCuidadores();
  }
}
