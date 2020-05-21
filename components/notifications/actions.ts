export enum ActionTypes {
  SET_SNACKBAR_MESSAGE = "[notification] SET_SNACKBAR_MESSAGE"
}

export interface SetMessagePayload {
  timestamp: number;
  message: string | null;
}

export interface SetMessageAction {
  type: ActionTypes.SET_SNACKBAR_MESSAGE;
  payload: SetMessagePayload;
}

export type Action = SetMessageAction;

export function setMessage(message: string): SetMessageAction {
  return {
    type: ActionTypes.SET_SNACKBAR_MESSAGE,
    payload: {
      timestamp: Date.now(),
      message
    }
  };
}
