import * as React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

export interface MeridiaTextProps {
    style?: StyleProp<any>[] | StyleProp<any>;
}

export default class MeridiaText extends React.Component<MeridiaTextProps, {}> {
    render() {
        return (<Text style={[styles.textStyle, this.props.style]}>{this.props.children}</Text>);
    }
}


const styles = StyleSheet.create({
    textStyle: {
        fontSize: 18,
        fontFamily: 'nunito-light'
    }
});