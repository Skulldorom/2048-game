import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import "./Board.css";

const gridSize = 4,
  cellSize = "15vmin",
  cellGap = "2vmin",
  bRadius = "0.5vmin";

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
    minHeight: cellSize,
    minWidth: cellSize,
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
      // onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h1" sx={{ fontWeight: "bold", color: "white" }}>
            2048
          </Typography>
          <Stack spacing={1}>
            <Typography variant="h3" sx={{ color: "white" }}>
              Score: {score}
            </Typography>
            <Button variant="contained" color="inherit">
              New Game
            </Button>
          </Stack>
        </Stack>

        <Box sx={board}>
          {rows}
          {cellArray.map(
            (cell, index) =>
              cell.value !== 0 && (
                <Tile x={cell.x} y={cell.y} value={cell.value} key={index} />
              )
          )}
        </Box>
      </Stack>

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
          <Button variant="contained" color="success">
            Restart
          </Button>
        </Box>
      )}
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
