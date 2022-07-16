const characterProperties = {
  width: null,
  height: null,
  sizeUnits: 'px',
  stay: null,
  move: null,
  speed: 10,
};

const mapSize = {
  width: 21,
  height: 21,
  tileSide: 40,
  tileSideUnits: 'px',
};

const mapTiles = {
  'defaultMapBorder': './assets/rock-wall.png',
  'collisionMapBorder': true,
  'tileRenderOrder': ['route', 'collision', 'overflow', 'placement(x,y)'],
  'wall': [
    'image => ./assets/rock-wall.png',
    'collision => TRUE',
    'overflow => SHOW',
    [
    '7x,5y', '8x,5y', '5x,3y', '7x,3y', '8x,3y',
    ],
  ],
  'grass': [
    'image => ./assets/grass.png',
    'collision => FALSE',
    'overflow => hidden',
    [
    '-2x,2y', '-1x,2y', '0x,2y', '1x,2y', '1x,1y', '1x,0y', '1x,-1y', '0x,-1y', '-1x,-1y', '-2x,-1y', '-2x,0y', '-2x,1y'
    ]
  ],
};

/*
 * Build tiles parameters.
 */
// Initiate render order and mapping.
var tileRenderOrder = [];
var collisionTiles = [];
var nonCollisionTiles = [];

for (let tileParameter in mapTiles) {
  switch (tileParameter) {
    case 'defaultMapBorder':
      // Check if parameter is not null, false or empty string.
      if (mapTiles[tileParameter] != null) {
        var defaultMapBorder = mapTiles[tileParameter];
        while (defaultMapBorder.indexOf(' ') !== -1) {
          defaultMapBorder = defaultMapBorder.replace(' ', '');
        }
      }
      else {
        var defaultMapBorder = null;
      }

      break;
    case 'collisionMapBorder':
      var collisionMapBorder = mapTiles[tileParameter];

      break;
    case 'tileRenderOrder':
      if (typeof mapTiles[tileParameter] == 'object') {
        // Assign render order.
        for (let i = 0; i < mapTiles[tileParameter].length; i++) {
          switch (mapTiles[tileParameter][i]) {
            case 'route':
              tileRenderOrder.push(mapTiles[tileParameter][i]);

              break;
            case 'collision':
              tileRenderOrder.push(mapTiles[tileParameter][i]);

              break;
            case 'overflow':
              tileRenderOrder.push(mapTiles[tileParameter][i]);

              break;
            case 'placement(x,y)':
              tileRenderOrder.push(mapTiles[tileParameter][i]);

              break;
          }
        }
      }

      break;
    default:
      // Validate data.
      if (typeof mapTiles[tileParameter] == 'object') {
        var tileName = tileParameter;

        // Set push empty array and save every element.
        var renderedTile = [];
        for (let i = 0; i < mapTiles[tileParameter].length; i++) {
          if (typeof mapTiles[tileParameter][i] == 'string') {
            if (mapTiles[tileParameter][i].indexOf('image =>')  !== -1) {
              var image = mapTiles[tileParameter][i].replace('image =>', '');
              while (image.indexOf(' ') !== -1) {
                image = image.replace(' ', '');
              }
            }
            if (mapTiles[tileParameter][i].indexOf('collision =>')  !== -1) {
              var collision = mapTiles[tileParameter][i];
              if (collision.indexOf('TRUE')  !== -1) {
                collision = true;
              }
              else {
                collision = false;
              }
            }
            if (mapTiles[tileParameter][i].indexOf('overflow =>')  !== -1) {
              var overflow = mapTiles[tileParameter][i];
              if (overflow.indexOf('SHOW')  !== -1) {
                overflow = 'SHOW';
              }
              else {
                overflow = 'HIDDEN';
              }
            }
          }
          else if (typeof mapTiles[tileParameter][i] == 'object') {
            mapTiles[tileParameter][i].forEach(element => {
              var splitTileParameter = element.split(',');
              if (collision) {
                // Check if tile name crash function.
                if (splitTileParameter[0] != '0x') {
                  xVariable = parseInt(splitTileParameter[0]);
                }
                else {
                  xVariable = 0;
                }

                // Append values to render array.
                collisionTiles.push(xVariable, parseInt(splitTileParameter[1]), image, ';');
              }
              else {
                // Check if tile name crash function.
                if (splitTileParameter[0] != '0x') {
                  xVariable = parseInt(splitTileParameter[0]);
                }
                else {
                  xVariable = 0;
                }

                // Append values to render array.
                nonCollisionTiles.push(xVariable, parseInt(splitTileParameter[1]), image, ';');
              }
            });
          }
        }
      }
  }
}

/*
 * User screen data.
 */
