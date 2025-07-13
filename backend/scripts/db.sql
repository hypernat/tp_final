create table mascotas(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    edad_estimada INT NOT NULL,
    tamaño VARCHAR(20) NOT NULL,
    esta_vacunado BOOLEAN NOT NULL,
    imagen VARCHAR(200),
    descripcion VARCHAR(100) NOT NULL
);
create table usuarios(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    tiene_patio BOOLEAN,
    tiene_mas_mascotas BOOLEAN
);
create table cuidadores(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    tipo VARCHAR(150) NOT NULL,
    animales_a_cargo INT NOT NULL,
    disponibilidad_horaria VARCHAR(180) NOT NULL
);
create table formularios_adopcion(
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    estado VARCHAR(50) NOT NULL,
    id_mascota INT NOT NULL REFERENCES mascotas(id),
    id_usuario INT NOT NULL REFERENCES usuarios(id),
    id_cuidador INT NOT NULL REFERENCES cuidador(id),
    comentario VARCHAR(200)
);