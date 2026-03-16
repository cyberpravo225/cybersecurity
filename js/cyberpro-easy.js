const quizData = [

{
question: "Что означает термин 'уязвимость' в кибербезопасности?",
answers: [
"Ошибка безопасности в системе",
"Тип антивируса",
"Метод шифрования",
"Формат файлов"
],
correct: 0,
explanation: "Уязвимость — это слабое место в системе, которое можно использовать для атаки."
},

{
question: "Что такое 'эксплойт'?",
answers: [
"Исправление ошибки",
"Инструмент использования уязвимости",
"Тип пароля",
"Формат шифрования"
],
correct: 1,
explanation: "Эксплойт — это код или инструмент для использования уязвимости."
},

{
question: "Что означает термин 'брутфорс'?",
answers: [
"Удаление данных",
"Сканирование сети",
"Подбор пароля перебором",
"Шифрование файлов"
],
correct: 2,
explanation: "Brute force — автоматический перебор комбинаций."
},

{
question: "Что такое фаервол (firewall)?",
answers: [
"Программа для шифрования",
"Тип вируса",
"Система фильтрации сетевого трафика",
"Менеджер паролей"
],
correct: 2,
explanation: "Фаервол контролирует сетевые соединения."
},

{
question: "Что означает термин 'malware'?",
answers: [
"Безопасная программа",
"Вредоносное ПО",
"Системное обновление",
"Формат файлов"
],
correct: 1,
explanation: "Malware — общее название вредоносных программ."
},

{
question: "Что такое фишинг?",
answers: [
"Попытка украсть данные через поддельные сайты",
"Тип антивируса",
"Метод шифрования",
"Сканирование сети"
],
correct: 0,
explanation: "Фишинг имитирует настоящие сервисы для кражи данных."
},

{
question: "Что означает термин 'ботнет'?",
answers: [
"Система резервного копирования",
"Сеть заражённых устройств",
"Тип браузера",
"Формат сайта"
],
correct: 1,
explanation: "Ботнет используется для атак и рассылки спама."
},

{
question: "Что такое ransomware?",
answers: [
"Тип антивируса",
"Вирус-вымогатель",
"Система резервного копирования",
"Метод шифрования"
],
correct: 1,
explanation: "Ransomware блокирует файлы и требует выкуп."
},

{
question: "Что означает термин 'патч'?",
answers: [
"Исправление уязвимости",
"Тип вируса",
"Метод взлома",
"Сетевой протокол"
],
correct: 0,
explanation: "Патч закрывает найденную уязвимость."
},

{
question: "Что такое двухфакторная аутентификация?",
answers: [
"Вход с двумя паролями",
"Подтверждение входа вторым фактором",
"Использование двух браузеров",
"Двойная регистрация"
],
correct: 1,
explanation: "Помимо пароля требуется дополнительный код."
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

function getLevel(){

if(score <=3) return "Нужно подтянуть знания"
if(score <=7) return "Хороший уровень"
return "Отличный уровень безопасности"

}

loadQuestion()
function launchConfetti(){

for(let i=0;i<40;i++){

const conf = document.createElement("div")

conf.style.position="fixed"
conf.style.width="8px"
conf.style.height="8px"
conf.style.background=`hsl(${Math.random()*360},70%,60%)`
conf.style.left=Math.random()*100+"%"
conf.style.top="-10px"
conf.style.opacity="0.8"
conf.style.zIndex="999"

conf.style.animation=`fall ${2+Math.random()*2}s linear`

document.body.appendChild(conf)

setTimeout(()=>conf.remove(),4000)

}

}
