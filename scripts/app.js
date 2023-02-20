function init() {

  // ! ELEMEMTS & VARIABLES

  // 1. Page Load: Game initiation
  // - Grids: generating two 10x10 grids (player and CPU) using JS DOM manipulation.
  // - Each square on the grid has an associated number (0 - 99) - which will be used to reference when shot is fired.

  // - Ships: defining const for all types of ships (i.e Carrier, Destroyer) and size of ship on grid.
  // - Player/CPU: defining an empty array/object of where all ship positions are on the grid.  
  // -- DO I NEED A CLASS TO MANAGE OVERALL ENVIRONMENT or over complicating it?

  // - Start: linking HTML button that will activate the game, initially into 'game setup' mode.
  // - Controls: defining controls - pressing 'Left' or 'Right' arrow will rotate ships when positioning.
  // - Game Status: defining a switch on who's turn it is; either Player or CPU + defining if game has been won or not.
  // - NOTE: no timer defined - not expecting to be time-based (i.e. unlimited time)

  // these will be used when referring object below.
  const carrier = 0
  const battleship = 1
  const destroyer = 2
  const submarine = 3
  const patrol = 4

  // each ship is represented by an object with a name, a size, and an empty array for its locations.
  // each ship will get smaller in size when hit (-1)
  // locations will show the cell dataset index
  const playerShips = [
    { name: 'Carrier', size: 5, locations: [] },
    { name: 'Battleship', size: 4, locations: [] },
    { name: 'Destroyer', size: 3, locations: [] },
    { name: 'Submarine', size: 3, locations: [] },
    { name: 'Patrol', size: 2, locations: [] }
  ]

  const computerShips = [
    { name: 'Carrier', size: 5, locations: [] },
    { name: 'Battleship', size: 4, locations: [] },
    { name: 'Destroyer', size: 3, locations: [] },
    { name: 'Submarine', size: 3, locations: [] },
    { name: 'Patrol', size: 2, locations: [] }
  ]

  // Global variation for the selected ship size
  // defaulting the first ship to set as the Carrier (largest first!) and vertical
  let playerShipToSet = destroyer
  let shipSelectedSize = playerShips[playerShipToSet].size
  let shipDirection = 'vertical'  // either 'vertical' || 'horizontal'

  // 2. Game Setup: Player chooses ship position on grid, define random CPU positions. Store in appropriate arrays/objects.
  // - Storing in the empty Arrays defined above

  // testing the push to array:
  playerShips[carrier].locations.push(23, 24, 25)
  computerShips[patrol].locations.push(56, 57)
  // console.log(playerShips[carrier], computerShips[patrol])

  // GLOBAL VARIABLES
  //  Generating a grid with playerCells array
  // const grid = document.querySelector('.grid')
  const playerGrid = document.querySelector('#playerGrid')
  const computerGrid = document.querySelector('#computerGrid')
  const rowWidth = 10
  const colHeight = 10
  const cellCount = rowWidth * colHeight
  const playerCells = []
  const computerCells = []


  // ! EVENTS

  // creates each grid when page is loaded and initialised. 10x10 with unique indexes.
  // passes through user type argument (player or computer)
  function createGrid(userGrid, userCells){
    // Using the total cell count we've saved to a variable we're going to use a for loop to iterate that many times
    for (let i = 0; i < cellCount; i++){
      // Create div cell
      const cell = document.createElement('div')

      // Add index as innerText
      cell.innerText = i

      // Data attribute representing the index
      // cell.setAttribute('data-index', i)
      cell.dataset.index = i

      // Append to grid
      userGrid.appendChild(cell)

      // Push cell into playerCells array
      userCells.push(cell)
    }
  }

  // function that validates whether it is possible for a player to select grid position of selected ship during game setup
  // triggers when hovering over mouse
  // checks whether valid position within the grid (i.e. doesnt go outside of grid) + ensures no overlapping of existing validated ships
  function validatePosition(e){
    
    // set index of currently selected grid cell on mouse hover
    const cellIndex = parseInt(e.target.dataset.index)
    // console.log(cellIndex)

    // THIS WORKS PERFECTLY but obviously needs refactoring and improved efficiency
    if (shipDirection === 'vertical') {
      if (shipSelectedSize === 3 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 9)) {
        if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 10].classList.contains('nowValidated') && !playerCells[cellIndex + 10].classList.contains('nowValidated')){
          playerCells[cellIndex].classList.add('validSelection')
          playerCells[cellIndex - 10].classList.add('validSelection')
          playerCells[cellIndex + 10].classList.add('validSelection')
        }
      } else if (shipSelectedSize === 4 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 8)) {
        if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 10].classList.contains('nowValidated') && !playerCells[cellIndex + 10].classList.contains('nowValidated') && !playerCells[cellIndex + 20].classList.contains('nowValidated')){
          playerCells[cellIndex].classList.add('validSelection')
          playerCells[cellIndex - 10].classList.add('validSelection')
          playerCells[cellIndex + 10].classList.add('validSelection')
          playerCells[cellIndex + 20].classList.add('validSelection')
        }
      } else if (shipSelectedSize === 2 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 10)) {
        if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 10].classList.contains('nowValidated')) {
          playerCells[cellIndex].classList.add('validSelection')
          playerCells[cellIndex - 10].classList.add('validSelection')
        }
      } else if (shipSelectedSize === 5 && (Math.floor(cellIndex / rowWidth) > 1) && ((Math.floor(cellIndex / rowWidth)) < 8)) {
        if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 20].classList.contains('nowValidated') && !playerCells[cellIndex - 10].classList.contains('nowValidated') && !playerCells[cellIndex + 10].classList.contains('nowValidated') && !playerCells[cellIndex + 20].classList.contains('nowValidated')) {
          playerCells[cellIndex].classList.add('validSelection')
          playerCells[cellIndex - 20].classList.add('validSelection')
          playerCells[cellIndex - 10].classList.add('validSelection')
          playerCells[cellIndex + 10].classList.add('validSelection')
          playerCells[cellIndex + 20].classList.add('validSelection')
        }
      }
    } else if (shipDirection === 'horizontal') {
      if (shipSelectedSize === 3 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 9)) {
        if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 1].classList.contains('nowValidated') && !playerCells[cellIndex + 1].classList.contains('nowValidated')) {
          playerCells[cellIndex].classList.add('validSelection')
          playerCells[cellIndex - 1].classList.add('validSelection')
          playerCells[cellIndex + 1].classList.add('validSelection')
        }
      } else if (shipSelectedSize === 4 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 8)) {
        if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 1].classList.contains('nowValidated') && !playerCells[cellIndex + 1].classList.contains('nowValidated') && !playerCells[cellIndex + 2].classList.contains('nowValidated')){
          playerCells[cellIndex].classList.add('validSelection')
          playerCells[cellIndex - 1].classList.add('validSelection')
          playerCells[cellIndex + 1].classList.add('validSelection')
          playerCells[cellIndex + 2].classList.add('validSelection')
        }
      } else if (shipSelectedSize === 5 && (Math.floor(cellIndex % rowWidth > 1) && (Math.floor(cellIndex % rowWidth) < 8))) {
        if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 2].classList.contains('nowValidated') && !playerCells[cellIndex - 1].classList.contains('nowValidated') && !playerCells[cellIndex + 1].classList.contains('nowValidated') && !playerCells[cellIndex + 2].classList.contains('nowValidated')) {
          playerCells[cellIndex].classList.add('validSelection')
          playerCells[cellIndex - 2].classList.add('validSelection')
          playerCells[cellIndex - 1].classList.add('validSelection')
          playerCells[cellIndex + 1].classList.add('validSelection')
          playerCells[cellIndex + 2].classList.add('validSelection')
        }
      } else if (shipSelectedSize === 2 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 10)) {
        if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 1].classList.contains('nowValidated')) {
          playerCells[cellIndex].classList.add('validSelection')
          playerCells[cellIndex - 1].classList.add('validSelection')
        }
      }
    }
  }

  function removePosition(){
    // this function resets the check for validation as the mouse moves away (out) from the selected playerCells
    playerCells.forEach(cell => cell.classList.remove('validSelection'))
  }

  function rotateShip(e){
    const left = 37
    const right = 39

    // pressing 'left' or 'right' arrow keys will switch direction of ship 
    if (e.keyCode === right || e.keyCode === left){
      if (shipDirection === 'horizontal'){
        shipDirection = 'vertical'
      } else {
        shipDirection = 'horizontal'
      }
    }
  }

  // generate players chosen positions for each ship + udpate the playerShips object
  function createPlayerPositions(){
    
    // loop through playerCells and identify which playerCells are selected and have validSelection class
    // then add indexs to the ships array
    playerCells.forEach(cell => {
      if (cell.classList.contains('validSelection')) {
        playerShips[playerShipToSet].locations.push(parseInt(cell.dataset.index))
        cell.classList.add('nowValidated')
      }
    })

    console.log(playerShips[playerShipToSet])
  }

  // randomly generate CPU positions for each ship + update the cpuShips object
  function createComputerPositions(){
    
    // select random shipDirection
    let randomShipDirection = Math.random() < 0.5 ? 'horizontal' : 'vertical'
    // console.log(randomShipDirection)

    // select random starting cell to place ship
    let randomCell = Math.floor(Math.random() * colHeight * rowWidth)
    // console.log(randomCell)

    // checks if it is a valid place to position a ship or not
    // for (const ship of computerShips) {
    //   let startIndex, orientation
    //   do {
    //     startIndex = randomCell
    //     orientation = randomShipDirection
    //   } while (!canPlaceShip(ship, startIndex, orientation))
    //   placeShip(ship, startIndex, orientation)
    // }

    // const validateWork = validateComputer(randomCell, randomShipDirection)
    // console.log(validateWork)

    let validateWork = validateComputer(randomCell, randomShipDirection)
    console.log(validateWork)
    while (validateWork === false) {
      randomShipDirection = Math.random() < 0.5 ? 'horizontal' : 'vertical'
      randomCell = Math.floor(Math.random() * colHeight * rowWidth)
      validateComputer(randomCell, randomShipDirection)
      console.log(validateWork)
      validateWork = true
    }

    // for (let i = 0; i < computerShips.length; i++){
    //   console.log(computerShips[i].name)
    // }

  }

  function validateComputer(cellIndex, shipDirection){

    // THIS WORKS PERFECTLY but obviously needs refactoring and improved efficiency
    if (shipDirection === 'vertical') {
      if (shipSelectedSize === 3 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 9)) {
        if (!computerCells[cellIndex].classList.contains('nowValidated') && !computerCells[cellIndex - 10].classList.contains('nowValidated') && !computerCells[cellIndex + 10].classList.contains('nowValidated')){
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 10].classList.add('validSelection')
          computerCells[cellIndex + 10].classList.add('validSelection')
          return true
        }
      } else if (shipSelectedSize === 4 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 8)) {
        if (!computerCells[cellIndex].classList.contains('nowValidated') && !computerCells[cellIndex - 10].classList.contains('nowValidated') && !computerCells[cellIndex + 10].classList.contains('nowValidated') && !computerCells[cellIndex + 20].classList.contains('nowValidated')){
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 10].classList.add('validSelection')
          computerCells[cellIndex + 10].classList.add('validSelection')
          computerCells[cellIndex + 20].classList.add('validSelection')
          return true
        }
      } else if (shipSelectedSize === 2 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 10)) {
        if (!computerCells[cellIndex].classList.contains('nowValidated') && !computerCells[cellIndex - 10].classList.contains('nowValidated')) {
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 10].classList.add('validSelection')
          return true
        }
      } else if (shipSelectedSize === 5 && (Math.floor(cellIndex / rowWidth) > 1) && ((Math.floor(cellIndex / rowWidth)) < 8)) {
        if (!computerCells[cellIndex].classList.contains('nowValidated') && !computerCells[cellIndex - 20].classList.contains('nowValidated') && !computerCells[cellIndex - 10].classList.contains('nowValidated') && !computerCells[cellIndex + 10].classList.contains('nowValidated') && !computerCells[cellIndex + 20].classList.contains('nowValidated')) {
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 20].classList.add('validSelection')
          computerCells[cellIndex - 10].classList.add('validSelection')
          computerCells[cellIndex + 10].classList.add('validSelection')
          computerCells[cellIndex + 20].classList.add('validSelection')
          return true
        }
      }
    } else if (shipDirection === 'horizontal') {
      if (shipSelectedSize === 3 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 9)) {
        if (!computerCells[cellIndex].classList.contains('nowValidated') && !computerCells[cellIndex - 1].classList.contains('nowValidated') && !computerCells[cellIndex + 1].classList.contains('nowValidated')) {
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 1].classList.add('validSelection')
          computerCells[cellIndex + 1].classList.add('validSelection')
          return true
        }
      } else if (shipSelectedSize === 4 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 8)) {
        if (!computerCells[cellIndex].classList.contains('nowValidated') && !computerCells[cellIndex - 1].classList.contains('nowValidated') && !computerCells[cellIndex + 1].classList.contains('nowValidated') && !computerCells[cellIndex + 2].classList.contains('nowValidated')){
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 1].classList.add('validSelection')
          computerCells[cellIndex + 1].classList.add('validSelection')
          computerCells[cellIndex + 2].classList.add('validSelection')
          return true
        }
      } else if (shipSelectedSize === 5 && (Math.floor(cellIndex % rowWidth > 1) && (Math.floor(cellIndex % rowWidth) < 8))) {
        if (!computerCells[cellIndex].classList.contains('nowValidated') && !computerCells[cellIndex - 2].classList.contains('nowValidated') && !computerCells[cellIndex - 1].classList.contains('nowValidated') && !computerCells[cellIndex + 1].classList.contains('nowValidated') && !computerCells[cellIndex + 2].classList.contains('nowValidated')) {
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 2].classList.add('validSelection')
          computerCells[cellIndex - 1].classList.add('validSelection')
          computerCells[cellIndex + 1].classList.add('validSelection')
          computerCells[cellIndex + 2].classList.add('validSelection')
          return true
        }
      } else if (shipSelectedSize === 2 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 10)) {
        if (!computerCells[cellIndex].classList.contains('nowValidated') && !computerCells[cellIndex - 1].classList.contains('nowValidated')) {
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 1].classList.add('validSelection')
          return true
        }
      }
    }
    // if none of the conditions are met, return as false (so needs to check again)
    return false
  }

  // NOT BEING USED:
  // function that checks to see whether a valid position to place ship
  // returns boolean
  // function canPlaceShip(ship, startIndex, orientation){
  //   // Check if the ship fits on the board
  //   if (orientation === 'horizontal' && (startIndex % colHeight) + ship.size > colHeight) {
  //     return false
  //   } else if (orientation === 'vertical' && Math.floor(startIndex / colHeight) + ship.size > rowWidth) {
  //     return false
  //   }

  //   // Check if the ship overlaps with any existing ships
  //   for (let i = 0; i < ship.size; i++) {
  //     const index = orientation === 'horizontal' ? startIndex + i : startIndex + i * colHeight
  //     if (computerGrid[index] !== 0) {
  //       return false
  //     }
  //   }

  //   // If the ship fits and does not overlap, return true
  //   return true
  // }

  // // function that places ship into array
  // function placeShip(ship, startIndex, orientation){
  //   console.log(ship, startIndex, orientation)
  // }

  // runs players Turn.  It will call fireShot.
  function playerTurn() {

  }

  // function that randomly generates computer's turn.  It will call fireShot
  function computerTurn() {

  }

  // determine if a missile has hit a ship or missed.  used for both player and CPU.  
  // Update the ships objects + grid accordingly
  // Keep track of player and CPUs ships, check gameState
  function fireShot() {
    
  }

  // check game status: who's turn it is + whether anyone has won yet
  function gameState(){

  }

  // not MVP
  function resetGame() {

  }


  // ! EXECUTION

  // event listeners for:
  // 1. Start button 'click' 
  // 2. Grid divs 'click' when taking a shot

  // Page Load
  // create the grids
  createGrid(playerGrid, playerCells)
  createGrid(computerGrid, computerCells)

  playerCells.forEach(cell => cell.addEventListener('mouseout', removePosition))
  playerCells.forEach(cell => cell.addEventListener('mouseover', validatePosition))
  playerCells.forEach(cell => cell.addEventListener('click', createPlayerPositions))
  document.addEventListener('keydown', rotateShip)

  createComputerPositions()
}

window.addEventListener('DOMContentLoaded', init)