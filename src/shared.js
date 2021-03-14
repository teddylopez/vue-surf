const REPORT_URL = "https://services.surfline.com/kbyg/spots/reports?spotId=";
const UPCOMING_SURF_URL =
  "https://services.surfline.com/kbyg/spots/forecasts/conditions?spotId=";

function formatConditions(conditions) {
  return conditions.split("_").join(" ");
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000)
    .toString()
    .split(" ", 4)
    .join(" ");
}

export { REPORT_URL, UPCOMING_SURF_URL, formatConditions, formatDate };
