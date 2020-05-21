import { ScheduleItem } from "../../model/scheduleItem";
import { WeatherItem } from "../../model/weatherItem";
import { HistoryRun, Level, WaterNow } from "../../model/historyRun";
import Api from "../../api/Api";
import { Dispatch } from 'redux';
import { SnackbarContent } from "./reducers";
import { getWeather } from "../../api/darkSky";
import { DeviceStatus } from "../../model/deviceStatus";
import { GeocodingResult } from "../../model/geocodingResult";
import { getGeocodingInfo } from "../../api/geocoding";

export enum ActionTypes {
    UPDATE_GEOCODING_INFO = '[command] UPDATE_GEOCODING_INFO',
    FETCH_GEOCODING_INFO = '[command] FETCH_GEOCODING_INFO',
    FETCH_SCHEDULES = '[command] FETCH_SCHEDULES',
    UPDATE_SCHEDULES = '[command] UPDATE_SCHEDULES',
    FETCH_HISTORY = '[command] FETCH_HISTORY',
    UPDATE_HISTORY = '[command] UPDATE_HISTORY',
    EDIT_SCHEDULE = '[command] EDIT_SCHEDULE',
    CANCEL_EDIT_SCHEDULE = '[command] CANCEL_EDIT_SCHEDULE',
    UPDATE_SCHEDULE = '[command] UPDATE_SCHEDULE',
    TOGGLE_SCHEDULE_ENABLED = '[command] TOGGLE_SCHEDULE_ENABLED',
    SCHEDULE_UPDATE_DONE = '[command] SCHEDULE_UPDATE_DONE',
    WATER_NOW = '[command] WATER_NOW',
    DONE_WATERING_CALL = '[command] DONE_WATERING_CALL',
    DONE_WATERING = '[command] DONE_WATERING',
    FETCH_WEATHER = '[command] FETCH_WEATHER',
    UPDATE_WEATHER = '[command] UPDATE_WEATHER',
    SET_SNACKBAR = '[command] SET_SNACKBAR',
    FETCH_DEVICE_STATUS = '[command] FETCH_DEVICE_STATUS',
    SET_DEVICE_STATUS = '[command] SET_DEVICE_STATUS',
    CANCEL_WATERING = '[command] CANCEL_WATERING'
}

export interface FetchDeviceStatusAction {
    type: ActionTypes.FETCH_DEVICE_STATUS;
}

export interface SetDeviceStatusAction {
    type: ActionTypes.SET_DEVICE_STATUS;
    payload: {
        deviceStatus: DeviceStatus
    }
}

export interface FetchGeocodeInfoAction {
    type: ActionTypes.FETCH_GEOCODING_INFO;
}

export interface UpdateGeocodingInfoAction {
    type: ActionTypes.UPDATE_GEOCODING_INFO;
    payload: {
        geocodingItem: GeocodingResult
    }
}

export interface FetchSchedulesAction {
    type: ActionTypes.FETCH_SCHEDULES;
}

export interface UpdateSchedulesAction {
    type: ActionTypes.UPDATE_SCHEDULES;
    payload: {
        schedules: ScheduleItem[]
    };
}

export interface FetchHistoryAction {
    type: ActionTypes.FETCH_HISTORY;
}

export interface UpdateHistoryAction {
    type: ActionTypes.UPDATE_HISTORY;
    payload: {
        historyItems: HistoryRun[]
    };
}

export interface EditScheduleAction {
    type: ActionTypes.EDIT_SCHEDULE;
    payload: {
        selectedSchedule: ScheduleItem | null
    };
}

export interface CancelEditScheduleAction {
    type: ActionTypes.CANCEL_EDIT_SCHEDULE;
}

export interface UpdateScheduleAction {
    type: ActionTypes.UPDATE_SCHEDULE;
    payload: {
        scheduleToUpdate: ScheduleItem
    };
}

export interface ToggleScheduleEnabledAction {
    type: ActionTypes.TOGGLE_SCHEDULE_ENABLED;
    payload: {
        level: Level
    }
}

export interface ScheduleUpdateDoneAction {
    type: ActionTypes.SCHEDULE_UPDATE_DONE;
    payload: {
        success: boolean,
        message: string
    }
}

