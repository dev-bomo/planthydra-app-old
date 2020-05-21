import React from "react";
import Svg, { Path, Line, Circle, G } from "react-native-svg";

export interface IconProps {
    fill?: string | number | number[] | undefined;
    height?: string | number | undefined;
    width?: string | number | undefined;
}

export class Level1Icon extends React.Component<IconProps, {}> {
    render(): JSX.Element {
        return (
            <Svg height={this.props.height} width={this.props.width} viewBox="0 0 100 100">
                {/* <Path d="M49.99 10.13C36.45 34.16 28.93 47.5 27.43 50.17a28.562 28.562 0 00-2.75 6.84h25.31v8H23.85c0 .65.09 1.31.18 1.96 1.67 12.07 11.5 22.36 24.81 22.9h2.29c13.31-.54 23.13-10.83 24.81-22.9.74-5.82-.45-11.72-3.39-16.8-3-5.34-10.53-18.68-22.56-40.04z"  */}
                <Path d="M75.6,50.3l-25.4-45l-25.4,45c-1.4,2.4-2.4,5-3.1,7.7h28.5v9H20.8c0,0.7,0.1,1.5,0.2,2.2C22.9,82.7,34,94.2,48.9,94.8c0.4,0,0.9,0,1.3,0c0.4,0,0.9,0,1.3,0c15-0.6,26-12.2,27.9-25.7C80.3,62.6,78.8,56,75.6,50.3z"
                    fill={this.props.fill} />
            </Svg>
        );
    }
}

export class ArrowUp extends React.Component<IconProps, {}>{
    render(): JSX.Element {
        return (
        <Svg height={this.props.height} width={this.props.width} viewBox="0 0 24 24">
                <Path d="M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M17,14L12,9L7,14H17Z" />
            </Svg>
        )
    }
}

export class Level2Icon extends React.Component<IconProps, {}> {
    render(): JSX.Element {
        return (
            <Svg height={this.props.height} width={this.props.width} viewBox="0 0 100 100">
                <Path d="M49.96 10.14C36.43 34.16 28.91 47.51 27.4 50.18c-.27.49-.52.99-.76 1.52h23.34v8H24.13c-.22 1.45-.32 2.92-.29 4.39H50v8H25.3c3.37 9.72 12.16 17.31 23.56 17.77h2.3c13.32-.54 23.13-10.82 24.8-22.9.72-5.82-.49-11.71-3.44-16.78-3.01-5.34-10.53-18.69-22.56-40.04z"
                    fill={this.props.fill} />
            </Svg>
        );
    }
}

export class WaterNowIcon extends React.Component<IconProps, {}> {
    render(): JSX.Element {
        return (
            <Svg height={this.props.height} width={this.props.width} viewBox="0 0 100 100">
                <Path d="M59.88 9.69l22.8 40.51.22.38.21.39.21.4.2.39.19.4.18.4.18.4.17.41.17.41.16.41.15.41.14.42.14.41.13.42.13.43.11.42.11.42.11.43.1.43.08.43.09.43.07.43.07.43.06.44.06.43.05.44.04.44.03.43.03.44.02.44.01.44v.88l-.01.44-.01.45-.03.44-.03.44-.03.44-.05.44-.05.44-.14.91-.18.91-.2.9-.23.88-.26.88-.29.87-.32.85-.34.85-.38.83-.4.82-.42.8-.46.79-.47.77-.51.75-.53.74-.55.72-.58.7-.6.69-.62.66-.64.64-.67.62-.69.59-.71.57-.73.55-.75.53-.78.49-.79.47-.81.45-.83.42-.84.38-.87.36-.88.33-.9.3-.91.26-.93.23-.95.2-.96.17-.98.13-.99.1-1 .06h-2.33l-.22-.01-.22-.02-.22-.01-.23-.01-.22-.02-.22-.02-.22-.02-.23-.03-.22-.02-.22-.03-.22-.03-.22-.03-.22-.03-.22-.03-.22-.04-.22-.04-.22-.04-.22-.04-.22-.04-.22-.05-.21-.05-.22-.05-.22-.05-.21-.05-.22-.05-.22-.06-.21-.06-.21-.06-.22-.06-.21-.07-.22-.06-.21-.07-.21-.07-.21-.07-.21-.08-.21-.07-.21-.08-.21-.08-.21-.08-.21-.08-.2.08-.21.08-.21.08-.21.08-.21.07-.21.07-.21.08-.21.06-.22.07-.21.07-.21.06-.22.06-.21.06-.22.06-.21.06-.22.05-.21.05-.22.05-.22.05-.21.05-.22.04-.22.05-.22.04-.22.04-.22.04-.22.03-.22.04-.22.03-.22.03-.22.03-.22.02-.22.03-.22.02-.22.02-.23.02-.22.01-.22.02-.22.01-.23.01-.22.01h-2.33l-1-.06-.99-.09-.97-.13-.96-.17-.95-.2-.93-.23-.91-.27-.9-.29-.88-.33-.86-.36-.85-.39-.83-.41-.81-.45-.79-.47-.77-.5-.75-.52-.73-.55-.71-.57-.69-.6-.67-.62-.65-.64-.62-.66-.6-.68-.58-.7-.55-.72-.53-.74-.5-.75-.48-.78-.45-.78-.43-.81-.4-.81-.37-.84-.35-.84-.32-.85-.29-.87-.26-.88-.23-.89-.21-.89-.17-.91-.14-.91-.05-.44-.05-.44-.04-.44-.03-.45-.02-.44-.02-.44v-1.32l.01-.44.02-.44.03-.44.04-.44.04-.44.05-.43.05-.44.06-.43.07-.44.08-.43.08-.43.09-.43.1-.43.11-.42.11-.43.12-.42.12-.42.13-.42.14-.42.15-.41.15-.42.16-.41.16-.4.18-.41.18-.4.18-.4.2-.4.19-.4.21-.39.21-.39.22-.39L40.15 9.66l9.84 17.49 9.89-17.46zM43.69 54.45l-.21.4-.21.4-.19.4-.19.41-.17.41-.17.42-.15.42-.15.42-.13.42-.13.43-.11.43-.11.43-.1.44-.08.44-.08.44-.06.44-.06.44-.04.44-.04.45-.02.44-.02.45v.9l.02.44.03.45.04.45.04.45.14.84.18.84.21.84.26.83.29.83.34.82.37.8.41.8.45.78.48.76.52.74.55.72.6.7.62.67.66.64.7.62.73.57.76.55.79.51.83.46.86.43.89.38.93.34.95.28.98.24 1.02.19 1.04.13 1.07.07h.85l.82-.01 1.07-.08 1.04-.13 1.02-.18.98-.24.95-.29.93-.34.89-.38.86-.43.82-.46.8-.51.76-.54.73-.58.7-.61.66-.65.62-.67.6-.69.55-.72.52-.75.49-.76.44-.78.41-.79.37-.81.34-.82.29-.83.26-.83.22-.84.18-.84.13-.84.05-.44.04-.45.03-.45.01-.45.01-.44v-.45l-.02-.45-.02-.44-.04-.45-.04-.44-.06-.44-.06-.44-.08-.44-.08-.44-.1-.43-.1-.43-.12-.43-.12-.43-.14-.42-.14-.43-.16-.41-.16-.42-.18-.41-.18-.41-.19-.4-.21-.4-.21-.4-.22-.39L59.88 25.7 43.91 54.06l-.22.39z"
                    fill={this.props.fill} />
            </Svg>
        );
    }
}

