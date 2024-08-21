if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

if (!localStorage.getItem('polls')) {
    localStorage.setItem('polls', JSON.stringify([]));
}

// Rekisteröityminen
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('role').value;

    let users = JSON.parse(localStorage.getItem('users'));

    if (users.find(user => user.username === username)) {
        alert('Käyttäjätunnus on jo käytössä.');
    } else {
        users.push({ username, password, role });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Rekisteröinti onnistui!');
        showLoginPage();
    }
});

// Kirjautuminen
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users'));
    let user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMainPage();
    } else {
        alert('Väärä käyttäjätunnus tai salasana.');
    }
});

// Kirjautumis- ja rekisteröitymissivun vaihto
document.getElementById('registerLink').addEventListener('click', showRegisterPage);
document.getElementById('loginLink').addEventListener('click', showLoginPage);

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'none';
}

function showRegisterPage() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'block';
    document.getElementById('mainPage').style.display = 'none';
}

function showMainPage() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('currentUser').textContent = currentUser.username;

    loadPolls();
}

// Äänestyksen luominen
document.getElementById('pollForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const question = document.getElementById('pollQuestion').value;

    let polls = JSON.parse(localStorage.getItem('polls'));
    polls.push({ question, yes: 0, no: 0 });
    localStorage.setItem('polls', JSON.stringify(polls));

    loadPolls();
});

// Äänestysten näyttäminen ja äänestäminen
function loadPolls() {
    const pollsContainer = document.getElementById('pollsContainer');
    pollsContainer.innerHTML = '';

    let polls = JSON.parse(localStorage.getItem('polls'));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    polls.forEach((poll, index) => {
        const pollDiv = document.createElement('div');
        pollDiv.className = 'poll';
        pollDiv.innerHTML = `
            <h4>${poll.question}</h4>
            <p>Kyllä: ${poll.yes} | Ei: ${poll.no}</p>
            <button onclick="vote(${index}, 'yes')">Kyllä</button>
            <button onclick="vote(${index}, 'no')">Ei</button>
        `;

        // Lisää "Poista" -painike, jos käyttäjä on ylläpitäjä
        if (currentUser.role === 'admin') {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Poista';
            deleteButton.style.backgroundColor = '#dc3545';
            deleteButton.onclick = function() {
                deletePoll(index);
            };
            pollDiv.appendChild(deleteButton);
        }

        pollsContainer.appendChild(pollDiv);
    });
}

// Äänestäminen
function vote(index, type) {
    let polls = JSON.parse(localStorage.getItem('polls'));
    if (type === 'yes') {
        polls[index].yes++;
    } else {
        polls[index].no++;
    }
    localStorage.setItem('polls', JSON.stringify(polls));
    loadPolls();
}

// Äänestyksen poistaminen
function deletePoll(index) {
    let polls = JSON.parse(localStorage.getItem('polls'));
    polls.splice(index, 1); // Poistetaan äänestys listasta
    localStorage.setItem('polls', JSON.stringify(polls));
    loadPolls();
}

// Uloskirjautuminen
document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('currentUser');
    showLoginPage();
});

// Sovelluksen aloitus
showLoginPage();