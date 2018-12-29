function Square(props) {  
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    
    // When someone wins, highlight the three squares that caused the win
    let squareStyle = null;
    if (this.props.winner)
      squareStyle = this.props.winner.winningSquares.includes(i) ? {backgroundColor: '#ccc'} : {backgroundColor: '#fff'};
    
  
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={Math.random()}
        style={squareStyle}
      />
    );
  }
    
  // Rewrite Board to use two loops to make the squares instead of hardcoding them
  createBoard() {
    let rows = [];
    for (let i = 0; i < 3; i++)
    {
      let squares = [];
      for (let j = 0; j < 3; j++)
        squares.push(this.renderSquare(3*i+j));
      
      rows.push(<div className="board-row" key={Math.random()}>{squares}</div>);
    }
    
    return rows;
  }
  
  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: true
    };
  } 
  
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const win = calculateWinner(squares);
    
    if (win || squares[i]) {
      return;
    } 
        
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    this.setState({
      history: history.concat([
        {
          squares: squares,
          coords: [i % 3 + 1, parseInt(i / 3) + 1],
          player: squares[i]
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
    
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    console.log("in render winner = ", winner);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        // Display the location for each move in the format (col, row) in the move history list    
        'Go to move #' + move + ': ' + history[move].player + ' at (' +  history[move].coords + ')' :
        'Go to game start';
      
      return (      
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)}
            // Bold the currently selected item in the move list
            style={this.state.stepNumber == move ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}
          >
            {desc}
          </button>
        </li>
      );
    });
        
    let status;
    if (winner) 
      status = 'Winner: ' + winner.winner;
    else
    {
      // When no one wins, display a message about the result being a draw
      if (winner == false)
        status = 'Draw';   
      else
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');   
    }
    return (
      <div className="game">
        <div className="game-board">
          {/* When someone wins, highlight the three squares that caused the win */}
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/* Add a toggle button that lets you sort the moves in either ascending or descending orderA JSX */}
          <button onClick={() => this.setState({ascending: !this.state.ascending})}>
            {this.state.ascending ? "Sort by descending order" : "Sort by ascending order"}
          </button>
          <ol>{this.state.ascending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      
      console.log("in calculate win winner = ", squares[a], "and winningSquares = ", lines[i]);
      
      return {
        winner: squares[a],
        // When someone wins, highlight the three squares that caused the win
        winningSquares: lines[i]
      };    
    }
  }
  
  // When no one wins, display a message about the result being a draw
  let win = false;    
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null)
    {
      win = null;
      break;
    }
  }  
  
  return win;  
}
