(function () {
    const spanEl = document.querySelector("main h2 span");
    const txtArr = ['한식', '중식', '일식', '양식', '분식', '야식'];
    let index = 0;
    let currentTxt = txtArr[index]?.split("") || [];

    function writeTxt() {
        if (!spanEl || currentTxt.length === 0) return;

        spanEl.textContent += currentTxt.shift();
        if (currentTxt.length !== 0) {
            setTimeout(writeTxt, Math.floor(Math.random() * 300));
        } else {
            currentTxt = spanEl.textContent.split("");
            setTimeout(deleteTxt, 1500);
        }
    }

    function deleteTxt() {
        currentTxt.pop();
        spanEl.textContent = currentTxt.join("");
        if (currentTxt.length !== 0) {
            setTimeout(deleteTxt, Math.floor(Math.random() * 300));
        } else {
            index = (index + 1) % txtArr.length;
            currentTxt = txtArr[index].split("");
            writeTxt();
        }
    }

    if (spanEl) writeTxt();
})();

const headerEl = document.querySelector("header");
window.addEventListener('scroll', function () {
    requestAnimationFrame(scrollCheck);
});
function scrollCheck() {
    let browserScrollY = window.scrollY || window.pageYOffset;
    if (browserScrollY > 0) {
        headerEl.classList.add("active");
    } else {
        headerEl.classList.remove("active");
    }
}

const animationMove = function (selector) {
    const targetEl = document.querySelector(selector);
    const browserScrollY = window.pageYOffset;
    const targetScorllY = targetEl.getBoundingClientRect().top + browserScrollY;
    window.scrollTo({ top: targetScorllY, behavior: 'smooth' });
};

const scrollMoveEl = document.querySelectorAll("[data-animation-scroll='true']");
scrollMoveEl.forEach(el => {
    el.addEventListener('click', function () {
        const target = this.dataset.target;
        animationMove(target);
    });
});

function setupGenderToggle() {
    const genderGroup = document.getElementById('gender-group');
    const genderButtons = genderGroup.querySelectorAll('button');
    const hiddenInput = document.getElementById('gender');

    genderButtons.forEach(button => {
        button.addEventListener('click', function () {
            genderButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            hiddenInput.value = this.dataset.value;
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setupGenderToggle();
});

document.addEventListener('DOMContentLoaded', function () {
    const commentInput = document.getElementById('comment-input');
    const commentSubmit = document.getElementById('comment-submit');
    const commentList = document.getElementById('comment-list');

    function saveComment(comment) {
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        comments.push(comment);
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        commentList.innerHTML = '';
        comments.forEach(comment => {
            const li = document.createElement('li');
            li.textContent = comment;
            commentList.appendChild(li);
        });
    }

    commentSubmit.addEventListener('click', function () {
        const text = commentInput.value.trim();
        if (text === '') return;

        saveComment(text);
        commentInput.value = '';
        loadComments();
    });

    loadComments();
});

document.addEventListener('DOMContentLoaded', function () {
    const commentInput = document.getElementById('comment-input');
    const commentSubmit = document.getElementById('comment-submit');
    const commentList = document.getElementById('comment-list');

    function saveComment(comment) {
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        comments.push(comment);
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        commentList.innerHTML = '';
        comments.forEach(comment => {
            const li = document.createElement('li');
            li.textContent = comment;
            commentList.appendChild(li);
        });
    }

    commentSubmit.addEventListener('click', function () {
        const text = commentInput.value.trim();
        if (text === '') return;
        saveComment(text);
        commentInput.value = '';
        loadComments();
    });

    loadComments();
});




const commentForm = document.getElementById('commentForm');
const nicknameInput = commentForm ? commentForm.querySelector('#nickname') : null;
const commentInput = commentForm ? commentForm.querySelector('#commentInput') : null;
const starRating = commentForm ? commentForm.querySelector('#starRating') : null;
const commentList = document.getElementById('commentList');

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function loadComments() {
    if (!commentList) return;
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    commentList.innerHTML = '';

    comments.forEach((comment, index) => {
        const stars = '★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating);
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${escapeHTML(comment.name)}</strong> <span class="comment-rating">${stars}</span>: ${escapeHTML(comment.text)}
            <span class="comment-actions">
                <button onclick="deleteComment(${index})">삭제</button>
                <button onclick="likeComment(${index})">👍 ${comment.likes || 0}</button>
            </span>
        `;
        commentList.appendChild(li);
    });
}

function likeComment(index) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    if (comments[index].likes === undefined) comments[index].likes = 0;
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

if (commentForm && nicknameInput && commentInput && starRating && commentList) {
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nicknameInput.value.trim();
        const text = commentInput.value.trim();
        const rating = parseInt(starRating.value);

        if (!name || !text || !rating) {
            alert('닉네임, 댓글, 평점을 모두 입력해주세요.');
            return;
        }

        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        comments.push({ name, text, rating, likes: 0 });
        localStorage.setItem('comments', JSON.stringify(comments));

        nicknameInput.value = '';
        commentInput.value = '';
        starRating.value = '';

        loadComments();
    });

    loadComments();
}
