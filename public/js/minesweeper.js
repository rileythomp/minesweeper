let height = Number(localStorage.getItem('height'));
let width = Number(localStorage.getItem('width'));
let mines = Number(localStorage.getItem('mines'));

let board_model = build_board(height, width, mines);

let board_view = document.getElementById('board');

let revealed_cells = 0;

let has_lost = false;

for (let i = 0; i < height; ++i) {
    let row = document.createElement('tr');
    row.setAttribute('class', 'row');
    row.setAttribute('id', 'row' + i)

    for (let j = 0; j < width; ++j) {
        let cell = document.createElement('td');
        cell.setAttribute('class', 'cell');
        cell.setAttribute('id', 'cell' + j);
        cell.classList.add('unrevealed');
        cell.addEventListener('mousedown', handle_click);
        row.appendChild(cell);
    }

    board_view.appendChild(row)
}

board_view.addEventListener('contextmenu', function(ev) {ev.preventDefault()})

document.getElementById('give-up').addEventListener('click', give_up);

document.getElementById('hint').addEventListener('click', (ev) => {
    while (true) {
        let row = Math.floor(Math.random() * height)
        let col = Math.floor(Math.random() * width);
        let cell_model = board_model[row][col];
        let cell_view = board_view.children[row].children[col];

        if (cell_model != ' ' && cell_model != '💣' && !cell_view.classList.contains('revealed')) {
            let cell_view = board_view.children[row].children[col];
            cell_view.classList.add('blinker');
            setTimeout(() => {
                cell_view.classList.remove('blinker');
            }, 2000)
            break;
        }
    }
})

function count_surrounding_class(row, col, class_name) {
    let count = 0;
    if (row > 0 && board_view.children[row-1].children[col].classList.contains(class_name)) {
        count += 1;
    }
    if (row < height-1 && board_view.children[row+1].children[col].classList.contains(class_name)) {
        count += 1;
    }
    if (col > 0 && board_view.children[row].children[col-1].classList.contains(class_name)) {
        count += 1;
    }
    if (col < width-1 && board_view.children[row].children[col+1].classList.contains(class_name)) {
        count += 1;
    }
    if (row > 0 && col > 0 && board_view.children[row-1].children[col-1].classList.contains(class_name)) {
        count += 1;
    }
    if (row < height-1 && col < width - 1 && board_view.children[row+1].children[col+1].classList.contains(class_name)) {
        count += 1;
    }
    if (row > 0 && col < width - 1 && board_view.children[row-1].children[col+1].classList.contains(class_name)) {
        count += 1;
    }
    if (row < height - 1 && col > 0 && board_view.children[row+1].children[col-1].classList.contains(class_name)) {
        count += 1;
    }
    return count;
}

function click_surrounding_unrevealed(row, col, class_name) {
    let reveal_coords = [];
    if (row > 0 && board_view.children[row-1].children[col].classList.contains(class_name)) {
        let cell_view =  board_view.children[row-1].children[col];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            reveal_coords.push({row: row - 1, col: col, flag: false});
        }
    }
    if (row < height-1 && board_view.children[row+1].children[col].classList.contains(class_name)) {
        let cell_view =  board_view.children[row+1].children[col];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            reveal_coords.push({row: row + 1, col: col, flag: false});
        }
    }
    if (col > 0 && board_view.children[row].children[col-1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row].children[col-1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            reveal_coords.push({row: row, col: col - 1, flag: false});
        }
    }
    if (col < width-1 && board_view.children[row].children[col+1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row].children[col+1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            reveal_coords.push({row: row, col: col + 1, flag: false});
        }
    }
    if (row > 0 && col > 0 && board_view.children[row-1].children[col-1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row-1].children[col-1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            reveal_coords.push({row: row - 1, col: col - 1, flag: false});
        }
    }
    if (row < height-1 && col < width - 1 && board_view.children[row+1].children[col+1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row+1].children[col+1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            reveal_coords.push({row: row + 1, col: col + 1, flag: false});
        }
    }
    if (row > 0 && col < width - 1 && board_view.children[row-1].children[col+1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row-1].children[col+1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            reveal_coords.push({row: row - 1, col: col + 1, flag: false});
        }
    }
    if (row < height - 1 && col > 0 && board_view.children[row+1].children[col-1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row+1].children[col-1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            reveal_coords.push({row: row + 1, col: col - 1, flag: false});
        }
    }
    return reveal_coords;
}

