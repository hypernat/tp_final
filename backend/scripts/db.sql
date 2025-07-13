create table cuidador(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    tipo VARCHAR(150) NOT NULL,
    animales_a_cargo INT NOT NULL,
    disponibilidad_horaria VARCHAR(180) NOT NULL
);
create table mascotas(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    edad_estimada INT NOT NULL,
    tamaño VARCHAR(20) NOT NULL,
    esta_vacunado BOOLEAN NOT NULL,
    imagen VARCHAR(200),
    descripcion VARCHAR(100) NOT NULL,
    id_cuidador INT REFERENCES cuidador(id)
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
create table cuidador(
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

insert into mascotas(nombre, especie, edad_estimada, tamaño, esta_vacunado, imagen, descripcion)
values
('Toby', 'Perro', 4, 'Mediano', true, '/imagenes/toby.jpeg', 'Obediente y tranquilo.'),
('Thor', 'Perro', 5, 'Grande', true, '/imagenes/thor.jpeg', 'Fuerte y muy leal.'),
('Simon', 'Perro', 3, 'Mediano', false, '/imagenes/simon.jpeg', 'Activo y curioso.'),
('Rocco', 'Perro', 5, 'Mediano', false, '/imagenes/rocco.jpeg', 'Leal y protector.'),
('Robin', 'Perro', 2, 'Pequeño', true, '/imagenes/robin.jpeg', 'Amigable y juguetón.'),
('Rita', 'Perro', 6, 'Grande', true, '/imagenes/rita.jpeg', 'Muy tranquila y dulce.'),
('Max', 'Perro', 2, 'Pequeño', true, '/imagenes/max.jpeg', 'Energético y fiel.'),
('Luna', 'Perro', 3, 'Pequeño', true, '/imagenes/luna.jpeg', 'Muy juguetona y sociable.'),
('Daisy', 'Perro', 3, 'Mediano', true, '/imagenes/daisy.jpeg', 'Ideal para familias.'),
('Coco', 'Perro', 6, 'Mediano', true, '/imagenes/coco.jpeg', 'Buen compañero de niños.'),
('Zoe', 'Gato', 2, 'Pequeño', true, '/imagenes/zoe.jpeg', 'Cariñosa y tranquila.'),
('Tom', 'Gato', 2, 'Pequeño', false, '/imagenes/tom.jpeg', 'Curioso y travieso.'),
('Simba', 'Gato', 3, 'Pequeño', false, '/imagenes/simba.jpeg', 'Cariñoso y dormilón.'),
('Olivia', 'Gato', 3, 'Pequeño', true, '/imagenes/olivia.jpeg', 'Muy tierna y sociable.'),
('Nina', 'Gato', 1, 'Pequeño', true, '/imagenes/nina.jpeg', 'Curiosa y activa.'),
('Mimi', 'Gato', 1, 'Pequeño', true, '/imagenes/mimi.jpeg', 'Tierna y dormilona.'),
('Milo', 'Gato', 2, 'Pequeño', true, '/imagenes/milo.jpeg', 'Tranquilo y cariñoso.'),
('Maya', 'Gato', 2, 'Pequeño', true, '/imagenes/maya.jpeg', 'Muy mimosa.'),
('Lola', 'Gato', 3, 'Pequeño', false, '/imagenes/lola.jpeg', 'Alegre y juguetona.'),
('Chispa', 'Gato', 1, 'Pequeño', true, '/imagenes/chispa.jpeg', 'Muy activa y simpática.');

DELETE FROM mascotas; 

ALTER TABLE mascotas
ADD COLUMN id_cuidador INT REFERENCES cuidador(id);

INSERT INTO cuidador (nombre, email, tipo, animales_a_cargo, disponibilidad_horaria)
VALUES
('María López', 'maria.lopez@example.com', 'Voluntaria', 2, 'Lunes a viernes de 9 a 13 hs'),
('Juan Pérez', 'juan.perez@example.com', 'Cuidador externo', 2, 'Fines de semana de 10 a 18 hs'),
('Lucía Gómez', 'lucia.gomez@example.com', 'Empleado', 2, 'Turno tarde: 14 a 20 hs'),
('Carlos Sánchez', 'carlos.sanchez@example.com', 'Voluntario', 2, 'Lunes, miércoles y viernes de 8 a 12 hs'),
('Ana Torres', 'ana.torres@example.com', 'Empleado', 2, 'Turno mañana: 8 a 14 hs'),
('Martín Díaz', 'martin.diaz@example.com', 'Voluntario', 2, 'Martes y jueves de 10 a 16 hs'),
('Laura Fernández', 'laura.fernandez@example.com', 'Empleado', 2, 'Lunes a viernes de 9 a 17 hs'),
('Diego Romero', 'diego.romero@example.com', 'Cuidador externo', 2, 'Fines de semana de 12 a 20 hs'),
('Valeria Silva', 'valeria.silva@example.com', 'Voluntaria', 2, 'Lunes a viernes de 17 a 21 hs'),
('Federico Ruiz', 'federico.ruiz@example.com', 'Empleado', 2, 'Turno rotativo: mañana y tarde');

INSERT INTO mascotas (nombre, especie, edad_estimada, tamaño, esta_vacunado, imagen, descripcion, id_cuidador)
VALUES
('Toby', 'Perro', 4, 'Mediano', true, '/imagenes/toby.jpeg', 'Obediente y tranquilo.', 1),
('Thor', 'Perro', 5, 'Grande', true, '/imagenes/thor.jpeg', 'Fuerte y muy leal.', 1),
('Simon', 'Perro', 3, 'Mediano', false, '/imagenes/simon.jpeg', 'Activo y curioso.', 2),
('Rocco', 'Perro', 5, 'Mediano', false, '/imagenes/rocco.jpeg', 'Leal y protector.', 2),
('Robin', 'Perro', 2, 'Pequeño', true, '/imagenes/robin.jpeg', 'Amigable y juguetón.', 3),
('Rita', 'Perro', 6, 'Grande', true, '/imagenes/rita.jpeg', 'Muy tranquila y dulce.', 3),
('Max', 'Perro', 2, 'Pequeño', true, '/imagenes/max.jpeg', 'Energético y fiel.', 4),
('Luna', 'Perro', 3, 'Pequeño', true, '/imagenes/luna.jpeg', 'Muy juguetona y sociable.', 4),
('Daisy', 'Perro', 3, 'Mediano', true, '/imagenes/daisy.jpeg', 'Ideal para familias.', 5),
('Coco', 'Perro', 6, 'Mediano', true, '/imagenes/coco.jpeg', 'Buen compañero de niños.', 5),
('Zoe', 'Gato', 2, 'Pequeño', true, '/imagenes/zoe.jpeg', 'Cariñosa y tranquila.', 6),
('Tom', 'Gato', 2, 'Pequeño', false, '/imagenes/tom.jpeg', 'Curioso y travieso.', 6),
('Simba', 'Gato', 3, 'Pequeño', false, '/imagenes/simba.jpeg', 'Cariñoso y dormilón.', 7),
('Olivia', 'Gato', 3, 'Pequeño', true, '/imagenes/olivia.jpeg', 'Muy tierna y sociable.', 7),
('Nina', 'Gato', 1, 'Pequeño', true, '/imagenes/nina.jpeg', 'Curiosa y activa.', 8),
('Mimi', 'Gato', 1, 'Pequeño', true, '/imagenes/mimi.jpeg', 'Tierna y dormilona.', 8),
('Milo', 'Gato', 2, 'Pequeño', true, '/imagenes/milo.jpeg', 'Tranquilo y cariñoso.', 9),
('Maya', 'Gato', 2, 'Pequeño', true, '/imagenes/maya.jpeg', 'Muy mimosa.', 9),
('Lola', 'Gato', 3, 'Pequeño', false, '/imagenes/lola.jpeg', 'Alegre y juguetona.', 10),
('Chispa', 'Gato', 1, 'Pequeño', true, '/imagenes/chispa.jpeg', 'Muy activa y simpática.', 10);

SELECT m.id, m.nombre, m.imagen, COUNT(f.id)
FROM mascotas m, formularios_adopcion f
WHERE m.id = f.id_mascota
GROUP BY m.id, m.nombre, m.imagen
ORDER BY COUNT(f.id) ASC
LIMIT 3;


