<template>
  <v-dialog :model-value="mqttReconnecting" persistent max-width="30em">
    <v-card class="pa-4">
      <v-row justify="center">
        <v-col cols="auto"> MQTT connection lost, reconnecting... </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
const mqttReconnecting = useMqttReconnecting()
</script>
