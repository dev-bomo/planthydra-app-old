import React from "react";
import { Text, List, Surface } from "react-native-paper";
import { DeviceStatus } from "../../model/deviceStatus";
import { StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import Theme from "../../assets/theme/theme";

interface NotificationItemProps {
    item: DeviceStatus;
}

export default class NotificationItem extends React.Component<NotificationItemProps, {}> {
    render(): JSX.Element {
        return (<Surface style={styles.item}>
            <List.Item title={format(new Date(this.props.item.changeOfStatus), 'd LLLL h:mm b')} left={props => this.getIcon(this.props.item)}>
            </List.Item>
        </Surface>);
    }

    private getIcon(item: DeviceStatus): JSX.Element {
        return (
            item.isOnline ?
                <Icon style={styles.icon} size={32} color={Theme.COLOR_PRIMARY} name='emoticon'></Icon> :
                <Icon style={styles.icon} size={32} color={Theme.COLOR_ERROR} name='emoticon-dead'></Icon>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: Theme.COLOR_BACKGROUND,
        elevation: 2,
        margin: 4,
        marginBottom: 2,
        marginTop: 2
    },
    icon: {
        margin: 8
    }
});