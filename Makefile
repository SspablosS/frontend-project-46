install: install-deps
	npx simple-git-hooks

gendiff:
	node bin/gendiff

install-deps:
	npm ci --legacy-peer-deps

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

publish:
	npm publish

.PHONY: test