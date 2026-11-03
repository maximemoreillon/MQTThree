# MQTThree

A 3D view of your home in which MQTT devices (lights, air conditioners, sensors, a lock) are shown live and can be controlled.

## How it works

- `config/model.glb` is the 3D model of the home and `config/devices.yml` lists the devices, their MQTT topics and positions. Both can be uploaded from the settings page.
- The browser connects directly to the MQTT broker over WebSockets.
- **The MQTT broker is the only authority:** you log in with your broker username and password. The server checks them by connecting to the broker, then issues a session cookie that protects the pages and the API. The browser keeps the credentials (for the browser session, or on the device with "Remember me") to connect to the broker itself. What you can see and control is whatever your broker ACL allows.

No broker-specific configuration is needed beyond users with the right ACLs and a WebSocket listener.

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `PUBLIC_MQTT_HOST` | `localhost` | Broker WebSocket hostname, as reached by the browser |
| `PUBLIC_MQTT_PORT` | `9001` | Broker WebSocket port |
| `PUBLIC_MQTT_USE_SSL` | off | Any non-empty value to use `wss://` |
| `MQTT_URL` | same as the browser | Broker URL the server uses to check logins, e.g. `mqtts://broker:8883` |
| `SESSION_SECRET` | random | Signs session cookies. If unset, sessions don't survive restarts |
| `BODY_SIZE_LIMIT` | `512K` | Raise it (e.g. `100M`) to upload models |
| `PROTOCOL_HEADER` | – | The server assumes HTTPS. Behind plain HTTP, set to `x-forwarded-proto` and have the proxy send it |
| `ADDRESS_HEADER` | – | Behind a reverse proxy, e.g. `x-forwarded-for`, so failed logins are rate limited per client |

## Running

```sh
npm install
npm run dev
```

Or with the container image built by GitHub Actions:

```sh
docker run -p 3000:3000 --env-file .env -v ./config:/app/config ghcr.io/<owner>/mqtthree
```
