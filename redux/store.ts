import { createStore, Action, applyMiddleware } from "redux";
import { State, rootReducer } from "./rootReducer";
import thunk from "redux-thunk";
import Api from "../api/Api";
import Server from "../api/Server";
import * as  Constants from "expo-constants";
import { apiUrl } from "../secrets";

const store = createStore<State, Action, any, any>(
  rootReducer,
  applyMiddleware(
    thunk.withExtraArgument<Api>(
      new Api(new Server(apiUrl), apiUrl)
    )
  )
);

export default store;