export interface WaterNowAction {
    type: ActionTypes.WATER_NOW;
    payload: {
        nowWateringLevel: number
    };
}

export interface DoneWateringCallAction {
    type: ActionTypes.DONE_WATERING_CALL;
    // some error here too?
}

export interface DoneWateringAction {
    type: ActionTypes.DONE_WATERING;
}

export interface FetchWeatherAction {
    type: ActionTypes.FETCH_WEATHER;
}

export interface UpdateWeatherAction {
    type: ActionTypes.UPDATE_WEATHER;
    payload: {
        weatherItem: WeatherItem
    }
}

export interface SetSnackbarAction {
    type: ActionTypes.SET_SNACKBAR;
    payload: {
        snackbarContent: SnackbarContent
    };
}

export interface CancelWateringAction {
    type: ActionTypes.CANCEL_WATERING;
}

export function cancelWatering(level: Level, dispatch: Dispatch, api: Api): CancelWateringAction {
    api.cancelWatering(level).then(() => {
        dispatch(setSnackbar(dispatch, { contentText: 'Watering canceled', isVisible: true }))
    }).catch((error: Error) => {
        // TODO: Do some sort of error stuff
    });
    return {
        type: ActionTypes.CANCEL_WATERING
    }
}

export function fetchDeviceState(dispatch: Dispatch, api: Api): FetchDeviceStatusAction {
    api.getDeviceState().then((ds: DeviceStatus) => {
        dispatch(setDeviceState(ds));
    }).catch((error: Error) => {
        // this is pretty bad but it's probably because the server can't be reached at all
    })
    return {
        type: ActionTypes.FETCH_DEVICE_STATUS
    }
}

export function setDeviceState(deviceStatus: DeviceStatus): SetDeviceStatusAction {
    return {
        type: ActionTypes.SET_DEVICE_STATUS,
        payload: {
            deviceStatus: deviceStatus
        }
    }
}

export function fetchSchedules(dispatch: Dispatch<Action>, api: Api): FetchSchedulesAction {
    api.fetchSchedules().then((schedules: ScheduleItem[]) => {
        dispatch(updateSchedules(schedules));
    });
    return {
        type: ActionTypes.FETCH_SCHEDULES
    };
}

export function updateSchedules(schedules: ScheduleItem[]): UpdateSchedulesAction {
    return {
        type: ActionTypes.UPDATE_SCHEDULES,
        payload: {
            schedules: schedules
        }
    };
}

export function fetchHistory(dispatch: Dispatch, api: Api): FetchHistoryAction {
    api.fetchHistoryData().then((data: HistoryRun[]) => {

        let historyRuns: HistoryRun[] = data && data.sort && data.sort((item1: HistoryRun, item2: HistoryRun) => {
            let date1: Date = new Date(item1.startTime);
            let date2: Date = new Date(item2.startTime);
            return date2.valueOf() - date1.valueOf();
        }) || [];

        dispatch(updateHistory(historyRuns));
    });
    return {
        type: ActionTypes.FETCH_HISTORY
    };
}

export function updateHistory(historyItems: HistoryRun[]): UpdateHistoryAction {
    return {
        type: ActionTypes.UPDATE_HISTORY,
        payload: {
            historyItems: historyItems
        }
    };
}

export function editSchedule(schedule: ScheduleItem | null): EditScheduleAction {
    return {
        type: ActionTypes.EDIT_SCHEDULE,
        payload: {
            selectedSchedule: schedule
        }
    };
}

export function cancelEditSchedule(): CancelEditScheduleAction {
    return {
        type: ActionTypes.CANCEL_EDIT_SCHEDULE
    }
}

export function updateSchedule(editedSchedule: ScheduleItem, dispatch: Dispatch, api: Api): UpdateScheduleAction {
    api.updateSchedule(editedSchedule).then(() => {
        dispatch(scheduleUpdateDone(true, 'Schedule updated'));
        dispatch(fetchSchedules(dispatch, api));
        dispatch(setSnackbar(dispatch, { isVisible: true, contentText: 'Schedule updated successfuly' }));
    }, (error: Error) => {
        dispatch(scheduleUpdateDone(false, 'Failed because of: ' + error.message));
    });
    return {
        type: ActionTypes.UPDATE_SCHEDULE,
        payload: {
            scheduleToUpdate: editedSchedule
        }
    };
}

