.PHONY: start-db stop-db start-backend run-backend start-frontend

start-db:
	cd ./backend && docker compose up -d

stop-db:
	cd ./backend && docker compose down

start-backend:
	cd ./backend && npm run dev

run-backend: start-db start-backend

start-frontend:
	cd ./frontend && http-server ./ --cors

