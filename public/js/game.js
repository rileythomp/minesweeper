let height = Number(localStorage.getItem('height'));
let width = Number(localStorage.getItem('width'));
let mines = Number(localStorage.getItem('mines'));

let board_model = build_board(height, width, mines);

let board_view = document.getElementById('board');

let revealed_cells = 0;

let has_lost = false;

// Build board view
for (let i = 0; i < height; ++i) {
    let row = document.createElement('tr');
    row.setAttribute('class', 'row');
    row.setAttribute('id', 'row' + i)

    for (let j = 0; j < width; ++j) {
        let cell = document.createElement('td');
        cell.setAttribute('class', 'cell');
        cell.setAttribute('id', 'cell' + j);
        cell.addEventListener('mousedown', handle_click);
        row.appendChild(cell);
    }

    board_view.appendChild(row)
}

board_view.addEventListener('contextmenu', function(ev) {ev.preventDefault()})

document.getElementById('give-up').addEventListener('click', give_up);

function build_board(height, width, mines) {
    let board = [];
    
    for (let i = 0; i < height; ++i) {
        let row = []    

        for (let j = 0; j < width; ++j) {
            row.push('');
        }

        board.push(row);
    }

    for (let i = 0; i < mines; ++i) {
        while (true) {
            let row = Math.floor(Math.random() * height)
            let col = Math.floor(Math.random() * width);

            if (board[row][col] != '') {
                continue;
            }
            else {
                board[row][col] = '💣';
                break;
            }
        }
    }

    for (let i = 0; i < height; ++i) {
        for (let j = 0; j < width; ++j) {

            if (board[i][j] == '💣') {
                continue;
            }

            let num_mines = 0;

            if (i > 0 && board[i-1][j] == '💣') {
                num_mines += 1;
            }
            if (i < height-1 && board[i+1][j] == '💣') {
                num_mines += 1;
            }
            if (j > 0 && board[i][j-1] == '💣') {
                num_mines += 1;
            }
            if (j < width-1 && board[i][j+1] == '💣') {
                num_mines += 1;
            }
            if (i > 0 && j > 0 && board[i-1][j-1] == '💣') {
                num_mines += 1;
            }
            if (i > 0 && j < width-1 && board[i-1][j+1] == '💣') {
                num_mines += 1;
            }
            if (i < height-1 && j < width-1 && board[i+1][j+1] == '💣') {
                num_mines += 1;
            }
            if (i < height-1 && j > 0 && board[i+1][j-1] == '💣') {
                num_mines += 1;
            }

            board[i][j] = num_mines;
        }
    }

    return board;
}

function update_cell_view(cell_view, cell_val, cell_model) {
    cell_val.innerHTML = cell_model;
    if (cell_view.children.length > 0 && cell_view.children[0].innerHTML == '🚩') {
        cell_view.removeChild(cell_view.children[0]);
    }
    cell_view.appendChild(cell_val);
    cell_view.style.backgroundColor = '#4C566A';
    cell_view.classList.add('revealed');

    if (!has_lost && revealed_cells == height*width - mines) {
        let msg = document.getElementById('game-msg');
        msg.innerHTML = 'You won';
        clearTimeout(t);

        let button = document.getElementById('new-game');
        button.innerHTML = 'Play again';
        button.style.display = 'inline-block';

        document.getElementById('give-up').style.display = 'none';

        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < width; ++j) {
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

    revealed_cells += 1;

    update_cell_view(cell_view, cell_val, cell_model);

    if (cell_model != '') {
        return
    }
    else {
        if (row > 0) {
            reveal_cells(row - 1, col);
        }
        if (row < height-1) {
            reveal_cells(row + 1, col);
        }
        if (col > 0) {
            reveal_cells(row, col - 1);
        }
        if (col < width-1) {
            reveal_cells(row, col + 1);
        }
        if (row > 0 && col > 0) {
            reveal_cells(row-1, col-1);
        }
        if (row < height-1 && col < width - 1) {
            reveal_cells(row+1, col+1);
        }
        if (row > 0 && col < width - 1) {
            reveal_cells(row-1, col+1);
        }
        if (row < height - 1 && col > 0) {
            reveal_cells(row+1, col-1);
        }
    }
}

function reset_cells() {
    for (let i = 0; i < height; ++i) {
        for (let j = 0; j < width; ++j) {
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
    has_lost = false;
    revealed_cells = 0;
    let msg = document.getElementById('game-msg');
    msg.innerHTML = '';

    let button = document.getElementById('new-game');
    button.style.display = 'none';

    board_model = build_board(height, width, mines);
    reset_cells();

    seconds = 0;
    minutes = 0;
    document.getElementById('timer').innerHTML = '00:00';
    first_click = true;
}

function give_up() {
    has_lost = true;
    let msg = document.getElementById('game-msg');
    msg.innerHTML = 'You lost';
    clearTimeout(t);

    let button = document.getElementById('new-game');
    button.innerHTML = 'Play again';
    button.style.display = 'inline-block';
    document.getElementById('give-up').style.display = 'none';

    for (let i = 0; i < height; ++i) {
        for (let j = 0; j < width; ++j) {
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
        has_lost = true;
        let msg = document.getElementById('game-msg');
        msg.innerHTML = 'You lost';
        clearTimeout(t);

        let button = document.getElementById('new-game');
        button.innerHTML = 'Play again';
        button.style.display = 'inline-block';
        document.getElementById('give-up').style.display = 'none';

        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < width; ++j) {
                let cell_view = board_view.children[i].children[j];
                let cell_model = board_model[i][j];
                let cell_val = document.createElement('span');

                if (cell_view.children.length != 0 && cell_view.children[0].innerHTML == '🚩') {
                    let child = cell_view.children[0];
                    cell_view.removeChild(child);
                }

                if (!cell_view.classList.contains('revealed')) {
                    update_cell_view(cell_view, cell_val, cell_model);
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

document.getElementById('home-button').addEventListener('click', (ev) => {
    location = '/';
})
