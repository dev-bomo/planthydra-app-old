import { ImageBackground, Platform, SafeAreaView, View } from "react-native";
import HistoryItem from "../controls/HistoryItem";
import { HistoryRun, Level, WaterNow } from "../../model/historyRun";
import React from "react";
import ScheduleControlItem from "../controls/ScheduleControlItem";
import { Modal, Portal, Surface, TouchableRipple } from "react-native-paper";
import { State } from "../../redux/rootReducer";
import { ScheduleItem } from "../../model/scheduleItem";
import { connect } from "react-redux";
import Api from "../../api/Api";
import {
    editSchedule,
    fetchHistory,
    fetchSchedules,
    fetchWeather,
    toggleScheduleEnabled,
    updateSchedule,
    waterNow,
    cancelEditSchedule,
    fetchDeviceState,
    fetchGeocodeInfo,
    cancelWatering
} from "./actions";
import { Dispatch } from "redux";

import WeatherItemView from "../controls/WeatherItemView";
import { WeatherItem } from "../../model/weatherItem";
import { NavigationInjectedProps, withNavigation } from "react-navigation";
import HistoryCalendar from "../controls/HistoryCalendar";
import ScheduleEditor from "../controls/ScheduleEditor";
import MeridiaCardHeaderText from "../MeridiaCardHeaderText";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Location from "expo-location";
import { DeviceStatus } from "../../model/deviceStatus";
import { GeocodingResult } from "../../model/geocodingResult";
import WaterNowControl from "../controls/WaterNowControl";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Theme from "../../assets/theme/theme";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from './styles';

export interface CommandScreenProps {

}

interface StateProps {
    schedules: ScheduleItem[];
    historyItems: HistoryRun[];
    isLoading: boolean;
    nowWateringLevel: number;
    weatherData: WeatherItem | null;
    geocodeInfo: GeocodingResult | null;
    selectedSchedule: ScheduleItem | null;
    isEditingSchedule: boolean;
    deviceStatus: DeviceStatus | null;
}

interface DispatchProps {
    fetchHistoryItems: () => void;
    fetchSchedules: () => void;
    waterNow: (waterNowItem: WaterNow) => void;
    fetchWeatherData: (latitude: Number, longitude: Number) => void;
    fetchGeocodeInfo: (latitude: Number, longitude: Number) => void;
    toggleScheduleEnabled: (level: Level) => void;
    editSchedule: (schedule: ScheduleItem | null) => void;
    cancelEditSchedule: () => void;
    updateSchedule: (schedule: ScheduleItem) => void;
    fetchDeviceStatus: () => void;
    cancelWatering: (level: Level) => void;
}

interface OwnState {
    isFabOpen: boolean;
    showingFullHistory: boolean;
    historyLevel: Level;
    editingScheduleLevel: Level;
    location: null | any;
    errorMessage: null | String;
    nowWateringDuration: number | null;
}

type Props = CommandScreenProps & StateProps & DispatchProps & NavigationInjectedProps;

class CommandScreen extends React.Component<Props, OwnState> {

    static navigationOptions = {
        header: null
    };

    public constructor(props: Props) {
        super(props);
        this.userIconAction = this.userIconAction.bind(this);
        this.openFullHistory = this.openFullHistory.bind(this);
        this.closeFullHistory = this.closeFullHistory.bind(this);
        this.editSchedule = this.editSchedule.bind(this);
        this.getSchedule = this.getSchedule.bind(this);
        this.state = {
            isFabOpen: false,
            showingFullHistory: false,
            historyLevel: Level.Upper,
            editingScheduleLevel: Level.Lower,
            location: null,
            errorMessage: null,
            nowWateringDuration: null
        };

    }

    public componentDidMount() {
        this.props.fetchHistoryItems();
        this.props.fetchSchedules();
        this.props.fetchDeviceStatus();
    }

    componentWillMount(): void {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log("location latitude: " + location.coords.latitude);
        console.log("location longitude: " + location.coords.longitude);
        this.props.fetchWeatherData(location.coords.latitude, location.coords.longitude);
        this.props.fetchGeocodeInfo(location.coords.latitude, location.coords.longitude);
        this.setState({ location });
    };

