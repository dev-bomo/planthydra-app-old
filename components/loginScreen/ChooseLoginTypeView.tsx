import React from "react";
import { ImageBackground, View, TouchableOpacity, StyleSheet } from "react-native";
import { sharedStyles } from "./styles";
import MeridiaText from "../MeridiaText";
import { Facebook } from "expo";
import Api from "../../api/Api";
import { ScreenMode } from "../LoginScreen";
import { fbAppId } from "../../secrets";

interface ChooseLoginTypeViewState {
    mode: ScreenMode;
}

export interface ChooseLoginTypeViewProps {
    goBack: () => void;
    api: Api;
    onLoggedIn: () => void;
    setMessage: (message: string) => void;
    goToLogin: () => void;
    mode: ScreenMode | null;
    loginWithFacebook: (token: string) => void;
}

export default class ChooseLoginTypeView extends React.Component<ChooseLoginTypeViewProps, ChooseLoginTypeViewState> {

    public constructor(props: ChooseLoginTypeViewProps) {
        super(props);
        this.logInWithFacebook = this.logInWithFacebook.bind(this);
        this.setState = this.setState.bind(this);
    }


    public render(): JSX.Element {
        return (
            <ImageBackground source={require('../../assets/login_background.jpg')} style={sharedStyles.container}>
                <View style={sharedStyles.container}>
                    <View>
                        <MeridiaText style={styles.continueText}>Continue with</MeridiaText>
                        <TouchableOpacity activeOpacity={0.5} onPress={this.props.goToLogin}>
                            <ImageBackground resizeMode='contain'
                                source={require('../../assets/normal_login_button_light80.png')}
                                style={sharedStyles.fbButton}>
                                <MeridiaText style={sharedStyles.fbButtonText}>E-mail</MeridiaText>
                            </ImageBackground>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.5} onPress={this.logInWithFacebook}>
                            <ImageBackground resizeMode='contain'
                                source={require('../../assets/fb_button_light80.png')}
                                style={sharedStyles.fbButton}>
                                <MeridiaText style={sharedStyles.fbButtonText}>Facebook</MeridiaText>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>

                </View>

                <MeridiaText style={sharedStyles.footer}>Plant & be happy</MeridiaText>

            </ImageBackground>

        );

    }
    private async logInWithFacebook(): Promise<string | undefined> {
        const {
            type,
            token
        } = await Facebook.logInWithReadPermissionsAsync(fbAppId,
            {
                permissions: ['public_profile', 'email']
            }
        );

        if (type === 'success' && token) {
            this.props.loginWithFacebook(token);
        } else {
            // TODO: say something went wrong
        }
        return token;
    }
}




const styles = StyleSheet.create({

    continueText: {
        color: 'white',
        alignSelf: 'center',
    },

});