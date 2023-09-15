import Konva from 'konva';

export const ChessConfig = {
    gap: 40,
    size: 15
};

export const ChessboardConfig: Konva.LineConfig = {
    stroke: '#aaa',
    strokeWidth: 2
};

export const ChessManConfig: Konva.CircleConfig = {
    radius: 16,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: {x: -2, y: 2},
    fillColor: {
        1: '#333',
        2: 'white'
    }
};
