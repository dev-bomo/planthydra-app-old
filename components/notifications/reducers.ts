import { Action, ActionTypes, SetMessagePayload } from "./actions";

export interface State {
  snackbar: SetMessagePayload;
}

export const initialState: State = {
  snackbar: {
    timestamp: Date.now(),
    message: null
  }
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ActionTypes.SET_SNACKBAR_MESSAGE:
      const snackbar = action.payload;
      return {
        ...state,
        snackbar
      };
    default:
      return state;
  }
}
