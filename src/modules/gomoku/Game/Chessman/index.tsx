import {Circle} from 'react-konva';
import {memo} from 'react';

import {ChessConfig, ChessManConfig} from '../../constants';

interface ChessmanProps {
    position: [number, number];
    // 1:黑棋 2:白棋
    player: 1 | 2;
    radius?: number;
    isDisplay?: boolean;
}

const Chessman = (props: ChessmanProps) => {
    console.log('render Chessman');
    const {position, player = 1, radius = ChessManConfig.radius, isDisplay = false} = props;
    const {gap} = ChessConfig;
    const [posX, posY] = position;
    const {fillColor} = ChessManConfig;

    return (
        <Circle
            {...ChessManConfig}
            fill={fillColor[player]}
            radius={radius}
            x={isDisplay ? posX : posX * gap}
            y={isDisplay ? posY : posY * gap}
        />
    );
};

export default memo(Chessman);
