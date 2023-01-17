all:
	echo 'pass'

.PHONY: build

build:
	. ~/.bash_profile && nvm use v16 && npm run build

push:
	aws s3 cp build/ s3://nostrify/ --recursive
	aws cloudfront create-invalidation --distribution-id E14Q4FNWR3HZVI --paths '/*'