build:
	npm run package

push:
	git add .
	git commit -m "run action"
	git push

act:
	sudo act