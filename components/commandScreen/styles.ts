import { StyleSheet } from "react-native";
import Theme from "../../assets/theme/theme";

export const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'stretch',
        backgroundColor: Theme.COLOR_PRIMARY
    },
    cover: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    content: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        flex: 2
    },
    userIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        borderRadius: 40,
        margin: 16,
        backgroundColor: Theme.COLOR_PRIMARY
    },
    weatherOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    scheduleCard: {
        margin: 10,
        borderRadius: 8,
        padding: 4,
        backgroundColor: Theme.COLOR_SECONDARY,
        elevation: 4
    },
    historyCard: {
        margin: 10,
        marginTop: 0,
        borderRadius: 8,
        padding: 4,
        backgroundColor: Theme.COLOR_SECONDARY,
        elevation: 4
    },
    cardItem: {
        elevation: 4
    },
    cardHeader: {
        textAlign: 'center',
        backgroundColor: Theme.COLOR_SECONDARY,
        padding: 8,
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    userButton: {
        height: 80,
        width: 80,
        backgroundColor: Theme.COLOR_PRIMARY,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
    },
    userButtonIcon: {
        width: 40,
        height: 40
    },
});