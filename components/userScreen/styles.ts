import { StyleSheet } from "react-native";
import Theme from "../../assets/theme/theme";

export const styles = StyleSheet.create({
    container: {
        marginTop: -50
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignContent: "center",
        margin: 4,
        height: 80,
        borderRadius: 4,
        elevation: 4
    },
    backgroundItemWrapper: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "space-between",
        margin: 4,
        flex: 1,
        borderRadius: 4
    },
    nameCard: {
        borderRadius: 4,
        textAlign: "center",
        padding: 12
    },
    dividerBackgroundItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        margin: 4,
        flex: 1,
        borderRadius: 4
    },
    backgroundItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        alignContent: "space-between",
        margin: 4,
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 4
    },
    divider: {
        borderWidth: 2,
        marginLeft: 4,
        marginRight: 4,
        elevation: 4,
        borderRadius: 4,
        backgroundColor: Theme.COLOR_BACKGROUND,
        color: Theme.COLOR_BACKGROUND,
        borderColor: Theme.COLOR_BACKGROUND
    },
    photoDivider: {
        borderWidth: 2,
        marginLeft: 4,
        marginRight: 4,
        flex: 1,
        elevation: 4,
        borderRadius: 4,
        backgroundColor: Theme.COLOR_SECONDARY,
        color: Theme.COLOR_SECONDARY,
        borderColor: Theme.COLOR_SECONDARY
    },
    content: {
        backgroundColor: Theme.COLOR_BACKGROUND,
        height: "55%",
        flex: 2
    },
    safeAreaView: {
        flex: 1,
        flexDirection: "column",
        alignContent: "stretch",
        backgroundColor: Theme.COLOR_PRIMARY
    },
    cover: {
        backgroundColor: Theme.COLOR_PRIMARY,
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch"
    },
    scheduleCard: {
        margin: 10,
        borderRadius: 8,
        padding: 4,
        backgroundColor: Theme.COLOR_SECONDARY,
        elevation: 4,
        flex: 1
    },
    actionButton: {
        margin: 4,
        borderRadius: 8,
        padding: 4,
        backgroundColor: Theme.COLOR_SECONDARY,
        elevation: 4
    },
    cardHeader: {
        textAlign: "center",
        backgroundColor: Theme.COLOR_SECONDARY,
        padding: 8
    },
    copyButton: {
        marginLeft: 2,
        padding: 4,
        marginRight: 8
    }
});