    public render(): JSX.Element {
        let { isLoading, nowWateringLevel, historyItems, selectedSchedule, isEditingSchedule }: Props = this.props;
        let { showingFullHistory, historyLevel, editingScheduleLevel }: OwnState = this.state;
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <ImageBackground source={require('../../assets/splash-textless.jpg')} style={styles.cover}>
                    <View style={styles.cover}>
                        <WeatherItemView geocodeInfo={this.getGeocodeInfo()} weatherData={this.getWeatherData()} isLoading={false} style={styles.weatherOverlay} />
                        <TouchableRipple onPress={this.userIconAction} underlayColor='#518057' style={styles.userButton}>
                            <Icon name='account' style={styles.userButtonIcon} size={40} color={Theme.COLOR_SECONDARY}></Icon>
                        </TouchableRipple>
                    </View>


                    <View style={styles.content}>

                        <ScrollView>
                            <Surface style={styles.scheduleCard}>
                                <MeridiaCardHeaderText style={styles.cardHeader}>Schedules</MeridiaCardHeaderText>
                                <ScheduleControlItem isLoading={isLoading}

                                    item={this.getSchedule(Level.Upper)}
                                    style={styles.cardItem}
                                    toggleIsEnabled={() => {
                                        this.props.toggleScheduleEnabled(Level.Upper)
                                    }}
                                    level={Level.Upper}
                                    editSchedule={this.editSchedule} />
                                <ScheduleControlItem isLoading={isLoading}
                                    item={this.getSchedule(Level.Lower)}
                                    style={styles.cardItem}
                                    toggleIsEnabled={() => {
                                        this.props.toggleScheduleEnabled(Level.Lower)
                                    }}
                                    level={Level.Lower}
                                    editSchedule={this.editSchedule} />
                            </Surface>
                            <Surface style={styles.historyCard}>
                                <MeridiaCardHeaderText style={styles.cardHeader}>History</MeridiaCardHeaderText>
                                <HistoryItem
                                    isWatering={nowWateringLevel === Level.Upper}
                                    isLoading={isLoading}
                                    level={Level.Upper}
                                    item={this.getLatestTopHistoryRun()}
                                    style={styles.cardItem}
                                    openFullHistory={() => {
                                        this.openFullHistory(Level.Upper)
                                    }}>
                                </HistoryItem>
                                <HistoryItem
                                    isWatering={nowWateringLevel === Level.Lower}
                                    isLoading={isLoading}
                                    level={Level.Lower}
                                    item={this.getLatestBottomHistoryRun()}
                                    style={styles.cardItem}
                                    openFullHistory={() => {
                                        this.openFullHistory(Level.Lower)
                                    }}>
                                </HistoryItem>
                            </Surface>
                        </ScrollView>
                    </View>
                    <Portal>

                        <Modal contentContainerStyle={styles.modalContainer} visible={showingFullHistory}
                            onDismiss={this.closeFullHistory}>
                            <HistoryCalendar defaultLevel={historyLevel} items={historyItems}></HistoryCalendar>
                        </Modal>
                        <Modal contentContainerStyle={styles.modalContainer} visible={showingFullHistory}
                            onDismiss={this.closeFullHistory}>
                            <HistoryCalendar defaultLevel={historyLevel} items={historyItems}></HistoryCalendar>
                        </Modal>
                        <Modal dismissable={false} contentContainerStyle={styles.modalContainer}
                            visible={isEditingSchedule}>
                            <ScheduleEditor
                                level={editingScheduleLevel}
                                schedule={selectedSchedule}
                                cancelOperation={this.props.cancelEditSchedule}
                                updateSchedule={this.props.updateSchedule}>
                            </ScheduleEditor>
                        </Modal>
                    </Portal>

                </ImageBackground>
                <WaterNowControl waterNowTriggered={this.props.waterNow}
                    isError={this.props.deviceStatus !== null && !this.props.deviceStatus.isOnline}
                    nowWateringLevel={this.props.nowWateringLevel}
                    cancelWatering={this.props.cancelWatering}
                    errorText='The Arbour is offline. This may be because it has lost power or connection to the wifi network or the server. 
                        Check the device status LED (green) and error LED (red). No light = no power, blinking rapidly = hotspot mode, blinking slowly = connected to wifi, connecting to server, always on = connected to server. RED LED on: cannot connect to server.'/>
            </SafeAreaView>
        );
    }

    private getSchedule(level: Level): ScheduleItem | null {
        let schedule: ScheduleItem | undefined = this.props.schedules.find && this.props.schedules.find((sc: ScheduleItem) => sc.waterNow.level === level);
        return schedule ? schedule : null;
    }

    private editSchedule(schedule: ScheduleItem | null, level: Level): void {
        this.setState({ editingScheduleLevel: level });
        this.props.editSchedule(schedule);
    }

    private openFullHistory(level: Level): void {
        this.setState({ historyLevel: level, showingFullHistory: true });
    }

    private closeFullHistory(): void {
        this.setState({ showingFullHistory: false });
    }

    private userIconAction(): void {
        this.props.navigation.navigate('User');
    }

    private getLatestTopHistoryRun(): HistoryRun | null {
        let upperRun: HistoryRun | undefined = this.props.historyItems.find((run: HistoryRun) => run.waterNow.level === Level.Upper);
        return upperRun ? upperRun : null;
    }

    private getLatestBottomHistoryRun(): HistoryRun | null {
        let lowerRun: HistoryRun | undefined = this.props.historyItems.find((run: HistoryRun) => run.waterNow.level === Level.Lower);
        return lowerRun ? lowerRun : null;
    }

    private getWeatherData(): WeatherItem | null {
        return this.props.weatherData;
    }

    private getGeocodeInfo(): GeocodingResult | null {
        return this.props.geocodeInfo;
    }
}

