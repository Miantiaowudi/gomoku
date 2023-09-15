import {Line, Circle} from 'react-konva';
import {useMemo, memo} from 'react';

import {ChessConfig, ChessboardConfig} from '../../constants';

const Chessboard = () => {
    console.log('render chessboard');
    const verticalLine = useMemo(() => {
        const {gap, size} = ChessConfig;
        return new Array(size)
            .fill(0)
            .map((_, index) => gap * index)
            .map(x => {
                return <Line key={`${x}0`} points={[x, 0, x, (size - 1) * gap]} {...ChessboardConfig} />;
            });
    }, []);

    const parallelLine = useMemo(() => {
        const {gap, size} = ChessConfig;
        return new Array(size)
            .fill(0)
            .map((_, index) => gap * index)
            .map(y => {
                return <Line key={`0${y}`} points={[0, y, (size - 1) * gap, y]} {...ChessboardConfig} />;
            });
    }, []);

    const fivePoints = useMemo(() => {
        const points = [
            [3, 3],
            [7, 7],
            [3, 11],
            [11, 11],
            [11, 3]
        ];
        return points.map(point => {
            const [x, y] = point;
            const {gap} = ChessConfig;
            return <Circle key={`${x}${y}`} x={x * gap} y={y * gap} radius={4} fill="black" />;
        });
    }, []);

    return (
        <>
            {verticalLine}
            {parallelLine}
            {fivePoints}
        </>
    );
};

export default memo(Chessboard);
