const quizData = [

{
question: "Что делает атака 'brute force'?",
answers: [
"Подбирает пароль перебором всех комбинаций",
"Отправляет вирус",
"Удаляет аккаунт",
"Копирует данные сайта"
],
correct: 0,
explanation: "Brute force — это автоматический подбор всех возможных комбинаций пароля."
},

{
question: "Почему длинные пароли безопаснее?",
answers: [
"Их быстрее вводить",
"Количество возможных комбинаций значительно больше",
"Сайт требует длинный пароль",
"Они легче запоминаются"
],
correct: 1,
explanation: "Каждый дополнительный символ резко увеличивает количество возможных комбинаций."
},

{
question: "Что такое утечка паролей?",
answers: [
"Удаление паролей",
"Попадание базы данных с паролями в интернет",
"Ошибка входа",
"Потеря компьютера"
],
correct: 1,
explanation: "При утечке базы данных злоумышленники могут получить тысячи аккаунтов."
},

{
question: "Какой метод хранения паролей используется на безопасных сайтах?",
answers: [
"Открытый текст",
"Шифрование или хэширование",
"Текстовый файл",
"Таблица Excel"
],
correct: 1,
explanation: "Пароли хранятся в виде хэша — математического преобразования."
},

{
question: "Что такое хэширование пароля?",
answers: [
"Удаление пароля",
"Преобразование пароля в специальный код",
"Создание второго пароля",
"Передача пароля администратору"
],
correct: 1,
explanation: "Хэш — это результат математической функции, из которого сложно восстановить исходный пароль."
},

{
question: "Почему нельзя использовать простой пароль даже с двухфакторной защитой?",
answers: [
"Он может быть быстро угадан",
"Он слишком длинный",
"Он не работает",
"Он замедляет интернет"
],
correct: 0,
explanation: "Даже с 2FA слабый пароль остаётся уязвимым."
},

{
question: "Что делает менеджер паролей?",
answers: [
"Удаляет старые аккаунты",
"Генерирует и хранит сложные пароли",
"Взламывает сайты",
"Отправляет пароли друзьям"
],
correct: 1,
explanation: "Менеджеры создают сложные уникальные пароли и хранят их безопасно."
},

{
question: "Почему опасно сохранять пароли в браузере на чужом компьютере?",
answers: [
"Компьютер может выключиться",
"Другой человек сможет войти в аккаунт",
"Сайт перестанет работать",
"Пароль станет длиннее"
],
correct: 1,
explanation: "Любой пользователь устройства сможет получить доступ к аккаунту."
},

{
question: "Что такое 'password reuse'?",
answers: [
"Повторное использование одного пароля на разных сайтах",
"Создание нового пароля",
"Удаление пароля",
"Изменение длины пароля"
],
correct: 0,
explanation: "Это одна из самых частых причин взлома аккаунтов."
},

{
question: "Какой пароль самый безопасный?",
answers: [
"Qwerty123",
"Мойкотик2024",
"X7!sLp9#Qf2@k",
"12345678"
],
correct: 2,
explanation: "Случайная комбинация символов максимально усложняет подбор."
}

]

let currentQuestion = 0
let score = 0
let answered = false

const questionEl = document.getElementById("question")
const answersEl = document.getElementById("answers")
const nextBtn = document.getElementById("next-btn")
const explanationEl = document.getElementById("explanation")
const progressEl = document.getElementById("progress")
const progressFill = document.getElementById("progress-fill")

function loadQuestion(){

answered = false
explanationEl.innerHTML = ""

const q = quizData[currentQuestion]

progressEl.innerHTML = `Вопрос ${currentQuestion+1} из ${quizData.length}`

const progressPercent = (currentQuestion / quizData.length) * 100
progressFill.style.width = progressPercent + "%"

questionEl.innerHTML = q.question

answersEl.innerHTML = ""

q.answers.forEach((answer,index)=>{

const div = document.createElement("div")
div.classList.add("answer-card")
div.innerText = answer

div.onclick = ()=>selectAnswer(div,index)

answersEl.appendChild(div)

})

}

function selectAnswer(card,index){

if(answered) return

answered = true

const q = quizData[currentQuestion]
const cards = document.querySelectorAll(".answer-card")

cards.forEach((c,i)=>{

if(i === q.correct){
c.classList.add("correct")
}

})

if(index === q.correct){

score++

}else{

card.classList.add("wrong")

explanationEl.innerHTML =
`Правильный ответ: <b>${q.answers[q.correct]}</b><br>${q.explanation}`

}

}

nextBtn.onclick = ()=>{

if(!answered) return

currentQuestion++

if(currentQuestion < quizData.length){

loadQuestion()

}else{

showResult()

}

}

document.addEventListener("keydown",(e)=>{

if(e.key === "Enter"){
nextBtn.click()
}

})

function showResult(){

document.getElementById("quiz-container").style.display="none"

const resultCard = document.getElementById("result")
const monkey = document.getElementById("result-monkey")
const title = document.getElementById("result-title")
const scoreText = document.getElementById("result-score")

resultCard.style.display = "block"

scoreText.innerHTML = `Ваш результат: ${score} / ${quizData.length}`

if(score <=4){

title.innerHTML = "Стоит повторить правила безопасности"
monkey.src = "assets/rez1.png"
resultCard.classList.add("result-bad")

}

else if(score <=7){

title.innerHTML = "Неплохо, но можно лучше"
monkey.src = "assets/rez2.png"
resultCard.classList.add("result-mid")

}

else{

title.innerHTML = "Отличный уровень безопасности!"
monkey.src = "assets/rez3.png"
resultCard.classList.add("result-good")

launchConfetti()

}

}

loadQuestion()
