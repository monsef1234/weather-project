<template>
  <div class="home-container">
    <div class="search">
      <v-text-field
        placeholder="Search"
        variant="underlined"
        color="white"
        hide-details
        v-model="search"
        @update:model-value="(val) => debouncedSearch(val)"
        :loading="loading"
        :disabled="disableSearch"
        min-width="250"
      >
        <template v-slot:append>
          <v-tooltip
            content-class="tooltip-content"
            text="Get Current Geoposition"
            location="top"
          >
            <template v-slot:activator="{ props }">
              <v-icon @click="getCurrentLocation" v-bind="props"
                >mdi-crosshairs-gps</v-icon
              >
            </template>
          </v-tooltip>
        </template>
      </v-text-field>

      <div class="search-suggestions" v-if="openSuggestions">
        <div
          class="search-suggestion-item"
          v-for="search in searches"
          :key="search.Key"
          @click="selectSearch(search)"
        >
          <p v-if="!noResults">
            {{ search.LocalizedName }},
            {{ search.AdministrativeArea.LocalizedName }},
            {{ search.Country.LocalizedName }}
          </p>
        </div>
        <p
          v-if="noResults"
          style="text-align: center; padding: 1rem 0; font-size: 1.2rem"
        >
          No Location found
        </p>
      </div>
    </div>

    <div
      class="saved-locations"
      v-if="savedLocationsStore.savedLocations.length"
    >
      <div
        class="saved-locations-item"
        v-for="location in savedLocationsStore.savedLocations"
        :key="location.Key"
        @click="
          () =>
            $router.push(
              `/weather/${location.Key}?name=${location.LocalizedName}`
            )
        "
      >
        <div class="country-name">
          <h2>{{ location.LocalizedName }}</h2>
        </div>
        <div class="country-temp">
          <h2>{{ location.Temperature.Metric.Value.toFixed(0) }} °C</h2>
        </div>
      </div>
    </div>

    <div class="no-locations text-center mt-10" v-else>
      <h2>No Locations Saved</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import lodash from "lodash";
import { SearchResult, HomeData, GeopositionResult } from "@/types";
import { emitter } from "@/main";
import { useSavedLocationsStore } from "@/store/savedLocations";
export default defineComponent({
  name: "Home",

  setup() {
    const savedLocationsStore = useSavedLocationsStore();
    return { savedLocationsStore };
  },

  data(): HomeData {
    return {
      debouncedSearch: lodash.debounce(
        (value: string) => this.newSearches(value),
        500
      ),
      search: "",

      searches: [],

      loading: false,
      noResults: false,
      openSuggestions: false,
      disableSearch: false,
    };
  },

  methods: {
    newSearches(value: string) {
      this.loading = true;
      if (value.length) {
        axios
          .get<SearchResult[]>(
            `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${
              import.meta.env.VITE_API_KEY
            }&q=${value}`
          )
          .then((res) => {
            this.openSuggestions = true;
            this.noResults = res.data.length === 0;
            this.searches = res.data;
          })
          .catch((err) => {
            console.log(err);
            this.openSuggestions = false;
            this.searches = [];
            this.noResults = false;
            emitter.emit("snackbar", {
              snackbar: true,
              text: "Invalid API Key",
            });
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.loading = false;
        this.openSuggestions = false;
        this.noResults = false;
        this.searches = [];
      }
    },

    selectSearch(search: SearchResult) {
      this.openSuggestions = false;
      this.search = "";
      console.log(search);
      this.$router.push(`/weather/${search.Key}?name=${search.LocalizedName}`);
    },

    getCurrentLocation() {
      this.loading = true;
      this.disableSearch = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          axios
            .get<GeopositionResult>(
              `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${
                import.meta.env.VITE_API_KEY
              }&q=${pos.coords.latitude},${pos.coords.longitude}`
            )
            .then((res) => {
              this.$router.push(
                `/weather/${res.data.Key}?name=${res.data.AdministrativeArea.LocalizedName}`
              );
            })
            .catch((err) => {
              console.log(err);
              emitter.emit("snackbar", {
                snackbar: true,
                text: "Invalid API Key if you want to use this feature please change the API Key or contact me <a style='color: white' href='mailto:monsef4566@gmail.com'>monsef4566@gmail.com</a>",
              });
            })
            .finally(() => {
              this.loading = false;
              this.disableSearch = false;
            });
        },
        (err) => {
          if (err.code === 1) {
            emitter.emit("snackbar", {
              snackbar: true,
              text: "You denied the request for Geolocation please allow it",
            });
          } else if (err.code === 2) {
            emitter.emit("snackbar", {
              snackbar: true,
              text: "Geolocation is not supported by this browser.",
            });
          } else {
            emitter.emit("snackbar", {
              snackbar: true,
              text: "An unknown error occurred.",
            });
          }
          this.disableSearch = false;
          this.loading = false;
        }
      );
    },
  },
});
</script>

<style lang="scss">
.home-container {
  padding: 2rem 0;
  min-width: 320px;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;

  input {
    padding: 0.5rem;
    font-size: 1.2rem;

    &::placeholder {
      opacity: 0.8;
    }
  }

  .search {
    position: relative;

    &-suggestions {
      background: var(--secondary-color);
      position: absolute;
      top: 105%;
      left: 0;
      width: 100%;
      min-height: 448px;
    }

    &-suggestion-item {
      font-size: 1.2rem;

      p {
        padding: 0.5rem 1rem;
        cursor: pointer;

        &:hover {
          background: var(--primary-color);
        }
      }
    }
  }

  .saved-locations {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--secondary-color);
      padding: 2rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;

      h2 {
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
