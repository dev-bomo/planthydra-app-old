import { UserProfile } from "../../model/userProfile";
import { Action, ActionTypes } from "./actions";
import { DeviceStatus } from "../../model/deviceStatus";

export interface State {
  user: UserProfile | null;
  notifications: DeviceStatus[];
  isWorking: boolean;
  openNotification: DeviceStatus | null;
  loggedIn: boolean;
  deviceToken: string | null;
}

export const initialState: State = {
  user: null,
  notifications: [],
  isWorking: false,
  openNotification: null,
  loggedIn: false,
  deviceToken: null
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ActionTypes.UPDATE_USER_DATA:
      return {
        ...state,
        user: action.payload.user,
        isWorking: false
      };
    case ActionTypes.UPDATE_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload.notifications,
        isWorking: false
      };
    case ActionTypes.OPEN_NOTIFICATION:
      return {
        ...state,
        openNotification: action.payload.notification
      };
    case ActionTypes.FETCH_USER_DATA:
    case ActionTypes.FETCH_NOTIFICATIONS:
      return {
        ...state,
        isWorking: true
      };
    case ActionTypes.LOG_OUT:
    case ActionTypes.CHECK_LOGIN:
      return {
        ...state,
        loggedIn: action.payload
      };
    case ActionTypes.UPDATE_DEVICE_TOKEN:
      return {
        ...state,
        deviceToken: action.payload.deviceToken
      }
    case ActionTypes.CLOSE_NOTIFICATION:
    default:
      return state;
  }
}
