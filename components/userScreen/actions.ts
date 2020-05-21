import { UserProfile } from "../../model/userProfile";
import { Dispatch } from "react";
import Api from "../../api/Api";
import SecureStorage from "../../api/SecureStorage";
import { DeviceStatus } from "../../model/deviceStatus";

export enum ActionTypes {
  FETCH_USER_DATA = "[user] FETCH_USER_DATA",
  UPDATE_USER_DATA = "[user] UPDATE_USER_DATA",
  CLEAR_USER_DATA = "[user] CLEAR_USER_DATA",
  LOG_OUT = "[user] LOG_OUT",
  CHECK_LOGIN = "[user] CHECK_LOGIN",
  FETCH_NOTIFICATIONS = "[user] FETCH_NOTIFICATIONS",
  UPDATE_NOTIFICATIONS = "[user] UPDATE_NOTIFICATIONS",
  OPEN_NOTIFICATION = "[user] OPEN_NOTIFICATION",
  CLOSE_NOTIFICATION = "[user] CLOSE_NOTIFICATION",
  UPDATE_DEVICE_TOKEN = "[user] UPDATE_DEVICE_TOKEN"
}

async function setIsLoggedIn(): Promise<boolean> {
  const token: string | null = await SecureStorage.getRefreshToken();
  if (token && token !== "") {
    return true;
  } else {
    return false;
  }
}

export interface UpdateDeviceTokenAction {
  type: ActionTypes.UPDATE_DEVICE_TOKEN;
  payload: {
    deviceToken: string
  };
}

export interface FetchUserDataAction {
  type: ActionTypes.FETCH_USER_DATA;
}

export interface UpdateUserDataAction {
  type: ActionTypes.UPDATE_USER_DATA;
  payload: {
    user: UserProfile;
  };
}

export interface FetchNotificationsAction {
  type: ActionTypes.FETCH_NOTIFICATIONS;
}

export interface UpdateNotificationsAction {
  type: ActionTypes.UPDATE_NOTIFICATIONS;
  payload: {
    notifications: DeviceStatus[];
  };
}

export interface OpenNotificationAction {
  type: ActionTypes.OPEN_NOTIFICATION;
  payload: {
    notification: DeviceStatus;
  };
}

export interface CloseNotificationAction {
  type: ActionTypes.CLOSE_NOTIFICATION;
}

export interface CheckLoginAction {
  type: ActionTypes.CHECK_LOGIN | ActionTypes.LOG_OUT;
  payload: boolean;
}

export function updateDeviceToken(token: string): UpdateDeviceTokenAction {
  return {
    type: ActionTypes.UPDATE_DEVICE_TOKEN,
    payload: {
      deviceToken: token
    }
  }
}

export async function fetchUserData(dispatch: Dispatch<Action>): Promise<FetchUserDataAction> {
  let up: UserProfile | null = await SecureStorage.getUserProfile();
  let token: string | null = await SecureStorage.getDeviceToken();
  if (up) {
    dispatch(updateUserData(up));
  }

  if (token) {
    dispatch(updateDeviceToken(token));
  }
  return {
    type: ActionTypes.FETCH_USER_DATA
  }
}

export function updateUserData(user: UserProfile): UpdateUserDataAction {
  return {
    type: ActionTypes.UPDATE_USER_DATA,
    payload: {
      user: user
    }
  };
}

export async function checkLogin(): Promise<CheckLoginAction> {
  return { type: ActionTypes.CHECK_LOGIN, payload: await setIsLoggedIn() };
}

export async function logOut(
  dispatch: Dispatch<Action>,
  api: Api
): Promise<CheckLoginAction> {
  try {
    await api.logout();
  } catch (e) {
    console.log("error logging out: ", e);
  }
  await SecureStorage.removeData();
  return {
    type: ActionTypes.LOG_OUT,
    payload: await setIsLoggedIn()
  };
}

export async function fetchNotifications(
  dispatch: Dispatch<Action>,
  api: Api
): Promise<FetchNotificationsAction> {
  let deviceToken: string | null = await SecureStorage.getDeviceToken();
  if (deviceToken) {
    let deviceStatusHistory: DeviceStatus[] = await api.getAllHistoryForDevice(deviceToken);
    dispatch(updateNotifications(deviceStatusHistory));
  }
  return {
    type: ActionTypes.FETCH_NOTIFICATIONS
  };
}

export function updateNotifications(
  notifications: DeviceStatus[]
): UpdateNotificationsAction {
  return {
    type: ActionTypes.UPDATE_NOTIFICATIONS,
    payload: {
      notifications: notifications
    }
  };
}

export function openNotification(
  notification: DeviceStatus
): OpenNotificationAction {
  return {
    type: ActionTypes.OPEN_NOTIFICATION,
    payload: {
      notification: notification
    }
  };
}

export function closeNotification(): CloseNotificationAction {
  return {
    type: ActionTypes.CLOSE_NOTIFICATION
  };
}

export type Action =
  | FetchUserDataAction
  | UpdateUserDataAction
  | FetchNotificationsAction
  | UpdateNotificationsAction
  | OpenNotificationAction
  | CloseNotificationAction
  | CheckLoginAction
  | UpdateDeviceTokenAction;
