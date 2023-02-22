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

  // each ship is represented by an object with a name, a size, and an empty array for its locations.
  // each ship will get smaller in size when hit (-1)
  // locations will show the cell dataset index
  const playerShips = [
    { name: 'Carrier', size: 5, health: 5, locations: [] },
    { name: 'Battleship', size: 4, health: 4, locations: [] },
    { name: 'Destroyer', size: 3, health: 3, locations: [] },
    { name: 'Submarine', size: 3, health: 3, locations: [] },
    { name: 'Patrol', size: 2, health: 2, locations: [] }
  ]

  const computerShips = [
    { name: 'Carrier', size: 5, health: 5, locations: [] },
    { name: 'Battleship', size: 4, health: 4, locations: [] },
    { name: 'Destroyer', size: 3, health: 3, locations: [] },
    { name: 'Submarine', size: 3, health: 3, locations: [] },
    { name: 'Patrol', size: 2, health: 2, locations: [] }
  ]

  // 2. Game Setup: Player chooses ship position on grid, define random CPU positions. Store in appropriate arrays/objects.
  // - Storing in the empty Arrays defined above

  // GLOBAL VARIABLES
  //  Generating a grid with playerCells array
  // const grid = document.querySelector('.grid')
  const playerGrid = document.querySelector('#playerGrid')
  const computerGrid = document.querySelector('#computerGrid')
  const playerSpan = document.querySelector('#playerSpan')
  const computerSpan = document.querySelector('#computerSpan')
  const startBtn = document.querySelector('#start-btn')

  // Ship variables
  // const playerShipToStart = 0
  let shipSelectedSize = playerShips[0].size  // init with first boat in ships array
  let shipDirection = 'vertical'  // init with first direction, either 'vertical' || 'horizontal'
  let shipCount = 0 // ship counter to loop through ships when creating

  // Grid variables
  const rowWidth = 10
  const colHeight = 10
  const cellCount = rowWidth * colHeight

  // Player and computer variables
  const playerCells = []
  const computerCells = []
  let attemptedShots = [] // tracks all cells that Player has clicked.
  let attemptedShotsCPU = []
  let computerLastHunt

  // Game variables
  let gameStarted = false
  let playersTurn = false   // sets when it is Players turn to play.  Disabled before set ships positions
  let endGameWinner = 'none'

  // ! EVENTS

  function gameInit(){
    console.log('Game started previously?', gameStarted)
    if (gameStarted === false){
      startGame()
    } else {
      console.log('Reset initiated')
      resetGame()
    }
  }

  function startGame(){
    playerGrid.classList.remove('grid-disabled')
    createComputerPositions()
    
    setTimeout(() => {
      playerSpan.innerText = '"TRUMP: Use LEFT or RIGHT arrow keys to rotate"'
      computerSpan.innerText = '"KIM: u too fat to rotate LMFAO"'
    }, '4000')

    playerSpan.innerText = '"TRUMP: OK patriots, time to deploy the ships!"'
    computerSpan.innerText = '"KIM: I deployed mine already NOOB LOL"'
    
    // console.log('Player Ships ->', playerShips)
    // console.log('Computer Ships ->', computerShips)
    gameStarted = true
    startBtn.disabled = true
  }

  // creates each grid when page is loaded and initialised. 10x10 with unique indexes.
  // passes through user type argument (player or computer)
  function createGrid(userGrid, userCells){
    // Using the total cell count we've saved to a variable we're going to use a for loop to iterate that many times
    for (let i = 0; i < cellCount; i++){
      // Create div cell
      const cell = document.createElement('div')

      // Add index as innerText
      // cell.innerText = i

      // Data attribute representing the index
      // cell.setAttribute('data-index', i)
      cell.dataset.index = i

      // Append to grid
      userGrid.appendChild(cell)

      // Push cell into playerCells array
      userCells.push(cell)
    }
  }

  // randomly generate CPU positions for each ship + update the cpuShips object
  function createComputerPositions(){

    // looping through the computerShips array and setting random positions for each ship
    // validation also applied to ensure ships are not already positioned there
    for (let i = 0; i < computerShips.length; i++){

      // select random shipDirection
      let randomShipDirection = pickRandomShipDirection()

      // select random starting cell to place ship
      let randomCell = pickRandomCellNumber()

      // select the size of the ship to position
      const computerShipSize = computerShips[i].size
      // console.log('Ship size ->', computerShipSize)

      // validation to ensure space is free
      let validateWork = validateComputer(i, computerShipSize, randomCell, randomShipDirection)
      // console.log(randomCell, randomShipDirection, validateWork)

      while (validateWork === false) {
        randomShipDirection = pickRandomShipDirection()
        randomCell = pickRandomCellNumber()
        validateWork = validateComputer(i, computerShipSize, randomCell, randomShipDirection)
        // console.log(randomCell, randomShipDirection, validateWork)
      }

      // set ships as validated and push all the validated ships to the Computer Ships array
      // pushValidatedComputerShips(i)
      setValidComputer()
    }
  }

  // function that randomly chooses direction of ship (when setting computer ships)
  function pickRandomShipDirection() {
    return Math.random() < 0.5 ? 'horizontal' : 'vertical'
  }

  // function that randomly chooses starting cell of ship (when setting computer ships)
  function pickRandomCellNumber() {
    return Math.floor(Math.random() * colHeight * rowWidth)
  }

  function validateComputer(shipIndex, shipSize, cellIndex, shipDirection){

    // THIS WORKS PERFECTLY but obviously needs refactoring and improved efficiency
    if (shipDirection === 'vertical') {
      if (shipSize === 3 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 9)) {
        if (!computerCells[cellIndex].classList.contains('nowValidatedCPU') && !computerCells[cellIndex - 10].classList.contains('nowValidatedCPU') && !computerCells[cellIndex + 10].classList.contains('nowValidatedCPU')){
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 10].classList.add('validSelection')
          computerCells[cellIndex + 10].classList.add('validSelection')
          // tempArr = [cellIndex - 10, cellIndex, cellIndex + 10]
          // console.log('Should be here', shipIndex)
          computerShips[shipIndex].locations.push(cellIndex - 10, cellIndex, cellIndex + 10)
          return true
        }
      } else if (shipSize === 4 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 8)) {
        if (!computerCells[cellIndex].classList.contains('nowValidatedCPU') && !computerCells[cellIndex - 10].classList.contains('nowValidatedCPU') && !computerCells[cellIndex + 10].classList.contains('nowValidatedCPU') && !computerCells[cellIndex + 20].classList.contains('nowValidatedCPU')){
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 10].classList.add('validSelection')
          computerCells[cellIndex + 10].classList.add('validSelection')
          computerCells[cellIndex + 20].classList.add('validSelection')
          // tempArr = [cellIndex - 10, cellIndex, cellIndex + 10, cellIndex + 20]
          computerShips[shipIndex].locations.push(cellIndex - 10, cellIndex, cellIndex + 10, cellIndex + 20)
          return true
        }
      } else if (shipSize === 2 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 10)) {
        if (!computerCells[cellIndex].classList.contains('nowValidatedCPU') && !computerCells[cellIndex - 10].classList.contains('nowValidatedCPU')) {
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 10].classList.add('validSelection')
          // tempArr = [cellIndex - 10, cellIndex]
          computerShips[shipIndex].locations.push(cellIndex - 10, cellIndex)
          return true
        }
      } else if (shipSize === 5 && (Math.floor(cellIndex / rowWidth) > 1) && ((Math.floor(cellIndex / rowWidth)) < 8)) {
        if (!computerCells[cellIndex].classList.contains('nowValidatedCPU') && !computerCells[cellIndex - 20].classList.contains('nowValidatedCPU') && !computerCells[cellIndex - 10].classList.contains('nowValidatedCPU') && !computerCells[cellIndex + 10].classList.contains('nowValidatedCPU') && !computerCells[cellIndex + 20].classList.contains('nowValidatedCPU')) {
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 20].classList.add('validSelection')
          computerCells[cellIndex - 10].classList.add('validSelection')
          computerCells[cellIndex + 10].classList.add('validSelection')
          computerCells[cellIndex + 20].classList.add('validSelection')
          // tempArr = [cellIndex - 20, cellIndex - 10, cellIndex, cellIndex + 10, cellIndex + 20]
          computerShips[shipIndex].locations.push(cellIndex - 20, cellIndex - 10, cellIndex, cellIndex + 10, cellIndex + 20)
          return true
        }
      }
    } else if (shipDirection === 'horizontal') {
      if (shipSize === 3 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 9)) {
        if (!computerCells[cellIndex].classList.contains('nowValidatedCPU') && !computerCells[cellIndex - 1].classList.contains('nowValidatedCPU') && !computerCells[cellIndex + 1].classList.contains('nowValidatedCPU')) {
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 1].classList.add('validSelection')
          computerCells[cellIndex + 1].classList.add('validSelection')
          // tempArr = [cellIndex - 1, cellIndex, cellIndex + 1]
          computerShips[shipIndex].locations.push(cellIndex - 1, cellIndex, cellIndex + 1)
          return true
        }
      } else if (shipSize === 4 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 8)) {
        if (!computerCells[cellIndex].classList.contains('nowValidatedCPU') && !computerCells[cellIndex - 1].classList.contains('nowValidatedCPU') && !computerCells[cellIndex + 1].classList.contains('nowValidatedCPU') && !computerCells[cellIndex + 2].classList.contains('nowValidatedCPU')){
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 1].classList.add('validSelection')
          computerCells[cellIndex + 1].classList.add('validSelection')
          computerCells[cellIndex + 2].classList.add('validSelection')
          // tempArr = [cellIndex - 1, cellIndex, cellIndex + 1, cellIndex + 2]
          computerShips[shipIndex].locations.push(cellIndex - 1, cellIndex, cellIndex + 1, cellIndex + 2)
          return true
        }
      } else if (shipSize === 5 && (Math.floor(cellIndex % rowWidth > 1) && (Math.floor(cellIndex % rowWidth) < 8))) {
        if (!computerCells[cellIndex].classList.contains('nowValidatedCPU') && !computerCells[cellIndex - 2].classList.contains('nowValidatedCPU') && !computerCells[cellIndex - 1].classList.contains('nowValidatedCPU') && !computerCells[cellIndex + 1].classList.contains('nowValidatedCPU') && !computerCells[cellIndex + 2].classList.contains('nowValidatedCPU')) {
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 2].classList.add('validSelection')
          computerCells[cellIndex - 1].classList.add('validSelection')
          computerCells[cellIndex + 1].classList.add('validSelection')
          computerCells[cellIndex + 2].classList.add('validSelection')
          // tempArr = [cellIndex - 2, cellIndex - 1, cellIndex, cellIndex + 1, cellIndex + 2]
          computerShips[shipIndex].locations.push(cellIndex - 2, cellIndex - 1, cellIndex, cellIndex + 1, cellIndex + 2)
          return true
        }
      } else if (shipSize === 2 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 10)) {
        if (!computerCells[cellIndex].classList.contains('nowValidatedCPU') && !computerCells[cellIndex - 1].classList.contains('nowValidatedCPU')) {
          computerCells[cellIndex].classList.add('validSelection')
          computerCells[cellIndex - 1].classList.add('validSelection')
          // tempArr = [cellIndex - 1, cellIndex]
          computerShips[shipIndex].locations.push(cellIndex - 1, cellIndex)
          return true
        }
      }
    }
    // if none of the conditions are met, return as false (so needs to check again)
    return false
  }

  function setValidComputer(){
    
    // loop through computerCells and identify which computerCells are selected and have validSelection class
    // then add indexs to the ships array
    computerCells.forEach(cell => {
      if (cell.classList.contains('validSelection')) {
        cell.classList.add('nowValidatedCPU')
      }
    })

    // console.log(computerShips[computerShipToSet])
  }

  // function that validates whether it is possible for a player to select grid position of selected ship during game setup
  // triggers when hovering over mouse
  // checks whether valid position within the grid (i.e. doesnt go outside of grid) + ensures no overlapping of existing validated ships
  function validatePosition(e){
    
    // set index of currently selected grid cell on mouse hover
    const cellIndex = parseInt(e.target.dataset.index)

    if (playersTurn !== true && gameStarted === true && endGameWinner === 'none'){
      // THIS WORKS PERFECTLY but obviously needs refactoring and improved efficiency
      if (shipDirection === 'vertical') {
        if (shipSelectedSize === 3 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 9)) {
          if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 10].classList.contains('nowValidated') && !playerCells[cellIndex + 10].classList.contains('nowValidated')){
            playerCells[cellIndex].classList.add('validSelection')
            playerCells[cellIndex - 10].classList.add('validSelection')
            playerCells[cellIndex + 10].classList.add('validSelection')
            return true
          }
        } else if (shipSelectedSize === 4 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 8)) {
          if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 10].classList.contains('nowValidated') && !playerCells[cellIndex + 10].classList.contains('nowValidated') && !playerCells[cellIndex + 20].classList.contains('nowValidated')){
            playerCells[cellIndex].classList.add('validSelection')
            playerCells[cellIndex - 10].classList.add('validSelection')
            playerCells[cellIndex + 10].classList.add('validSelection')
            playerCells[cellIndex + 20].classList.add('validSelection')
            return true
          }
        } else if (shipSelectedSize === 2 && (Math.floor(cellIndex / rowWidth)) && ((Math.floor(cellIndex / rowWidth)) < 10)) {
          if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 10].classList.contains('nowValidated')) {
            playerCells[cellIndex].classList.add('validSelection')
            playerCells[cellIndex - 10].classList.add('validSelection')
            return true
          }
        } else if (shipSelectedSize === 5 && (Math.floor(cellIndex / rowWidth) > 1) && ((Math.floor(cellIndex / rowWidth)) < 8)) {
          if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 20].classList.contains('nowValidated') && !playerCells[cellIndex - 10].classList.contains('nowValidated') && !playerCells[cellIndex + 10].classList.contains('nowValidated') && !playerCells[cellIndex + 20].classList.contains('nowValidated')) {
            playerCells[cellIndex].classList.add('validSelection')
            playerCells[cellIndex - 20].classList.add('validSelection')
            playerCells[cellIndex - 10].classList.add('validSelection')
            playerCells[cellIndex + 10].classList.add('validSelection')
            playerCells[cellIndex + 20].classList.add('validSelection')
            return true
          }
        }
      } else if (shipDirection === 'horizontal') {
        if (shipSelectedSize === 3 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 9)) {
          if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 1].classList.contains('nowValidated') && !playerCells[cellIndex + 1].classList.contains('nowValidated')) {
            playerCells[cellIndex].classList.add('validSelection')
            playerCells[cellIndex - 1].classList.add('validSelection')
            playerCells[cellIndex + 1].classList.add('validSelection')
            return true
          }
        } else if (shipSelectedSize === 4 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 8)) {
          if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 1].classList.contains('nowValidated') && !playerCells[cellIndex + 1].classList.contains('nowValidated') && !playerCells[cellIndex + 2].classList.contains('nowValidated')){
            playerCells[cellIndex].classList.add('validSelection')
            playerCells[cellIndex - 1].classList.add('validSelection')
            playerCells[cellIndex + 1].classList.add('validSelection')
            playerCells[cellIndex + 2].classList.add('validSelection')
            return true
          }
        } else if (shipSelectedSize === 5 && (Math.floor(cellIndex % rowWidth > 1) && (Math.floor(cellIndex % rowWidth) < 8))) {
          if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 2].classList.contains('nowValidated') && !playerCells[cellIndex - 1].classList.contains('nowValidated') && !playerCells[cellIndex + 1].classList.contains('nowValidated') && !playerCells[cellIndex + 2].classList.contains('nowValidated')) {
            playerCells[cellIndex].classList.add('validSelection')
            playerCells[cellIndex - 2].classList.add('validSelection')
            playerCells[cellIndex - 1].classList.add('validSelection')
            playerCells[cellIndex + 1].classList.add('validSelection')
            playerCells[cellIndex + 2].classList.add('validSelection')
            return true
          }
        } else if (shipSelectedSize === 2 && (Math.floor(cellIndex % rowWidth)) && (Math.floor(cellIndex % rowWidth) < 10)) {
          if (!playerCells[cellIndex].classList.contains('nowValidated') && !playerCells[cellIndex - 1].classList.contains('nowValidated')) {
            playerCells[cellIndex].classList.add('validSelection')
            playerCells[cellIndex - 1].classList.add('validSelection')
            return true
          }
        }
      }
    }
    // disable grid so no non-validated cells can be added!
    playerGrid.classList.add('grid-disabled')
  }

  // generate players chosen positions for each ship + udpate the playerShips object
  function createPlayerPositions(){
    // loop through playerCells and identify which playerCells are selected and have validSelection class
    // then add indexs to the ships array

    // WORK BUT HAD ISSUE CLICKING ON VALIDATED
    playerCells.forEach(cell => {
      if (cell.classList.contains('validSelection')) {
        playerShips[shipCount].locations.push(parseInt(cell.dataset.index))
        cell.classList.add('nowValidated')
      }
    })
    
    // console.log(playerShips[shipCount])
    if (shipCount < 4){
      shipCount++
      shipSelectedSize = playerShips[shipCount].size
    } else if (shipCount === 4) {
      playerIsReady()
    }

    // remove ability to add again immediately
    playerGrid.classList.add('grid-disabled')
    
    // console.log(playerShips[shipCount])

  }

  function removePosition(){
    // this function resets the check for validation as the mouse moves out from the selected playerCells
    // playerGrid.click(() => true)
    // if (endGameWinner !== 'none'){
    playerGrid.classList.remove('grid-disabled')
    // }
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

  // triggered once ships have been set (and validated), game is ready to start
  function playerIsReady() {
    playersTurn = true
    playerGrid.classList.add('grid-disabled')
    computerGrid.classList.remove('grid-disabled')
    playerSpan.innerText = '"TRUMP: GREAT JOB. Now go kick some Commie ass"'
    computerSpan.innerText = '"KIM: Come at me BRO bwhahaha"'
    console.log('Player Ships ->', playerShips)
    console.log('Computer Ships ->', computerShips)
  }

  // triggered once it is player's turn + clicked on computer grid
  function playerTurn(e) {
    // capture the cell that has clicked on
    const cellFire = parseInt(e.target.dataset.index)
    
    // first check to make sure they haven't attempted shot already (does nothing)
    if (!attemptedShots.includes(cellFire)) {
      // if they haven't, push to attemptedShots array to record shot, and then trigger the fireShot function
      attemptedShots.push(cellFire)
      fireShot('player', cellFire)

      // now set to computers turn
      playersTurn = false
      computerTurn()
    } else {
      computerSpan.innerText = 'Bwhwhwa YOU ALREADY TRIED THAT SPOT, MINION'
    }
    // console.log('Array of attempted shots ->', attemptedShots)
  }  

  // THIS VERSION WORKS! BACKUP
  // function that randomly generates computer's turn.  It will call fireShot
  // function computerTurn() {
    
  //   if (endGameWinner === 'none'){
  //     computerSpan.innerText = 'KIM: Haha my go now...'
  //     let randomCell = pickRandomCellNumber()
  //     setTimeout(() => {
        
  //       // if attemptedShot array does NOT already contain random cell, push to attemptedShots array to record shot
  //       // then trigger the fireShot function
  //       if (!attemptedShotsCPU.includes(randomCell)) {
  //         attemptedShotsCPU.push(randomCell)
  //         fireShot('computer', randomCell)
    
  //         // now set to players turn
  //         playersTurn = true
  //         // console.log('Not included in attemptedShotsCPU ->', attemptedShotsCPU)
  //       } else {
  //         while (attemptedShotsCPU.includes(randomCell)) {
  //           // console.log('FAILED attemptedShotsCPU ->', randomCell)
  //           randomCell = pickRandomCellNumber()
  //         }
  //         attemptedShotsCPU.push(randomCell)
  //         fireShot('computer', randomCell)
  //         // computerSpan.innerText = randomCell
  //         // console.log('INCLUDED in attemptedShotsCPU ->', attemptedShotsCPU)
  //       }

  //       playerSpan.innerText = 'TRUMP: Our time to shine...'
  //     }, '1500')
  //   }
  // }

  function computerTurn() {
    
    if (endGameWinner === 'none'){
      computerSpan.innerText = 'KIM: Haha my go now...'
      let cellChosen

      if (computerLastHunt === null){
        cellChosen = pickRandomCellNumber()
      } else {
        cellChosen = computerHunt()
        if (cellChosen === false){
          cellChosen = pickRandomCellNumber()
        }
      }

      setTimeout(() => {
        
        // if attemptedShot array does NOT already contain random cell, push to attemptedShots array to record shot
        // then trigger the fireShot function
        if (!attemptedShotsCPU.includes(cellChosen)) {
          attemptedShotsCPU.push(cellChosen)
          fireShot('computer', cellChosen)
    
          // now set to players turn
          playersTurn = true
          // console.log('Not included in attemptedShotsCPU ->', attemptedShotsCPU)
        } else {
          while (attemptedShotsCPU.includes(cellChosen)) {
            // console.log('FAILED attemptedShotsCPU ->', randomCell)
            cellChosen = pickRandomCellNumber()
          }
          attemptedShotsCPU.push(cellChosen)
          fireShot('computer', cellChosen)
          // computerSpan.innerText = randomCell
          // console.log('INCLUDED in attemptedShotsCPU ->', attemptedShotsCPU)
        }

        playerSpan.innerText = 'TRUMP: Our time to shine...'
      }, '1500')
    }
  }

  function computerHunt(){
    const lastHitX = computerLastHunt % 10
    const lastHitY = Math.floor(computerLastHunt / 10)
    const possibleCells = [
      [lastHitX - 1, lastHitY],
      [lastHitX + 1, lastHitY],
      [lastHitX, lastHitY - 1],
      [lastHitX, lastHitY + 1]
    ].filter(coords => {
      const [x, y] = coords
      return x >= 0 && x < 10 && y >= 0 && y < 10 && !attemptedShotsCPU.includes(y * 10 + x)
    })

    if (possibleCells.length > 0) {
      // Choose a random nearby cell to fire upon
      const [randomX, randomY] = possibleCells[Math.floor(Math.random() * possibleCells.length)]
      return randomY * 10 + randomX
    } else {
      // No nearby cells available, switch back to "random" mode
      computerLastHunt = null
      // let randomCell = pickRandomCellNumber()
      // while (attemptedShotsCPU.includes(randomCell)) {
      //   randomCell = pickRandomCellNumber()
      // }
      // return randomCell
      return false
    }
  }

  // determine if a missile has hit a ship or missed.  used for both player and CPU.  
  // Update the ships objects + grid accordingly
  // Keep track of player and CPUs ships, check gameState
  function fireShot(user, cellFire) {
    
    // identify if the cell that has been fired is contained within computerShips array.
    let locateShip
    if (user === 'player'){
      locateShip = computerShips.find(ship => ship.locations.includes(cellFire))
    } else {
      locateShip = playerShips.find(ship => ship.locations.includes(cellFire))
    }
    
    if (locateShip) {
      if (locateShip.health > 1) {
        locateShip.health--
        if (user === 'player'){
          // playerSpan.innerText = `hit! ${cellFire}`
          playerSpan.innerText = 'TRUMP: HIT! He really felt that one!!'
          computerCells[cellFire].classList.add('shotHit')
        } else {
          // computerSpan.innerText = `hit! ${cellFire}`
          computerSpan.innerText = 'KIM: HIT! LOL who is ur daddy now!!'
          playerCells[cellFire].classList.add('shotHit')
          computerLastHunt = cellFire
        }
      } else if (locateShip.health === 1) {
        locateShip.health = 0
        if (user === 'player'){
          playerSpan.innerText = `TRUMP: GO TEAM AMERICA! We sunk his ${locateShip.name}`
          computerCells[cellFire].classList.add('shotHit')
        } else {
          computerSpan.innerText = `KIM: Hope u not miss ur ${locateShip.name} LOL`
          playerCells[cellFire].classList.add('shotHit')
          computerLastHunt = null
        }
        checkEndGame(user)
      }
    } else {
      if (user === 'player'){
        // playerSpan.innerText = `miss! ${cellFire}`
        playerSpan.innerText = 'TRUMP: MISS! Recalibrate the Freedom missles!'
        computerCells[cellFire].classList.add('shotMissed')
      } else {
        // computerSpan.innerText = `miss! ${cellFire}`
        computerSpan.innerText = 'KIM: MISS! Failure is not an option!'
        playerCells[cellFire].classList.add('shotMissed')
        // computerLastHunt = null
      }
    }

    // USEFUL LOGGING HERE:
    // console.log('Computer Ships ->', computerShips)
    // console.log('Player Ships ->', playerShips)

  }

  // check game status: whether anyone has won yet
  function checkEndGame(user) {
    
    let locateHealth

    if (user === 'player'){
      locateHealth = computerShips.every(ship => ship.health === 0)
      console.log('Player Health ->', locateHealth)
      if (locateHealth) {
        endGame('player')
      }
    } else {
      locateHealth = playerShips.every(ship => ship.health === 0)
      console.log('Computer Health ->', locateHealth)
      if (locateHealth) {
        endGame('computer')
      }
    }
  }

  function endGame(user){
    
    // updating global variable to halt actions across the app
    endGameWinner = user

    // update the spans
    if (endGameWinner === 'player'){
      playerSpan.innerText = 'TRUMP: GAME OVER! God Bless America!!'
      computerSpan.innerText = 'KIM: NOOOOOO how u cheat??'
    } else {
      computerSpan.innerText = 'KIM: GAME OVER! Down with capitalism!!'
      playerSpan.innerText = 'TRUMP: I didnt want to play anyway'
    }
    console.log('We have a winner:', endGameWinner)
    
    // disable all the things
    startBtn.disabled = false
    startBtn.innerText = 'Reset'
    // gameStarted = false
    computerGrid.classList.add('grid-disabled')
    playerGrid.classList.add('grid-disabled')

    // endGameWinner = 'none'
  }

  // not MVP
  function resetGame() {

    // resetting Ships objects (there is a better way of reusable code here but NO time!)
    playerShips[0].health = 5
    playerShips[1].health = 4
    playerShips[2].health = 3
    playerShips[3].health = 3
    playerShips[4].health = 2
    playerShips.forEach(ship => ship.locations = [])
    
    computerShips[0].health = 5
    computerShips[1].health = 4
    computerShips[2].health = 3
    computerShips[3].health = 3
    computerShips[4].health = 2
    computerShips.forEach(ship => ship.locations = [])

    console.log('Resetting Ship PLAYER:', playerShips)
    console.log('Resetting Ship CPU:', computerShips)

    // resetting HTML classes so wont show on grid
    playerCells.forEach(cell => {
      cell.classList.remove('validSelection')
      cell.classList.remove('nowValidated')
      cell.classList.remove('shotHit')
      cell.classList.remove('shotMissed')
    })

    computerCells.forEach(cell => {
      cell.classList.remove('validSelection')
      cell.classList.remove('nowValidatedCPU')
      cell.classList.remove('shotHit')
      cell.classList.remove('shotMissed')
    })

    // resetting variables back to first counts
    shipSelectedSize = playerShips[0].size
    shipCount = 0

    // resetting temp arrays
    attemptedShots = []
    attemptedShotsCPU = []

    // resetting game switches
    playersTurn = false
    endGameWinner = 'none'

    playerGrid.classList.remove('grid-disabled')

    // run start game function
    startGame()
  }


  // ! EXECUTION

  // event listeners for:
  // 1. Start button 'click' 
  // 2. Grid divs 'click' when taking a shot

  // Page Load
  // create the grids
  createGrid(playerGrid, playerCells)
  createGrid(computerGrid, computerCells)
  playerGrid.classList.add('grid-disabled')
  computerGrid.classList.add('grid-disabled')

  startBtn.addEventListener('click', gameInit)
  playerCells.forEach(cell => cell.addEventListener('mouseout', removePosition))
  playerCells.forEach(cell => cell.addEventListener('mouseover', validatePosition))
  playerCells.forEach(cell => cell.addEventListener('click', createPlayerPositions))
  computerCells.forEach(cell => cell.addEventListener('click', playerTurn))
  document.addEventListener('keydown', rotateShip)
  
  // console.log('Computer Ships ->', computerShips)
}

window.addEventListener('DOMContentLoaded', init)