class Moonbase {
  constructor(appendId, characterProperties, mapSize, mapTiles) {
    this.appendId = appendId;
    this.characterProperties = characterProperties;
    this.mapSize = mapSize;
    this.mapTiles = mapTiles;

    if (!tileSide) {
      var tileSide = this.mapSize.tileSide;
    }

    // USER SCREEN DATA.
    const screenWidth  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var html = document.documentElement.innerHTML;
    const body = document.getElementsByTagName('body')[0];

    /**
     * BUILD CHARACTER.
     */
    // Get character parameters.
    for (let key in this.characterProperties) {
      switch (key) {
        // Get character width.
        case 'width':
          if (this.characterProperties[key] != null) {
            this.characterWidth = this.characterProperties[key];
          }
          else {
            this.characterWidth =  tileSide;
          }
          break;

        // Get character height.
        case 'height':
          if (this.characterProperties[key] != null) {
            this.characterHeight = this.characterProperties[key];
          }
          else {
            this.characterHeight = tileSide * (3 / 2);
          }
          break;

        // Get character size units.
        case 'sizeUnits':
          if (this.characterProperties[key] != null) {
            this.characterSizeUnits = this.characterProperties[key];
          }
          else {
            this.characterSizeUnits = 'px';
          }
          break;

        // Get character stay animation.
        case 'stay':
          var characterStayAnimationRoute = this.characterProperties[key];
          break;
      
        // Get character move animation.
        case 'move':
          var characterMoveAnimationRoute = this.characterProperties[key];
          break;

        // Get character speed in px per press.
        case 'speed':
          var characterSpeed = this.characterProperties[key];
          break;
      }
    }

    //  Build character box and set parameters.
    let character = document.createElement('div');
    character.className = character.id = 'character';

    // Character styles.
    character.style.width = this.characterWidth + this.characterSizeUnits;
    character.style.height = this.characterHeight + this.characterSizeUnits;
    character.style.position = 'fixed';
    character.style.top = 0 + (screenHeight / 2) - (this.characterHeight * (2 / 3)) + this.characterSizeUnits;
    character.style.left = 0 + (screenWidth / 2) - (this.characterWidth / 2) + this.characterSizeUnits;
    character.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    character.style.zIndex = '1';

    // Character processing parameters.
    const characterHalfHeight = this.characterHeight / 2;
    const characterHalfWidth = this.characterWidth / 2;

    // Movement keys.
    const movementBend = ['Control'];
    const movementJump = [' '];
    const movementInteract = ['f', 'F', 'Enter'];
    const movementSkip = ['f', 'F', 'Enter', ' '];

    // Key down callout.
    window.onkeydown = function (event) {
      // Initiate al keys as false and make then true only if pressed.
      let leftKey = false;
      let rightKey = false;
      let upKey = false;
      let downKey = false;

      if (['a', 'A', 'ArrowLeft'].includes(event.key)) {
        leftKey = true;
      }
      if (['d', 'D', 'ArrowRight'].includes(event.key)) {
        rightKey = true;
      }
      if (['w', 'W', 'ArrowUp'].includes(event.key)) {
        upKey = true;
      }
      if (['s', 'S', 'ArrowDown'].includes(event.key)) {
        downKey = true;
      }

      // Restore (or set if first interaction) collision direction.
      let collisionDirection = null;

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

    /**
     * Check character collision.
     *
     * @param string tileListed
     *  Tile with collision property provided by tilesList.forEach().
     * 
     * @return string
     *  Collision direction if detected.
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
          if (this.upKey
            && tilesListedOffsetsTop - characterOffsetsTop <= this.characterHeight - tileSide
            && (tilesListedOffsetsLeft - characterOffsetsLeft < tileSide) && (characterOffsetsLeft - tilesListedOffsetsLeft < tileSide)
            && characterOffsetsBottom - tilesListedOffsetsBottom >= 0
            && characterOffsetsRight - tilesListedOffsetsRight < tileSide) {
            // Set collision direction to "top".
            return 'up';
          }
          else if (this.leftKey
            && tilesListedOffsetsLeft - characterOffsetsLeft <= -tileSide
            && tilesListedOffsetsBottom - characterOffsetsBottom <= tileSide
            && tilesListedOffsetsRight - characterOffsetsRight >= -tileSide
            && tilesListedOffsetsTop - characterOffsetsTop >= tileSide - ((tileSide / 3) * 2)) {
            // Set collision direction to "left".
            return 'left';
          }
          else if (this.downKey
            && characterOffsetsBottom - tilesListedOffsetsBottom + tileSide <= characterHalfHeight
            && tilesListedOffsetsRight - characterOffsetsRight <= tileSide
            && characterOffsetsTop - tilesListedOffsetsTop <= characterHalfHeight
            && characterOffsetsLeft - tilesListedOffsetsLeft < characterWidth) {
            // Set collision direction to "down".
            return 'down';
          }
          else if (this.rightKey
            && characterOffsetsRight - tilesListedOffsetsRight < tileSide
            && tilesListedOffsetsTop - characterOffsetsTop >= tileSide - ((tileSide / 3) * 2)
            && characterOffsetsLeft - tilesListedOffsetsLeft < characterHalfWidth
            && tilesListedOffsetsBottom - characterOffsetsBottom <= tileSide
            ) {
            // Set collision direction to "right".
            return 'right';
          }
        }
      }
    };

    /**
     * MAIN MOVEMENT FUNCTION.
     *
     * Background movement left.
     */
    function moveLeft () {
      let newLeft = parseFloat(tiles.style.left) + characterSpeed;
      tiles.style.left = newLeft + tileSideUnits;
    };

    /**
     * MAIN MOVEMENT FUNCTION.
     *
     * Background movement right.
     */
    function moveRight () {
      let newLeft = parseFloat(tiles.style.left) - characterSpeed;
      tiles.style.left = newLeft + tileSideUnits;
    };

    /**
     * MAIN MOVEMENT FUNCTION.
     *
     * Background movement up.
     */
    function moveUp () {
      let newTop = parseFloat(tiles.style.top) + characterSpeed;
      tiles.style.top = newTop + tileSideUnits;
    };

    /**
     * MAIN MOVEMENT FUNCTION.
     *
     * Background movement down.
     */
    function moveDown () {
      let newTop = parseFloat(tiles.style.top) - characterSpeed;
      tiles.style.top = newTop + tileSideUnits;
    };

    /*
     * BUILD TILES PARAMETERS.
     */
    // Initiate render order and mapping.
    var tileRenderOrder = [];
    var collisionTiles = [];
    var nonCollisionTiles = [];

    for (let tileParameter in this.mapTiles) {
      switch (tileParameter) {
        case 'defaultMapBorder':
          // Check if parameter is not null, false or empty string.
          if (this.mapTiles[tileParameter] != null) {
            var defaultMapBorder = this.mapTiles[tileParameter];
            while (defaultMapBorder.indexOf(' ') !== -1) {
              defaultMapBorder = defaultMapBorder.replace(' ', '');
            }
          }
          else {
            var defaultMapBorder = null;
          }

          break;

        case 'collisionMapBorder':
          var collisionMapBorder = this.mapTiles[tileParameter];

          break;

        case 'tileRenderOrder':
          if (typeof this.mapTiles[tileParameter] == 'object') {
            // Assign render order.
            for (let i = 0; i < this.mapTiles[tileParameter].length; i++) {
              switch (this.mapTiles[tileParameter][i]) {
                case 'route':
                  tileRenderOrder.push(this.mapTiles[tileParameter][i]);

                  break;

                case 'collision':
                  tileRenderOrder.push(this.mapTiles[tileParameter][i]);

                  break;

                case 'overflow':
                  tileRenderOrder.push(this.mapTiles[tileParameter][i]);

                  break;

                case 'placement(x,y)':
                  tileRenderOrder.push(this.mapTiles[tileParameter][i]);

                  break;

              }
            }
          }

          break;

        default:
          // Validate data.
          if (typeof this.mapTiles[tileParameter] == 'object') {
            var tileName = tileParameter;

            // Set push empty array and save every element.
            var renderedTile = [];
            for (let i = 0; i < this.mapTiles[tileParameter].length; i++) {
              if (typeof this.mapTiles[tileParameter][i] == 'string') {
                if (this.mapTiles[tileParameter][i].indexOf('image =>')  !== -1) {
                  var image = this.mapTiles[tileParameter][i].replace('image =>', '');
                  while (image.indexOf(' ') !== -1) {
                    image = image.replace(' ', '');
                  }
                }
                if (this.mapTiles[tileParameter][i].indexOf('collision =>')  !== -1) {
                  var collision = this.mapTiles[tileParameter][i];
                  if (collision.indexOf('TRUE')  !== -1) {
                    collision = true;
                  }
                  else {
                    collision = false;
                  }
                }
                if (this.mapTiles[tileParameter][i].indexOf('overflow =>')  !== -1) {
                  var overflow = this.mapTiles[tileParameter][i];
                  if (overflow.indexOf('SHOW')  !== -1) {
                    overflow = 'SHOW';
                  }
                  else {
                    overflow = 'HIDDEN';
                  }
                }
              }
              else if (typeof this.mapTiles[tileParameter][i] == 'object') {
                this.mapTiles[tileParameter][i].forEach(element => {
                  var splitTileParameter = element.split(',');
                  if (collision) {
                    // Check if tile name crash function.
                    if (splitTileParameter[0] != '0x') {
                      this.xVariable = parseInt(splitTileParameter[0]);
                    }
                    else {
                      this.xVariable = 0;
                    }

                    // Append values to render array.
                    collisionTiles.push(this.xVariable, parseInt(splitTileParameter[1]), image, ';');
                  }
                  else {
                    // Check if tile name crash function.
                    if (splitTileParameter[0] != '0x') {
                      this.xVariable = parseInt(splitTileParameter[0]);
                    }
                    else {
                      this.xVariable = 0;
                    }

                    // Append values to render array.
                    nonCollisionTiles.push(this.xVariable, parseInt(splitTileParameter[1]), image, ';');
                  }
                });
              }
            }
          }
      }
    }

    // Build tiles' enclosure.
    let tiles = document.createElement('div');
    tiles.className = 'tiles';
    tiles.style.position = 'fixed';
    tiles.style.display = 'grid';
    // Get map size from parameters.
    for (let key in this.mapSize) {
      switch (key) {
        case 'width':
          var width = this.mapSize[key];

          break;

        case 'height':
          var height = this.mapSize[key];

          break;

        case 'tileSide':
          tileSide = this.mapSize[key];

          break;

        case 'tileSideUnits':
          var tileSideUnits = this.mapSize[key];

          break;

      }
    }

    /*
    * Build parameters.
    */
    this.totalWidth = tileSide * width;
    this.totalHeight = tileSide * height;
    this.initialLeft = 0 - (this.totalWidth / 2) + (screenWidth / 2) - (tileSide / 2);
    this.initialTop = 0 - (this.totalHeight / 2) + (screenHeight / 2) - (tileSide / 2);

    /*
    * Build enclosure parameters.
    */
    // Apply styles to enclosure
    tiles.style.top = this.initialTop + tileSideUnits;
    tiles.style.left = this.initialLeft + tileSideUnits;
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

    /**
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

    /**
     * BUILD EVERYTHING.
     */
    // Append elements.
    body.appendChild(character);
    body.appendChild(tiles);

    // Common styles.
    body.style.margin = '0';

    // Save character offsets after building.
    let characterOffsets = document.getElementById('character').getBoundingClientRect();
    const characterOffsetsTop = characterOffsets.top;
    const characterOffsetsBottom = characterOffsets.bottom;
    const characterOffsetsLeft = characterOffsets.left;
    const characterOffsetsRight = characterOffsets.right;
  }
}

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
new Moonbase (
  '#moonbase',
  characterProperties,
  mapSize,
  mapTiles,
);
*/

new Moonbase (
  target_id_or_class => '#moonbase',
  character_properties => [
    width => null,
    height => null,
    size_units => 'px',
    stay => null,
    move => null,
    speed => 10,
  ],
  map_size => [
    width => 21,
    height => 21,
    tile_side => 40,
    tile_side_units => 'px',
  ],
  map_tiles => [
    collision_map_border => true,
    default_map_border => './assets/rock-wall.png',
    default_map_floor => true,
    default_map_floor_image => './assets/grass.png',
    tiles => [
      wall => [
        image => './assets/rock-wall.png',
        collision => true,
        coordinates => [
          [x => 7, y => 5],
          [x => 8, y => 5],
          [x => 5, y => 3],
          [x => 7, y => 3],
          [x => 8, y => 3],
        ],
      ],
    ],
    grass => [
      image => './assets/grass.png',
      collision => false,
      coordinates => [
        [x => -2, y => 2],
        [x => -1, y => 2],
        [x => 0, y => 2],
        [x => 1, y => 2],
        [x => 1, y => 1],
        [x => 1, y => 0],
        [x => 1, y => -1],
        [x => 0, y => -1],
        [x => -1, y => -1],
        [x => -2, y => -1],
        [x => -2, y => 0],
        [x => -2, y => 1],
      ],
    ],
  ],
);
