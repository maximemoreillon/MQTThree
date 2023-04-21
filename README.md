# MQTThree

MQTT + Three.js

## Usage

This application can be run as a Docker container:

```bash
docker run \
  -p 8080:3000 \
  -e NUXT_PUBLIC_MQTT_HOST=your-mqtt-host \
  -e NUXT_PUBLIC_MQTT_PORT=your-mqtt-port \
  -v local-config-path:/app/config \
  moreillon/mqtthree:latest
```
