const registration = document.getElementById("registration");
const tetrisContext = document.getElementById("tetris-context");
const highestScore = document.getElementById("high-score");
const loginName = document.getElementById("login-name");
const playerName = document.getElementById("player");
const playerResult = document.getElementById("count-end");
const dataTable = document.getElementById("data-table");
const image = document.body.style.backgroundImage;

tetrisContext.style.display = "none";
highestScore.style.display = "none";

window.onload = function () {
    loginName.value = readName();
};

document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    savePlayerNickname(loginName.value);
    playerName.innerText = readName();
    isOver = false;

    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "#483D8B";
    registration.style.display = "none";
    tetrisContext.style.display = "block";

    drop();
});


document.getElementById("reset").addEventListener("click", function () {
    location.reload();
});


function savePlayerNickname(username) {
    if (username === "") {
        username = "Player"
    }
    localStorage["tetris.username"] = username;
}

function storeNewLevel(username, score) {
    let recordsTable = getPlayerResults();
    if ((username in recordsTable) && (recordsTable[username] < score) ||
        (!(username in recordsTable))) {
        recordsTable[username] = score;
        localStorage.setItem("tetris.recordsTable", JSON.stringify(recordsTable));
    }
}


function readName() {
    if (localStorage["tetris.username"] !== undefined) {
        return localStorage["tetris.username"];
    }

    return "User"
}

function sortResults() {
    let recordsTable = getPlayerResults();
    let items = Object.keys(recordsTable).map(function (n) {
        return [n, recordsTable[n]];
    });
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    return items;
}

function putRecord() {
    let scores = sortResults();
    let tableHtml = "";
    scores.forEach(function (record) {
        // record: [nickname, bestScore]
        if (record[0] !== undefined) {
            tableHtml += `<tr><td>${record[1]}</td><td>${record[0]}</td></tr>`; // add table row
        }
    });
    dataTable.innerHTML = tableHtml;
}

function getPlayerResults() {
    let recordsTable = localStorage.getItem("tetris.recordsTable");
    if (!recordsTable) {
        return {};
    }
    return JSON.parse(recordsTable);
}

function endGame() {
    tetrisContext.style.display = "none";
    highestScore.style.display = "block";

    document.body.style.backgroundImage = image;

    playerResult.innerText = score;
    storeNewLevel(localStorage["tetris.username"], score);
    putRecord();
}