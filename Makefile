app-build:
	cd web && yarn && yarn build
	cd ..
	go build -o bin/sit-iot-workshop main.go