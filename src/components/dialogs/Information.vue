<template>
  <v-dialog
    scrim="#084760"
    @update:model-value="$emit('update:informationDialog', $event)"
    :model-value="informationDialog"
    width="800"
  >
    <v-card class="info-card">
      <v-card-title>About</v-card-title>
      <v-card-text>
        The Local Weather allows you to track the current and future weather of
        cities of your choosing.
      </v-card-text>

      <v-card-title>How it works:</v-card-title>
      <v-card-text>
        <ol>
          <li>
            Search for your city by entering the name into the search bar.
          </li>
          <li>
            Select a city within the results, this will take you to the current
            and future weather for your selection.
          </li>
          <li>
            Track the city by clicking the "+" icon in the top right. This will
            save the city to your cities list.
          </li>
        </ol>
      </v-card-text>

      <v-card-title>Removing a city</v-card-title>
      <v-card-text>
        If you no longer wish to track a city, simply click on the "" icon
        within the home page. This will enable a edit mode. A "" icon should now
        be visible and allow you to delete a city.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          class="info-close-btn"
          :ripple="false"
          variant="plain"
          flat
          @click="$emit('update:informationDialog', false)"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Information",

  props: {
    informationDialog: {
      type: Boolean,
      required: true,
    },
  },
});
</script>


<style>
.info-card {
  background: white !important;
  color: black !important;
}

.info-close-btn {
  text-transform: capitalize !important;
  opacity: 1 !important;
  background: var(--secondary-color) !important;
  color: white !important;
  margin: 0.8rem !important;
  font-size: 1.2rem !important;
  letter-spacing: normal !important;
  width: 8rem !important;
  height: 3.5rem !important;
  padding: 0 !important;

  @media (max-width: 1060px) {
    font-size: 1rem !important;
  }
}

.info-card .v-card-title {
  padding: 0.8rem !important;
  font-size: 1.5rem;

  @media (max-width: 1060px) {
    font-size: 1.2rem;
  }
}

.info-card .v-card-text,
.info-card .v-card-text ol {
  padding: 0 0.8rem !important;
  font-size: 1.1rem !important;

  @media (max-width: 1060px) {
    font-size: 1rem !important;
  }
}
</style>
