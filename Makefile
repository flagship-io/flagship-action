build:
	ncc build src/index.ts --license LICENSE

push:
	git add .
	git commit -m "run action"
	git push

run: 
	rm -r flagship
	ncc build src/index.ts --license LICENSE
	node dist/index.js