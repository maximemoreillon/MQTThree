# Ideas

Possible improvements, none of them planned. Stage 1 (upgrade, auth, reliability, config validation) is done.

## Stage 2: device editor

Place devices by dragging them in the 3D scene instead of editing coordinates by hand.

- Edit mode toggled from the UI, with Threlte `TransformControls` on the selected device (move, rotate).
- A side panel to edit the selected device's fields (type, topics, payloads), plus add and delete.
- Saving goes through the same zod schema as uploads, so the editor can't produce an invalid file.
- Devices are already keyed by topic (topic + key for sensors), which gives the editor a stable identity.
- Writing a ConfigMap-backed `devices.yml` isn't possible (read-only mount, and Argo CD would revert it). The editor would either need writable storage (PVC) or export YAML to paste into git.
- Room names are YAML comments today, and a program rewriting the file would lose them. Add an optional `name` field first, and show it as a label in the scene.
- shadcn-svelte components to add: sheet (side panel), select, dialog (delete confirmation), sonner (toasts).

## Deployment and storage

- **`devices.yml` as a ConfigMap** next to the Home Assistant config, versioned in git and synced by Argo CD. Mount it with `subPath` at `/app/config/devices.yml`, over the PVC at `/app/config`, so the app needs no path change. `subPath` mounts don't update live, so add `reloader.stakater.com/auto: "true"` to restart the pod on changes. Remove the devices upload, since the file is read-only.
- **`npm run check-devices <file>`** to validate `devices.yml` with the app's schema before committing it.
- **Optional S3 storage for the model** (e.g. versitygw), enabled by `S3_*` variables, falling back to the file. Keep model access behind `readModel()`/`writeModel()` so this stays one module. A lightweight signer like `aws4fetch` over the full AWS SDK.
- **Keep the previous model** on upload (`model.glb.bak`), to undo a bad upload.

## Devices

Ideas from what the Home Assistant config already uses:

- **Availability:** every device publishes `<id>/availability`. Show offline devices greyed out instead of in their last known state.
- **Air conditioner modes:** the firmware supports `ac_on`, `heater_on` and `off`, but the fan type only toggles `ac_on`/`off`. A `climate` type could show and switch between cool, heat and off.
- **Motion sensors:** several devices publish `<id>/motion` (`motion`/`idle`). A `motion` type could highlight the room briefly.
- **Humidity:** the air conditioners also report `humidity` on their temperature topic. Works today with a second `sensor` entry (same topic, `key: humidity`).
- **RGBW light:** the living room light has `rgbw` topics. Its colour could be shown, and maybe set.
