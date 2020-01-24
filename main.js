

let grid;
let grid_new;
let score = 0;

function blankGrid() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}

function setup() {
  createCanvas(400, 400);
  noLoop();
  grid = blankGrid();
  grid_new = blankGrid();
  // console.table(grid);
  insertNumber();
  insertNumber();
  updateCanvas();
}

function insertNumber() {
  let options = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push({
          x: i,
          y: j
        });
      }
    }
  }
  if (options.length > 0) {
    let spot = random(options);
    grid[spot.x][spot.y] = Math.random() > 0.5 ? 2 : 4; //random out of 2 and 4
    grid_new[spot.x][spot.y] = 1;
  }
}

function keyPressed() {
  let flipped = false;
  let rotated = false;
  let played = true; //to prevent game from running if we use anything else except arrows
  switch (keyCode) {
    case DOWN_ARROW: //default is going down only
      // do nothing
      break;
    case UP_ARROW:
      grid = flipGrid(grid);
      flipped = true;
      break;
    case RIGHT_ARROW:
      grid = transposeGrid(grid); 
      rotated = true;
      break;
    case LEFT_ARROW:
      grid = transposeGrid(grid);
      grid = flipGrid(grid);
      rotated = true;
      flipped = true;
      break;
    default:
      played = false;
  }

  if (played) {
    let previous = copyGrid(grid);
    for (let i = 0; i < 4; i++) {
      grid[i] = operate(grid[i]);
    }
    let changed = compare(previous, grid);
    if (flipped) {
      grid = flipGrid(grid);
    }
    if (rotated) {
      grid = transposeGrid(grid);
    }
    if (changed) {
      insertNumber();
    }
    updateCanvas();

  }
}

function updateCanvas() {
  background(255);
  drawGrid();
  select('#score').html(score);
}

function drawGrid() {
  let w = 100;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      noFill();
      strokeWeight(1);
      let val = grid[i][j];
      let s = val.toString();
      if (grid_new[i][j] === 1) {
        stroke(200, 0, 200);
        strokeWeight(16);
        grid_new[i][j] = 0;
      } else {
        strokeWeight(4);
        stroke(0);
      }

      if (val != 0) {
        fill(colorsSizes[s].color);
      } else {
        noFill();
      }
      rect(i * w, j * w, w, w, 30);
      if (val !== 0) {
        textAlign(CENTER, CENTER);
        noStroke();
        fill(0);
        textSize(colorsSizes[s].size);
        text(val, i * w + w / 2, j * w + w / 2);
      }
    }
  }
}



function operate(row) {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
}

// making new array
function slide(row) {
  let arr = row.filter(val => val);
  let missing = 4 - arr.length;
  let zeros = Array(missing).fill(0);
  arr = zeros.concat(arr);
  return arr;
}

// operating on array itself
function combine(row) {
  for (let i = 3; i >= 1; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a == b) {
      row[i] = a + b;
      score += row[i];
      row[i - 1] = 0;
    }
  }
  return row;
}



function compare(a, b) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (a[i][j] !== b[i][j]) {
        return true;
      }
    }
  }
  return false;
}

function copyGrid(grid) {
  let extra = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      extra[i][j] = grid[i][j];
    }
  }
  return extra;
}

function flipGrid(grid) {
  for (let i = 0; i < 4; i++) {
    grid[i].reverse();
  }
  return grid;
}

function transposeGrid(grid) {
  let newGrid = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][i];
    }
  }
  return newGrid;
}
