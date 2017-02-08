
IMAGE := ttn

all: staging

staging: build-staging deploy-staging

build-staging:
	NODE_ENV=test webpack --progress --colors

deploy-staging:
	docker build -t $(IMAGE) .
	docker run -d --privileged --name ttn $(IMAGE)

clean:
	docker rm -f ttn

