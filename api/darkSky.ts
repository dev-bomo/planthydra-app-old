import * as Constants from "expo-constants";
import { darkskyApiKey } from "../secrets";

const latitudePlaceholder: string = "{latitude}";
const longitudePlaceholder = "{longitude}";
const units = "auto"; //automatically select units based on geographic location
const exclude = "minutely,hourly,daily,alerts,flags";

const url: String =
  Constants.default.manifest.extra.darkskyBaseUrl +
  darkskyApiKey +
  "/" +
  latitudePlaceholder +
  "," +
  longitudePlaceholder +
  "?units=" +
  units +
  "&exclude=" +
  exclude;

export async function getWeather(latitude: Number, longitude: Number) {
  let finalUrl = url
    .replace(latitudePlaceholder, latitude.toString())
    .replace(longitudePlaceholder, longitude.toString());
  return await fetch(finalUrl).then(response => response.json());
}
