class Moonbase {
  constructor(target_selector, character_properties, map_size, map_tiles) {
    document.addEventListener("DOMContentLoaded", function(event) {
      // Get and set target selector global scopes.
      var target_selector_element = document.querySelector(target_selector);;
      var element_width  = target_selector_element.offsetWidth;
      var element_height = target_selector_element.offsetHeight;
      // Get and set character global scopes.
      var character_width = character_properties[0];
      var character_height = character_properties[1];
      var character_size_units = character_properties[2];
      var character_stay_animation_route = character_properties[3];
      var character_move_animation_route = character_properties[4];
      var character_speed = character_properties[5];
      // Get and set map size global scopes.
      var map_width = map_size[0];
      var map_height = map_size[1];
      var tile_side = map_size[2];
      var tile_side_units = map_size[3];
      // Get and set map tiles global scopes.
      var collision_map_border = map_tiles[0];
      var default_map_border_route = map_tiles[1];
      var default_map_floor = map_tiles[2];
      var default_map_floor_image_route = map_tiles[3];
      var rendered_tiles = map_tiles[4];
      //  Build character box and set parameters.
      var character = document.createElement('div');
      character.className = character.id = 'character';

      // Character styles.
      character.style.width = character_width + character_size_units;
      character.style.height = character_height + character_size_units;
      character.style.position = 'fixed';
      character.style.top = 0 + (element_height / 2) - (character_height * (2 / 3)) + character_size_units;
      character.style.left = 0 + (element_width / 2) - (character_width / 2) + character_size_units;
      character.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      character.style.zIndex = '1';

      // Character processing parameters.
      const characterHalfHeight = character_height / 2;
      const characterHalfWidth = character_width / 2;

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
          if (tilesListedOffsetsBottom - characterOffsetsBottom - tile_side < characterHalfHeight && tilesListedOffsetsBottom - characterOffsetsBottom + tile_side > -characterHalfHeight
            && tilesListedOffsetsTop - characterOffsetsTop - tile_side < characterHalfHeight && tilesListedOffsetsTop - characterOffsetsTop - tile_side + 1 > -characterHalfHeight
            && tilesListedOffsetsLeft - characterOffsetsLeft - (tile_side * 0.75) < characterHalfWidth && tilesListedOffsetsLeft - characterOffsetsLeft + (tile_side * 0.75) > -characterHalfWidth
            && tilesListedOffsetsRight - characterOffsetsRight - (tile_side * 0.75) < characterHalfWidth && tilesListedOffsetsRight - characterOffsetsRight + (tile_side * 0.75) > -characterHalfWidth) {
            // Get collision direction.
            if (upKey
              && tilesListedOffsetsTop - characterOffsetsTop <= character_height - tile_side
              && (tilesListedOffsetsLeft - characterOffsetsLeft < tile_side) && (characterOffsetsLeft - tilesListedOffsetsLeft < tile_side)
              && characterOffsetsBottom - tilesListedOffsetsBottom >= 0
              && characterOffsetsRight - tilesListedOffsetsRight < tile_side) {
              // Set collision direction to "top".
              return 'up';
            }
            else if (leftKey
              && tilesListedOffsetsLeft - characterOffsetsLeft <= -tile_side
              && tilesListedOffsetsBottom - characterOffsetsBottom <= tile_side
              && tilesListedOffsetsRight - characterOffsetsRight >= -tile_side
              && tilesListedOffsetsTop - characterOffsetsTop >= tile_side - ((tile_side / 3) * 2)) {
              // Set collision direction to "left".
              return 'left';
            }
            else if (downKey
              && characterOffsetsBottom - tilesListedOffsetsBottom + tile_side <= characterHalfHeight
              && tilesListedOffsetsRight - characterOffsetsRight <= tile_side
              && characterOffsetsTop - tilesListedOffsetsTop <= characterHalfHeight
              && characterOffsetsLeft - tilesListedOffsetsLeft < character_width) {
              // Set collision direction to "down".
              return 'down';
            }
            else if (rightKey
              && characterOffsetsRight - tilesListedOffsetsRight < tile_side
              && tilesListedOffsetsTop - characterOffsetsTop >= tile_side - ((tile_side / 3) * 2)
              && characterOffsetsLeft - tilesListedOffsetsLeft < characterHalfWidth
              && tilesListedOffsetsBottom - characterOffsetsBottom <= tile_side
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
        let newLeft = parseFloat(tiles.style.left) + character_speed;
        tiles.style.left = newLeft + tile_side_units;
      };

      /**
       * MAIN MOVEMENT FUNCTION.
       *
       * Background movement right.
       */
      function moveRight () {
        let newLeft = parseFloat(tiles.style.left) - character_speed;
        tiles.style.left = newLeft + tile_side_units;
      };

      /**
       * MAIN MOVEMENT FUNCTION.
       *
       * Background movement up.
       */
      function moveUp () {
        let newTop = parseFloat(tiles.style.top) + character_speed;
        tiles.style.top = newTop + tile_side_units;
      };

      /**
       * MAIN MOVEMENT FUNCTION.
       *
       * Background movement down.
       */
      function moveDown () {
        let newTop = parseFloat(tiles.style.top) - character_speed;
        tiles.style.top = newTop + tile_side_units;
      };

      /**
       * BUILD TILES PARAMETERS.
       */
      // Get mapping.
      var collisionTiles = [];
      var nonCollisionTiles = [];
      rendered_tiles.forEach(rendered_tile => {
        if (rendered_tile[1] === true) {
          rendered_tile[2].forEach(coordinates => {
            collisionTiles.push(coordinates[0], coordinates[1], rendered_tile[0], ';');
          });
        }
        else {
          rendered_tile[2].forEach(coordinates => {
            nonCollisionTiles.push(coordinates[0], coordinates[1], rendered_tile[0], ';');
          });
        }
      });

      // Build tiles' enclosure.
      let tiles = document.createElement('div');
      tiles.className = 'tiles';
      tiles.style.position = 'fixed';
      tiles.style.display = 'grid';

      // Build parameters.
      var totalWidth = tile_side * map_width;
      var totalHeight = tile_side * map_height;
      var initialLeft = 0 - (totalWidth / 2) + (element_width / 2) - (tile_side / 2);
      var initialTop = 0 - (totalHeight / 2) + (element_height / 2) - (tile_side / 2);

      /**
       * Build enclosure parameters.
       */
      // Apply styles to enclosure
      tiles.style.top = initialTop + tile_side_units;
      tiles.style.left = initialLeft + tile_side_units;
      for (let i = 0; i < map_height; i++) {
        if (i == 0) {
          var gridTemplateRowsCount = tile_side + tile_side_units;
        }
        else {
          gridTemplateRowsCount += ' ' + tile_side + tile_side_units;
        }
      }
      for (let i = 0; i < map_width; i++) {
        if (i == 0) {
          var gridTemplateColumnsCount = tile_side + tile_side_units;
        }
        else {
          gridTemplateColumnsCount += ' ' + tile_side + tile_side_units;
        }
      }
      tiles.style.gridTemplateRows = gridTemplateRowsCount;
      tiles.style.gridTemplateColumns = gridTemplateColumnsCount;

      /**
       * Mapping variables.
       */
      let variableHeight = map_height;
      let variableYMap = Math.round(map_height / 2);
      var tilesList = [];

      /*
      * GENERATE TILES.
      */
      while (variableHeight > 0) {
        // Reset variables for each row.
        let variableWidth = map_width;
        let variableXMap = Math.floor(-map_width / 2);
          
        while (variableWidth > 0) {
          // Default tile variables.
          let collisionDefaultText = false;
          let tileImage = null;

          // Apply collisions for map boundaries if configured.
          if (collision_map_border == true) {
            // Add generic collision properties for top side.
            if (variableYMap == Math.round(map_height / 2)) {
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
            if (variableXMap == -(Math.round(map_width / 2))) {
              collisionTiles.push(variableXMap, variableYMap, ';');
              collisionDefaultText = true;
            }

            // Add tile image for map boundaries.
            if (collisionDefaultText) {
              tileImage = default_map_border_route;
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
            tile.style.backgroundSize = tile_side + 'px ' + tile_side + 'px';
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
          tile.style.width =  tile.style.height = tile_side + tile_side_units;
          tile.style.fontSize = (tile_side / 4) + tile_side_units

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
      target_selector_element.appendChild(character);
      target_selector_element.appendChild(tiles);

      // Common styles.
      target_selector_element.style.margin = '0';

      // Save character offsets after building.
      let characterOffsets = document.getElementById('character').getBoundingClientRect();
      const characterOffsetsTop = characterOffsets.top;
      const characterOffsetsBottom = characterOffsets.bottom;
      const characterOffsetsLeft = characterOffsets.left;
      const characterOffsetsRight = characterOffsets.right;
    });
  };
};

new Moonbase (
  target_selector = '#moonbase',
  character_properties = [
    width = 40,
    height = 60,
    size_units = 'px',
    stay_animation_route = null,
    move_animation_route = null,
    speed = 10,
  ],
  map_size = [
    width = 21,
    height = 21,
    tile_side = 40,
    tile_side_units = 'px',
  ],
  map_tiles = [
    collision_map_border = true,
    default_map_border_route = './assets/Moonbase_floor_model_5b.png',
    default_map_floor = true,
    default_map_floor_image_route = './assets/Moonbase_floor_model_1a.png',
    tiles = [
      /*
      wall = [
        image = './assets/rock-wall.png',
        collision = true,
        coordinates = [
          [x = 7, y = 5],
          [x = 8, y = 5],
          [x = 5, y = 3],
          [x = 7, y = 3],
          [x = 8, y = 3],
        ],
      ],
      grass = [
        image = './assets/grass.png',
        collision = false,
        coordinates = [
          [x = -2, y = 2],
          [x = -1, y = 2],
          [x = 0, y = 2],
          [x = 1, y = 2],
          [x = 1, y = 1],
          [x = 1, y = 0],
          [x = 1, y = -1],
          [x = 0, y = -1],
          [x = -1, y = -1],
          [x = -2, y = -1],
          [x = -2, y = 0],
          [x = -2, y = 1],
        ],
      ],
      */
    ],
  ],
);
