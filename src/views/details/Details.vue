<template>
  <div class="details-container">
    <h3 class="notice" v-if="!checkLocationInLocalStorage">
      You are currently previewing this city, click the "+" icon to start
      tracking this city.
    </h3>

    <v-btn
      class="remove-location-btn"
      v-if="checkLocationInLocalStorage"
      color="error"
      @click="removeLocation"
    >
      Remove Location from saved locations
    </v-btn>

    <div class="details-content">
      <div v-if="loadingStates.currentWeather" class="current-weather">
        <div class="current-weather-city">
          <v-skeleton-loader
            class="mx-auto"
            color="transparent"
            loading
            type="heading"
            width="350"
          ></v-skeleton-loader>

          <v-skeleton-loader
            color="transparent"
            class="mt-4 mx-auto"
            type="text"
            width="300"
          ></v-skeleton-loader>

          <v-skeleton-loader
            class="mt-6 mx-auto"
            type="heading"
            width="250"
            color="transparent"
          ></v-skeleton-loader>

          <v-skeleton-loader
            class="mt-4 mx-auto"
            type="text"
            color="transparent"
            width="200"
          ></v-skeleton-loader>

          <v-skeleton-loader
            class="mt-6 mx-auto overflow-hidden"
            color="transparent"
            type="image"
            width="200"
            height="200"
          ></v-skeleton-loader>
        </div>
      </div>

      <div v-else class="current-weather">
        <div class="current-weather-city">
          <h1>{{ $route.query.name }}</h1>
          <p>
            {{
              format(
                new Date(currentWeather.LocalObservationDateTime),
                "EEE, MMM d h:mm a"
              )
            }}
          </p>
          <h1>
            {{ currentWeather.Temperature.Metric.Value.toFixed(0) }}°
            {{ currentWeather.Temperature.Metric.Unit }}
          </h1>
          <p>{{ currentWeather.WeatherText }}</p>
          <v-img
            :src="`https://www.accuweather.com/images/weathericons/${currentWeather.WeatherIcon}.svg`"
            :alt="currentWeather.WeatherText"
            width="100"
            height="100"
            class="current-weather-city-icon"
          ></v-img>
        </div>
      </div>

      <v-divider thickness="3" style="margin: 3rem 0"></v-divider>

      <div class="hourly-weather">
        <h3>Hourly Forecast</h3>

        <div v-if="loadingStates.hourlyWeather" class="hourly-weather-items">
          <div class="hourly-weather-item" v-for="i in 12" :key="i">
            <v-skeleton-loader
              color="transparent"
              class="mx-auto"
              type="text"
              width="80"
            ></v-skeleton-loader>

            <v-skeleton-loader
              color="transparent"
              class="mx-auto overflow-hidden"
              type="image"
              width="50"
              height="50"
            ></v-skeleton-loader>

            <v-skeleton-loader
              color="transparent"
              class="mx-auto"
              type="text"
              width="80"
            ></v-skeleton-loader>
          </div>
        </div>

        <div v-else class="hourly-weather-items">
          <div
            class="hourly-weather-item"
            v-for="hourly in hourlyWeather"
            :key="hourly.EpochDateTime"
          >
            <p>{{ format(new Date(hourly.DateTime), "h:mm a") }}</p>
            <v-img
              :src="`https://www.accuweather.com/images/weathericons/${hourly.WeatherIcon}.svg`"
              :alt="hourly.IconPhrase"
              width="50"
              height="50"
            ></v-img>
            <p>{{ convertToCelsius(hourly.Temperature.Value) }}° C</p>
          </div>
        </div>
      </div>

      <v-divider thickness="3" style="margin: 3rem 0"></v-divider>

      <div class="five-day-weather">
        <h3>5 Days Forecast</h3>

        <div v-if="loadingStates.fiveDayWeather" class="five-day-weather-items">
          <div class="five-day-weather-item" v-for="i in 7" :key="i">
            <v-skeleton-loader
              color="transparent"
              type="text"
              width="150"
            ></v-skeleton-loader>

            <v-skeleton-loader
              color="transparent"
              class="overflow-hidden"
              type="image"
              width="50"
              height="50"
            ></v-skeleton-loader>

            <v-skeleton-loader
              color="transparent"
              type="text"
              width="100"
            ></v-skeleton-loader>
          </div>
        </div>

        <div v-else class="five-day-weather-items">
          <div
            class="five-day-weather-item"
            v-for="forecast in fiveDayWeather.DailyForecasts"
            :key="forecast.EpochDate"
          >
            <p>{{ format(new Date(forecast.Date), "EEE") }}</p>
            <v-img
              :src="`https://www.accuweather.com/images/weathericons/${forecast.Day.Icon}.svg`"
              :alt="forecast.Day.IconPhrase"
              width="50"
              height="50"
            ></v-img>
            <p>
              H: {{ convertToCelsius(forecast.Temperature.Maximum.Value) }}°C
              <br />
              L: {{ convertToCelsius(forecast.Temperature.Minimum.Value) }}°C
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  DetailsData,
  CurrentWeather,
  HourlyWeather,
  FiveDayForecast,
  SavedLocation,
} from "@/types";
import axios from "axios";
import { defineComponent } from "vue";
import { format } from "date-fns";
import { emitter } from "@/main";
import { useSavedLocationsStore } from "@/store/savedLocations";

