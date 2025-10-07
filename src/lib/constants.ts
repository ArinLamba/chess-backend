// directions
export const ROOK_DIRS = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
];
export const KNIGHT_MOVES = [
  [-2, -1], // up 2, left 1
  [-2,  1], // up 2, right 1
  [-1, -2], // up 1, left 2
  [-1,  2], // up 1, right 2
  [ 1, -2], // down 1, left 2
  [ 1,  2], // down 1, right 2
  [ 2, -1], // down 2, left 1
  [ 2,  1], // down 2, right 1
];

export const BISHOP_DIRS = [
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

export const QUEEN_DIRS = [...ROOK_DIRS, ...BISHOP_DIRS];
export const KING_DIRS = [...QUEEN_DIRS];