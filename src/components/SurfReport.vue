<template lang="html">
  <div v-if="report" id="report">
    <main class="current-report">
      <router-link to="/">BACK TO MAP</router-link>
      <div class="main-title">
        <h1 class="location">SURF REPORT FOR {{ spotDetails.name }}</h1>
        <h1>
          <div class="date-day">
            {{ date }} <br />
            <span class="section-title" id="realtime">{{ currentTime }}</span>
          </div>
        </h1>
      </div>
      <div class="location-info">
        <strong>{{ spotDetails.name }}:</strong> <br />
        {{ spotDetails.info }}
      </div>
      <div class="date">
        <div class="conditions">
          {{ conditions }}
        </div>
        <h4 class="section-title section-title-date">
          <div class="wave-height-desc">
            {{ forecast.waveHeight.humanRelation }}:
            {{ forecast.waveHeight.min }} - {{ forecast.waveHeight.max }} ft
          </div>
        </h4>
        <br />
        <div class="current-tide-wrapper">
          Current Tide ({{ styleTime(forecast.tide.current.timestamp) }} EST ):
          {{ forecast.tide.current.type }}
          <br />
          Wave Height: {{ forecast.tide.current.height }} ft. <br />
        </div>
        <br />
        <div class="next-tide-wrapper">
          Next Tide ({{
            styleTime(forecast.tide.next.timestamp)
          }}
          EST):
          {{ forecast.tide.next.type }}
          <br />
          Wave Height:
          {{ forecast.tide.next.height }} ft.
          <br />
        </div>
      </div>
      <div class="temp">
        <div class="weather-container">
          <div class="air-wrapper">
            <h4>Air Temp</h4>
            <div class="air-info" style="display: flex; align-items: center;">
              <img data-weather alt="Weather" v-bind:src="weatherUrl" />
              <span class="section-title"
                >{{ forecast.weather.temperature }}° f</span
              >
            </div>
          </div>
          <div class="water-wrapper">
            <h4>Water Temp</h4>
            <img class="water-icon" :src="waterIcon" alt="Water Temp" />
            <span class="section-title">
              {{ forecast.waterTemp.min }}° - {{ forecast.waterTemp.max }}° f
            </span>
          </div>

          <div class="wind-wrapper">
            <h4>Wind Speed</h4>
            <span class="section-title section-title-date" data-wind-speed>{{
              forecast.wind.speed
            }}</span>
            kts
          </div>
        </div>
      </div>
      <div class="wind-and-swell">
        <span
          class="wind-circle"
          ref="windCircle"
          :style="{
            transform: 'rotate(' + `${forecast.wind.direction}` + 'deg)'
          }"
        >
          <div class="wind-degree" ref="windDegree">
            <div class="wind-arrow" ref="windArrow"></div>
          </div>
        </span>
        <div
          id="location-map"
          ref="locationMap"
          :style="{
            backgroundImage:
              'url(' + require(`../assets/maps/${spotDetails.map}`) + ')'
          }"
        >
          <img
            src="../assets/maps/compass-overlay-black.svg"
            alt="compass"
            width="100%"
            height="100%"
          />
        </div>
        <span
          class="swell-circle"
          :style="{ transform: 'rotate(' + `${swell.direction}` + 'deg)' }"
        >
          <div class="swell-degree">
            <div class="swell-arrow"></div>
          </div>
        </span>
      </div>
      <div class="info">
        <div data-report-section v-html="report.body"></div>
      </div>
    </main>

    <div
      class="upcoming-surf"
      v-on:click="addClass"
      :class="{ 'show-surf': isAddClass }"
    >
      <button for="weather-toggle" class="show-upcoming-surf">
        <span class="arrow-label">↑</span>
        <span class="sr-only">Show upcoming surf</span>
      </button>

      <h2 class="main-title upcoming-surf-title">Upcoming Surf</h2>
      <div class="upcoming-days" data-upcoming-days>
        <UpcomingSurf v-for="day in upcomingSurf" :key="day.data" :day="day" />
      </div>
    </div>
  </div>
</template>

<script>
import spotDetails from "../spotDetails.json";
import UpcomingSurf from "./UpcomingSurf.vue";
import {
  REPORT_URL,
  UPCOMING_SURF_URL,
  formatConditions,
  formatDate
} from "../shared.js";

export default {
  name: "SurfReport",
  components: {
    UpcomingSurf
  },
  data() {
    return {
      id: this.$route.query.id,
      forecast: "",
      spot: "",
      date: "",
      conditions: "",
      swell: "",
      tides: "",
      waterTemp: "",
      waveHeight: "",
      weather: "",
      wind: "",
      report: "",
      weatherUrl: "",
      spotDetails: [],
      isAddClass: false,
      upcomingSurf: [],
      currentTime: "",
      waterIcon:
        "https://wa.cdn-surfline.com/quiver/0.6.2/weathericons/WATER_ICON.svg"
    };
  },
  methods: {
    async fetchSurfData(spotId) {
      const targetUrl = `${REPORT_URL}${spotId}`;
      const data = await fetch(`${targetUrl}`).then(res => {
        return res.json();
      });

      this.date = formatDate(data.report.timestamp),
      this.spot = data.spot,
      this.forecast = data.forecast,
      this.conditions = formatConditions(data.forecast.conditions.value),
      this.tides = data.forecast.tide,
      this.swell = this.primarySwell(data.forecast.swells),
      this.waterTemp = data.forecast.waterTemp,
      this.waveHeight = data.forecast.waveHeight,
      this.weather = data.forecast.weather,
      this.wind = data.forecast.wind,
      this.report = data.report,
      this.weatherUrl = `https://wa.cdn-surfline.com/quiver/0.6.2/weathericons/${data.forecast.weather.condition}.svg`,
      this.spotDetails = this.getSpotDetails(spotId);
    },
    async fetchUpcomingSurf(spotId) {
      const targetUrl = `${UPCOMING_SURF_URL}${spotId}&days=6`;
      const { data } = await fetch(`${targetUrl}`).then(res => res.json());
      this.upcomingSurf = await data.conditions;
    },
    getSpotDetails(spotId) {
      return spotDetails.filter(spot => spot.id === spotId)[0];
    },
    getNow() {
      const today = new Date();
      const time =
        ("0" + today.getHours()).slice(-2) +
        " : " +
        ("0" + today.getMinutes()).slice(-2) +
        " : " +
        ("0" + today.getSeconds()).slice(-2);
      this.currentTime = time;
    },
    styleTime(timestamp) {
      const time = new Date(timestamp * 1000);
      const formattedTime =
        ("0" + time.getHours()).slice(-2) +
        ":" +
        ("0" + time.getMinutes()).slice(-2);
      return formattedTime;
    },
    addClass() {
      this.isAddClass = !this.isAddClass;
    },
    primarySwell(swells) {
      const res = {
        height: -Infinity,
        direction: -Infinity,
        directionMin: -Infinity,
        period: -Infinity
      };

      swells.forEach(el => {
        const { height, direction, directionMin, period } = el;
        if (height > res.height) {
          res.height = height;
          res.direction = direction;
          res.directionMin = directionMin;
          res.period = period;
        }
      });
      return res;
    }
  },
  created() {
    this.fetchSurfData(this.id);
    this.fetchUpcomingSurf(this.id);
    setInterval(this.getNow, 1000);
  }
};
</script>
