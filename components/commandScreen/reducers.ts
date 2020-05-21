import { Action, ActionTypes } from "./actions";
import { ScheduleItem } from "../../model/scheduleItem";
import { WeatherItem } from "../../model/weatherItem";
import { HistoryRun } from "../../model/historyRun";
import { DeviceStatus } from "../../model/deviceStatus";
import { GeocodingResult } from "../../model/geocodingResult";

export interface State {
    schedules: ScheduleItem[];
    historyItems: HistoryRun[];
    selectedSchedule: ScheduleItem | null;
    isEditingSchedule: boolean;
    weatherItem: WeatherItem | null;
    geocodingInfo: GeocodingResult | null;
    nowWateringLevel: number;
    isWorking: boolean;
    errorState: Error | null;
    snackbarContent: SnackbarContent;
    hasNews: boolean;
    deviceStatus: DeviceStatus | null;
}

export interface SnackbarContent {
    isVisible: boolean;
    contentText: string;
}

export const initialState: State = {
    schedules: [],
    historyItems: [],
    selectedSchedule: null,
    isEditingSchedule: false,
    weatherItem: null,
    geocodingInfo: null,
    nowWateringLevel: 0,
    isWorking: false,
    errorState: null,
    snackbarContent: { isVisible: false, contentText: '' },
    hasNews: false,
    deviceStatus: null
};

export function reducer(state: State = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.FETCH_SCHEDULES:
            return {
                ...state,
                isWorking: true
            };
        case ActionTypes.UPDATE_SCHEDULES:
            return {
                ...state,
                isWorking: false,
                schedules: action.payload.schedules || []
            };
        case ActionTypes.FETCH_HISTORY:
            return {
                ...state,
                isWorking: true
            };
        case ActionTypes.UPDATE_HISTORY:
            return {
                ...state,
                isWorking: false,
                historyItems: action.payload.historyItems
            };
        case ActionTypes.EDIT_SCHEDULE:
            return {
                ...state,
                isEditingSchedule: true,
                selectedSchedule: action.payload.selectedSchedule
            };
        case ActionTypes.CANCEL_EDIT_SCHEDULE:
            return {
                ...state,
                isEditingSchedule: false
            };
        case ActionTypes.UPDATE_SCHEDULE:
            return {
                ...state,
                isWorking: true
            };
        case ActionTypes.SCHEDULE_UPDATE_DONE:
            return {
                ...state,
                isWorking: false,
                isEditingSchedule: !action.payload.success,
                snackbarContent: action.payload.message
            };
        case ActionTypes.WATER_NOW:
            return {
                ...state,
                nowWateringLevel: action.payload.nowWateringLevel
            };
        case ActionTypes.DONE_WATERING:
            return {
                ...state,
                nowWateringLevel: 0
            };
        case ActionTypes.SET_SNACKBAR:
            return {
                ...state,
                snackbarContent: action.payload.snackbarContent
            };
        case ActionTypes.UPDATE_WEATHER:
            return {
                ...state,
                weatherItem: action.payload.weatherItem
            };
        case ActionTypes.SET_DEVICE_STATUS:
            return {
                ...state,
                deviceStatus: action.payload.deviceStatus
            }
        case ActionTypes.UPDATE_GEOCODING_INFO:
            return {
                ...state,
                geocodingInfo: action.payload.geocodingItem
            };
        case ActionTypes.CANCEL_WATERING:
            return {
                ...state,
                nowWateringLevel: 0
            }
        case ActionTypes.FETCH_DEVICE_STATUS:
        case ActionTypes.TOGGLE_SCHEDULE_ENABLED:
        default:
            return state;
    }
}