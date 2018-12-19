function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {   
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
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
          squares: Array(9).fill(null),
          position: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    console.log("in handleClick(", i, ") -----------");
    console.log("history = ", history);
    console.log("current = ", current);
    console.log("squares = ", squares);
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    console.log("squares[", i, "] = ", squares[i]);
    
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: squarePosition(i)
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    
    console.log("this.setState", this.setState);
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
    
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    console.log("in render() -----------");
    console.log("history = ", history);
    console.log("current = ", current);
    console.log("winner = ", winner);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ': ' + current.squares[move-1] + ' at (' +  history[move].position + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    console.log("moves = ", moves)
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }    
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
      return squares[a];
    }
  }
  return null;
}

function squarePosition(i) {
  console.log("i = ", i);
  
  let row = parseInt(i / 3) + 1;
  //console.log("row = ", row);
  
  let col = i % 3 + 1;
  //console.log("col = ", col);
   
  let position = [col, row];
  return position;
}
