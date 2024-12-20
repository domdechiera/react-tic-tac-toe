import { useState } from 'react';

// Square Component
function Square({ value, onSquareClick, className }) {
  return (
    <button className={`square ${className}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board Component
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  let draw = false;

  if (winner) {
    status = 'Winner: ' + winner.player;
  } else if (squares.every(Boolean)) {
    status = 'It\'s a draw!'
    draw = true;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const highlight = winner && winner.line.includes(index) ? 'highlight' : '';
      rowSquares.push(
        <Square 
          key={index} 
          value={squares[index]} 
          onSquareClick={() => handleClick(index)}
          className={`square ${highlight}`}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

// Game Component
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [locations, setLocations] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, location) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const row = Math.floor(location / 3);
    const col = location % 3;
    const nextLocations = [...locations.slice(0, currentMove + 1), { row, col }];

    setHistory(nextHistory);
    setLocations(nextLocations);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  const moves = history.map((move) => {
    let description;

    if (currentMove === move) {
      description = 'You are at move #' + move;
    } else if (move > 0) {
      const { row, col } = locations[move - 1];
      description = `Go to move #${move} (${row}, ${col})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        { currentMove === move ?
            <span>{description}</span>
          :
            <button onClick={() => jumpTo(move)}>{description}</button>
        }
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          xIsNext={xIsNext}
          squares={currentSquares} 
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <div className="sort-toggle">
          <button onClick={toggleSortOrder}>
            {isAscending ? 'Sort Descending' : 'Sort Ascending'}
          </button>
        </div>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

// calculateWinner Function
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
