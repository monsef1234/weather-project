<template>
  <v-app>
    <v-main>
      <Search />
      <router-view />
      <v-snackbar v-model="snackbar" multi-line color="error">
        <p v-html="text" />
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Search from "@/components/Header.vue";
import { emitter } from "./main";

export default defineComponent({
  name: "App",

  components: {
    Search,
  },

  data() {
    return {
      snackbar: false,
      text: "",
    };
  },

  mounted() {
    emitter.on("snackbar", (t: { snackbar: boolean; text: string }) => {
      this.snackbar = t.snackbar;
      this.text = t.text;
    });
  },
});
</script>
