import {useCallback, useState, useMemo, useEffect} from 'react';
import {Stage, Layer, Text} from 'react-konva';
import Konva from 'konva';
import {Button} from 'antd';

import {ChessConfig} from '../constants';
import Chessman from './Chessman';
import Chessboard from './Chessboard';

import './index.less';

const {size, gap} = ChessConfig;

const enum GameStatusType {
    INIT = 1,
    ING,
    WIN_1,
    WIN_2,
    END_0
}

const CanvasConfig = {
    stageWidth: 640,
    stageHeight: 640
};

const WinTextConfig: Konva.TextConfig = {
    y: 10,
    fontSize: 24,
    fill: 'blue',
    width: CanvasConfig.stageWidth,
    align: 'center'
};

const Gomuku = () => {
    const initChess = new Array(size).fill(0).map(() => new Array(size).fill(0));
    const {stageWidth, stageHeight} = CanvasConfig;
    const [layerOffsetX, layerOffsetY] = [(stageWidth - gap * (size - 1)) / 2, (stageHeight - gap * (size - 1)) / 2];
    const [chess, setChess] = useState(initChess);
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [gameStatus, setGameStatus] = useState<GameStatusType>(GameStatusType.INIT);

    const isGaming = gameStatus === GameStatusType.ING;

    const calculatePosition = (position: number) => (position / gap).toFixed();

    const [playerOnePos, playerTwoPos] = useMemo(() => {
        const playerOne = [] as [number, number][];
        const playerTwo = [] as [number, number][];
        chess.map((yitem, x) =>
            yitem.map((item, y) => {
                item === 1 ? playerOne.push([x, y]) : item === 2 ? playerTwo.push([x, y]) : null;
            })
        );
        return [playerOne, playerTwo];
    }, [chess]);

    const checkIsWinner = (posArray: [number, number][]) => {
        if (posArray.length < 5) {
            return false;
        }
        const sortX = posArray.sort((x, y) => x[0] - y[0]).slice();
        const sortY = posArray.sort((x, y) => x[1] - y[1]).slice();
        // 检查水平方向的五连
        const checkX = (arr: [number, number][]) => {
            let win = false;
            let xNum = 1;
            let curX = arr[0][0];
            for (let i = 1; i < arr.length; i++) {
                if (arr[i][0] === curX && arr[i][1] === arr[i - 1][1] + 1) {
                    xNum += 1;
                    if (xNum === 5) {
                        win = true;
                        return win;
                    }
                }
                else {
                    xNum = 1;
                    curX = arr[i][0];
                }
            }
            return win;
        };
        // 检查竖直方向的五连
        const checkY = (arr: [number, number][]) => {
            let win = false;
            let yNum = 1;
            let curY = arr[0][1];
            for (let i = 1; i < arr.length; i++) {
                if (arr[i][1] === curY && arr[i][0] === arr[i - 1][0] + 1) {
                    yNum += 1;
                    if (yNum === 5) {
                        win = true;
                        return win;
                    }
                }
                else {
                    yNum = 1;
                    curY = arr[i][1];
                }
            }
            return win;
        };
        // 检查对角线的五连 type 1:左上到右下 2:左下到右上
        const checkDiagonal = (arr: [number, number][], type: 1 | 2) => {
            const stringArr = arr.map(item => `${item[0]}${item[1]}`);
            let win = false;
            let curNum = 1;
            let curX: number;
            let curY: number;
            for (let i = 0; i < arr.length; i++) {
                const [x, y] = arr[i];
                curX = x;
                curY = y;
                while (curNum < 5) {
                    if (
                        (type === 1 && stringArr.includes(`${curX + 1}${curY + 1}`))
                        || (type === 2 && stringArr.includes(`${curX + 1}${curY - 1}`))
                    ) {
                        curX += 1;
                        type === 1 ? (curY += 1) : (curY -= 1);
                        curNum += 1;
                        if (curNum === 5) {
                            win = true;
                            return win;
                        }
                    }
                    else {
                        curNum = 1;
                        break;
                    }
                }
            }
            return win;
        };
        return checkX(sortX) || checkY(sortY) || checkDiagonal(sortX, 1) || checkDiagonal(sortX, 2);
    };

    const handleClickStage = useCallback(
        (e: Konva.KonvaEventObject<MouseEvent>) => {
            if (gameStatus !== GameStatusType.ING) {
                return;
            }
            const [x, y] = [e.evt.offsetX - layerOffsetX, e.evt.offsetY - layerOffsetY];
            const [chessX, chessY] = [calculatePosition(x), calculatePosition(y)];
            if (chess[chessX][chessY] !== 0) {
                return;
            }
            setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
            setChess(prev => {
                const res = prev.slice();
                res[chessX][chessY] = currentPlayer;
                return res;
            });
        },
        [chess, currentPlayer, gameStatus, layerOffsetX, layerOffsetY]
    );

    const renderChess = useCallback((chess: typeof initChess) => {
        return chess.map((yitem, x) =>
            yitem.map((item, y) => {
                if (item === 0) {
                    return null;
                }
                return <Chessman key={`${x}${y}${item}`} position={[x, y]} player={item} />;
            })
        );
    }, []);

    const handleStartGame = () => {
        setGameStatus(GameStatusType.ING);
        setCurrentPlayer(1);
        setChess(initChess);
    };

    const handleGoBack = () => {};

    const winnerInfo = useMemo(() => {
        if (gameStatus === GameStatusType.WIN_1) {
            return <Text text="黑棋获胜" {...WinTextConfig} />;
        }
        else if (gameStatus === GameStatusType.WIN_2) {
            return <Text text="白棋获胜" {...WinTextConfig} />;
        }
    }, [gameStatus]);

    useEffect(() => {
        if (isGaming) {
            if (checkIsWinner(playerOnePos)) {
                setGameStatus(GameStatusType.WIN_1);
            }
            else if (checkIsWinner(playerTwoPos)) {
                setGameStatus(GameStatusType.WIN_2);
            }
        }
    }, [isGaming, playerOnePos, playerTwoPos]);

    return (
        <>
            <div className="game-container">
                <Stage className="gomuku-container" onClick={handleClickStage} width={stageWidth} height={stageHeight}>
                    <Layer>{winnerInfo}</Layer>
                    <Layer x={layerOffsetX} y={layerOffsetY}>
                        <Chessboard />
                        {renderChess(chess)}
                    </Layer>
                </Stage>
                <div className="game-tools">
                    <Button onClick={handleStartGame}>
                        {gameStatus === GameStatusType.INIT ? '开始游戏' : '重新开始'}
                    </Button>
                    <Button onClick={handleGoBack}>返回主页</Button>
                    <Button onClick={handleStartGame}>查看游戏记录</Button>
                    <div className="current-player" style={{visibility: isGaming ? 'visible' : 'hidden'}}>
                        <span className="player-text">当前玩家：</span>
                        <Stage width={80} height={80}>
                            <Layer>
                                <Chessman position={[40, 40]} player={currentPlayer} isDisplay />
                            </Layer>
                        </Stage>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Gomuku;
