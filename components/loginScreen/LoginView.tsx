import React from "react";
import { View, ImageBackground, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { TouchableRipple } from "react-native-paper";
import Theme from "../../assets/theme/theme";
import MeridiaText from "../MeridiaText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { sharedStyles } from "./styles";
import FieldValidation from "../controls/Validation/FieldValidation";

interface LoginViewState {
    email: string;
    password: string;
    hasValidationError: boolean;
}

interface LoginViewProps {
    email?: string;
    goBack: () => void;
    goToPasswordRecover: () => void;
    setMessage: (message: string) => void;
    sendCredentials: (email: string, password: string, isRegister: boolean) => void;
}

export default class LoginView extends React.Component<LoginViewProps, LoginViewState> {

    public constructor(props: LoginViewProps) {
        super(props);
        this.logIn = this.logIn.bind(this);
        this.register = this.register.bind(this);
        this.checkAndSendCredentials = this.checkAndSendCredentials.bind(this);
        this.state = {
            email: props.email || '',
            password: '',
            hasValidationError: true
        }
    }

    public render(): JSX.Element {

        let { email, password, hasValidationError }: LoginViewState = this.state;

        return (
            <ImageBackground source={require('../../assets/login_background_no_logo.jpg')} style={styles.inputForm}>
                <TouchableRipple style={sharedStyles.backIcon} onPress={this.props.goBack}>
                    <Icon name='chevron-left' color={Theme.COLOR_BACKGROUND} size={36} />
                </TouchableRipple>
                <View style={sharedStyles.container}>
                    <FieldValidation type='email' value={email}
                        onErrorStatusChanged={(hasError: boolean) => {
                            this.setState({ hasValidationError: hasError });
                        }}>
                        <TextInput
                            placeholderTextColor={'#444444'}
                            style={sharedStyles.input}
                            value={email}
                            autoCapitalize='none'
                            keyboardType='email-address'
                            onChangeText={(newEmail: string) => { this.setState({ email: newEmail }) }}
                            placeholder='Username/Email' />
                    </FieldValidation>
                    <FieldValidation type='password' value={password}
                        onErrorStatusChanged={(hasError: boolean) => {
                            this.setState({ hasValidationError: hasError });
                        }}>
                        <TextInput
                            placeholderTextColor={'#444444'}
                            style={sharedStyles.input}
                            value={password}
                            autoCapitalize='none'
                            onChangeText={(newPassword: string) => { this.setState({ password: newPassword }) }}
                            secureTextEntry={true}
                            placeholder='Password' />
                    </FieldValidation>
                    <TouchableRipple onPress={this.props.goToPasswordRecover} style={styles.forgotPassword}>
                        <MeridiaText style={styles.forgotPasswordText}>Forgot your password?</MeridiaText>
                    </TouchableRipple>

                    <View style={styles.containerRow}>
                        <TouchableOpacity disabled={hasValidationError}
                            style={hasValidationError ? [sharedStyles.loginButton, sharedStyles.loginButtonDisabled] : sharedStyles.loginButton}
                            onPress={this.logIn}>
                            <MeridiaText >Sign in</MeridiaText>
                        </TouchableOpacity>

                        <TouchableOpacity disabled={hasValidationError}
                            style={hasValidationError ? [sharedStyles.loginButton, sharedStyles.loginButtonDisabled] : sharedStyles.loginButton}
                            onPress={this.register}>
                            <MeridiaText>Sign up</MeridiaText>
                        </TouchableOpacity>
                    </View>
                </View>
                <MeridiaText style={sharedStyles.footer}>Plant & be happy</MeridiaText>
            </ImageBackground >
        );
    }

    private logIn(): void {
        this.checkAndSendCredentials(false);
    }

    private register(): void {
        this.checkAndSendCredentials(true);
    }

    private checkAndSendCredentials(isRegister: boolean): void {
        let { email, password }: LoginViewState = this.state;

        if (!email || !password) {
            this.props.setMessage("Please fill in email and password");
            return;
        }

        this.props.sendCredentials(email, password, isRegister);
    }
}

const styles = StyleSheet.create({
    inputForm: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '5%',
        paddingLeft: 20,
        paddingRight: 20
    },
    forgotPassword: {
        alignSelf: 'flex-end',
    },
    forgotPasswordText: {
        color: 'white',
    },
    containerRow: {

        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 75
    },
});