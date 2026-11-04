# MQTThree

A 3D view of your home in which MQTT devices (lights, air conditioners, sensors, a lock) are shown live and can be controlled.

## How it works

- `config/model.glb` is the 3D model of the home and `config/devices.yml` lists the devices, their MQTT topics and positions. Both can be uploaded from the settings page.
- The browser connects directly to the MQTT broker over WebSockets.
- **The MQTT broker is the only authority:** you log in with your broker username and password. The server checks them by connecting to the broker, then issues a session cookie that protects the pages and the API. The browser keeps the credentials (for the browser session, or on the device with "Remember me") to connect to the broker itself. What you can see and control is whatever your broker ACL allows.

No broker-specific configuration is needed beyond users with the right ACLs and a WebSocket listener.

## devices.yml

A list of devices. Status messages are expected to be JSON, and commands are sent as `{"state": "<payload>"}`.

```yaml
# Living room ceiling light
- type: light
  topic: light-d084cb/state # status topic, its `state` field holds the payload
  commandTopic: light-d084cb/command
  payload: # optional, these are the defaults
    on: "on"
    off: "off"
  position: { x: -2, y: 2.1, z: 1.5 } # in the model's coordinates
  rotation: { y: 180 } # optional, in degrees, every axis optional

# Air conditioner, shown as a fan that spins when on
- type: fan
  topic: aircon-d8e608/state
  commandTopic: aircon-d8e608/command
  payload: { on: ac_on, off: "off" }
  position: { x: -3.2, y: 2.1, z: -0.5 }

# Shows one field of a status message
- type: sensor
  topic: sensor-dbc37a/temperature
  key: temperature
  unit: °C # optional
  position: { x: -3.2, y: 2.1, z: 2.5 }

- type: lock
  topic: lock-d0dd07/state
  commandTopic: lock-d0dd07/command
  payload: # optional, these are the defaults
    locked: locked
    unlocked: unlocked
  position: { x: 3.5, y: 1.2, z: -0.8 }
```

The file is checked when it is uploaded (an invalid file is rejected and the current one kept) and when the app loads it. Unknown fields are errors, so typos don't go unnoticed. Each device must be unique: by topic, or by topic and key for sensors, which can read different fields of the same message.

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
