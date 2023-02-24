Battleships plan
<h1>Battleships game</h1>
<h2>Vision</h2>

- WW3 style battleship game, with a bit of humour.  
- Thinking USA vs North Korea or China, feat. Donald Trump and Kim Jong-Il 😂
- Cartoony, possibly 8-bit or 16-bit graphics
- Trump soundbites, Stars & Stripes, explosions, animated gifs, CSS transitions

<h3>Rules:</h3>

- Default to Hasbro rules, but simplified. NOT Salvo or any other UK variation.
- 2 types of user: 1 x 'player' and 1 x 'computer'.
- Each grid is 10x10 squares in size.
- Player is automatically selected as USA by default and can't switch, computer always as North Korea/China (contraversial?!)
- Each user has 1 shot per round - NOT 5 shots as some rules suggest.
- If a hit is successful, there is NO bonus shot immediately afterwards.
- Unlimited rounds and shots - NO limits
- NOT time-based - i.e. unlimited time to take shot.  CPU will be chosen after Player (maybe with slight delay)
- Game is over when all enemy ships are sunk - the winner is congratulated.
- NO mines (as per some UK variants)

<h3>Terminology:</h3>

- A 'user' is either: 'player' or 'computer' (CPU for short)
- 'Shots' are 'fired' towards 'ships' (not boats; it is BattleSHIPs after all...) that are located on the 'grid' (not board).
- An opponent's ship is 'hit', otherwise 'miss'.
- When all parts of the ship are hit, they are 'sunk' and subsquently 'destroyed', otherwise they are 'alive'.

<h3>Each player has 5 ships:</h3>

- 1 x 'Carrier'	(grid size 5)
- 1	x 'Battleship' (grid size 4)
- 1 x 'Destroyer'	(grid size 3)
- 1	x 'Submarine'	(grid size 3)
- 1	x 'Patrol Ship'	(grid size 2)

<h3>MVP features</h3>

- Basic game (either win or lose). No scoreboard or local storage for MVP.
- MVP focus is on the functionality and game play mechanics.  i.e. getting the basics right
- Human can choose where ships are placed on board using mouse hover and then click.
  -  They can rotate and place them horizontally or vertically.
- Computer will make random shots automatically after the human
  - There is no intelligence in the next shot for MVP
- Ships can be aligned next to each other, as long as they are on the grid, but NOT overlapping
- Need to track what ships are where on the board, so know how to sink a ship, and update UI.
- When a ship is sunk, it will identify which ship has been destroyed, and show visually under the grid.

<h3>Biggest expected challenges:</h3>

- Defining how to store player and CPU choices in memory and referring back to them; i.e. defining the classes, objects, arrays
- Logic on setting the ships on the grid; hovering over grid with size dependent, making sure no overlapping and valid position.

<h2>Post-MVP ideas</h2>

- Add personality, animated gifs, transition CSS, sound effects
- Adding game Reset functionality
- CPU 'intelligence' - if hit, next shot will be near the previous hit.
- Choose side?  Randomise who goes first?
- Scoreboard or local storage save?
- Salvo variation of game - start with 5 different shots.
- Responsive?  Sounds a nightmare!


<h3>Before game starts:</h3>

- User has to press 'Start' to initiate.
- User then has to manually choose locations for all ships listed above (shown on their grid)
  - Starts with largest size (Carrier) and then down to smallest (Patrol Boat)
  - Ships can be placed horizontally or vertically, NOT diagonally.
  - Ships CAN touch each other but CANNOT overlap each other.
  - Position CANNOT be changed or edited.
- Computer is randomly chosen location for their ships (not shown up on the grid)
  - Same rules apply as per player.

<h3>During the game:</h3>

- User always starts first, alternates between the User and CPU (one shot each go)
- If the ship is hit, it will indicate (maybe do a nice sound effect too!)
- If hit, computer will try areas nearby to complete the kill

<h3>Game complete:</h3>

- The game completes when either all User or CPU boats are sunk.
- Show dialog with winner
- Option to restart.

