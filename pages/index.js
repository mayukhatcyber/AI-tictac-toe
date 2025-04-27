import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useSound from 'use-sound';

export default function Home() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  const [playMove] = useSound('/move.mp3', { volume: 0.5 });
  const [playWin] = useSound('/win.mp3', { volume: 0.5 });
  const [playDraw] = useSound('/draw.mp3', { volume: 0.5 });

  const winningPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const checkWinner = (newBoard) => {
    for (let pattern of winningPatterns) {
      const [a,b,c] = pattern;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        setWinningLine(pattern);
        return newBoard[a];
      }
    }
    if (newBoard.every(cell => cell)) return 'Draw';
    return null;
  };

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = isPlayerTurn ? 'X' : 'O';
    setBoard(newBoard);
    playMove();
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'Draw') playDraw();
      else playWin();
    }
    setIsPlayerTurn(!isPlayerTurn);
  };

  const aiMove = () => {
    const emptyIndices = board.map((v, i) => v ? null : i).filter(v => v !== null);
    if (emptyIndices.length === 0) return;
    const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    handleClick(randomMove);
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(aiMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningLine([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-background bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-[length:400%_400%]">
      <motion.h1 
        className="text-5xl font-bold mb-8 text-white drop-shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Tic Tac Toe - vs AI
      </motion.h1>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            onClick={() => isPlayerTurn && handleClick(i)}
            className={`w-24 h-24 text-3xl font-bold border-2 ${
              winningLine.includes(i) ? "border-green-500 bg-green-300" : "border-gray-400 bg-white"
            }`}
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            {cell}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {winner && (
          <motion.div 
            className="mt-6 text-3xl font-semibold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {winner === 'Draw' ? 'It\'s a Draw!' : `${winner} Wins!`}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        onClick={resetGame}
        className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg text-lg shadow-md"
        whileHover={{ scale: 1.1 }}
      >
        Restart Game
      </motion.button>
    </div>
  );
}
