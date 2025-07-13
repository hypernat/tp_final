# Trabajo Práctico 2
- Desarrollo de un sitio web con frontend, backend y base de datos. En construcción 👷🏽🚧
- Plataforma de adopción de mascotas!! 🐈🦜🐇 

## Entidades y campos 
- **mascota**: id,nombre, especie, edad_estimada, tamaño, esta_vacunado, descripcion
- **usuario**: id, nombre, email, numero, dirección, tiene_patio, tiene_mas_mascotas
- **cuidador**: id, nombre,tipo(voluntario/empleado/cuidador_externo), animales_a_cargo, disponibilidad
- **formularios_adopcion**(tabla intermediaria): id, fecha, estado (puede ser tipo en proceso, rechazada, aprobada),
comentario,id_cuidador_a_cargo, id_usuario, id_mascota 

## Ideas de funciones
- panel que muestre las solicitudes
- crear usuario
- enviar solicitud de adopción
- ver las mascotas disponibles

## Datos:
- Se puede encontrar la estructura de la base de datos en el archivo:
```
./backend/scripts/db.sql
```
- Para levantar el backend del proyecto correr:
```
make run-backend
```
- Si solo se quiere levantar la base de datos:
```
make start-db
```
- Si se quiere parar la base de datos utilizo:
```
make stop-db
```
- Si se quiere solo levantar el servidor del backend
```
make start-backend
```
- Si se quiere solo levantar el servidor del frontend
```
make start-frontend
```
-Para correr sql en el docker compose:
```
entramos a la carpeta backend:
docker compose up -d
docker exec -it backend-db-1 psql -U postgres -d pethub 
```