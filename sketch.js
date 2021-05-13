/***********************************************************************************
  Project 03
  by Jingyi Zhao

  Uses the p5.2DAdventure.js 
  
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects


// indexes into the clickable array (constants) 
const cl_startScenario = 0;
const cl_PowerWin = 1;
const cl_OilWin = 2;
const cl_AutoWin = 3;
const cl_PowerDo = 4;
const cl_PowerWant = 5;
const cl_PowerEnd = 6;
const cl_OilUnlike = 7;
const cl_OilChange = 8;
const cl_AutoDo = 9;
const cl_AutoWant = 10;


// car emojis
var carImage;  
var maxCar = 5;

// character arrays
var characterImages = [];   
var characters = []; 

// characters
const driver = 0;
const power = 1;
const oil = 2;
const auto = 3;
const team = 4;

// room indices - look at adventureManager
const startScreen = 3;
const powerA = 4;
const oilA = 5;
const autoA = 6;
const want = 7;
const doo = 8;
const end = 9;
const unlike = 10;

let headlineFont;
let bodyFont;


// Allocate Adventure Manager with states table and interaction tables
function preload() {

  headlineFont = loadFont('fonts/TCCB.TTF');
  bodyFont = loadFont('fonts/TCCB.TTF');

  // load all images
  carImage = loadImage("assets/car.png");
  
  allocateCharacters();

  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
}

// Setup the adventure manager
function setup() {
  createCanvas(1100, 700);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

  // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // load all text screens
  loadAllText();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 

  fs = fullscreen();
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

 // drawCharacters();

  // don't draw them on first few screens
  if( adventureManager.getStateName() === "Splash" ||
      adventureManager.getStateName() === "Instructions" ||
      adventureManager.getStateName() === "Characters" ) {
    ;
  }
  else {
    drawCharacters();
  }
  
  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch all keys to adventure manager
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  // dispatch all mouse events to adventure manager
  adventureManager.mouseReleased();
}

function drawCharacters() {
  for( let i = 0; i < characters.length; i++ ) {
    characters[i].draw();
  }
}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;    
  }

  // we do specific callbacks for each clickable
  clickables[0].onPress = clickableButtonPressed;
  clickables[1].onPress = clPowerWin;
  clickables[2].onPress = clOilWin;
  clickables[3].onPress = clAutoWin;
  clickables[4].onPress = clPowerDo;
  clickables[5].onPress = clPowerWant;
  clickables[6].onPress = clPowerEnd;
  clickables[7].onPress = clOilUnlike;
  clickables[8].onPress = clOilChange;
  clickables[9].onPress = clAutoDo;
  clickables[10].onPress =clAutoWant;
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#AAAAAA";
}

clickableButtonPressed = function() {
  adventureManager.clickablePressed(this.name);
} 

//-- specific button callbacks: these will add or subtrack car, then
//-- pass the clickable pressed to the adventure manager, which changes the
//-- state. A more elegant solution would be to use a table for all of these values
clPowerWin = function() {
    characters[driver].addCar(2);
    characters[team].subCar(3);
    characters[auto].addCar(2);
    characters[power].addCar(4);
    adventureManager.clickablePressed(this.name);
}

clOilWin = function() {
  characters[auto].addCar(1);
  characters[driver].subCar(2);
  characters[team].subCar(2);
  adventureManager.clickablePressed(this.name);
}

clAutoWin = function() {
  characters[power].addCar(3);
  characters[driver].addCar(3);
  characters[team].addCar(1);
  characters[oil].subCar(1);
  characters[auto].addCar(4);
  adventureManager.clickablePressed(this.name);
}

clPowerDo = function() {
  characters[auto].addCar(3);
  characters[driver].addCar(2);
  characters[team].addCar(2);
  adventureManager.clickablePressed(this.name);
}

clPowerWant = function() {
  characters[auto].addCar(1);
  characters[driver].addCar(1);
  characters[team].addCar(1);
  adventureManager.clickablePressed(this.name);
}

clPowerEnd = function() {
  characters[oil].addCar(2);
  characters[auto].addCar(1);
  adventureManager.clickablePressed(this.name);
}

clOilUnlike = function() {
  characters[power].addCar(4);
  characters[auto].addCar(2);
  characters[driver].addCar(2);
  characters[team].addCar(2);
  adventureManager.clickablePressed(this.name);
}

clOilChange = function() {
  characters[power].subCar(2);
  characters[auto].addCar(2);
  characters[driver].addCar(2);
  characters[team].addCar(2);
  adventureManager.clickablePressed(this.name);
}

clAutoDo = function() {
  characters[driver].addCar(4);
  characters[power].addCar(1);
  characters[team].subCar(2);
  adventureManager.clickablePressed(this.name);
}

clAutoWant = function() {
  characters[power].addCar(1);
  characters[driver].addCar(2);
  characters[team].addCar(1);
  adventureManager.clickablePressed(this.name);
}





//-------------- CHARACTERS -------------//
function allocateCharacters() {
  // load the images first
  characterImages[driver] = loadImage("assets/driver.jpg");
  characterImages[power] = loadImage("assets/power.jpg");
  characterImages[oil] = loadImage("assets/oil.jpg");
  characterImages[auto] = loadImage("assets/auto.jpg");
  characterImages[team] = loadImage("assets/team.jpg");
  

  for( let i = 0; i < characterImages.length; i++ ) {
    characters[i] = new Character();
    characters[i].setup( characterImages[i], 50 + (400 * parseInt(i/2)), 120 + (i%2 * 120));
  }

  // default car is zero, set up some car values
  characters[auto].addCar(4);
  characters[driver].addCar(3);
  characters[team].addCar(1);
  characters[power].addCar(2);
}

class Character {
  constructor() {
    this.image = null;
    this.x = width/2;
    this.y = width/2;
  }

  setup(img, x, y) {
    this.image = img;
    this.x = x;
    this.y = y;
    this.car = 0;
  }

  draw() {
    if( this.image ) {
      push();
      // draw the character icon
      imageMode(CENTER);
      image( this.image, this.x, this.y );

      // draw car emojis
      for( let i = 0; i < this.car; i++ ) {
        image(carImage, this.x + 70 + (i*40), this.y +10 );
      }

      pop();
    }
  }

  getCar() {
    return this.car;
  }

  // add, check for max overflow
  addCar(amt) {
    this.car += amt;
    if( this.car > maxCar ) {
      this.car = maxCar;
    }

  }

  // sub, check for below zero
  subCar(amt) {
    this.car -= amt;
    if( this.car < 0 ) {
      this.car = 0;
    }
  }
}

//-------------- ROOMS --------------//

// hard-coded text for all the rooms
// the elegant way would be to load from an array
function loadAllText() {
  // go through all states and setup text
  // ONLY call if these are ScenarioRoom
  
// copy the array reference from adventure manager so that code is cleajer
  scenarioRooms = adventureManager.states;

  scenarioRooms[startScreen].setText("Who is the WINNER?", "Each one does not want to pay too much, but wants to have high returns. The engineering team will express to the sponsoring company that whoever sponsors will increase revenue several times. Which company would be willing?");
  scenarioRooms[powerA].setText("How to smart electricity price?", "Use lower costs, such as the use of wind and solar power generation. Becoming a contracting company for the engineering team can become the main source of this purpose!");
  scenarioRooms[oilA].setText("Don't want to reduce", "Only by controlling the price can win the support of people with traditional ideas. The ultimate goal of the supplier behind the engineering team is to make money!");
  scenarioRooms[autoA].setText("How to maintain a fixed consumption?", "We must continue to research the best and latest products. Do we cooperate with power companies to become the strongest beneficiaries!");
  scenarioRooms[want].setText("There are obstacles, what should we do?", "Money is the biggest problem. The increase in competition leads to a decrease in income. The company will not do things at a loss. Apparently, the company uses a special discount to increase revenue.");
  scenarioRooms[doo].setText("There are obstacles, what should we do??", "Money is the biggest problem. The increase in competition leads to a decrease in income. The company will not do things at a loss. Apparently, the company uses a special discount to increase revenue.");
  scenarioRooms[end].setText("What Should I do?", "Just provide its own products and get rebates from it, and don't want to pay for other things. THE END...");
  scenarioRooms[unlike].setText("How big a crisis will there be?", "Very opposed. Although the crisis is the accumulation of time. Re-planning and using a lot of money led to the closure of gas stations and unemployment of employees. Who can help us?");
}

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class ScenarioRoom extends PNGRoom {
  // Constructor gets calle with the new keyword, when upon constructor for the adventure manager in preload()
  constructor() {
    super();    // call super-class constructor to initialize variables in PNGRoom

    this.titleText = "";
    this.bodyText = "";
  }

  // should be called for each room, after adventureManager allocates
  setText( titleText, bodyText ) {
    this.titleText = titleText;
    this.bodyText = bodyText;
    this.drawY = 360;
    this.drawX = 152;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
    draw() {
      // this calls PNGRoom.draw()
      super.draw();
      
      push();

      // title text
      fill(255);
      //textAlign(LEFT);
      //textFont(headlineFont);
      //textSize(24);

      

      // title text
      textSize(60);

      text(this.titleText, this.drawX , this.drawY);
     
      // Draw text in a box
      //text(this.titleText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
    
      textFont(bodyFont);
      textSize(35);

      text(this.bodyText, this.drawX , this.drawY + 60, width - (this.drawX*2),height - (this.drawY+100) );
      
      pop();
    }
}

