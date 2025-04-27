import { useState } from 'react';

export default function Home() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const checkWinner = (newBoard) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b,c] of lines) {
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    if (newBoard.every(cell => cell)) return 'Draw';
    return null;
  };

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = board.slice();
    newBoard[i] = isPlayerTurn ? 'X' : 'O';
    setBoard(newBoard);
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) setWinner(gameWinner);
    setIsPlayerTurn(!isPlayerTurn);
  };

  const aiMove = () => {
    const emptyIndices = board.map((v, i) => v ? null : i).filter(v => v !== null);
    if (emptyIndices.length === 0) return;
    const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    handleClick(randomMove);
  };

  if (!isPlayerTurn && !winner) {
    setTimeout(aiMove, 500);
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Tic Tac Toe - vs AI</h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            className="w-24 h-24 bg-white text-2xl font-bold border-2 border-gray-400"
            onClick={() => isPlayerTurn && handleClick(i)}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <div className="mt-6 text-2xl font-semibold">
          {winner === 'Draw' ? 'It\'s a Draw!' : `${winner} Wins!`}
        </div>
      )}
      <button onClick={resetGame} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Restart
      </button>
    </div>
  );
}
