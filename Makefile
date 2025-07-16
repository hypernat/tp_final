.PHONY: start-db stop-db start-backend run-backend start-frontend start

start-db:
	cd ./backend && docker compose up -d

stop-db:
	cd ./backend && docker compose down

start-backend:
	cd ./backend && npm run dev

run-backend: start-db start-backend

start-frontend:
	cd ./frontend && http-server ./ --cors

start:
	make start-frontend & make run-backend

load-db: 
	sleep 5
	docker exec -i backend-db psql -U postgres -d pethub < backend/scripts/db.sql