function mapStateToProps(state: State, props: CommandScreenProps): StateProps {
    return {
        schedules: state.command.schedules,
        historyItems: state.command.historyItems,
        isLoading: state.command.isWorking,
        nowWateringLevel: state.command.nowWateringLevel,
        weatherData: state.command.weatherItem,
        geocodeInfo: state.command.geocodingInfo,
        selectedSchedule: state.command.selectedSchedule,
        isEditingSchedule: state.command.isEditingSchedule,
        deviceStatus: state.command.deviceStatus
    };
}

const mapDispatchToProps = {
    fetchHistoryItems: () => (dispatch: Dispatch, getState: any, api: Api) => {
        dispatch(fetchHistory(dispatch, api));
    },
    fetchSchedules: () => (dispatch: Dispatch, getState: any, api: Api) => {
        dispatch(fetchSchedules(dispatch, api));
    },
    waterNow: (waterNowItem: WaterNow) => (dispatch: Dispatch, getState: any, api: Api) => {
        dispatch(waterNow(waterNowItem, dispatch, api));
    },
    fetchWeatherData: (latitude: Number, longitude: Number) => (dispatch: Dispatch) => {
        dispatch(fetchWeather(latitude, longitude, dispatch));
    },
    fetchGeocodeInfo: (latitude: Number, longitude: Number) => (dispatch: Dispatch) => {
        dispatch(fetchGeocodeInfo(latitude, longitude, dispatch));
    },
    toggleScheduleEnabled: (level: Level) => (dispatch: Dispatch, getState: any, api: Api) => {
        dispatch(toggleScheduleEnabled(dispatch, level, api));
    },
    editSchedule: (schedule: ScheduleItem | null) => (dispatch: Dispatch) => {
        dispatch(editSchedule(schedule));
    },
    cancelEditSchedule: () => (dispatch: Dispatch) => {
        dispatch(cancelEditSchedule());
    },
    updateSchedule: (schedule: ScheduleItem) => (dispatch: Dispatch, getState: State, api: Api) => {
        dispatch(updateSchedule(schedule, dispatch, api));
    },
    fetchDeviceStatus: () => (dispatch: Dispatch, getState: State, api: Api) => {
        dispatch(fetchDeviceState(dispatch, api));
    },
    cancelWatering: (level: Level) => (dispatch: Dispatch, getState: State, api: Api) => {
        dispatch(cancelWatering(level, dispatch, api));
    }
};

export default withNavigation(connect<StateProps, DispatchProps, CommandScreenProps, State>(mapStateToProps, mapDispatchToProps)(CommandScreen));