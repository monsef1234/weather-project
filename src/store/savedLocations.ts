import { SavedLocation } from "@/types";
import { defineStore } from "pinia";

export const useSavedLocationsStore = defineStore("savedLocations", {
  state: () => ({
    savedLocations: [] as SavedLocation[],
    search: "" as string,
  }),

  actions: {
    addLocation(location: SavedLocation) {
      this.savedLocations = [...this.savedLocations, location];
    },

    removeLocation(key: string) {
      this.savedLocations = this.savedLocations.filter(
        (location) => location.Key !== key
      );
    },

    setSearch(search: string) {
      this.search = search;
    },
  },

  persist: {
    key: "savedLocations",
  }
});
