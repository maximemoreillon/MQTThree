<template>
  <v-dialog v-model="dialog" width="40rem">
    <template v-slot:activator="{ props }">
      <v-btn
        class="ma-4"
        color="primary"
        v-bind="props"
        position="absolute"
        icon="mdi-cogs"
      />
    </template>

    <v-card>
      <v-card-title> Settings </v-card-title>
      <v-card-text>
        <v-row justify="space-between">
          <v-col cols="auto">
            <v-btn
              @click="threejsApp.toggleGrid()"
              prepend-icon="mdi-grid"
              variant="text"
            >
              Toggle grid
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              @click="threejsApp.toggle3d()"
              prepend-icon="mdi-rotate-3d"
              variant="text"
            >
              Toggle 3D
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              @click="threejsApp.toggleAmbientLight()"
              prepend-icon="mdi-lightbulb"
              variant="text"
            >
              Ambient light
            </v-btn>
          </v-col>
        </v-row>
        <model-upload />
        <config-upload />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="dialog = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const dialog = ref(false)
const threejsApp = useThreejsApp()
</script>
