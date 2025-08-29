function init() {
    console.log("initiolized!");
}

// 1. 원의 넓이
function getCircleArea(r) {
    return r ** 2 * 3.14;
}

// 2. 최대값
const max = function(arr) {
    let result = 0;
    for(let i=0;i<arr.length;i++) {
        if(result < arr[i]) {
            result = arr[i];
        }
    }
    return result;
}

// 3. BMI
// 체질량 지수가 26점 이상이면 비만, 24~25점은 과체중, 18.5~23점은 정상, 18.5점 미만은 저체중
const getBmi = (height, weight) => {
    let heightM = height /100;  // cm -> m로 변환
    let bmi = weight / (heightM ** 2);

    if(bmi >= 26) return "비만";
    else if(bmi >= 24) return "과체중";
    else if(bmi >= 18.5) return "정상";
    else return "저체중";
}

const person = {
    name:{
        firstName:"Gildong",
        lastName:"Hong"
        },
    age:20,
    isAdult:true,
    likes:["apple", "samsung"],
    "phone number":"010-1234-5678",
    printInfo:function() {
            console.log('printInfo');
        }
};

// 소수 판별 함수
function checkPrimeNumber(n) {
    if(n == 1) return false;
    for(let i=2;i<=n-1;i++) {
        if(n % i == 0) return false;
    }
    return true;
}

let cnt = 0;
let sum = 0;
for(let i=1;i<=100;i++) {
    if(checkPrimeNumber(i)) {
        sum += i;
        cnt++;
    }
}
console.log(cnt);

// 팩토리알 함수
function factorial(n) {
    let r = 1;
    for(let i=1;i<=n;i++) r *= i;
    return r;
}

sum = 0;
for(let i=0;i<10;i++) {
    sum += factorial(i);
}
console.log(sum);

function checkTriangle(a,b,c) {
    if(a <= 0 && b <= 0 && c <= 0) return false;
    if(a + b <= c || a + c <= b || b + c <= a) return false;
    return true;
}
