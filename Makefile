up_local:
	docker-compose -f ./docker-compose.local.yml up -d

reset:
	npm run console -- clean-db && \
	make migrate && \
	npm run console -- seed

seed:
	npm run console -- seed

migrate:
	npm run typeorm:run-migrations

migrate_rollback:
	npm run typeorm:revert-migration
