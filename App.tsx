import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text
} from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Api from "./api/Api";
import SecureStorage from "./api/SecureStorage";
import LoginScreen, { ScreenMode } from "./components/LoginScreen";
import Server from "./api/Server";
import { AppLoading, Notifications } from "expo";
import CommandScreen from "./components/commandScreen/CommandScreen";
import { Provider } from "react-redux";
import store from "./redux/store";
import { createAppContainer, createStackNavigator } from "react-navigation";
import UserScreen from "./components/userScreen/UserScreen";
//@ts-ignore
import cacheAssetsAsync from "./util/cacheAssetsAsync";
import * as  Constants from "expo-constants";
import * as Permissions from 'expo-permissions';
import { connect } from "react-redux";
import { State } from "./redux/rootReducer";
import { Dispatch } from "redux";
import { checkLogin } from "./components/userScreen/actions";
import NotificationSnackBar from "./components/notifications/NotificationSnackBar";
import { fetchDeviceState } from "./components/commandScreen/actions";
import Theme from "./assets/theme/theme";
import { apiUrl } from "./secrets";

interface StateProps {
  isLoggedIn: boolean;
}

interface DispatchProps {
  checkLogin(): void;
  listenForNotifications(): void;
}

const MainNavigator = createStackNavigator(
  {
    Command: CommandScreen,
    User: {
      screen: UserScreen,
    }
  },
  {
    initialRouteName: "Command",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Theme.COLOR_PRIMARY,
      },
    },
  },
);

const AppContainer = createAppContainer(MainNavigator);

const theme = {
  ...DefaultTheme,
  roundness: 0,
  colors: {
    ...DefaultTheme.colors,
    primary: Theme.COLOR_PRIMARY,
    accent: Theme.COLOR_SECONDARY
  }
};

const api: Api = new Api(new Server(apiUrl), apiUrl);

const getLocalNotificationPermissions = async (): Promise<void> => {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = { status };
  if (status !== "granted") {
    finalStatus = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (finalStatus.status === 'granted') {
      let token: string = await Notifications.getExpoPushTokenAsync();
      api.setExpoPushToken(token);
    }
  }
};

type Props = StateProps & DispatchProps;

const mapStateToProps = (state: State): StateProps => {
  return {
    isLoggedIn: state.user.loggedIn
  };
};

const mapDispatchToProps = {
  checkLogin: () => async (dispatch: Dispatch) => {
    return dispatch(await checkLogin());
  },
  listenForNotifications: () => async (dispatch: Dispatch) => {
    Notifications.addListener((notification: any) => {
      if (notification.origin === "received" && Platform.OS === "ios") {
        dispatch(fetchDeviceState(dispatch, api));
      }
    });
  }
};

const AppWrapper: React.FunctionComponent<Props> = (props: Props) => {
  useEffect(() => {
    const doAsync = async () => {
      await props.checkLogin();
      await props.listenForNotifications();
    };
    doAsync();
  }, [props.checkLogin]);

  const setIsLoggedIn = async (): Promise<void> => {
    await props.checkLogin();
  };

  if (props.isLoggedIn) {
    return <AppContainer />;
  } else {
    return (
      <LoginScreen
        mode={ScreenMode.Login}
        api={api}
        onLoggedIn={setIsLoggedIn}
      />
    );
  }
};

const ConnectedAppWrapper = connect<StateProps, DispatchProps, {}, State>(
  mapStateToProps,
  mapDispatchToProps
)(AppWrapper);

const App: React.FunctionComponent<{}> = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const doAsyncs = async () => {
      setAppReady(false);
      getLocalNotificationPermissions();
      await loadAssetsAsync();
      setAppReady(true);
    };
    doAsyncs();
  }, [setAppReady]);

  const loadAssetsAsync = async () => {
    try {
      await cacheAssetsAsync({
        fonts: [
          {
            "nunito-light": require("./assets/fonts/Nunito-Light.ttf"),
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
          }
        ]
      });
    } catch (e) {
      console.warn(
        "There was an error caching assets (see: main.js), perhaps due to a " +
        "network timeout, so we skipped caching. Reload the app to try again."
      );
      console.log(e.message);
    }
  };

  if (appReady) {
    return (
      <View style={styles.mainView}>
        <Provider store={store}>
          <PaperProvider theme={theme}>
            <ConnectedAppWrapper />
            <NotificationSnackBar />
          </PaperProvider>
        </Provider>
      </View>
    );
  } else {
    return <AppLoading />;
  }
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    fontFamily: "nunito-light"
  }
});

export default App;