function flag_surrounding_unrevealed(row, col, class_name) {
    let flag_coords = [];
    if (row > 0 && board_view.children[row-1].children[col].classList.contains(class_name)) {
        let cell_view =  board_view.children[row-1].children[col];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            flag_coords.push({row: row - 1, col: col, flag: true});
        }
    }
    if (row < height-1 && board_view.children[row+1].children[col].classList.contains(class_name)) {
        let cell_view =  board_view.children[row+1].children[col];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            flag_coords.push({row: row + 1, col: col, flag: true});
        }
    }
    if (col > 0 && board_view.children[row].children[col-1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row].children[col-1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            flag_coords.push({row: row, col: col - 1, flag: true});

        }
    }
    if (col < width-1 && board_view.children[row].children[col+1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row].children[col+1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            flag_coords.push({row: row, col: col + 1, flag: true});

        }
    }
    if (row > 0 && col > 0 && board_view.children[row-1].children[col-1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row-1].children[col-1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            flag_coords.push({row: row - 1, col: col - 1, flag: true});
        }
    }
    if (row < height-1 && col < width - 1 && board_view.children[row+1].children[col+1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row+1].children[col+1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            flag_coords.push({row: row + 1, col: col + 1, flag: true});
        }
    }
    if (row > 0 && col < width - 1 && board_view.children[row-1].children[col+1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row-1].children[col+1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            flag_coords.push({row: row - 1, col: col + 1, flag: true});
        }
    }
    if (row < height - 1 && col > 0 && board_view.children[row+1].children[col-1].classList.contains(class_name)) {
        let cell_view =  board_view.children[row+1].children[col-1];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            flag_coords.push({row: row + 1, col: col - 1, flag: true});
        }
    }
    return flag_coords;
}

document.getElementById('solve').addEventListener('click', (ev) => {
    let clicked_last_scan = true;
    let click_coords = [];

    while (clicked_last_scan) {
        clicked_last_scan = false;
        for (let row = 0; row < height; ++row) {
            for (let col = 0; col < width; ++col) {
                let cell_view = board_view.children[row].children[col];
    
                if (cell_view.classList.contains('revealed') && cell_view.children[0].innerHTML != ' ') {
                    let flags = count_surrounding_class(row, col, 'flagged');
                    let unrevealed = count_surrounding_class(row, col, 'unrevealed'); //8 - flags - count_surrounding_class(row, col, 'revealed');
                    let cell_val = Number(cell_view.children[0].innerHTML);
    
                    if (flags + unrevealed == cell_val && unrevealed != 0) {
                        click_coords = click_coords.concat(flag_surrounding_unrevealed(row, col, 'unrevealed'));
                    }
                    else if (flags == cell_val && unrevealed != 0) {
                        click_coords = click_coords.concat(click_surrounding_unrevealed(row, col, 'unrevealed'));   
                    }
                }
    
            }
        }

        if (!clicked_last_scan) {
            break;
        }
    }
    let index = 0;
    let clickint = setInterval(function() {
        if (index >= click_coords.length) {
            clearInterval(clickint);
            return;
        }
        let coord = click_coords[index];
        let mousedown = new Event('mousedown');
        if (coord.flag) {
            mousedown.which = 3;
        }
        let cell_view = board_view.children[coord.row].children[coord.col];
        if (!cell_view.classList.contains('revealed') && !cell_view.classList.contains('flagged')) {
            cell_view.dispatchEvent(mousedown);
            clicked = true;
        }
        index += 1;
    }, 100)
})

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
    cell_val.innerHTML = (cell_model == 0 ? ' ' : cell_model);
    if (cell_view.children.length > 0 && cell_view.children[0].innerHTML == '🚩') {
        cell_view.removeChild(cell_view.children[0]);
    }
    cell_view.appendChild(cell_val);
    cell_view.style.backgroundColor = '#4C566A';
    cell_view.classList.add('revealed');
    cell_view.classList.remove('unrevealed');

    if (!has_lost && revealed_cells == height*width - mines) {
        let msg = document.getElementById('game-msg');
        msg.innerHTML = 'You won';
        clearTimeout(t);

        let button = document.getElementById('new-game');
        button.innerHTML = 'Play again';
        button.style.display = 'inline-block';

        document.getElementById('give-up').style.display = 'none';
        document.getElementById('hint').style.display = 'none';
        document.getElementById('solve').style.display = 'none';

        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < width; ++j) {
                let cell = board_view.children[i].children[j];
                cell.removeEventListener('mousedown', handle_click);
            }
        }

        add_to_leaderboard();

        button.addEventListener('click', restart_game);
    }
}

function add_to_leaderboard() {
    
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
            cell.classList.remove('flagged');
            cell.classList.add('unrevealed');
            cell.addEventListener('mousedown', handle_click);
        }
    }
}

function restart_game() {
    has_lost = false;
    revealed_cells = 0;
    document.getElementById('game-msg').innerHTML = '';
    document.getElementById('new-game').style.display = 'none';

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
    document.getElementById('hint').style.display = 'none';
    document.getElementById('solve').style.display = 'none';

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
        document.getElementById('give-up').style.display = 'block';
        document.getElementById('hint').style.display = 'block';
        document.getElementById('solve').style.display = 'block';
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
            target.classList.add('flagged');
            target.classList.remove('unrevealed');
            target.appendChild(flag);
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
        document.getElementById('hint').style.display = 'none';
        document.getElementById('solve').style.display = 'none';

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
