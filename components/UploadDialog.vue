<template>
  <v-dialog v-model="dialog" width="40rem">
    <template v-slot:activator="{ props }">
      <v-btn
        class="ma-4"
        color="primary"
        v-bind="props"
        position="absolute"
        icon="mdi-upload"
      />
    </template>

    <v-card>
      <v-card-title> Model / config upload </v-card-title>
      <v-card-text>
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

<script setup type="ts">

import axios from 'axios'


const dialog = ref(false)
</script>
