import * as fromCommand from '../components/commandScreen/reducers';
import * as fromUser from '../components/userScreen/reducers';
import * as fromNotifications from '../components/notifications/reducers';
import { combineReducers } from 'redux';

export interface State {
    command: fromCommand.State;
    user: fromUser.State;
    notifications: fromNotifications.State;
}

export const initialState: State = {
    command: fromCommand.initialState,
    user: fromUser.initialState,
    notifications: fromNotifications.initialState
}

export const rootReducer = combineReducers<State>({
    command: fromCommand.reducer,
    user: fromUser.reducer,
    notifications: fromNotifications.reducer
}); 