export class DeviceOfflineIcon extends React.Component<IconProps, {}> {
    render(): JSX.Element {
        // stroke and fill
        return (
            <Svg height={this.props.height} width={this.props.width} viewBox="0 0 100 100">
                <Circle fill='#BE1E2D' cx="-70" cy="50" r="39.5" />
                <G>
                    <Path fill='#FFFFFF' d="M-59.7,73c-6.6-3-14-3-20.6,0l-1.4-4.8c7.5-3.4,15.8-3.4,23.3,0L-59.7,73z" />
                </G>
                <G>
                    <Line fill='none' stroke='#FFFFFF' strokeWidth='5' strokeMiterlimit='10' x1="-93.3" y1="36.7" x2="-81.3" y2="48.7" />
                    <Line fill='none' stroke='#FFFFFF' strokeWidth='5' strokeMiterlimit='10' x1="-93.3" y1="48.7" x2="-81.3" y2="36.7" />
                </G>
                <G>
                    <Line fill='none' stroke='#FFFFFF' strokeWidth='5' strokeMiterlimit='10' x1="-58.3" y1="36.7" x2="-46.3" y2="48.7" />
                    <Line fill='none' stroke='#FFFFFF' strokeWidth='5' strokeMiterlimit='10' x1="-58.3" y1="48.7" x2="-46.3" y2="36.7" />
                </G>
                <Circle fill='#33473A' stroke='red' cx="50" cy="50" r="39.5" />
                <Circle fill='#BE1E2D' stroke='red' cx="50" cy="50" r="34.3" />
                <G>
                    <Path fill='#FFFFFF' d="M60.3,73c-6.6-3-14-3-20.6,0l-1.4-4.8c7.5-3.4,15.8-3.4,23.3,0L60.3,73z" />
                </G>
                <G>
                    <Line fill='none' stroke='#FFFFFF' strokeWidth='5' strokeMiterlimit='10' x1="26.7" y1="36.7" x2="38.7" y2="48.7" />
                    <Line fill='none' stroke='#FFFFFF' strokeWidth='5' strokeMiterlimit='10' x1="26.7" y1="48.7" x2="38.7" y2="36.7" />
                </G>
                <G>
                    <Line fill='none' stroke='#FFFFFF' strokeWidth='5' strokeMiterlimit='10' x1="61.7" y1="36.7" x2="73.7" y2="48.7" />
                    <Line fill='none' stroke='#FFFFFF' strokeWidth='5' strokeMiterlimit='10' x1="61.7" y1="48.7" x2="73.7" y2="36.7" />
                </G>
            </Svg>
        );
    }
}

export class CancelWateringIcon extends React.Component<IconProps, {}> {
    render(): JSX.Element {
        return (
            <Svg height={this.props.height} width={this.props.width} viewBox="0 0 100 100">
                <Path d="M75.2,50L50,5.3L24.8,50c-3.2,5.7-4.7,12.3-3.8,18.7c1.9,13.5,12.8,25,27.7,25.6c0.4,0,0.9,0,1.3,0c0.4,0,0.9,0,1.3,0C66.2,93.7,77.1,82.3,79,68.8C79.9,62.3,78.4,55.7,75.2,50z M61.6,70.8l-3.9,3.9L50,67l-7.7,7.7l-3.9-3.9l7.7-7.7l-7.7-7.7l3.9-3.9l7.7,7.7l7.7-7.7l3.9,3.9l-7.7,7.7L61.6,70.8z"
                    fill={this.props.fill} />
            </Svg>
        );
    }
}