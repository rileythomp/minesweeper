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

const board_length = 20;
const mines = 69;

let board_model = build_board(board_length, mines);

let board_view = document.getElementById('board');

let revealed_cells = 0;

function update_cell_view(cell_view, cell_val, cell_model) {
    cell_val.innerHTML = cell_model;
    if (cell_view.children.length > 0 && cell_view.children[0].innerHTML == '🚩') {
        cell_view.removeChild(cell_view.children[0]);
    }
    cell_view.appendChild(cell_val);
    cell_view.style.backgroundColor = '#4C566A';
    cell_view.classList.add('revealed');

    revealed_cells += 1;

    if (revealed_cells == board_length*board_length - mines) {
        let msg = document.getElementById('game-msg');
        msg.innerHTML = 'You won';
        clearTimeout(t);

        let button = document.getElementById('new-game');
        button.innerHTML = 'Play again';
        button.style.display = 'inline-block';

        for (let i = 0; i < board_length; ++i) {
            for (let j = 0; j < board_length; ++j) {
                let cell = board_view.children[i].children[j];
                cell.removeEventListener('mousedown', handle_click);
            }
        }

        button.addEventListener('click', restart_game);
    }
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

function reset_cells() {
    for (let i = 0; i < board_length; ++i) {
        for (let j = 0; j < board_length; ++j) {
            let cell = board_view.children[i].children[j];

            if (cell.children.length != 0) {
                let child = cell.children[0];
                cell.removeChild(child);
            }

            cell.innerHTML = '';
            cell.style.backgroundColor = '#3B4252';
            cell.classList.remove('revealed');
            cell.addEventListener('mousedown', handle_click);
        }
    }
}

function restart_game() {
    let msg = document.getElementById('game-msg');
    msg.innerHTML = '';

    let button = document.getElementById('new-game');
    button.style.display = 'none';

    board_model = build_board(board_length, mines);
    reset_cells();

    seconds = 0;
    minutes = 0;
    document.getElementById('timer').innerHTML = '00:00';
    first_click = true;
}

function give_up() {
    let msg = document.getElementById('game-msg');
    msg.innerHTML = 'You lost';
    clearTimeout(t);

    let button = document.getElementById('new-game');
    button.innerHTML = 'Play again';
    button.style.display = 'inline-block';
    document.getElementById('give-up').style.display = 'none';

    for (let i = 0; i < board_length; ++i) {
        for (let j = 0; j < board_length; ++j) {
            let cell_view = board_view.children[i].children[j];
            let cell_model = board_model[i][j];
            let cell_val = document.createElement('span');

            if (cell_view.children.length != 0 && cell_view.children[0].innerHTML == '🚩') {
                let child = cell_view.children[0];
                cell_view.removeChild(child);
            }

            if (!cell_view.classList.contains('revealed')) {
                update_cell_view(cell_view, cell_val, cell_model);;
            }
        
            cell_view.removeEventListener('mousedown', handle_click);
        }
    }

    button.addEventListener('click', restart_game);
}

let first_click = true;

// cell_view is the <td></td> element
// cell_val is the <spam></span> inside of cell_view
// cell_model is the value in the matrix
function handle_click(ev) {
    if (first_click) {
        timer();
        document.getElementById('give-up').style.display = 'inline-block';
        first_click = false;
    }
    // right mouse click
    if (ev.which == 3) {
        let target = ev.target;
        if (ev.target.tagName == 'SPAN') {
            target = target.parentElement;
        }

        if (target.children.length == 0) {
            let flag = document.createElement('span');
            flag.innerHTML = '🚩';
            ev.target.appendChild(flag);
        }
        else if (target.children[0].innerHTML == '🚩') {
            let flag = target.children[0];
            target.removeChild(flag);
        }

        return;
    }

    let row = Number(ev.target.parentNode.id.replace('row', ''));
    let col = Number(ev.target.id.replace('cell', ''));

    if (board_model[row][col] == '💣') {
        let msg = document.getElementById('game-msg');
        msg.innerHTML = 'You lost';
        clearTimeout(t);

        let button = document.getElementById('new-game');
        button.innerHTML = 'Play again';
        button.style.display = 'inline-block';
        document.getElementById('give-up').style.display = 'none';

        for (let i = 0; i < board_length; ++i) {
            for (let j = 0; j < board_length; ++j) {
                let cell_view = board_view.children[i].children[j];
                let cell_model = board_model[i][j];
                let cell_val = document.createElement('span');

                if (cell_view.children.length != 0 && cell_view.children[0].innerHTML == '🚩') {
                    let child = cell_view.children[0];
                    cell_view.removeChild(child);
                }

                if (!cell_view.classList.contains('revealed')) {
                    update_cell_view(cell_view, cell_val, cell_model);;
                }
            
                cell_view.removeEventListener('mousedown', handle_click);
            }
        }

        button.addEventListener('click', restart_game);
    }

    reveal_cells(row, col);
}

let t;
let seconds = 0;
let minutes = 0;

function timer() {
    t = setTimeout(add_time, 1000);
}

function format_time(x) {
    return (x > 0 ? (x > 9 ? x : '0' + x) : '00')
}

function add_time() {
    seconds += 1;
    let clock = document.getElementById('timer');

    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }

    clock.innerHTML = format_time(minutes) + ':' + format_time(seconds);

    timer();
}
