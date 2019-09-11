function build_board(length, mines) {
    let board = [];
    
    for (let i = 0; i < length; ++i) {
        let row = []    

        for (let j = 0; j < length; ++j) {
            row.push('');
        }

        board.push(row);
    }

    for (let i = 0; i < mines; ++i) {
        while (true) {
            let row = Math.floor(Math.random() * length)
            let col = Math.floor(Math.random() * length);

            if (board[row][col] != '') {
                continue;
            }
            else {
                board[row][col] = '💣';
                break;
            }
        }
    }

    for (let i = 0; i < length; ++i) {
        for (let j = 0; j < length; ++j) {

            if (board[i][j] == '💣') {
                continue;
            }

            let num_mines = 0;

            if (i > 0 && board[i-1][j] == '💣') {
                num_mines += 1;
            }
            if (i < length-1 && board[i+1][j] == '💣') {
                num_mines += 1;
            }
            if (j > 0 && board[i][j-1] == '💣') {
                num_mines += 1;
            }
            if (j < length-1 && board[i][j+1] == '💣') {
                num_mines += 1;
            }
            if (i > 0 && j > 0 && board[i-1][j-1] == '💣') {
                num_mines += 1;
            }
            if (i > 0 && j < length-1 && board[i-1][j+1] == '💣') {
                num_mines += 1;
            }
            if (i < length-1 && j < length-1 && board[i+1][j+1] == '💣') {
                num_mines += 1;
            }
            if (i < length-1 && j > 0 && board[i+1][j-1] == '💣') {
                num_mines += 1;
            }

            board[i][j] = num_mines;
        }
    }

    return board;
}

let board_model = build_board(20, 50);

const board_length = board_model.length;

let board_view = document.getElementById('board');

function update_cell_view(cell_view, cell_val, cell_model) {
    cell_val.innerHTML = cell_model;
    cell_view.appendChild(cell_val);
    cell_view.removeEventListener('mousedown', handle_click);
    cell_view.style.backgroundColor = 'lightgrey';
    cell_view.classList.add('revealed');
}

function reveal_cells(row, col) {
    let cell_model = board_model[row][col];
    let cell_view = board_view.children[row].children[col];
    let cell_val = document.createElement('span');

    if (cell_view.classList.contains('revealed')) {
        return;
    }

    update_cell_view(cell_view, cell_val, cell_model);

    if (cell_model != '') {
        return
    }
    else {
        if (row > 0) {
            reveal_cells(row - 1, col);
        }
        if (row < board_length-1) {
            reveal_cells(row + 1, col);
        }
        if (col > 0) {
            reveal_cells(row, col - 1);
        }
        if (col < board_length-1) {
            reveal_cells(row, col + 1);
        }
        if (row > 0 && col > 0) {
            reveal_cells(row-1, col-1);
        }
        if (row < board_length-1 && col < board_length - 1) {
            reveal_cells(row+1, col+1);
        }
        if (row > 0 && col < board_length - 1) {
            reveal_cells(row-1, col+1);
        }
        if (row < board_length - 1 && col > 0) {
            reveal_cells(row+1, col-1);
        }
    }
}

// cell_view is the <td></td> element
// cell_val is the <spam></span> inside of cell_view
// cell_model is the value in the matrix
function handle_click(ev) {
    // right mouse click
    if (ev.which == 3) {
        let flag = document.createElement('span');
        flag.innerHTML = '🚩';
        ev.target.appendChild(flag);
        ev.target.removeEventListener('mousedown', handle_click);
        return;
    }

    let row = Number(ev.target.parentNode.id.replace('row', ''));
    let col = Number(ev.target.id.replace('cell', ''));

    if (board_model[row][col] == '💣') {
        console.log("you lose");
    }

    reveal_cells(row, col);
}