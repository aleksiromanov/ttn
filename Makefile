
all: deploy

deploy:
	ansible-playbook -s -v --extra-vars '{"homedir":"/opt/ws/neaten/ttn"}' before-docker.yml
	docker build -t aleksiromanov/ttn .
	docker run -d --privileged --name ttn aleksiromanov/ttn

clean:
	docker rm -f ttn