const screenWidth  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var html = document.documentElement.innerHTML;

// Build tiles' enclosure.
let tiles = document.createElement('div');
tiles.className = 'tiles';
tiles.style.position = 'fixed';
tiles.style.display = 'grid';
// Get map size from parameters.
for (let key in mapSize) {
  switch (key) {
    case 'width':
      var width = mapSize[key];
      break;
    case 'height':
      var height = mapSize[key];
      break;
    case 'tileSide':
      var tileSide = mapSize[key];
      break;
    case 'tileSideUnits':
      var tileSideUnits = mapSize[key];
      break;
  }
}

/*
 * Build parameters.
 */
totalWidth = tileSide * width;
totalHeight = tileSide * height;
initialLeft = 0 - (totalWidth / 2) + (screenWidth / 2) - (tileSide / 2);
initialTop = 0 - (totalHeight / 2) + (screenHeight / 2) - (tileSide / 2);

/*
 * Build enclosure parameters.
 */
// Apply styles to enclosure
tiles.style.top = initialTop + tileSideUnits;
tiles.style.left = initialLeft + tileSideUnits;
for (let i = 0; i < height; i++) {
  if (i == 0) {
    var gridTemplateRowsCount = tileSide + tileSideUnits;
  }
  else {
    gridTemplateRowsCount += ' ' + tileSide + tileSideUnits;
  }
}
for (let i = 0; i < width; i++) {
  if (i == 0) {
    var gridTemplateColumnsCount = tileSide + tileSideUnits;
  }
  else {
    gridTemplateColumnsCount += ' ' + tileSide + tileSideUnits;
  }
}
tiles.style.gridTemplateRows = gridTemplateRowsCount;
tiles.style.gridTemplateColumns = gridTemplateColumnsCount;

/*
 * BUILD TILES.
 *
 * Mapping variables.
 */
let variableHeight = height;
let variableYMap = Math.round(height / 2);
var tilesList = [];

/*
 * GENERATE TILES.
 */
while (variableHeight > 0) {
  // Reset variables for each row.
  let variableWidth = width;
  let variableXMap = Math.floor(-width / 2);
    
  while (variableWidth > 0) {
    // Default tile variables.
    let collisionDefaultText = false;
    let tileImage = null;

    // Apply collisions for map boundaries if configured.
    if (collisionMapBorder == true) {
      // Add generic collision properties for top side.
      if (variableYMap == Math.round(height / 2)) {
        collisionTiles.push(variableXMap, variableYMap, ';');
        collisionDefaultText = true;
      }

      // Add generic collision properties for bottom side.
      if (variableHeight == 1) {
        collisionTiles.push(variableXMap, variableYMap, ';');
        collisionDefaultText = true;
      }

      // Add generic collision properties for right side.
      if (variableWidth == 1) {
        collisionTiles.push(variableXMap, variableYMap, ';');
        collisionDefaultText = true;
      }

      // Add generic collision properties for left side.
      if (variableXMap == -(Math.round(width / 2))) {
        collisionTiles.push(variableXMap, variableYMap, ';');
        collisionDefaultText = true;
      }

      // Add tile image for map boundaries.
      if (collisionDefaultText) {
        tileImage = defaultMapBorder;
      }
    }

    // Apply collisions if not applied yet checking collision list and current location is inside list.
    if (collisionDefaultText != true) {
      for (let i = 0; i < collisionTiles.length; i++) {
        if (collisionTiles[i] == variableXMap && collisionTiles[i + 1] == variableYMap) {
          tileImage = collisionTiles[i + 2];
          collisionDefaultText = true;

          break;
        }
      }
    }

    if (collisionDefaultText != true) {
      for (let i = 0; i < nonCollisionTiles.length; i++) {
        if (nonCollisionTiles[i] == variableXMap && nonCollisionTiles[i + 1] == variableYMap) {
          tileImage = nonCollisionTiles[i + 2];

          break;
        }
      }
    }

    // Create element.
    let tile = document.createElement('div');
    tile.id = tile.textContent = "x" + variableXMap + "y" + variableYMap;
    tile.className = 'tile';

    if (tileImage) {
      tile.style.backgroundImage = 'url(' + tileImage + ')';
      tile.style.backgroundSize = tileSide + 'px ' + tileSide + 'px';
      tile.style.backgroundRepeat = 'no-repeat';
    }

    // Add tile text collision variables if applicable.
    if (collisionDefaultText == true) {
      if (!tileImage) {
        tile.textContent += ' ' + 'collision';
      }

      tile.className += ' ' + 'tile-collision';

      // Add collision tile parameters to tiles list.
      tilesList.push("x" + variableXMap + "y" + variableYMap);
    }

    // Tile styles.
    if (!tileImage) {
      tile.style.border = '1px solid #000000';
    }
    tile.style.width =  tile.style.height = tileSide + tileSideUnits;
    tile.style.fontSize = (tileSide / 4) + tileSideUnits

    // Append tile.
    tiles.appendChild(tile);

    // Operate.
    variableWidth--;
    variableXMap++;
  }

  // Operate.
  variableHeight--;
  variableYMap--;
}

