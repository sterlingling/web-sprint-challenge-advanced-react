import React from 'react'
import axios from 'axios'
// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4
// the index the "B" is at


export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor() {
    super();
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps
      // x: initialX,
      // y: initialY
    }
  }
  getXY = () => {
    let x = this.state.index % 3
    let y = Math.floor((this.state.index / 3) + 1);

    return [x, y];
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  getXYMessage = () => {
    return (`Coordinates (${this.getXY()[0]},${this.getXY()[1]})`)
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    this.setState({
      ...this.state,
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps
    });
    // Use this helper to reset all states to their initial values.
  }

  getNextIndex = (direction) => {
    if ((direction == 'left') && (this.state.index === 0 || this.state.index === 3 || this.state.index === 6)) {
      this.setState({ ...this.state, index: this.state.index });
    } else if ((direction == 'left')) {
      this.setState({ ...this.state, index: this.state.index - 1 })
    }

    if ((direction == 'right') && (this.state.index === 2 || this.state.index === 5 || this.state.index === 8)) {
      this.setState({ ...this.state, index: this.state.index });
    } else if ((direction == 'right')) {
      this.setState({ ...this.state, index: this.state.index + 1 })
    }

    if ((direction == 'up') && (this.state.index === 0 || this.state.index === 1 || this.state.index === 2)) {
      this.setState({ ...this.state, index: this.state.index });
    } else if ((direction == 'up')) {
      this.setState({ ...this.state, index: this.state.index - 3 })
    }

    if ((direction == 'down') && (this.state.index === 6 || this.state.index === 7 || this.state.index === 8)) {
      this.setState({ ...this.state, index: this.state.index });
    } else if ((direction == 'down')) {
      this.setState({ ...this.state, index: this.state.index + 3 })
    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (direction) => {
    if ((direction == 'left') && (this.state.index === 0 || this.state.index === 3 || this.state.index === 6)) {
      this.setState({ ...this.state, steps: this.state.steps });
    } else if ((direction == 'left')) {
      this.setState({ ...this.state, steps: this.state.steps + 1 })
    }

    if ((direction == 'right') && (this.state.index === 2 || this.state.index === 5 || this.state.index === 8)) {
      this.setState({ ...this.state, steps: this.state.steps });
    } else if ((direction == 'right')) {
      this.setState({ ...this.state, steps: this.state.steps + 1 })
    }

    if ((direction == 'up') && (this.state.index === 0 || this.state.index === 1 || this.state.index === 2)) {
      this.setState({ ...this.state, steps: this.state.steps });
    } else if ((direction == 'up')) {
      this.setState({ ...this.state, steps: this.state.steps + 1 })
    }

    if ((direction == 'down') && (this.state.index === 6 || this.state.index === 7 || this.state.index === 8)) {
      this.setState({ ...this.state, steps: this.state.steps });
    } else if ((direction == 'down')) {
      this.setState({ ...this.state, steps: this.state.steps + 1 })
    }
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    this.setState({ ...this.state, email: evt.target.value })
    // You will need this to update the value of the input.
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    axios.post('http://localhost:9000/api/result', { x: this.getXY()[0], y: this.getXY()[1], steps: this.steps, email: this.email })
      .then(res => {
        this.reset();
        this.setState({ ...this.state, message: res.data.message })
      }).catch(err => {
        console.log(err);
      })
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
                {idx === 4 ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={(evt) => {
            this.move(evt.target.id)
            this.getNextIndex(evt.target.id)
          }} >LEFT</button>
          <button id="up" onClick={(evt) => {
            this.move(evt.target.id)
            this.getNextIndex(evt.target.id)
          }}>UP</button>
          <button id="right" onClick={(evt) => {
            this.move(evt.target.id)
            this.getNextIndex(evt.target.id)
          }}>RIGHT</button>
          <button id="down" onClick={(evt) => {
            this.move(evt.target.id)
            this.getNextIndex(evt.target.id)
          }}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
