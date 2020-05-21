import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Clipboard,
} from "react-native";
import {
  Surface,
  Divider,
  TouchableRipple,
  Portal,
  Dialog,
  Paragraph,
  Button
} from "react-native-paper";
import { Spinner } from "native-base";
import { State } from "../../redux/rootReducer";
import { connect } from "react-redux";
import { UserProfile } from "../../model/userProfile";
import { Dispatch } from "redux";
import Api from "../../api/Api";
import { fetchUserData, logOut, fetchNotifications } from "./actions";
import MeridiaCardHeaderText from "../MeridiaCardHeaderText";
import { NavigationScreenProps } from "react-navigation";
import { setMessage } from "../notifications/actions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DeviceStatus } from "../../model/deviceStatus";
import { FlatList } from "react-native-gesture-handler";
import NotificationItem from "../controls/NotificationItem";
import Theme from '../../assets/theme/theme';
import MeridiaText from "../MeridiaText";
import { styles } from "./styles";

export interface UserScreenProps { }

export interface UserScreenState {
  isDialogVisible: boolean;
}
interface StateProps {
  user: UserProfile | null;
  deviceToken: string | null;
  isWorking: boolean;
  notifications: DeviceStatus[];
}

interface DispatchProps {
  fetchUserData: () => void;
  logout: () => void;
  setMessage(message: string): void;
  fetchNotifications: () => void;
}


type Props = UserScreenProps & StateProps & DispatchProps & NavigationScreenProps;

export class UserScreen extends React.Component<Props, UserScreenState> {

  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
      headerRight: <TouchableRipple onPress={navigation.getParam('logOut')} style={{ padding: 4, marginRight: 8 }}>
        <Icon color={Theme.COLOR_SECONDARY} size={24} name='logout'></Icon>
      </TouchableRipple>,
      headerLeft: <TouchableRipple onPress={() => { navigation.goBack() }} style={{ padding: 4, marginLeft: 8 }}>
        <Icon color={Theme.COLOR_SECONDARY} size={24} name='arrow-left'></Icon>
      </TouchableRipple>,
      title: 'User details',
      headerStyle: {
        backgroundColor: Theme.COLOR_PRIMARY,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: Theme.COLOR_SECONDARY
      }
    }
  };

  constructor(props: Props) {
    super(props);
    this.logoutOperation = this.logoutOperation.bind(this);
    this.logoutConfirmed = this.logoutConfirmed.bind(this);
    this.logoutRevoked = this.logoutRevoked.bind(this);
    this.logout = this.logout.bind(this);
    this.copyToken = this.copyToken.bind(this);
    this.state = {
      isDialogVisible: false,
    };
  }

  public componentDidMount() {
    this.props.fetchUserData();
    this.props.navigation.setParams({ logOut: this.logoutOperation })
    this.props.fetchNotifications();
  }

  public render(): JSX.Element {
    let { isDialogVisible }: UserScreenState = this.state;
    if (this.props.user === null || this.props.user.email === null) {
      return <Spinner />;
    }

    return (
      <SafeAreaView style={styles.safeAreaView}>
        <ImageBackground
          source={require("../../assets/splash-textless.jpg")}
          style={styles.cover}
        >
          <View style={styles.backgroundItemWrapper}>
            <Surface style={styles.dividerBackgroundItem}>
              <Divider style={styles.photoDivider} />
            </Surface>
            <Surface style={styles.backgroundItem}>
              <MeridiaText style={styles.nameCard} >{this.props.user.email}</MeridiaText>
            </Surface>
            <Surface style={styles.backgroundItem}>
              <MeridiaText style={styles.nameCard}>{this.props.deviceToken}</MeridiaText>
              <TouchableRipple onPress={this.copyToken} style={styles.copyButton}><Icon name='content-copy' size={24}></Icon></TouchableRipple>
            </Surface>
            <Surface style={styles.dividerBackgroundItem}>
              <Divider style={styles.photoDivider} />
            </Surface>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <Surface style={styles.scheduleCard}>
            <MeridiaCardHeaderText style={styles.cardHeader}>
              Notifications
            </MeridiaCardHeaderText>
            <Divider style={styles.divider} />
            <FlatList keyExtractor={this.keyExtractor} data={this.props.notifications} renderItem={({ item }) =>
              <NotificationItem item={item} />
            }>
            </FlatList>
          </Surface>
        </View>
        <Portal>
          <Dialog
            visible={isDialogVisible}
            dismissable={false}>
            <Dialog.Title>Logout</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Are you sure you want to logout?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this.logoutConfirmed}>Yes</Button>
              <Button onPress={this.logoutRevoked}>No</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    );
  }

  private keyExtractor = (item: DeviceStatus) => item.changeOfStatus.valueOf().toString();

  private async logout(): Promise<void> {
    await this.props.logout();
    this.props.setMessage("Successfully logged out!");
  }

  private logoutOperation(): void {
    this.setState({ isDialogVisible: true });
  }

  private logoutConfirmed(): void {
    this.props.logout();
  }

  private logoutRevoked(): void {
    this.setState({ isDialogVisible: false });
  }

  private copyToken(): void {
    this.props.deviceToken && Clipboard.setString(this.props.deviceToken);
    this.props.setMessage('Token copied to clipboard');
  }

}

const mapStateToProps = (state: State, props: UserScreenProps): StateProps => {
  return {
    user: state.user.user,
    deviceToken: state.user.deviceToken,
    isWorking: state.user.isWorking,
    notifications: state.user.notifications
  };
};

const mapDispatchToProps = {
  fetchUserData: () => async (dispatch: Dispatch, getState: State, api: Api) => {
    dispatch(await fetchUserData(dispatch));
  },
  logout: () => async (dispatch: Dispatch, getState: State, api: Api) => {
    dispatch(await logOut(dispatch, api));
  },
  setMessage: (message: string) => (dispatch: Dispatch) =>
    dispatch(setMessage(message)),
  fetchNotifications: () => async (dispatch: Dispatch, getState: State, api: Api) =>
    dispatch(await fetchNotifications(dispatch, api))
};

export default connect<StateProps, DispatchProps, UserScreenProps, State>(
  mapStateToProps,
  mapDispatchToProps,
)(UserScreen);
