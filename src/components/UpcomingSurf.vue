<template data-upcoming-day-template>
  <div class="upcoming-day">
    <h3 class="upcoming-day__date margin-bottom">
      {{formatDate(day.timestamp)}}
    </h3>
    <p class="upcoming-day__rating">
      <b>AM Rating:</b> <br />
      {{ formatConditions(day.am.rating) }}:
    </p>
    <p class="upcoming-day__am_min_max">
      <b>AM Min/Max: </b> <br />
      {{ day.am.minHeight }} -
      {{ day.am.maxHeight }} ft. ({{
        day.am.humanRelation
      }})
    </p>
    <p class="upcoming-day__rating">
      <b>PM Rating:</b> <br />
      {{ formatConditions(day.pm.rating) }}:
    </p>
    <p class="upcoming-day__pm_min-max">
      <b>PM Min/Max:</b> <br />
      {{ day.pm.minHeight }} -
      {{ day.pm.maxHeight }} ft. ({{
        day.pm.humanRelation
      }})
    </p>
  </div>
</template>

<script>
import { formatConditions, formatDate } from "../shared.js";

export default {
  name: "UpcomingSurf",
  props: {
    day: Object
  },
  created() {
    this.formatConditions = formatConditions;
    this.formatDate = formatDate;
  }
};
</script>
