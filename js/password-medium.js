const quizData = [

{
question: "Почему нельзя использовать один и тот же пароль на разных сайтах?",
answers: [
"Он может забыться",
"Если один сайт взломают — получат доступ к другим аккаунтам",
"Пароль становится длиннее",
"Сайт будет работать медленнее"
],
correct: 1,
explanation: "Мошенники часто проверяют украденные пароли на других сайтах."
},

{
question: "Какой пароль сложнее всего взломать?",
answers: [
"12345678",
"qwerty2024",
"K9!sP#4Lm2",
"password"
],
correct: 2,
explanation: "Сложные пароли содержат буквы, цифры и специальные символы."
},

{
question: "Что лучше использовать для хранения паролей?",
answers: [
"Заметки телефона",
"Блокнот на столе",
"Менеджер паролей",
"Сообщение в мессенджере"
],
correct: 2,
explanation: "Менеджеры паролей шифруют данные и защищают их."
},

{
question: "Что делать если сайт сообщил о взломе базы данных?",
answers: [
"Ничего",
"Удалить компьютер",
"Сменить пароль",
"Создать новый аккаунт"
],
correct: 2,
explanation: "После утечки данных пароль нужно обязательно изменить."
},

{
question: "Почему нельзя использовать имя или дату рождения в пароле?",
answers: [
"Такие пароли длинные",
"Их легко угадать",
"Сайт их не принимает",
"Они плохо запоминаются"
],
correct: 1,
explanation: "Личную информацию легко найти в соцсетях."
},

{
question: "Что делает двухфакторная аутентификация?",
answers: [
"Создаёт второй пароль",
"Удаляет старый пароль",
"Добавляет дополнительный код подтверждения",
"Ускоряет вход"
],
correct: 2,
explanation: "После ввода пароля требуется код из SMS или приложения."
},

{
question: "Какой пароль безопаснее?",
answers: [
"котик123",
"Иван2008",
"F7#sP!9LmQ",
"qwerty123"
],
correct: 2,
explanation: "Случайные символы делают пароль намного сложнее для взлома."
},

{
question: "Почему нельзя сохранять пароль на чужом компьютере?",
answers: [
"Компьютер может сломаться",
"Другой человек сможет войти в аккаунт",
"Пароль станет длиннее",
"Это запрещено интернетом"
],
correct: 1,
explanation: "Любой пользователь компьютера сможет получить доступ к аккаунту."
},

{
question: "Что нужно сделать если пароль случайно сообщили другому человеку?",
answers: [
"Ничего",
"Сразу сменить пароль",
"Удалить сайт",
"Создать новый компьютер"
],
correct: 1,
explanation: "Пароль должен быть известен только владельцу аккаунта."
},

{
question: "Какой способ создания пароля безопаснее?",
answers: [
"Использовать слово",
"Использовать случайную комбинацию символов",
"Использовать дату рождения",
"Использовать имя"
],
correct: 1,
explanation: "Случайные комбинации намного сложнее подобрать."
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
const resultEl = document.getElementById("result")

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
