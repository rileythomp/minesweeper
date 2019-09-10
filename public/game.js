function build_board(length, mines) {
    return [
        ['1', '', '', '', 'B', '1', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '1', '', '', '', 'B', '1', ''],
        ['', '', 'B', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', 'B', '', '', '', ''],
        ['1', '1', '', '', '', '1', '', '', '', ''],
        ['', 'B', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', 'B', ''],
        ['', '', '', '', '', '', '', '', '', '1'],
    ]
}

function update_cell_view(cell_view, cell_val, cell_model) {
    cell_val.innerHTML = cell_model;
    cell_view.appendChild(cell_val);
    cell_view.removeEventListener('mousedown', handle_click);
    cell_view.style.backgroundColor = 'lightgrey';
    cell_view.classList.add('revealed');
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

    let cell_model = board_model[row][col];
    let cell_view = ev.target;
    let cell_val = document.createElement('span');

    update_cell_view(cell_view, cell_val, cell_model)

    if (cell_model == '') {
        // recurse in each direction

        // up
        let cur_row = row - 1;
        while (cur_row >= 0) {
            let cell_model = board_model[cur_row][col];
            let cell_view = board_view.children[cur_row].children[col];
            if (cell_view.classList.contains('revealed')) {
                break;
            }
            let cell_val = document.createElement('span');

            update_cell_view(cell_view, cell_val, cell_model)
            
            if (cell_model != '') {
                break;
            }

            cur_row -= 1;
        }

        // down
        cur_row = row + 1;
        while (cur_row <= board_length - 1) {
            let cell_model = board_model[cur_row][col];
            let cell_view = board_view.children[cur_row].children[col];
            if (cell_view.classList.contains('revealed')) {
                break;
            }
            let cell_val = document.createElement('span');

            update_cell_view(cell_view, cell_val, cell_model)

            if (cell_model != '') {
                break;
            }

            cur_row += 1;
        }

        // right
        let cur_col = col + 1;
        while (cur_col <= board_length - 1) {
            let cell_model = board_model[row][cur_col];
            let cell_view = board_view.children[row].children[cur_col];
            if (cell_view.classList.contains('revealed')) {
                break;
            }
            let cell_val = document.createElement('span');

            update_cell_view(cell_view, cell_val, cell_model)

            if (cell_model != '') {
                break;
            }

            cur_col += 1;
        }

        // left
        cur_col = col - 1;
        while (cur_col >= 0) {
            let cell_model = board_model[row][cur_col];
            let cell_view = board_view.children[row].children[cur_col];
            if (cell_view.classList.contains('revealed')) {
                break;
            }
            let cell_val = document.createElement('span');

            update_cell_view(cell_view, cell_val, cell_model)
            
            if (cell_model != '') {
                break;
            }

            cur_col -= 1;
        }

        // left up
        cur_col = col - 1;
        cur_row = row - 1;
        while (cur_col >= 0 && cur_row >= 0) {
            let cell_model = board_model[cur_row][cur_col];
            let cell_view = board_view.children[cur_row].children[cur_col];
            if (cell_view.classList.contains('revealed')) {
                break;
            }
            let cell_val = document.createElement('span');

            update_cell_view(cell_view, cell_val, cell_model)
            
            if (cell_model != '') {
                break;
            }

            cur_col -= 1;
            cur_row -=1 ;
        }

        // right up
        cur_col = col + 1;
        cur_row = row - 1;
        while (cur_col <= board_length - 1 && cur_row >= 0) {
            let cell_model = board_model[cur_row][cur_col];
            let cell_view = board_view.children[cur_row].children[cur_col];
            if (cell_view.classList.contains('revealed')) {
                break;
            }
            let cell_val = document.createElement('span');

            update_cell_view(cell_view, cell_val, cell_model)
            
            if (cell_model != '') {
                break;
            }

            cur_col += 1;
            cur_row -=1 ;
        }

        // left down
        cur_col = col - 1;
        cur_row = row + 1;
        while (cur_col >= 0 && cur_row <= board_length - 1) {
            let cell_model = board_model[cur_row][cur_col];
            let cell_view = board_view.children[cur_row].children[cur_col];
            if (cell_view.classList.contains('revealed')) {
                break;
            }
            let cell_val = document.createElement('span');

            update_cell_view(cell_view, cell_val, cell_model)
            
            if (cell_model != '') {
                break;
            }

            cur_col -= 1;
            cur_row +=1 ;
        }

        // right down
        cur_col = col + 1;
        cur_row = row + 1;
        while (cur_col <= board_length - 1 && cur_row <= board_length - 1) {
            let cell_model = board_model[cur_row][cur_col];
            let cell_view = board_view.children[cur_row].children[cur_col];
            if (cell_view.classList.contains('revealed')) {
                break;
            }
            let cell_val = document.createElement('span');

            update_cell_view(cell_view, cell_val, cell_model)
            
            if (cell_model != '') {
                break;
            }

            cur_col += 1;
            cur_row +=1 ;
        }
    }
}