import * as  Constants from "expo-constants";
import { googleGeocodeApiKey } from "../secrets";

const geocodeUrl = Constants.default.manifest.extra.googleGeocodeUrl;
const latitudePlaceholder: string = "{latitude}"; //should request from device
const longitudePlaceholder = "{longitude}"; //should request from device
const locationType = "APPROXIMATE";
const resultType = "locality";

const url: String =
  `${geocodeUrl}?latlng=` +
  latitudePlaceholder +
  "," +
  longitudePlaceholder +
  "&result_type=" +
  resultType +
  "&location_type=" +
  locationType +
  "&key=" +
  googleGeocodeApiKey;

export async function getGeocodingInfo(latitude: Number, longitude: Number) {
  let finalUrl = url
    .replace(latitudePlaceholder, latitude.toString())
    .replace(longitudePlaceholder, longitude.toString());
  return await fetch(finalUrl).then(response => response.json());
}
