let Gameboard = (function() {
    const gameboard = [];
   
    for(let i = 0; i < 9; i++) {
        gameboard.push(Cell());
    }

    const getBoard = () => gameboard;

    const putMark = (cellIndex, player) => {
        gameboard[cellIndex].addMark(player);
    };

    const clearCellBoard = () => {
      gameboard.forEach(cell => cell.addMark(""))
    };

    return {
        getBoard,
        putMark,
        clearCellBoard,
    }
})();

function Cell() {
    let value = "";
    const addMark = (player) => {
      value = player;
    };
  
    const getValue = () => value;
  
    return {
      addMark,
      getValue
    };
  }

let Players = (function() {
    const playerOne = "Player one";
    const playertwo = "Player two";
 
    const players = [
        {
            name:playerOne,
            mark:"X",
        },
        {
            name:playertwo,
            mark:"O",
        },
    ];

    
    const getPlayerNewName = (playerOneNewName,playerTwoNewName) => {
      if (playerOneNewName === "") {
        playerOneNewName = playerOne;
      } else if (playerTwoNewName === "") {
        playerTwoNewName = playertwo;
      }
      players[0].name = playerOneNewName;
      players[1].name = playerTwoNewName;
     }
    
    let activePlayer = players[0];

    const switchPlayer = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

    const getActivePlayer = () => activePlayer;


    return {
        switchPlayer,
        getActivePlayer,
        getPlayerNewName,
    }
})();

const GameController = (function() {
       const board = Gameboard.getBoard();
       const checkWin = () => {
        const winPatterns = [
            [0, 1, 2],  
            [3, 4, 5],  
            [6, 7, 8],  
            [0, 3, 6],  
            [1, 4, 7], 
            [2, 5, 8],  
            [0, 4, 8],  
            [2, 4, 6]  
        ];
    
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a].getValue() !== "" && board[a].getValue() === board[b].getValue() && board[a].getValue() === board[c].getValue()) {
                return true; 
           }
        }
        return false; 
    }

        const checkForDraw = () => {
        let checkIfAllCellOccupied = board.every(cell => cell.getValue() !== "");
        let noWinner = !checkWin()
        return checkIfAllCellOccupied && noWinner;
    }
      
      const playRound = (cellIndex) => {
      Gameboard.putMark(cellIndex,Players.getActivePlayer().mark);

      if (checkWin()) {
          return;
      } 

      if (checkForDraw()) {
        return;
      }
      Players.switchPlayer();
      }

      return {
          playRound,
          checkWin,
          checkForDraw,
      }

})();

let screenController = (function() {

  const playerTurn = document.querySelector('.player-turn');
  const gameBoard = document.querySelector('.board');
  const restartBtn = document.querySelector('.restart-btn button')


  const updateScreen = () => {
    gameBoard.textContent = "";
    
    const currentBoard = Gameboard.getBoard();
    const currentPlayer = Players.getActivePlayer();

    playerTurn.textContent = `${currentPlayer.name}'s turn`

    currentBoard.forEach((cell, index) => {
      const cellButton = document.createElement("button");
      cellButton.classList.add("cell");
      cellButton.dataset.cellIndex = index;
      cellButton.textContent = cell.getValue();
      if (cell.getValue() !== "") {
        cellButton.disabled = true;
      }
      if (GameController.checkWin()) {
        playerTurn.textContent = `${currentPlayer.name} wins`
        cellButton.disabled = true;
      } else if (GameController.checkForDraw()) {
        playerTurn.textContent = `Its a tie`
      }
      gameBoard.appendChild(cellButton);
    });
  }

  function handleClickEvent(e) {
    const cellIndex = e.target.dataset.cellIndex;
    if (!cellIndex) return;

    GameController.playRound(cellIndex);
    
    updateScreen();
  }

  gameBoard.addEventListener('click', handleClickEvent);

  restartBtn.addEventListener('click', () => {
  Gameboard.clearCellBoard();
  updateScreen();
  });

  const changeNameBtn = document.querySelector('.change-name-btn');
  const popUpModal = document.querySelector('#change-name-dialog');
  const confirmBtn = document.querySelector('#confirm-btn');
  const inputPlayerOneNewName = document.getElementById('player-one-name');
  const inputPlayerTwoNewName = document.getElementById('player-two-name');


  changeNameBtn.addEventListener('click', () => {
    popUpModal.showModal();
  });

  popUpModal.addEventListener('close', () => {
    inputPlayerOneNewName.value = "";
    inputPlayerTwoNewName.value = "";
  });

  confirmBtn.addEventListener('click',(e) => {
    e.preventDefault();
    Players.getPlayerNewName(inputPlayerOneNewName.value,inputPlayerTwoNewName.value);
    Gameboard.clearCellBoard();
    updateScreen()
    popUpModal.close();
  });

  return {
    updateScreen,
  }

})();

screenController.updateScreen();