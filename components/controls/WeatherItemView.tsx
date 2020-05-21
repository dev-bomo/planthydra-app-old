import React from "react";
import { WeatherItem } from "../../model/weatherItem";
import { StyleProp, StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MeridiaText from "../MeridiaText";
import { GeocodingResult } from "../../model/geocodingResult";
import Theme from "../../assets/theme/theme";

const data = require("../../assets/weather_icon_mapping.json");

export interface WeatherItemProps {
    geocodeInfo: GeocodingResult | null;
    weatherData: WeatherItem | null;
    isLoading: boolean;
    style?: StyleProp<any>
}

export default class WeatherItemView extends React.Component<WeatherItemProps, {}> {
    public render(): JSX.Element {
        let { weatherData, isLoading, geocodeInfo }: WeatherItemProps = this.props;
        if (!weatherData) {
            return (<View style={styles.item}>
                <MeridiaText style={styles.weatherInfoText}>{isLoading ? 'loading?' : 'no weather data'}</MeridiaText>
            </View>);
        }

        return (
            <View style={[styles.item, this.props.style]}>
                <View style={[styles.column, { alignContent: 'flex-start', justifyContent: 'center' }]}>
                    <Icon size={64} color='white' name={data[weatherData.currently.icon]} />
                    {geocodeInfo != null ? <MeridiaText style={styles.weatherInfoText}>{geocodeInfo.results[0].formatted_address}</MeridiaText> : null}
                </View>

                <View
                    style={{ height: 60, width: 3, backgroundColor: 'white', borderRadius: 20 }} />

                <View style={[styles.column, { alignItems: 'flex-end', justifyContent: 'center' }]}>
                    <MeridiaText style={styles.weatherInfoText}>{weatherData.currently.temperature.toPrecision(2)}ºC</MeridiaText>
                    <MeridiaText style={styles.weatherInfoText}>{weatherData.currently.precipIntensity} mm</MeridiaText>
                </View>
            </View>
        )
    };
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingLeft: 20,
        paddingRight: 20,
        color: Theme.COLOR_BACKGROUND,
        justifyContent: 'center'
    },

    column: {
        flex: 1,
        flexDirection: 'column',
        margin: 4,
        alignSelf: 'stretch',
        padding: 10,
        paddingTop: 80
    },
    weatherInfoText: {
        alignItems: 'center',
        color: Theme.COLOR_BACKGROUND,

    },
    goodWeatherBackground: {
        backgroundColor: 'rgba(200, 200, 28, 0.2)'
    },
    badWeatherBackground: {
        backgroundColor: 'rgba(28, 64, 28, 0.2)'
    }
});