export function toggleScheduleEnabled(dispatch: Dispatch, level: Level, api: Api): ToggleScheduleEnabledAction {
    api.toggleSchedule(level).then(() => {
        dispatch(fetchSchedules(dispatch, api));
    }, (error: Error) => {
        dispatch(setSnackbar(dispatch, { isVisible: true, contentText: 'Error while updating schedule' }))
    });
    return {
        type: ActionTypes.TOGGLE_SCHEDULE_ENABLED,
        payload: {
            level: level
        }
    }
}

export function scheduleUpdateDone(success: boolean, message: string): ScheduleUpdateDoneAction {
    return {
        type: ActionTypes.SCHEDULE_UPDATE_DONE,
        payload: {
            success: success,
            message: message
        }
    };
}

export function waterNow(waterNowItem: WaterNow, dispatch: Dispatch, api: Api): WaterNowAction {
    // do a server call and register the callback to the donewateringcall
    api.waterNow(waterNowItem.level, waterNowItem.duration).then(() => {
        dispatch(doneWateringCall());
    }, () => {
        // error handling
    });

    setTimeout(() => {
        dispatch(fetchHistory(dispatch, api));
        dispatch(doneWatering());
    }, waterNowItem.duration * 1000);

    return {
        type: ActionTypes.WATER_NOW,
        payload: {
            nowWateringLevel: waterNowItem.level
        }
    }
}

export function doneWateringCall(): DoneWateringCallAction {
    return {
        type: ActionTypes.DONE_WATERING_CALL
    };
}

export function doneWatering(): DoneWateringAction {
    // may want to add the history item here instead of doing a full refresh
    return {
        type: ActionTypes.DONE_WATERING
    };
}

export function updateWeatherData(data: WeatherItem): UpdateWeatherAction {
    return {
        type: ActionTypes.UPDATE_WEATHER,
        payload: {
            weatherItem: data
        }
    };
}

export function updateGeocodingInfoData(data: GeocodingResult): UpdateGeocodingInfoAction {
    return {
        type: ActionTypes.UPDATE_GEOCODING_INFO,
        payload: {
            geocodingItem: data
        }
    };
}

export function fetchWeather(latitude: Number, longitude: Number, dispatch: Dispatch): FetchWeatherAction {
    getWeather(latitude, longitude).then((data: WeatherItem) => {
        dispatch(updateWeatherData(data))
    }, () => {
        //TODO error handling
    });
    return {
        type: ActionTypes.FETCH_WEATHER
    };
}

export function fetchGeocodeInfo(latitude: Number, longitude: Number, dispatch: Dispatch): FetchGeocodeInfoAction {
    getGeocodingInfo(latitude, longitude).then((data: GeocodingResult) => {
        console.log("geocodingInfo: " + data.results[0].formatted_address);
        dispatch(updateGeocodingInfoData(data))
    }, () => {
        //TODO error handling
    });
    return {
        type: ActionTypes.FETCH_GEOCODING_INFO
    };
}

export function setSnackbar(dispatch: Dispatch, snackbarContent: SnackbarContent): SetSnackbarAction {
    // auto hide in 2 seconds
    snackbarContent && snackbarContent.isVisible && setTimeout(() => {
        dispatch(setSnackbar(dispatch, { isVisible: false, contentText: '' }))
    }, 2000);
    return {
        type: ActionTypes.SET_SNACKBAR,
        payload: {
            snackbarContent: snackbarContent
        }
    }
}

export type Action = FetchSchedulesAction |
    UpdateSchedulesAction |
    FetchHistoryAction |
    UpdateHistoryAction |
    EditScheduleAction |
    UpdateScheduleAction |
    ToggleScheduleEnabledAction |
    ScheduleUpdateDoneAction |
    WaterNowAction |
    DoneWateringCallAction |
    DoneWateringAction |
    FetchWeatherAction |
    UpdateWeatherAction |
    SetSnackbarAction |
    CancelEditScheduleAction |
    FetchDeviceStatusAction |
    SetDeviceStatusAction |
    FetchGeocodeInfoAction |
    UpdateGeocodingInfoAction |
    CancelWateringAction;
