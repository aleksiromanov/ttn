
all: deploy

build:
	ansible-playbook -s -v --extra-vars '{"homedir":"/opt/ws/neaten/ttn"}' before-docker.yml

deploy:
	docker build -t aleksiromanov/ttn .
	docker run -d --privileged --name ttn aleksiromanov/ttn

clean:
	docker rm -f ttn

