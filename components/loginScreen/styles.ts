import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '10%'
    },
    backIcon: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
        zIndex: 1
    },
    input: {
        fontFamily: 'nunito-light',
        fontSize: 18,
        textAlign: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#ffffffA0',
    },
    loginButton: {
        fontFamily: 'nunito-light',
        fontSize: 18,
        textAlign: 'center',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor: '#ffffffA0',
    },
    loginButtonDisabled: {
        backgroundColor: '#AAAAAAAA'
    },
    footer: {
        color: 'white',
        fontSize: 18,
        position: 'absolute',
        alignSelf: 'center',
        bottom: 20
    },
    fbButtonText: {
        alignSelf: 'center'
    },

    fbButton: {
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 15,
        paddingBottom: 15,
    },
});