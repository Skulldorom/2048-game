import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import "./Board.css";

import RefreshIcon from "@mui/icons-material/Refresh";
import { QuestionMarkRounded } from "@mui/icons-material";
import Instructions from "./Instructions";
import Copyright from "./Copyright";
import { useSwipeable } from "react-swipeable";

const gridSize = 4,
  cellSize = "15vmin",
  cellGap = "2vmin",
  bRadius = "0.5vmin";

export default function Board(props) {
  const [cellArray, setCellArray] = React.useState([]),
    [rows, setRows] = React.useState([]),
    [score, setScore] = React.useState(0),
    [highScore, setHighScore] = React.useState(0),
    [tile2048Achieved, setTile2048Achieved] = React.useState(false),
    [historyTileAchieved, setHistoryTileAchieved] = React.useState(false),
    [gameStart, setGameStart] = React.useState(false),
    [gameOver, setGameOver] = React.useState(false),
    [allowInput, setAllowInput] = React.useState(false),
    [helpOpen, setHelpOpen] = React.useState(false);

  const MainAreaStyle = {
    background: "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    overflowX: "hidden",
    margin: 0,
    fontSize: "6.5vmin",
  };

  const board = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridSize},  ${cellSize})`,
    gridTemplateRows: `repeat(${gridSize}, ${cellSize})`,
    backgroundColor: "#CCC",
    gap: cellGap,
    border: bRadius,
    borderRadius: bRadius,
    padding: cellGap,
    position: "relative",
    width: "fit-content",
  };

  const cell = {
    backgroundColor: "#AAA",
    minHeight: cellSize,
    minWidth: cellSize,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: bRadius,
  };

  //Count Score
  React.useEffect(() => {
    let score = 0;
    cellArray.forEach((cell) => {
      score += cell.value;
      if (cell.value === 2048 && !historyTileAchieved) {
        setTile2048Achieved(true);
        setHistoryTileAchieved(true);
      }
    });
    setScore(score);
    if (score > highScore) {
      setHighScore(score);
    }
  }, [cellArray, highScore, historyTileAchieved]);

  React.useEffect(() => {
    const rowArray = [];
    const valueArray = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      rowArray.push(<Box sx={cell} key={i} />);
      valueArray.push({
        indexValue: i,
        value: 0,
        x: i % gridSize,
        y: Math.floor(i / gridSize),
      });
    }
    setRows(rowArray);
    setCellArray(valueArray);
    setGameStart(true);
  }, []); // eslint-disable-line

  React.useEffect(() => {
    if (gameStart) {
      createRandomTile(); // create a random tile
      // wait for cellArray to be set then create another tile
      setTimeout(() => {
        createRandomTile();
        setGameStart(false);
        setAllowInput(true);
      }, 100);
    }
  }, [gameStart]); // eslint-disable-line

  const createRandomTile = () => {
    //Used to find empty cells
    const getEmptyCells = cellArray.filter((cell) => cell.value === 0);

    //Picks from empty cells
    const randomEmptyCell = () => {
      const rNum = Math.floor(Math.random() * getEmptyCells.length);
      return getEmptyCells[rNum];
    };

    //Picks a between 2 and 4

    if (getEmptyCells.length > 0) {
      const emptyCell = randomEmptyCell().indexValue;
      const newArray = [...cellArray];
      newArray[emptyCell].value = Math.random() > 0.5 ? 2 : 4;
      setCellArray(newArray);
    }
  };

  const restartGame = () => {
    const valueArray = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      valueArray.push({
        indexValue: i,
        value: 0,
        x: i % gridSize,
        y: Math.floor(i / gridSize),
      });
    }
    setCellArray(valueArray);
    setGameStart(true);
    setGameOver(false);
    setScore(0);
  };

  const cellsByColumn = () => {
    const array = cellArray;
    return array.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  };

  const cellsByRow = () => {
    const array = cellArray;
    return array.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  };

  const setupInput = () => {
    setAllowInput(true);
  };

  const handleKeyDown = (e) => {
    if (allowInput) {
      setAllowInput(false);
      switch (e.key) {
        case "ArrowUp":
          if (!canMoveUp()) {
            setupInput();
            return;
          }
          moveUp();
          break;
        case "ArrowDown":
          if (!canMoveDown()) {
            setupInput();
            return;
          }
          moveDown();
          break;
        case "ArrowLeft":
          if (!canMoveLeft()) {
            setupInput();
            return;
          }
          moveLeft();
          break;
        case "ArrowRight":
          if (!canMoveRight()) {
            setupInput();
            return;
          }
          moveRight();
          break;
        default:
          setupInput();
          return;
      }
      setTimeout(() => {
        createRandomTile();

        if (
          !canMoveUp() &&
          !canMoveDown() &&
          !canMoveLeft() &&
          !canMoveRight()
        ) {
          setGameOver(true);
        }

        setupInput();
      }, 100);
    }
  };

  const handlers = useSwipeable({
    onSwiped: (e) => handleSwipe(e),
    preventDefaultTouchmoveEvent: true,
  });

  const handleSwipe = (e) => {
    if (allowInput) {
      setAllowInput(false);
      switch (e.dir) {
        case "Up":
          if (!canMoveUp()) {
            setupInput();
            return;
          }
          moveUp();
          break;
        case "Down":
          if (!canMoveDown()) {
            setupInput();
            return;
          }
          moveDown();
          break;
        case "Left":
          if (!canMoveLeft()) {
            setupInput();
            return;
          }
          moveLeft();
          break;
        case "Right":
          if (!canMoveRight()) {
            setupInput();
            return;
          }
          moveRight();
          break;
        default:
          setupInput();
          return;
      }
      setTimeout(() => {
        createRandomTile();

        if (
          !canMoveUp() &&
          !canMoveDown() &&
          !canMoveLeft() &&
          !canMoveRight()
        ) {
          setGameOver(true);
        }

        setupInput();
      }, 100);
    }
  };

  const moveUp = () => {
    do slideTile(cellsByColumn());
    while (canOnlyMoveUp());
  };

  const moveDown = () => {
    do slideTile(cellsByColumn().map((column) => [...column].reverse()));
    while (canOnlyMoveDown());
  };

  const moveLeft = () => {
    do slideTile(cellsByRow());
    while (canOnlyMoveLeft());
  };

  const moveRight = () => {
    do slideTile(cellsByRow().map((row) => [...row].reverse()));
    while (canOnlyMoveRight());
  };

  const slideTile = (cells) => {
    cells.forEach((group) => {
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.value === 0) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!canAccept(cell, moveToCell)) break;
          lastValidCell = moveToCell;
        }

        if (lastValidCell) {
          const OldCellX = cell.x,
            OldCellY = cell.y;

          if (lastValidCell.value === 0) {
            // If the cell is empty, move the tile to the empty cell
            cell.x = lastValidCell.x;
            cell.y = lastValidCell.y;

            lastValidCell.x = OldCellX;
            lastValidCell.y = OldCellY;
          } else {
            // If the cell is not empty, combine the tiles
            cell.x = lastValidCell.x;
            cell.y = lastValidCell.y;

            lastValidCell.x = OldCellX;
            lastValidCell.y = OldCellY;

            cell.value = cell.value * 2;
            lastValidCell.value = 0;
          }
        }
      }
    });

    const final = cells.concat
      .apply([], cells)
      .sort((a, b) =>
        a.indexValue > b.indexValue ? 1 : b.indexValue > a.indexValue ? -1 : 0
      );

    setCellArray(final);
  };

  const canAccept = (cell, cellToMoveTo) => {
    return cellToMoveTo.value === 0 || cell.value === cellToMoveTo.value;
  };

  const canMoveUp = () => {
    return canMove(cellsByColumn());
  };

  const canMoveDown = () => {
    return canMove(cellsByColumn().map((column) => [...column].reverse()));
  };

  const canMoveLeft = () => {
    return canMove(cellsByRow());
  };

  const canMoveRight = () => {
    return canMove(cellsByRow().map((row) => [...row].reverse()));
  };

  const canMove = (cells) => {
    return cells.some((group) => {
      return group.some((cell, index) => {
        if (index === 0) return false;
        if (cell.value === 0) return false;
        const moveToCell = group[index - 1];
        return canAccept(cell, moveToCell);
      });
    });
  };

  const canOnlyMoveUp = () => {
    return canOnlyMove(cellsByColumn());
  };

  const canOnlyMoveDown = () => {
    return canOnlyMove(cellsByColumn().map((column) => [...column].reverse()));
  };

  const canOnlyMoveLeft = () => {
    return canOnlyMove(cellsByRow());
  };

  const canOnlyMoveRight = () => {
    return canOnlyMove(cellsByRow().map((row) => [...row].reverse()));
  };

  const canOnlyMove = (cells) => {
    return cells.some((group) => {
      return group.some((cell, index) => {
        if (index === 0) return false;
        if (cell.value === 0) return false;
        const moveToCell = group[index - 1];
        return canOnlyAccept(moveToCell);
      });
    });
  };

  const canOnlyAccept = (cellToMoveTo) => {
    return cellToMoveTo.value === 0;
  };

  return (
    <Box sx={MainAreaStyle} onKeyDown={handleKeyDown} tabIndex={-1}>
      <Stack spacing={1} alignItems="center">
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography variant="h2" sx={{ fontWeight: "bold", color: "white" }}>
            2048
            <Tooltip title="How to play?">
              <IconButton color="inherit" onClick={() => setHelpOpen(true)}>
                <QuestionMarkRounded />
              </IconButton>
            </Tooltip>
          </Typography>
          <Instructions setClose={() => setHelpOpen(false)} open={helpOpen} />
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ color: "white" }}>
              Score: {score}
            </Typography>
            <Typography variant="h5" sx={{ color: "white" }}>
              High Score: {highScore}
            </Typography>
            <Button variant="contained" color="inherit" onClick={restartGame}>
              New Game
            </Button>
          </Stack>
        </Stack>

        <Box sx={board} {...handlers}>
          {rows}
          {cellArray.map(
            (cell, index) =>
              cell.value !== 0 && (
                <Tile x={cell.x} y={cell.y} value={cell.value} key={index} />
              )
          )}
        </Box>
      </Stack>
      {tile2048Achieved && (
        <Box
          backgroundColor="rgba(0,0,0,0.5)"
          sx={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="title"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            You have gotten the 2048 tile!
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => setTile2048Achieved(false)}
          >
            Continue
          </Button>
        </Box>
      )}
      {gameOver && (
        <Box
          backgroundColor="rgba(0,0,0,0.5)"
          sx={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="title"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            Game Over
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={restartGame}
            startIcon={<RefreshIcon />}
          >
            Restart
          </Button>
        </Box>
      )}
      <Copyright />
    </Box>
  );
}

function Tile({ x, y, value }) {
  const power = Math.log2(value);
  const backgroundLightness = 100 - power * 7;
  const textLightness = backgroundLightness <= 50 ? 90 : 10;

  const tile = {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: cellSize,
    height: cellSize,
    borderRadius: bRadius,
    backgroundColor: `hsl(264,50%, ${backgroundLightness}%)`,
    top: `calc(${y} * (${cellSize} + ${cellGap} ) + ${cellGap})`,
    left: `calc(${x} * (${cellSize} + ${cellGap}) + ${cellGap})`,
    color: `hsl(264,25%, ${textLightness}%)`,
    fontWeight: "bold",
    animation: "show 200ms ease-in-out",
    transition: "100ms ease-in-out",
  };

  return <Box sx={tile}>{value}</Box>;
}
