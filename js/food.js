// 1번 기능: 시간대 기반 음식 추천
function timeBasedFood() {
    const hour = new Date().getHours();
    let food = '비빔밥';

    if (hour < 10) food = '토스트';
    else if (hour < 14) food = '김치찌개';
    else if (hour < 18) food = '돈까스';
    else food = '삼겹살';

    const timeFoodEl = document.getElementById('timeFood');
    if (timeFoodEl) {
        timeFoodEl.textContent = `지금은 👉 ${food} 어때요?`;
    }
}

// 2번 기능: 카테고리별 랜덤 메뉴 추천 + 다시 고르기 버튼
const foodCategories = {
    '한식': ['김치찌개', '불고기', '비빔밥', '된장찌개'],
    '중식': ['짜장면', '짬뽕', '탕수육', '마파두부'],
    '일식': ['초밥', '라멘', '돈부리', '우동'],
    '분식': ['떡볶이', '순대', '튀김', '김밥'],
    '야식': ['치킨', '피자', '햄버거', '야식 도시락'],
    '양식': ['파스타', '샌드위치', '스테이크', '샐러드']
};

const categorySelect = document.getElementById('categorySelect');
const recommendationArea = document.getElementById('recommendationArea');
const rerollBtn = document.getElementById('rerollBtn');

let currentCategory = null;
let lastPick = null;

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function recommendMenu(category) {
    const menus = foodCategories[category];
    if (!menus || menus.length === 0) {
        recommendationArea.innerHTML = `<p>${escapeHTML(category)} 메뉴가 없습니다.</p>`;
        if (rerollBtn) rerollBtn.style.display = 'none';
        return;
    }

    let pick;
    do {
        pick = menus[Math.floor(Math.random() * menus.length)];
    } while (pick === lastPick && menus.length > 1);

    lastPick = pick;

    recommendationArea.innerHTML = `
        <h3>${escapeHTML(category)} 추천 메뉴</h3>
        <p>👉 ${escapeHTML(pick)}</p>
    `;

    if (rerollBtn) rerollBtn.style.display = 'inline-block';
}

if (categorySelect && recommendationArea && rerollBtn) {
    rerollBtn.style.display = 'none';  // 초기에는 숨김

    categorySelect.addEventListener('change', () => {
        const selectedCategory = categorySelect.value;
        currentCategory = selectedCategory;
        lastPick = null;  // 카테고리 바뀌면 추천 메뉴 초기화

        if (!selectedCategory) {
            recommendationArea.innerHTML = '<p>추천 메뉴가 여기 표시됩니다.</p>';
            rerollBtn.style.display = 'none';
            return;
        }

        recommendMenu(selectedCategory);
    });

    rerollBtn.addEventListener('click', () => {
        if (currentCategory) {
            recommendMenu(currentCategory);
        }
    });
}

if (reviewForm && reviewList) {
    reviewForm.addEventListener('submit', e => {
        e.preventDefault();

        const nickname = reviewForm.nickname.value.trim();
        const text = reviewForm.reviewText.value.trim();
        const rating = parseInt(reviewForm.starRating.value);

        if (!nickname || !text || !rating) {
            alert('모든 항목을 채워주세요.');
            return;
        }

        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviews.push({ nickname, text, rating });

        localStorage.setItem('reviews', JSON.stringify(reviews));

        reviewForm.reset();
        renderReviews();
    });

    renderReviews();
}

// 식단 일기 기능
const dietDiaryForm = document.getElementById('dietDiaryForm');
const dietDiaryList = document.getElementById('dietDiaryList');

function renderDietDiary() {
    if (!dietDiaryList) return;
    const diaries = JSON.parse(localStorage.getItem('dietDiaries') || '[]');
    dietDiaryList.innerHTML = '';

    diaries.forEach(({ date, food, memo }) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="diary-date">${escapeHTML(date)}</span>:
          <span class="diary-food">${escapeHTML(food)}</span>
          <p class="diary-memo">${escapeHTML(memo || '')}</p>
        `;
        dietDiaryList.appendChild(li);
    });
}

if (dietDiaryForm && dietDiaryList) {
    dietDiaryForm.addEventListener('submit', e => {
        e.preventDefault();

        const date = dietDiaryForm.dateInput.value;
        const food = dietDiaryForm.foodInput.value.trim();
        const memo = dietDiaryForm.memoInput.value.trim();

        if (!date || !food) {
            alert('날짜와 먹은 음식은 필수 입력입니다.');
            return;
        }

        const diaries = JSON.parse(localStorage.getItem('dietDiaries') || '[]');
        diaries.push({ date, food, memo });

        localStorage.setItem('dietDiaries', JSON.stringify(diaries));

        dietDiaryForm.reset();
        renderDietDiary();
    });

    renderDietDiary();
}

// 맞춤 추천 기능
const preferenceForm = document.getElementById('preferenceForm');
const customRecommendation = document.getElementById('customRecommendation');

if (preferenceForm && customRecommendation) {
    preferenceForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let preferences = preferenceForm.elements['preference'];
        if (!preferences) {
            customRecommendation.textContent = "선택할 수 있는 카테고리가 없습니다.";
            return;
        }

        const checkedPreferences = (preferences.length === undefined ? [preferences] : Array.from(preferences))
            .filter(input => input.checked)
            .map(input => input.value);

        if (checkedPreferences.length === 0) {
            customRecommendation.textContent = "하나 이상의 카테고리를 선택해 주세요!";
            return;
        }

        const randomCategory = checkedPreferences[Math.floor(Math.random() * checkedPreferences.length)];
        const menuList = foodCategories[randomCategory];
        const randomMenu = menuList[Math.floor(Math.random() * menuList.length)];

        customRecommendation.textContent = `당신을 위한 추천: ${randomCategory} - ${randomMenu}`;
    });
}

// 페이지 로드 시 초기 실행
window.addEventListener('DOMContentLoaded', () => {
    timeBasedFood();
    loadComments();
    renderReviews();
    renderDietDiary();
});
