import { ImageBackground, View, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import React from "react"
import { TouchableRipple } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MeridiaText from "../MeridiaText";
import { sharedStyles } from "./styles";
import Theme from "../../assets/theme/theme";
import FieldValidation from "../controls/Validation/FieldValidation";

interface RegisterViewState {
    recoverPasswordEmail: string;
    newPassword: string;
    newPasswordCheck: string;
    recoverPasswordCode: string;
    hasValidationError: boolean;
}

interface RegisterViewProps {
    goBack: () => void;
    forgotpassword: (recoverPasswordEmail: string) => void;
    setMessage: (message: string) => void;
    resetpassword: (newPassword: string, newPasswordCheck: string, newPasswowrdCode: string, recoverPasswordEmail: string) => void;
    codeHasBeenSent: boolean
}

export default class RegisterView extends React.Component<RegisterViewProps, RegisterViewState> {

    public constructor(props: RegisterViewProps) {
        super(props);
        this.state = {
            recoverPasswordCode: '',
            newPassword: '',
            newPasswordCheck: '',
            recoverPasswordEmail: '',
            hasValidationError: true
        }
    }

    public render(): JSX.Element {

        let { codeHasBeenSent }: RegisterViewProps = this.props;
        let { hasValidationError }: RegisterViewState = this.state;

        return (
            <ImageBackground source={require('../../assets/login_background_no_logo.jpg')} style={sharedStyles.container}>
                <TouchableRipple style={sharedStyles.backIcon} onPress={this.props.goBack}>
                    <Icon name='chevron-left' color={Theme.COLOR_BACKGROUND} size={36} />
                </TouchableRipple>
                <View style={sharedStyles.container}>
                    <View style={styles.recoverPassContainer}>
                        <FieldValidation type='email' value={this.state.recoverPasswordEmail}
                            onErrorStatusChanged={(hasError: boolean) => {
                                this.setState({ hasValidationError: hasError });
                            }}>
                            <TextInput
                                placeholderTextColor={'#444444'}
                                style={sharedStyles.input}
                                value={this.state.recoverPasswordEmail}
                                autoCapitalize='none'
                                keyboardType='email-address'
                                placeholder='Username/Email'
                                onChangeText={(newText: string) => { this.setState({ recoverPasswordEmail: newText }) }} />
                        </FieldValidation>
                        <TouchableOpacity disabled={hasValidationError}

                            style={hasValidationError ? [
                                sharedStyles.loginButton, styles.elevation, sharedStyles.loginButtonDisabled] :
                                [sharedStyles.loginButton, styles.elevation]}
                            onPress={() => { this.props.forgotpassword(this.state.recoverPasswordEmail) }}>
                            <MeridiaText style={sharedStyles.fbButtonText}>Get verification code</MeridiaText>
                        </TouchableOpacity>
                        {codeHasBeenSent &&
                            <React.Fragment>
                                <FieldValidation type='passwordRecovery' value={this.state.recoverPasswordCode}
                                    onErrorStatusChanged={(hasError: boolean) => {
                                        this.setState({ hasValidationError: hasError });
                                    }}>
                                    <TextInput
                                        placeholderTextColor={'#444444'}
                                        style={sharedStyles.input}
                                        value={this.state.recoverPasswordCode}
                                        autoCapitalize='none'
                                        placeholder='Verification Code'
                                        onChangeText={(newText: string) => { this.setState({ recoverPasswordCode: newText }) }} />
                                </FieldValidation>
                                <FieldValidation type='password' value={this.state.newPassword}
                                    onErrorStatusChanged={(hasError: boolean) => {
                                        this.setState({ hasValidationError: hasError });
                                    }}>
                                    <TextInput
                                        placeholderTextColor={'#444444'}
                                        style={sharedStyles.input}
                                        value={this.state.newPassword}
                                        autoCapitalize='none'
                                        placeholder='New password'
                                        secureTextEntry={true}
                                        onChangeText={(newText: string) => { this.setState({ newPassword: newText }) }} />
                                </FieldValidation>
                                <FieldValidation type='confirmPassword' value={{
                                    password: this.state.newPassword,
                                    confirmPassword: this.state.newPasswordCheck
                                }}
                                    onErrorStatusChanged={(hasError: boolean) => {
                                        this.setState({ hasValidationError: hasError });
                                    }}>
                                    <TextInput
                                        placeholderTextColor={'#444444'}
                                        style={sharedStyles.input}
                                        value={this.state.newPasswordCheck}
                                        autoCapitalize='none'
                                        placeholder='Confirm new password'
                                        secureTextEntry={true}
                                        onChangeText={(newText: string) => { this.setState({ newPasswordCheck: newText }) }} />
                                </FieldValidation>
                                <TouchableOpacity disabled={hasValidationError}
                                    style={hasValidationError ? [sharedStyles.loginButton, sharedStyles.loginButtonDisabled] : sharedStyles.loginButton}
                                    onPress={() => { this.props.resetpassword(this.state.newPassword, this.state.newPasswordCheck, this.state.recoverPasswordCode, this.state.recoverPasswordEmail) }}>
                                    <MeridiaText style={sharedStyles.fbButtonText}>Reset password</MeridiaText>
                                </TouchableOpacity>
                            </React.Fragment>}
                    </View>
                </View>
                <MeridiaText style={sharedStyles.footer}>Plant & be happy</MeridiaText>
            </ImageBackground>
        );
    }
}



const styles = StyleSheet.create({
    elevation: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    recoverPassContainer: {
        padding: 20
    }
}

)