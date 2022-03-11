import { Box } from "@mui/material";
import React from "react";
import "./Board.css";

const gridSize = 4,
  cellSize = "20vmin",
  cellGap = "2vmin",
  bRadius = "1vmin";

export default function Board(props) {
  const [cellArray, setCellArray] = React.useState([]),
    [rows, setRows] = React.useState([]),
    [score, setScore] = React.useState(0),
    [gameStart, setGameStart] = React.useState(false),
    [gameOver, setGameOver] = React.useState(false),
    [allowInput, setAllowInput] = React.useState(true);

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
  };

  const cell = {
    backgroundColor: "#AAA",
    minHeight: "20vmin",
    minWidth: "20vmin",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: bRadius,
  };

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
      const cell1 = randomEmptyCell().indexValue;
      const newArray = [...cellArray];
      newArray[cell1].value = Math.random() > 0.5 ? 2 : 4;
      setCellArray(newArray);
      setTimeout(() => {
        const cell2 = randomEmptyCell().indexValue;
        const newArray2 = [...cellArray];
        newArray2[cell2].value = Math.random() > 0.5 ? 2 : 4;
        setCellArray(newArray2);
      }, 100);

      setGameStart(false);
    }
  }, [cellArray, gameStart]);

  const emptyCells = cellArray.filter((cell) => cell.value === 0);

  const randomEmptyCell = () => {
    const rNum = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[rNum];
  };

  const cellsByColumn = () => {
    return cellArray.reduce((acc, cell) => {
      acc[cell.x] = acc[cell.x] || [];
      acc[cell.x][cell.y] = cell;
      return acc;
    }, []);
  };

  const cellsByRow = () => {
    return cellArray.reduce((acc, cell) => {
      acc[cell.y] = acc[cell.y] || [];
      acc[cell.y][cell.x] = cell;
      return acc;
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
          return;
      }

      const cell = randomEmptyCell().indexValue;
      const newArray = [...cellArray];
      newArray[cell].value = Math.random() > 0.5 ? 2 : 4;

      setupInput();
    }
  };

  const moveUp = () => {
    slideTiles(cellsByColumn().map((column) => column.reverse()));
  };

  const moveDown = () => {
    slideTiles(cellsByColumn());
  };

  const moveLeft = () => {
    slideTiles(cellsByRow().map((column) => column.reverse()));
  };

  const moveRight = () => {
    slideTiles(cellsByRow());
  };

  const slideTiles = (cells) => {
    cells.forEach((group) => {
      for (let i = 0; i < group.length; i++) {
        const cell = group[i];
        if (cell.value === 0) continue;
        let lastValidCell;
        for (let j = i + 1; j < group.length; j++) {
          const moveToCell = group[j];
          if (!canAccept(moveToCell, cell)) break;
          lastValidCell = moveToCell;
        }
        if (lastValidCell) {
          if (lastValidCell.value !== 0) {
            // merge and move
            lastValidCell.value = cell.value + cell.value;
          } else {
            // move
            lastValidCell.value = cell.value;
          }
          cell.value = 0;
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

  const canMoveUp = () => {
    return canMove(cellsByColumn().map((column) => column.reverse()));
  };

  const canMoveDown = () => {
    return canMove(cellsByColumn());
  };

  const canMoveLeft = () => {
    return canMove(cellsByRow().map((column) => column.reverse()));
  };

  const canMoveRight = () => {
    return canMove(cellsByRow());
  };

  const canMove = (cells) => {
    return cells.some((group) => {
      return group.some((cell, index) => {
        if (index === 0) return false;
        if (cell.value === 0) return false;
        const moveToCell = group[index - 1];
        return canAccept(moveToCell, cell);
      });
    });
  };

  const canAccept = (cell, otherCell) => {
    return cell.value === 0 || cell.value === otherCell.value;
  };

  return (
    <Box
      sx={{
        background: "#333",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: 0,
        fontSize: "7.5vmin",
      }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <Box sx={board}>
        {rows}
        {cellArray.map(
          (cell, index) =>
            cell.value !== 0 && (
              <Tile x={cell.x} y={cell.y} value={cell.value} key={index} />
            )
        )}
      </Box>
    </Box>
  );
}

function Tile({ x, y, value }) {
  const power = Math.log2(value);
  const backgroundLightness = 100 - power * 9;
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