/*
 * BUILD CHARACTER.
 */

/*
 * Get character parameters.
 */ 
for (let key in characterProperties) {
  switch (key) {
    // Get character width.
    case 'width':
      if (characterProperties[key] != null) {
        var characterWidth = characterProperties[key];
      }
      else {
        var characterWidth = tileSide;
      }
      break;

    // Get character height.
    case 'height':
      if (characterProperties[key] != null) {
        var characterHeight = characterProperties[key];
      }
      else {
        var characterHeight = tileSide * (3 / 2);
      }
      break;

    // Get character size units.
    case 'sizeUnits':
      if (characterProperties[key] != null) {
        var characterSizeUnits = characterProperties[key];
      }
      else {
        var characterSizeUnits = 'px';
      }
      break;

    // Get character stay animation.
    case 'stay':
      var characterStayAnimationRoute = characterProperties[key];
      break;
  
    // Get character move animation.
    case 'move':
      var characterMoveAnimationRoute = characterProperties[key];
      break;

    // Get character speed in px per press.
    case 'speed':
      var characterSpeed = characterProperties[key];
      break;
  }
}

/*
 * Build character box and set parameters.
 */
let character = document.createElement('div');
character.className = character.id = 'character';
// Character styles.
character.style.width = characterWidth + characterSizeUnits;
character.style.height = characterHeight + characterSizeUnits;
character.style.position = 'fixed';
character.style.top = 0 + (screenHeight / 2) - (characterHeight * (2 / 3)) + characterSizeUnits;
character.style.left = 0 + (screenWidth / 2) - (characterWidth / 2) + characterSizeUnits;
character.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
character.style.zIndex = '1';
// Character processing parameters.
const characterHalfHeight = characterHeight / 2;
const characterHalfWidth = characterWidth / 2;

/*
 * Movement definitions.
 */
// Movement keys.
const movementLeft = ['a', 'A', 'ArrowLeft'];
const movementRight = ['d', 'D', 'ArrowRight'];
const movementUp = ['w', 'W', 'ArrowUp'];
const movementDown = ['s', 'S', 'ArrowDown'];
const movementBend = ['Control'];
const movementJump = [' '];
const movementInteract = ['f', 'F', 'Enter'];
const movementSkip = ['f', 'F', 'Enter', ' '];

// Key down callout.
window.onkeydown = function (event) {
  movement (event);
}

/*
 * Get pressed key and call collision and main movement functions.
 */
function movement (event) {
  // Initiate al keys as false and make then true only if pressed.
  leftKey = rightKey = upKey = downKey = bendKey = jumpKey = interactKey = skipKey = false;
  if (movementLeft.includes(event.key)) {
    leftKey = true;
  }
  if (movementRight.includes(event.key)) {
    rightKey = true;
  }
  if (movementUp.includes(event.key)) {
    upKey = true;
  }
  if (movementDown.includes(event.key)) {
    downKey = true;
  }
  if (movementBend.includes(event.key)) {
    bendKey = true;
  }
  if (movementJump.includes(event.key)) {
    jumpKey = true;
  }
  if (movementInteract.includes(event.key)) {
    interactKey = true;
  }
  if (movementSkip.includes(event.key)) {
    skipKey = true;
  }

  // Restore (or set if first interaction) collision direction.
  collisionDirection = null;

  // Check collisions on move.
  tilesList.forEach(checkProximity);

  // Call movement functions checking only key pressed.
  if (leftKey) {
    if (collisionDirection != 'left') {
      // Left.
      moveLeft();
    }
  }
  else if (rightKey) {
    if (collisionDirection != 'right') {
      // Right.
      moveRight();
    }
  }
  else if (upKey) {
    if (collisionDirection != 'up') {
      // Up.
      moveUp();
    }
  }
  else if (downKey) {
    if (collisionDirection != 'down') {
      // Down.
      moveDown();
    }
  }
};

/*
 * MAIN MOVEMENT FUNCTIONS.
 */

/*
 * Background movement left.
 */
function moveLeft () {
  newLeft = parseFloat(tiles.style.left) + characterSpeed;
  tiles.style.left = newLeft + tileSideUnits;
}

/*
 * Background movement right.
 */
function moveRight () {
  newLeft = parseFloat(tiles.style.left) - characterSpeed;
  tiles.style.left = newLeft + tileSideUnits;
}

