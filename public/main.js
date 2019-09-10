const board_length = 10;

let board_view = document.getElementById('board');

let board_model = build_board();

// Build board view
for (let i = 0; i < board_length; ++i) {
    let row = document.createElement('tr');
    row.setAttribute('class', 'row');
    row.setAttribute('id', 'row' + i)

    for (let j = 0; j < board_length; ++j) {
        let cell = document.createElement('td');
        cell.setAttribute('class', 'cell');
        cell.setAttribute('id', 'cell' + j);
        cell.addEventListener('mousedown', handle_click);
        row.appendChild(cell);
    }

    board_view.appendChild(row)
}

board_view.addEventListener('contextmenu', function(ev) {ev.preventDefault()})