import React from "react";
import { StyleSheet, KeyboardAvoidingView, View } from "react-native";
import Api from "../api/Api";
import { ActivityIndicator, Portal } from "react-native-paper";
import { setMessage } from "./notifications/actions";
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import LoginView from "./loginScreen/LoginView";
import ChooseLoginTypeView from "./loginScreen/ChooseLoginTypeView";
import RegisterView from "./loginScreen/RegisterView";
import Theme from "../assets/theme/theme";

export enum ScreenMode {
    Login,
    Recover,
    LoginType,
}

export interface LoginScreenState {
    mode: ScreenMode
    isLoading: boolean;
    codeHasBeenSent: boolean;
}

export interface LoginScreenProps {
    mode: ScreenMode | null;
    api: Api;
    onLoggedIn: () => void;
}

export interface DispatchProps {
    setMessage: (message: string) => void;
}

export type Props = LoginScreenProps & DispatchProps;

class LoginScreen extends React.Component<Props, LoginScreenState> {

    public constructor(props: Props) {
        super(props);
        this.logInWithFacebook = this.logInWithFacebook.bind(this);
        this.goBack = this.goBack.bind(this);
        this.sendCredentials = this.sendCredentials.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.state = {
            mode: props.mode || ScreenMode.LoginType,
            isLoading: false,
            codeHasBeenSent: false
        };
    }

    public render(): JSX.Element {
        return (
            <KeyboardAvoidingView style={styles.cover} behavior='padding' enabled>
                {this.state.mode === ScreenMode.Login &&
                    <LoginView
                        goToPasswordRecover={() => { this.setState({ mode: ScreenMode.Recover }) }}
                        sendCredentials={this.sendCredentials}
                        setMessage={this.props.setMessage}
                        goBack={() => { this.setState({ mode: ScreenMode.LoginType }) }}
                    />
                }

                {this.state.mode === ScreenMode.LoginType &&
                    <ChooseLoginTypeView
                        mode={this.props.mode}
                        onLoggedIn={this.props.onLoggedIn}
                        api={this.props.api}
                        setMessage={this.props.setMessage}
                        goToLogin={() => { this.setState({ mode: ScreenMode.Login }) }}
                        goBack={() => { this.setState({ mode: ScreenMode.LoginType }) }}
                        loginWithFacebook={this.logInWithFacebook}
                    />
                }

                {this.state.mode === ScreenMode.Recover &&
                    <RegisterView
                        goBack={() => { this.setState({ mode: ScreenMode.LoginType }) }}
                        setMessage={this.props.setMessage}
                        forgotpassword={this.forgotPassword}
                        resetpassword={this.resetPassword}
                        codeHasBeenSent={this.state.codeHasBeenSent}
                    />
                }

                {this.state.isLoading &&
                    <Portal>
                        <View style={styles.spinnerContainer}>
                            <ActivityIndicator size="large" color={Theme.COLOR_PRIMARY} />
                        </View>
                    </Portal>
                }
            </KeyboardAvoidingView>
        );
    }

    private sendCredentials(email: string, password: string, isRegister: boolean): void {
        this.setState({ isLoading: true });
        if (!isRegister) {

            this.props.api.login(email, password).then(() => {
                this.setState({ isLoading: false });
                this.props.onLoggedIn();
                this.props.setMessage("Login successful!");
            }, () => {
                this.setState({ isLoading: false });
                this.props.setMessage("Could not login, please check your credentials");
            }).catch((err: Error) => {
                this.props.setMessage('Could not login, please check your credentials \nMessage: ' + err.message);
            });
        } else {
            this.props.api.register(email, password).then(() => {
                this.setState({ isLoading: false });
                this.props.onLoggedIn();
                this.props.setMessage("Registration successful!");
            }, (er: Error) => {
                this.setState({ isLoading: false });
                this.props.setMessage("Registration failed" + er.message);
            }).catch((err: Error) => {
                this.props.setMessage('Registration failed \nMessage: ' + err.message);
            });;
        }
    }

    private goBack(): void {
        switch (this.state.mode) {
            case ScreenMode.Login:
                this.setState({ mode: ScreenMode.LoginType });
                break;
            case ScreenMode.Recover:
                this.setState({ mode: ScreenMode.Login });
                break;
        }
    }

    private logInWithFacebook(token: string): void {
        this.setState({ isLoading: true });
        this.props.api.facebookLogin(token).then(() => {
            this.setState({ isLoading: false });
            this.props.onLoggedIn();
            this.props.setMessage("Login successful!");
        });
    }

    private forgotPassword(recoverPasswordEmail: string): void {
        if (recoverPasswordEmail) {
            this.props.api.forgotPassword(recoverPasswordEmail).then(() => {
                this.setState({ codeHasBeenSent: true });
            }, (er: Error) => {
                this.props.setMessage('Could not send email, check email address. \nMessage: ' + er.message)
            });
        } else {
            this.props.setMessage('Please fill in the email address used for this account');
        }
    }


    private resetPassword(newPassword: string, newPasswordCheck: string, recoverPasswordCode: string, recoverPasswordEmail: string): void {
        if (newPassword && newPasswordCheck && newPassword !== newPasswordCheck) {
            this.props.setMessage('Password and password check don\'t match');
            return;
        }
        if (recoverPasswordCode && newPassword && recoverPasswordEmail) {
            this.props.api.resetPassword(
                recoverPasswordEmail,
                newPassword,
                recoverPasswordCode
            );
            this.setState({ mode: ScreenMode.Login });
        }
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 10,
    },
    registerContainer: {
        margin: 8
    },
    dismissButton: {
        marginRight: 'auto'
    },
    cover: {
        alignSelf: 'stretch',
        width: '100%',
        height: '100%'

    },
    textInputContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    spinnerContainer: {
        backgroundColor: '#ffffff44',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const mapDispatchToProps = {
    setMessage: (message: string) => (dispatch: Dispatch) =>
        dispatch(setMessage(message))
}

export default connect(null, mapDispatchToProps)(LoginScreen);
