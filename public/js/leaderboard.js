document.getElementById('leaderboard-select').onchange = (ev) => {
    let difficulty = ev.target.value;

    switch (difficulty) {
        case 'easy':
            display_records(easy_records);
            break;
        case 'intermediate':
            display_records(intermediate_records);
            break;
        case 'expert':
            display_records(expert_records);
            break;
    }
}

document.getElementById('home-button').addEventListener('click', (ev) => {
    location = '/';
})

let easy_records = [
    {name: 'john', time: '1:00', date: 'Monday, October 8, 2019'},
    {name: 'john', time: '1:00', date: 'Monday, October 8, 2019'},
    {name: 'john', time: '1:00', date: 'Monday, October 8, 2019'},
    {name: 'john', time: '1:00', date: 'Monday, October 8, 2019'},
    {name: 'john', time: '1:00', date: 'Monday, October 8, 2019'}
]

let intermediate_records = [
    {name: 'req', time: '1:41', date: 'Monday, October 8, 2019'},
    {name: 'req', time: '1:14', date: 'Monday, October 8, 2019'},
    {name: 'rweq', time: '1:41', date: 'Monday, October 8, 2019'},
    {name: 'rweq', time: '1:14', date: 'Monday, October 8, 2019'},
    {name: 'req', time: '1:41', date: 'Monday, October 8, 2019'},
    {name: 'req', time: '1:14', date: 'Monday, October 8, 2019'},
    {name: 'rweq', time: '1:41', date: 'Monday, October 8, 2019'},
    {name: 'rweq', time: '1:14', date: 'Monday, October 8, 2019'},
    {name: 'rewq', time: '1:41', date: 'Monday, October 8, 2019'}
]

let expert_records = [
    {name: 'asdf', time: '1:34', date: 'Monday, October 8, 2019'},
    {name: 'asdf', time: '1:43', date: 'Monday, October 8, 2019'},
    {name: 'asdf', time: '1:34', date: 'Monday, October 8, 2019'},
    {name: 'asdf', time: '1:43', date: 'Monday, October 8, 2019'},
    {name: 'asdf', time: '1:34', date: 'Monday, October 8, 2019'}
]

function display_records(records) {
    let rows = document.getElementsByTagName('tr');
    for (let i = rows.length - 1; i >= 0; --i) {
        rows[i].parentNode.removeChild(rows[i]);
    }

    let leaderboard = document.getElementById('leaderboard');
    
    for (let i = 0; i < records.length; ++i) {
        let record = records[i];
        let row = document.createElement('tr');
        
        let name = document.createElement('td');
        name.innerHTML = (i + 1) + '.&nbsp&nbsp' +  record.name;
        row.appendChild(name);
    
        let time = document.createElement('td');
        time.innerHTML = record.time;
        row.appendChild(time);
    
        let date = document.createElement('td');
        date.innerHTML = record.date;
        row.appendChild(date);
        
        leaderboard.appendChild(row);
    }
}

display_records(easy_records);