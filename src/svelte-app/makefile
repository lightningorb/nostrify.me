all:
	echo 'pass'

.PHONY: build

build:
# 	. ~/.bash_profile && nvm use v16 && coffee -c src/routes/+layout.coffee
	. ~/.bash_profile && nvm use v16 && npm run format && npm run build
	cp static/nostr.jpeg build/

push:
	aws s3 cp build/ s3://nostrify/ --recursive
	aws cloudfront create-invalidation --distribution-id E14Q4FNWR3HZVI --paths '/*'

compile:
	. ~/.bash_profile && nvm use v16 && coffee --compile src/routes/+layout.coffee