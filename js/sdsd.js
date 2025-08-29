// 1. 시간대 음식 추천
function timeBasedFood() {
    const hour = new Date().getHours();
    let food = '비빔밥';

    if (hour < 10) food = '토스트';
    else if (hour < 14) food = '김치찌개';
    else if (hour < 18) food = '돈까스';
    else food = '삼겹살';

    document.getElementById('timeFood').textContent = `지금은 👉 ${food} 어때요?`;
}

// 2. 카테고리 음식 추천
const foodCategories = {
    '한식': ['김치찌개', '제육볶음', '불고기', '비빔밥'],
    '중식': ['짜장면', '짬뽕', '탕수육'],
    '일식': ['초밥', '라멘', '돈부리'],
    '분식': ['떡볶이', '김밥', '순대']
};

document.getElementById('categoryBtn').addEventListener('click', () => {
    const selected = document.querySelector('input[name="category"]:checked').value;
    const list = foodCategories[selected];
    const pick = list[Math.floor(Math.random() * list.length)];
    document.getElementById('categoryResult').textContent = `👉 ${pick}`;
});

// 3. 로그인 시스템
const loginSection = document.getElementById('loginSection');
const loginName = document.getElementById('loginName');
const loginBtn = document.getElementById('loginBtn');
const userInfo = document.getElementById('userInfo');
const welcomeMsg = document.getElementById('welcomeMsg');
const logoutBtn = document.getElementById('logoutBtn');

const commentForm = document.getElementById('commentForm');
const nicknameInput = document.getElementById('nickname');
const commentInput = document.getElementById('commentInput');
const commentList = document.getElementById('commentList');

function checkLogin() {
    const loggedUser = localStorage.getItem('loggedInUser');

    if (loggedUser) {
        loginSection.style.display = 'none';
        userInfo.style.display = 'block';
        welcomeMsg.textContent = `${loggedUser}님 환영합니다!`;

        nicknameInput.value = loggedUser;
        nicknameInput.readOnly = true;
        commentInput.disabled = false;
        commentForm.querySelector('button[type="submit"]').disabled = false;
    } else {
        loginSection.style.display = 'block';
        userInfo.style.display = 'none';

        nicknameInput.value = '';
        nicknameInput.readOnly = false;
        commentInput.disabled = true;
        commentForm.querySelector('button[type="submit"]').disabled = true;
    }
}

loginBtn.addEventListener('click', () => {
    const name = loginName.value.trim();
    if (name) {
        localStorage.setItem('loggedInUser', name);
        loginName.value = '';
        checkLogin();
        loadComments();
    } else {
        alert('닉네임을 입력하세요.');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    checkLogin();
});

// 4. 댓글 기능
function loadComments() {
    const saved = JSON.parse(localStorage.getItem('comments') || '[]');
    commentList.innerHTML = '';

    saved.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.name}:</strong> 
            <span class="comment-text" id="comment-text-${index}">${item.text}</span>
            <div class="comment-actions">
                <span>👍 ${item.likes}</span>
                <button onclick="likeComment(${index})">Like</button>
                <button onclick="editComment(${index})">수정</button>
                <button onclick="deleteComment(${index})">삭제</button>
            </div>
        `;
        commentList.appendChild(li);
    });
}

function likeComment(index) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments[index].likes++;
    localStorage.setItem('comments', JSON.stringify(comments));
    loadComments();
}

function deleteComment(index) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.splice(index, 1);
    localStorage.setItem('comments', JSON.stringify(comments));
    loadComments();
}

function editComment(index) {
    const commentSpan = document.getElementById(`comment-text-${index}`);
    const savedComments = JSON.parse(localStorage.getItem('comments') || '[]');

    if (commentSpan.querySelector('textarea')) return;

    const textarea = document.createElement('textarea');
    textarea.value = savedComments[index].text;
    textarea.style.width = '100%';
    textarea.rows = 3;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '저장';
    saveBtn.style.marginLeft = '5px';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '취소';
    cancelBtn.style.marginLeft = '5px';

    commentSpan.innerHTML = '';
    commentSpan.appendChild(textarea);
    commentSpan.appendChild(saveBtn);
    commentSpan.appendChild(cancelBtn);

    saveBtn.onclick = () => {
        const newText = textarea.value.trim();
        if (newText) {
            savedComments[index].text = newText;
            localStorage.setItem('comments', JSON.stringify(savedComments));
            loadComments();
        }
    };

    cancelBtn.onclick = () => {
        loadComments();
    };
}

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!localStorage.getItem('loggedInUser')) {
        alert('로그인 후 댓글을 작성할 수 있습니다.');
        return;
    }

    const name = nicknameInput.value.trim();
    const text = commentInput.value.trim();
    if (!name || !text) return;

    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.push({ name, text, likes: 0 });
    localStorage.setItem('comments', JSON.stringify(comments));

    commentInput.value = '';
    loadComments();
});

// 5. 다크모드
const themeBtn = document.getElementById('themeToggle');

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeBtn.textContent = isDark ? '☀️ 라이트모드' : '🌙 다크모드';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

(function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeBtn.textContent = '☀️ 라이트모드';
    }
})();

// 6. Todolist
let taskCount = 0;

document.getElementById('addTask').addEventListener('click', () => {
    const input = document.getElementById('textinput');
    const taskText = input.value.trim();
    if (taskText === '') return;

    taskCount++;

    const tableBody = document.getElementById('taskTableBody');
    const row = document.createElement('tr');

    const numCell = document.createElement('td');
    numCell.textContent = taskCount;

    const taskCell = document.createElement('td');
    taskCell.textContent = taskText;

    const checkCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
        taskCell.classList.toggle('task-done', checkbox.checked);
    });
    checkCell.appendChild(checkbox);

    row.appendChild(numCell);
    row.appendChild(taskCell);
    row.appendChild(checkCell);
    tableBody.appendChild(row);

    input.value = '';
});

document.getElementById('deleteTask').addEventListener('click', () => {
    const tableBody = document.getElementById('taskTableBody');
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            tableBody.removeChild(row);
        }
    });
});

var listNo = 0;

function addTask() {
    const taskinputEl = document.querySelector("#taskInput");
    const trEl = document.createElement("tr");
    let task = taskinputEl.value.trim();

    if (task == "") {
        alert("할 일을 입력해 주세요.");
        taskinputEl.focus();
        return;
    }

    let html = `<td>${++listNo}</td><td>${task}</td><td><input type="checkbox"></td>`;

    trEl.innerHTML = html;

    document.querySelector("#taskTableBody").appendChild(trEl);

    taskinputEl.value = "";
}