/*
 * Background movement up.
 */
function moveUp () {
  newTop = parseFloat(tiles.style.top) + characterSpeed;
  tiles.style.top = newTop + tileSideUnits;
}

/*
 * Background movement down.
 */
function moveDown () {
  newTop = parseFloat(tiles.style.top) - characterSpeed;
  tiles.style.top = newTop + tileSideUnits;
}

/*
 * Check character collision.
 * 
 * @param string tileListed
 *  Tile with collision property provided by tilesList.forEach().
 */
function checkProximity (tileListed) {
  // Load top, left, bottom and right tile offsets.
  var tilesListedOffsets = document.getElementById(tileListed).getBoundingClientRect();
  var tilesListedOffsetsTop = tilesListedOffsets.top;
  var tilesListedOffsetsLeft = tilesListedOffsets.left;
  var tilesListedOffsetsBottom = tilesListedOffsets.bottom;
  var tilesListedOffsetsRight = tilesListedOffsets.right;

  // Check is tile is inside screen range.
  if (tilesListedOffsetsTop >= 0 || tilesListedOffsetsBottom >= 0 || tilesListedOffsetsLeft >= 0 || tilesListedOffsetsRight >= 0) {
    // Check if tile is colliding with character.
    if (tilesListedOffsetsBottom - characterOffsetsBottom - tileSide < characterHalfHeight && tilesListedOffsetsBottom - characterOffsetsBottom + tileSide > -characterHalfHeight
      && tilesListedOffsetsTop - characterOffsetsTop - tileSide < characterHalfHeight && tilesListedOffsetsTop - characterOffsetsTop - tileSide + 1 > -characterHalfHeight
      && tilesListedOffsetsLeft - characterOffsetsLeft - (tileSide * 0.75) < characterHalfWidth && tilesListedOffsetsLeft - characterOffsetsLeft + (tileSide * 0.75) > -characterHalfWidth
      && tilesListedOffsetsRight - characterOffsetsRight - (tileSide * 0.75) < characterHalfWidth && tilesListedOffsetsRight - characterOffsetsRight + (tileSide * 0.75) > -characterHalfWidth) {
      // Get collision direction.
      if (upKey
        && tilesListedOffsetsTop - characterOffsetsTop <= characterHeight - tileSide
        && (tilesListedOffsetsLeft - characterOffsetsLeft < tileSide) && (characterOffsetsLeft - tilesListedOffsetsLeft < tileSide)
        && characterOffsetsBottom - tilesListedOffsetsBottom >= 0
        && characterOffsetsRight - tilesListedOffsetsRight < tileSide) {
        // Set collision direction to "top".
        collisionDirection = 'up';
      }
      else if (leftKey
        && tilesListedOffsetsLeft - characterOffsetsLeft <= -tileSide
        && tilesListedOffsetsBottom - characterOffsetsBottom <= tileSide
        && tilesListedOffsetsRight - characterOffsetsRight >= -tileSide
        && tilesListedOffsetsTop - characterOffsetsTop >= tileSide - ((tileSide / 3) * 2)) {
        // Set collision direction to "left".
        collisionDirection = 'left';
      }
      else if (downKey
        && characterOffsetsBottom - tilesListedOffsetsBottom + tileSide <= characterHalfHeight
        && tilesListedOffsetsRight - characterOffsetsRight <= tileSide
        && characterOffsetsTop - tilesListedOffsetsTop <= characterHalfHeight
        && characterOffsetsLeft - tilesListedOffsetsLeft < characterWidth) {
        // Set collision direction to "down".
        collisionDirection = 'down';
      }
      else if (rightKey
        && characterOffsetsRight - tilesListedOffsetsRight < tileSide
        && tilesListedOffsetsTop - characterOffsetsTop >= tileSide - ((tileSide / 3) * 2)
        && characterOffsetsLeft - tilesListedOffsetsLeft < characterHalfWidth
        && tilesListedOffsetsBottom - characterOffsetsBottom <= tileSide
        ) {
        // Set collision direction to "right".
        collisionDirection = 'right';
      }
    }
  }
}

/*
 * BUILD EVERYTHING.
 *
 * Append elements.
 */
body = document.getElementsByTagName('body')[0];
body.appendChild(character);
body.appendChild(tiles);

/*
 * Common styles.
 */
body.style.margin = '0';

/*
 * Save character offsets after building.
 */
let characterOffsets = document.getElementById('character').getBoundingClientRect();
const characterOffsetsTop = characterOffsets.top;
const characterOffsetsBottom = characterOffsets.bottom;
const characterOffsetsLeft = characterOffsets.left;
const characterOffsetsRight = characterOffsets.right;