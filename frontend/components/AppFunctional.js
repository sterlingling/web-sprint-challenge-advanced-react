import React from 'react'
import { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);
  // const [errorMessage,setErrorMessage] = useState(initialMessage)
  function getXY() {
    let y = Math.floor((index / 3) + 1);
    let x = index % 3 + 1;

    return [x, y]

    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }




  function getXYMessage() {
    return (`Coordinates (${getXY()[0]},${getXY()[1]})`)
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
    // Use this helper to reset all states to their initial values.
  }

  function getNextIndex(direction) {

    if ((direction == 'left') && (index === 0 || index === 3 || index === 6)) {
      setIndex(index);
      setMessage("You can't go left")
    } else if ((direction == 'left')) {
      setIndex(index - 1)
    }

    if ((direction == 'right') && (index === 2 || index === 5 || index === 8)) {
      setIndex(index);
      setMessage("You can't go right")
    } else if ((direction == 'right')) {
      setIndex(index + 1)
    }

    if ((direction == 'up') && (index === 0 || index === 1 || index === 2)) {
      setIndex(index);
      setMessage("You can't go up")
    } else if ((direction == 'up')) {
      setIndex(index - 3)
    }

    if ((direction == 'down') && (index === 6 || index === 7 || index === 8)) {
      setIndex(index);
      setMessage("You can't go down")
    } else if ((direction == 'down')) {
      setIndex(index + 3)
    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  // let leftButton = document.getElementById('left');
  // let rightButton = document.getElementById('right');
  // let upButton = document.getElementById('up');
  // let downButton = document.getElementById('down');
  // leftButton.addEventListener('click', setSteps(steps + 1));
  // console.log(leftButton)

  function move(direction) {
    if ((direction == 'left') && (index === 0 || index === 3 || index === 6)) {
      setSteps(steps);
    } else if ((direction == 'left')) {
      setSteps(steps + 1)
    }
    if ((direction == 'right') && (index === 2 || index === 5 || index === 8)) {
      setSteps(steps);
    } else if ((direction == 'right')) {
      setSteps(steps + 1);
    }
    if ((direction == 'down') && (index === 6 || index === 7 || index === 8)) {
      setSteps(steps);
    } else if ((direction == 'down')) {
      setSteps(steps + 1);
    }
    if ((direction == 'up') && (index === 0 || index === 1 || index === 2)) {
      setSteps(steps);
    } else if ((direction == 'up')) {
      setSteps(steps + 1);
    }

  }
  function onChange(evt) {
    setEmail(evt.target.value)
    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    evt.preventDefault();
    axios.post('http://localhost:9000/api/result', { x: getXY()[0], y: getXY()[1], steps: steps, email: email })
      .then(res => {
        reset();
        setMessage(res.data.message)
      }).catch(err => {
        console.log(err);
      })
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps == 1 ? 'time' : 'times'}</h3>

      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={(evt) => {
          move(evt.target.id)
          getNextIndex(evt.target.id)
        }} >LEFT</button>
        <button id="up" onClick={(evt) => {
          move(evt.target.id)
          getNextIndex(evt.target.id)
        }}>UP</button>
        <button id="right" onClick={(evt) => {
          move(evt.target.id)
          getNextIndex(evt.target.id)
        }}>RIGHT</button>
        <button id="down" onClick={(evt) => {
          move(evt.target.id)
          getNextIndex(evt.target.id)
        }}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
