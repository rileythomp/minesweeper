document.getElementsByTagName('button')[0].addEventListener('click', (ev) => {
    start_game();
})

document.addEventListener('keypress', (ev) => {
    if (ev.which == 13) {
        start_game();
    }
})

document.getElementById('leaderboard-button').addEventListener('click', (ev) => {
    location = '/leaderboard.html'
})

function start_game() {
    let level = document.getElementById('difficulty-select').value;

    let height;
    let width;
    let mines;

    switch (level) {
        case 'custom':
            height = document.getElementById('height').value;
            width = document.getElementById('width').value;
            mines = document.getElementById('mines').value;
            break;
        case 'easy':
            height = 9;
            width = 9;
            mines = 10;
            break;
        case 'intermediate':
            height = 16;
            width = 16;
            mines = 40;
            break;
        case 'expert':
            height = 16;
            width = 30;
            mines = 99;
            break;
    }

    if (height < 1 || height > 30 || height == '') {
        height = 9;
    }
    if (width < 1 || width > 30 || width == '') {
        width = 9;
    }
    if (mines < 0 || mines > height * width || mines == '') {
        mines = Math.floor(0.1 * height * width);
    }

    localStorage.setItem('height', height);
    localStorage.setItem('width', width);
    localStorage.setItem('mines', mines);

    location = '/minesweeper.html';
}