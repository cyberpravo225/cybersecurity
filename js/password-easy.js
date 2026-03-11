const quizData = [

{
question: "Какой пароль самый безопасный?",
answers: [
"123456",
"password",
"Q7!dF9@kL2",
"qwerty"
],
correct: 2
},

{
question: "Можно ли использовать один и тот же пароль на разных сайтах?",
answers: [
"Да, так удобнее",
"Нет, это небезопасно",
"Можно только на важных сайтах",
"Можно иногда"
],
correct: 1
},

{
question: "Что нужно делать с паролем?",
answers: [
"Рассказывать друзьям",
"Писать в комментариях",
"Хранить в секрете",
"Отправлять по почте"
],
correct: 2
},

{
question: "Какая длина пароля считается более безопасной?",
answers: [
"3 символа",
"5 символов",
"8 символов и больше",
"Любая"
],
correct: 2
},

{
question: "Можно ли использовать своё имя в пароле?",
answers: [
"Да",
"Лучше не стоит",
"Всегда можно",
"Это самый безопасный вариант"
],
correct: 1
},

{
question: "Что такое двухфакторная аутентификация?",
answers: [
"Вход без пароля",
"Дополнительный код подтверждения",
"Пароль из двух слов",
"Использование двух сайтов"
],
correct: 1
},

{
question: "Можно ли сохранять пароль на чужом компьютере?",
answers: [
"Да",
"Нет",
"Только иногда",
"Всегда можно"
],
correct: 1
},

{
question: "Что делать, если пароль узнал кто-то другой?",
answers: [
"Ничего",
"Удалить аккаунт",
"Сменить пароль",
"Сообщить всем"
],
correct: 2
},

{
question: "Как часто желательно менять важные пароли?",
answers: [
"Никогда",
"Раз в несколько месяцев",
"Каждый день",
"Раз в 10 лет"
],
correct: 1
},

{
question: "Можно ли хранить пароль в заметке на телефоне без защиты?",
answers: [
"Да",
"Нет",
"Только иногда",
"Это самый безопасный способ"
],
correct: 1
}

]

let currentQuestion = 0
let score = 0

const quiz = document.getElementById("quiz")
const nextBtn = document.getElementById("next-btn")
const result = document.getElementById("result")

function loadQuestion(){

const q = quizData[currentQuestion]

quiz.innerHTML = `
<h2>${q.question}</h2>
${q.answers.map((a,i)=>`
<label>
<input type="radio" name="answer" value="${i}">
${a}
</label><br>
`).join("")}
`

}

nextBtn.addEventListener("click",()=>{

const selected = document.querySelector("input[name='answer']:checked")

if(!selected) return

if(Number(selected.value) === quizData[currentQuestion].correct){
score++
}

currentQuestion++

if(currentQuestion < quizData.length){
loadQuestion()
}else{
showResult()
}

})

function showResult(){

quiz.style.display = "none"
nextBtn.style.display = "none"

result.style.display = "block"

result.innerHTML = `
<h2>Ваш результат: ${score} / ${quizData.length}</h2>
<p>${getLevel()}</p>
`

}

function getLevel(){

if(score <=3) return "Нужно подтянуть знания 🔐"
if(score <=7) return "Хороший уровень безопасности 👍"
return "Отличный уровень! 🛡️"

}

loadQuestion()
