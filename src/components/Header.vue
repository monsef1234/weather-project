<template>
  <div class="search-container">
    <div>
      <router-link to="/" style="text-decoration: none; color: inherit">
        <div class="logo">
          <v-icon size="large" icon="mdi-cog-outline"></v-icon>
          <h1>the local winter</h1>
        </div>
      </router-link>
      <div>
        <v-icon
          size="large"
          icon="mdi-information"
          class="info-icon"
          @click="informationDialog = true"
        ></v-icon>
        <v-icon
          size="large"
          icon="mdi-plus"
          style="cursor: pointer; margin-left: 0.2rem"
          v-if="$route.params.key && !checkLocationInLocalStorage"
          @click="addLocation"
        ></v-icon>
      </div>
    </div>
    <Information v-model:informationDialog="informationDialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Information from "@/components/dialogs/Information.vue";
import { emitter } from "@/main";
import { SavedLocation } from "@/types";
import { useSavedLocationsStore } from "@/store/savedLocations";

export default defineComponent({
  name: "Search",

  components: {
    Information,
  },

  setup() {
    const savedLocationsStore = useSavedLocationsStore();
    return { savedLocationsStore };
  },

  data() {
    return {
      informationDialog: false as boolean,
    };
  },

  methods: {
    addLocation() {
      emitter.emit("addLocation");
    },
  },

  computed: {
    checkLocationInLocalStorage() {
      return this.savedLocationsStore.savedLocations.some(
        (location: SavedLocation) => location.Key === this.$route.params.key
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.search-container {
  padding: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 320px;
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-transform: capitalize;

    h1 {
      font-weight: 600 !important;

      @media (max-width: 1060px) {
        font-size: 1.5rem;
      }
    }
  }

  .info-icon {
    cursor: pointer;

    &:hover {
      color: rgba(0, 0, 0, 0.5);
    }

    &:active {
      transform: scale(0.8);
    }
  }
}
</style>