export default defineComponent({
  name: "Details",

  setup() {
    const savedLocationsStore = useSavedLocationsStore();
    return {
      savedLocationsStore,
      format,
    };
  },

  data(): DetailsData {
    return {
      currentWeather: {
        LocalObservationDateTime: "",
        EpochTime: 0,
        WeatherText: "",
        WeatherIcon: 0,
        HasPrecipitation: false,
        PrecipitationType: null,
        IsDayTime: false,
        Temperature: {
          Metric: {
            Value: 0,
            Unit: "",
            UnitType: 0,
          },
          Imperial: {
            Value: 0,
            Unit: "",
            UnitType: 0,
          },
        },
        MobileLink: "",
        Link: "",
      },

      hourlyWeather: [],

      fiveDayWeather: {
        Headline: {
          EffectiveDate: "",
          EffectiveEpochDate: 0,
          Severity: 0,
          Text: "",
          Category: "",
          EndDate: "",
          EndEpochDate: 0,
          MobileLink: "",
          Link: "",
        },
        DailyForecasts: [],
      },

      loadingStates: {
        currentWeather: true,
        hourlyWeather: true,
        fiveDayWeather: true,
      },
    };
  },

  methods: {
    getCurrentWeather() {
      this.loadingStates.currentWeather = true;

      axios
        .get<CurrentWeather[]>(
          `https://dataservice.accuweather.com/currentconditions/v1/${
            this.$route.params.key
          }?apikey=${import.meta.env.VITE_API_KEY}`
        )
        .then((res) => {
          this.currentWeather = res.data[0];
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loadingStates.currentWeather = false;
        });
    },

    getHourlyWeather() {
      this.loadingStates.hourlyWeather = true;

      axios
        .get<HourlyWeather[]>(
          `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${
            this.$route.params.key
          }?apikey=${import.meta.env.VITE_API_KEY}`
        )
        .then((res) => {
          this.hourlyWeather = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loadingStates.hourlyWeather = false;
        });
    },

    getFiveDayWeather() {
      this.loadingStates.fiveDayWeather = true;

      axios
        .get<FiveDayForecast>(
          `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${
            this.$route.params.key
          }?apikey=${import.meta.env.VITE_API_KEY}`
        )
        .then((res) => {
          this.fiveDayWeather = res.data;
        })
        .catch((err) => {
          console.log(err);
          emitter.emit("invalid-api-key");
        })
        .finally(() => {
          this.loadingStates.fiveDayWeather = false;
        });
    },

    convertToCelsius(value: number) {
      const celsius = (value - 32) / 1.8;
      return celsius.toFixed(0);
    },

    handleAddLocation() {
      const location: SavedLocation = {
        Key: this.$route.params.key as string,
        LocalizedName: this.$route.query.name as string,
        Temperature: this.currentWeather.Temperature,
      };

      this.savedLocationsStore.addLocation(location);
    },

    removeLocation() {
      this.savedLocationsStore.removeLocation(this.$route.params.key as string);
    },
  },

  computed: {
    checkLocationInLocalStorage() {
      return this.savedLocationsStore.savedLocations.some(
        (location: SavedLocation) => location.Key === this.$route.params.key
      );
    },
  },

  mounted() {
    emitter.on("addLocation", this.handleAddLocation);
  },

  // to avoid rendering issues
  beforeUnmount() {
    emitter.off("addLocation", this.handleAddLocation);
  },

  created() {
    this.getCurrentWeather();
    this.getHourlyWeather();
    this.getFiveDayWeather();
  },
});
</script>

<style lang="scss">
.details-container {
  text-align: center;
  padding: 0 0 2rem;

  .notice {
    font-size: 1.2rem;
    text-align: center;
    background: var(--secondary-color);
    padding: 1rem 0;
    margin-bottom: 2rem;

    @media (max-width: 1060px) {
      font-size: 1rem;
    }
  }

  .remove-location-btn {
    margin: 2rem 0;
    letter-spacing: normal !important;
    text-transform: none !important;
  }

  .details-content {
    min-width: 320px;
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;

    .current-weather-city {
      h1:first-of-type {
        font-size: 2.5rem;
        font-weight: 600;
      }

      h1:last-of-type {
        font-size: 4rem;
        margin: 2rem 0;
        font-weight: 600;
      }

      &-icon {
        margin: 3rem auto 0;
      }
    }

    .hourly-weather {
      text-align: left;
      font-weight: 600;

      h3 {
        margin-bottom: 1rem;
      }

      &-items {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        flex-wrap: wrap;
        gap: 1rem;

        @media (max-width: 1175px) {
          gap: 1.5rem;
          justify-content: center;
        }
      }

      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        @media (max-width: 1175px) {
          flex: 1;
        }

        &-icon {
          margin: 0 auto;
        }
      }
    }

    .five-day-weather {
      text-align: left;
      font-weight: 600;

      h3 {
        margin-bottom: 1rem;
      }

      &-items {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
      }

      &-item {
        display: flex;
        align-items: center;
        justify-content: space-between;

        p {
          flex: 1;
        }

        p:last-of-type {
          text-align: right;
        }
      }
    }
  }
}
</style>
