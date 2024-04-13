let categories = [];

async function getCategoryIds() {
    const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories', { params: { count: 100 } });
    const categoryIds = response.data.map(cat => cat.id);
    return _.sampleSize(categoryIds, 6);
}

async function getCategory(catId) {
    const response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category`, { params: { id: catId } });
    const category = response.data;
    const title = category.title.toUpperCase(); // Capitalizing the title
    return { title: title, clues: _.sampleSize(category.clues, 5) };
}

async function fillTable() {
    $('#jeopardy thead').empty();
    $('#jeopardy tbody').empty();

    let headRow = $('<tr>');
    categories.forEach(cat => {
        headRow.append($('<th>').text(cat.title));
    });
    $('#jeopardy thead').append(headRow);

    for (let i = 0; i < 5; i++) {
        let row = $('<tr>');
        categories.forEach(cat => {
            let cell = $('<td>').text('?').data('clue', cat.clues[i]);
            row.append(cell);
        });
        $('#jeopardy tbody').append(row);
    }
}

function handleClick(evt) {
    let cell = $(evt.target);
    let clue = cell.data('clue');

    if (!clue.showing) {
        cell.text(clue.question);
        clue.showing = 'question';
    } else if (clue.showing === 'question') {
        cell.text(clue.answer);
        clue.showing = 'answer';
    }
}

async function setupAndStart() {
    $('#start').hide();
    categories = [];
    const ids = await getCategoryIds();
    for (let id of ids) {
        categories.push(await getCategory(id));
    }
    fillTable();
    $('#start').show();
}

$(function() {
    $('#start').on('click', setupAndStart);
    $('#jeopardy').on('click', 'td', handleClick);
});