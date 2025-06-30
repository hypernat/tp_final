# Trabajo Práctico 2
- Desarrollo de un sitio web con frontend, backend y base de datos. En construcción 👷🏽🚧
- Plataforma de adopción de mascotas!! 🐈🦜🐇

## Entidades y campos 
- **mascota**: id,nombre, especie, edad_estimada, tamaño, esta_vacunado, descripcion
- **usuario**: id, nombre, email, numero, dirección, tiene_patio, tiene_mas_mascotas
- **cuidador**: id, nombre,tipo(voluntario/casa_de_tránsito), animales_a_cargo, disponibilidad
- **formularios_adopcion**(tabla intermediaria): id, fecha, estado (puede ser tipo en proceso, rechazada, aprobada),
comentario,id_cuidador_a_cargo, id_usuario, id_mascota 

## Ideas de funciones
- panel que muestre las solicitudes
- crear usuario
- enviar solicitud de adopción
- ver las mascotas disponibles

## Datos:
- nuestro puerto es 5432
- http://localhost:5432/index/health utilizo esto para saber si el servidor esta levantado