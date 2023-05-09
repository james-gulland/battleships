<h1>Project One: Battleships</h1>
<h2>Project Overview</h2>

The first GA Software Engineering immersive course project was in week 4 of the course, with the brief of creating a Battleships game using JavaScript, HTML and CSS.  I learnt a lot about streamlined, readable, and reusable code, by implementing objects, functions and methods in JavaScript, as well as had some fun with HTML5 and CSS techniques. 

<h3>Deployment link:</h3>

https://james-gulland.github.io/battleships/ 

![image](https://res.cloudinary.com/drrscrxod/image/upload/v1683626033/battleships-2_tqachn.png)

<h3>Timeframe & Working Team</h3>

This project was a solo, independent project with a duration of 1 week for completion.  I conducted the initial plan and requirements, to the wireframe, and then on to the development and testing.

<h3>Technologies Used</h3>

- JavaScript
- HTML5
- CSS
- VS Code
- Excalidraw (UX wireframing)
- Git & GitHub

<h2>Brief</h2>

We were provided a list of games to choose to develop; ranging from Minesweeper, to Frogger, to Space Invaders, to Pacman, and beyond!  I settled on choosing Battleships; as it was a firm favourite of mine growing up, and also it was rated the highest degree of complexity amongst the list of games - and I wanted the challenge!  

The overall aim was to develop a Battleships game using techniques learnt in the first 3 weeks of the bootcamp, including JavaScript, HTML5 and CSS.

We were advised to plan carefully on how to approach the brief before digging straight into coding: understanding the requirements clearly, defining the rules and the features of the game, creating a wireframe/prototype to visualise how it might come together, and writing pseudo code to articulate what functionality needs to be developed.  This was split into a MVP version and additional post-MVP functionality if we had time to complete.

Once planning had been signed off by the instructor team, we then went about coding from start to finish, and hosting on the web for all to see.  We had 6 full days to complete the work.  We worked towards the mindset of reusable, readable code that was refactored as we went along.

<h2>Planning</h2>

<b>Step 1: The Plan</b>

I devised an initial plan in a readme file, with a clear understanding in the vision/concept of the game, the rules and requirements, terminology to use (which will affect how I define the variables), MVP features and post-MVP features (nice-to-have if I have the time).

![image](https://res.cloudinary.com/drrscrxod/image/upload/v1683626588/battleships-brief_yqp9m7.png)

<b>Step 2: The Wireframe</b>

Creation of wireframe based on the above vision, rules, and requirements, at a high-level - which would help define the HTML structure of the page and some of the play mechanics.

![image](https://res.cloudinary.com/drrscrxod/image/upload/v1683626588/battleships-wireframe_ewjgq2.png)

<b>Step 3: The Pseudo Code</b>

Pseudo code out all necessary elements and global variables, all the events and functions required to do the job, and the execution processes, such as page load and clicking of buttons.  

I knew this was likely to change as I started developing the game, but it was useful to map things out initially in my brain, in terms of what reusable functions I might need, how to name variables in line with the terminology defined in the planning process, and how everything was going to link together.

<h2>Build Process</h2>

Step 1: Develop a mock game ‘playground’ to experiment with functionality

Initially, I didn’t want to create all the HTML structure and perfect the CSS upfront; I just wanted to create a ‘playground’ area so that I could tackle the hardest problems first.  I did this by automatically generating a couple of grids using a ‘createGrid’ function; one for the player and one for the computer.  This function was a reusable component for both instances, and generated a 10x10 grid, which are the official board sizes defined by Hasbro.  I put the indexes as inner text so I could debug easily.

(image)

I also defined some of the key global variables and objects in order to generate the basics of the game mechanics, such as the player and computer ships objects, that could be reused throughout the codebase:




