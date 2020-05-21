import {CurrentWeatherInfo} from "./currentWeatherInfo";

export interface WeatherItem {
    latitude: number,
    longitude: number,
    timezone: string,
    currently: CurrentWeatherInfo,
    offset: number
}