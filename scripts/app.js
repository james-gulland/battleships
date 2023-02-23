function init() {

  // ! ELEMEMTS & VARIABLES

  // GLOBAL VARIABLES

  // each ship is represented by an object with a name, a size, and an empty array for its locations.
  // locations will show the cell dataset index
  // health will be decremented when hit

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

  //  Defining all the HTML elements as variables to manipulate
  const playerGrid = document.querySelector('#playerGrid')
  const computerGrid = document.querySelector('#computerGrid')
  const playerSpan = document.querySelector('#playerSpan')
  const computerSpan = document.querySelector('#computerSpan')
  const startBtn = document.querySelector('#start-btn')
  const playerScoreSpan = document.querySelector('#you')
  const cpuScoreSpan = document.querySelector('#cpu')
  const audio = document.querySelector('#audio')

  // Ship variables
  // const playerShipToStart = 0
  let shipSelectedSize = playerShips[0].size  // init with first boat in ships array
  let shipDirection = 'vertical'              // init with first direction, either 'vertical' || 'horizontal'
  let shipCount = 0                           // ship counter to loop through ships when creating

  // Grid variables
  const rowWidth = 10
  const colHeight = 10
  const cellCount = rowWidth * colHeight

  // Player and computer variables
  const playerCells = []      // tracks player Cells
  const computerCells = []    // tracks CPU cells
  let attemptedShots = []     // tracks all cells that Player has previously chosen
  let attemptedShotsCPU = []  // tracks all cells that Player has previously chosen
  let computerLastHunt        // tracks last CPU hit to be used for 'hunt' mode

  // Defining game state variables
  let gameStarted = false     // has game started or not
  let deployed = false        // has player deployed all their ships or not
  let playersTurn = false     // is it players turn or not
  let endGameWinner = 'none'  // is there a winner defined yet or not. either 'player' or 'computer'

  // ! EVENTS

  function gameInit(){
    // console.log('Game started previously?', gameStarted)
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

    // play sound
    playAudio('player')
  }

  // creates each grid when page is loaded and initialised. 10x10 with unique indexes.
  // passes through user type argument (player or computer)
  function createGrid(userGrid, userCells){
    // Using the total cell count we've saved to a variable we're going to use a for loop to iterate that many times
    for (let i = 0; i < cellCount; i++){
      // Create div cell
      const cell = document.createElement('div')

      // Debug mode on cell positions:
      // cell.innerText = i

      // Data attribute representing the index
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
    // console.log(playersTurn)
    if (playersTurn !== true && gameStarted === true && endGameWinner === 'none' && deployed !== true){
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
    // console.log(gameStarted)

    if (gameStarted && !deployed){
      
      playAudio('set')
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
    }
    // console.log(playerShips[shipCount])
  }

  // this function resets the check for validation as the mouse moves out from the selected playerCells
  function removePosition(){
    // console.log(gameStarted, playersTurn, endGameWinner)
    // if (gameStarted === true && playersTurn === false){
    if (!deployed){
      playerGrid.classList.remove('grid-disabled')
      playerCells.forEach(cell => cell.classList.remove('validSelection'))
    }
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
    deployed = true
    playerGrid.classList.add('grid-disabled')
    computerGrid.classList.remove('grid-disabled')
    playerSpan.innerText = '"TRUMP: GREAT JOB. Now go kick some Commie ass"'
    computerSpan.innerText = '"KIM: Come at me BRO bwhahaha"'

    setTimeout(() => {
      playAudio('start')
    }, '1500')
    

    console.log('Player Ships ->', playerShips)
    console.log('Computer Ships ->', computerShips)
  }

  // triggered once it is player's turn + clicked on computer grid
  function playerTurn(e) {
    // console.log(playersTurn, endGameWinner)
    playerGrid.classList.add('grid-disabled')
    if (endGameWinner === 'none' && playersTurn === true){
      // capture the cell that has clicked on
      const cellFire = parseInt(e.target.dataset.index)
      computerGrid.classList.add('grid-disabled')
      
      if (!attemptedShots.includes(cellFire)) {
        // if they haven't, push to attemptedShots array to record shot, and then trigger the fireShot function
        attemptedShots.push(cellFire)
        fireShot('player', cellFire)

        // now set to computers turn
        playersTurn = false
        computerTurn()

      } else {
        computerSpan.innerText = 'KIM: YOU ALREADY TRIED THAT SPOT, MINION'
      }

      setTimeout(() => {
        // first check to make sure they haven't attempted shot already (does nothing)
        computerGrid.classList.remove('grid-disabled')
      }, '2000')

    }
    // console.log('Array of attempted shots ->', attemptedShots)
  }

  function computerTurn() {
    
    if (endGameWinner === 'none'){
      // computerGrid.classList.add('grid-disabled')
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
        // computerGrid.classList.add('grid-disabled')
        // if attemptedShot array does NOT already contain random cell, push to attemptedShots array to record shot
        // then trigger the fireShot function
        // playerGrid.classList.add('grid-disabled')
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
          playersTurn = true
          // computerGrid.classList.remove('grid-disabled')
          // computerSpan.innerText = randomCell
          // console.log('INCLUDED in attemptedShotsCPU ->', attemptedShotsCPU)
        }

        // computerGrid.classList.remove('grid-disabled')
        if (endGameWinner === 'none'){
          playerSpan.innerText = 'TRUMP: Our time to shine...'
        }
      }, '1500')
      // playerGrid.classList.remove('grid-disabled')
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
          playAudio('hit')
        } else {
          // computerSpan.innerText = `hit! ${cellFire}`
          computerSpan.innerText = 'KIM: HIT! LOL who is ur daddy now!!'
          playerCells[cellFire].classList.add('shotHit')
          playAudio('hit')
          computerLastHunt = cellFire
        }
      } else if (locateShip.health === 1) {
        locateShip.health = 0
        if (user === 'player'){
          playerSpan.innerText = `TRUMP: GO TEAM AMERICA! We sunk his ${locateShip.name}`
          computerCells[cellFire].classList.add('shotHit')
          playAudio('sink')
          updateScore(computerShips, cpuScoreSpan)
        } else {
          computerSpan.innerText = `KIM: Hope u not miss ur ${locateShip.name} LOL`
          playerCells[cellFire].classList.add('shotHit')
          playAudio('sink')
          updateScore(playerShips, playerScoreSpan)
          computerLastHunt = null
        }
        checkEndGame(user)
      }
    } else {
      if (user === 'player'){
        // playerSpan.innerText = `miss! ${cellFire}`
        playerSpan.innerText = 'TRUMP: MISS! Recalibrate the Freedom missles!'
        computerCells[cellFire].classList.add('shotMissed')
        playAudio('miss')
      } else {
        // computerSpan.innerText = `miss! ${cellFire}`
        computerSpan.innerText = 'KIM: MISS! Failure is not an option!'
        playerCells[cellFire].classList.add('shotMissed')
        playAudio('miss')
        // computerLastHunt = null
      }
    }

    // USEFUL LOGGING HERE:
    // console.log('Computer Ships ->', computerShips)
    // console.log('Player Ships ->', playerShips)

  }

  function updateScore(ships, span) {
    const shipsLeft = ships.filter(ship => ship.health !== 0).length
    if (span === playerScoreSpan){
      span.innerText = 'YOU ' + '🚢 '.repeat(shipsLeft)
    } else {
      span.innerText = 'CPU ' + '🚢 '.repeat(shipsLeft)
    }
  }

  function playAudio(sound){
    audio.src = `assets/${sound}.wav`
    audio.play()
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
      playerGrid.style.backgroundImage = 'url("assets/trump-applause.gif")'
      playerGrid.style.animation = 'none'
      removeAllClass(playerCells)
      computerSpan.innerText = 'KIM: NOOOOOO how u cheat??'
      setTimeout(() => {
        playAudio('fired')
      }, '2000')

    } else {
      computerSpan.innerText = 'KIM: GAME OVER! Down with American capitalism!!'
      computerGrid.style.backgroundImage = 'url("assets/kimwin.gif")'
      computerGrid.style.animation = 'none'
      removeAllClass(computerCells)
      playerSpan.innerText = 'TRUMP: FAKE NEWS. I never wanted to play anyway'
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

  function removeAllClass(cells) {
    cells.forEach(cell => {
      cell.classList.remove('validSelection')
      cell.classList.remove('nowValidated')
      cell.classList.remove('shotHit')
      cell.classList.remove('shotMissed')
    })
  }

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
    removeAllClass(playerCells)
    removeAllClass(computerCells)
    playerGrid.style.backgroundImage = 'url("assets/sea.jpeg")'
    playerGrid.style.animation = 'animate 60s linear infinite'
    computerGrid.style.backgroundImage = 'url("assets/sea.jpeg")'
    computerGrid.style.animation = 'animate 60s linear infinite'
    updateScore(playerShips, playerScoreSpan)
    updateScore(computerShips, cpuScoreSpan)

    // resetting variables back to first counts
    shipSelectedSize = playerShips[0].size
    shipCount = 0

    // resetting temp arrays
    attemptedShots = []
    attemptedShotsCPU = []

    // resetting game switches
    playersTurn = false
    deployed = false
    endGameWinner = 'none'

    playerGrid.classList.remove('grid-disabled')

    // run start game function
    startBtn.innerText = 'Start'
    startGame()
  }


  // ! EXECUTION

  // Page Load
  // Create the grids
  createGrid(playerGrid, playerCells)
  createGrid(computerGrid, computerCells)
  playerGrid.classList.add('grid-disabled')
  computerGrid.classList.add('grid-disabled')

  // HTML executions
  startBtn.addEventListener('click', gameInit)
  playerCells.forEach(cell => cell.addEventListener('mouseout', removePosition))
  playerCells.forEach(cell => cell.addEventListener('mouseover', validatePosition))
  playerCells.forEach(cell => cell.addEventListener('click', createPlayerPositions))
  computerCells.forEach(cell => cell.addEventListener('click', playerTurn))
  document.addEventListener('keydown', rotateShip)
  
  // console.log('Computer Ships ->', computerShips)
}

window.addEventListener('DOMContentLoaded', init)