import React, { useState, useEffect } from "react";
import { Snackbar } from "react-native-paper";
import { Keyboard } from "react-native";
import { State } from "../../redux/rootReducer";
import { connect } from "react-redux";
import { SetMessagePayload } from "./actions";

interface StateProps {
  snackbar: SetMessagePayload;
}

interface InternalState {
  extraMargin: number;
}

type Props = StateProps;

type ComponentState = State & InternalState;

const implicitBottomMargin: number = 15;

const NotificationSnackBar: React.FunctionComponent<Props> = (props: Props) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [extraMargin, setExtraMargin] = useState(implicitBottomMargin);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (props.snackbar.message) {
      setMessage(props.snackbar.message);
      setSnackbarVisible(true);
    }
    let keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    let keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    return function cleanup() {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    }

  }, [props.snackbar.timestamp, setMessage, setSnackbarVisible]);

  const _keyboardDidShow = (e: any) => {
    let keyboardHeight: number = e.endCoordinates.height;
    setExtraMargin(keyboardHeight + implicitBottomMargin);
  };

  const _keyboardDidHide = () => {
    setExtraMargin(implicitBottomMargin);
  };

  return (
    <Snackbar
      style={{
        zIndex: 2,
        bottom: extraMargin,
        position: 'absolute'
      }}
      visible={snackbarVisible}
      onDismiss={() => setSnackbarVisible(false)}
      duration={2000}
    >
      {message}
    </Snackbar>
  );
};

const mapStateToProps = (state: State): StateProps => {
  return {
    snackbar: state.notifications.snackbar
  };
};

export default connect(mapStateToProps)(NotificationSnackBar);
