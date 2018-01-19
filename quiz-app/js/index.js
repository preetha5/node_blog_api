const STORE = 
	[	
		{
			question: 'Which movie is this quote from: "You can\'t handle the truth"?',
		 	options: ["A few Good Men", "Rules of Engagement", "The Departed", "Top Gun"],
		 	answer: "A few Good Men",
		},
		{
			question: 'Which movie is this quote from: "Keep your friends close, but enemies closer."?',
		 	options: ["The Godfather 1", "The Godfather 2", "The Godfather 3", "GoodFellas"],
		 	answer: "The Godfather 2",
		},
		{
			question: 'Which movie is this quote from: "Here\'s Johnny."?',
		 	options: ["The Terminator", "Ghost Rider", "The Shining", "The Treasure Island"],
		 	answer: "The Shining",
		},
		{
			question: 'Which movie is this quote from: "Hasta la vista, baby." ?',
		 	options: ["Terminator", "Terminator 2 : Judgement Day", "Terminator 3: Rise of the Machines", "Total Recall"],
		 	answer: "Terminator 2 : Judgement Day",
		},
		{
			question: '"My Precious" - Who says this in the movie "Lord of the Rings"?',
		 	options: ["Frodo Baggins", "Gimli", "Gollum", "Bilbo Baggins"],
		 	answer: "Gollum",
		},
		{
			question: 'Which movie is this quote from: "Open the pod bay doors, please HAL"?',
		 	options: ["2001 - Space Odyssey", "Gravity", "Planet of the Apes", "Apollo 18"],
		 	answer: "2001 - Space Odyssey",
		},
		{
			question: 'Which of the Star Wars character is famous for this quote: "Do or Do not. There is no try."?',
		 	options: ["Hans Solo", "Luke Skywalker", "Obi-Wan Kenobi", "Yoda"],
		 	answer: "Yoda",
		},
		{
			question: 'Which character from Harry Potter series says: "Of course its happening in your head Harry, but \
			 why on earth should that mean it is not real"?',
		 	options: ["Lord Voldemort", "Hermione Granger", "Albus Dumbledore", "Ron Weasley"],
		 	answer: "Albus Dumbledore",
		},
		{
			question: 'Which movie is this quote from: "Frankly, my dear, I don\'t give a damn."?',
		 	options: ["Gone with the Wind", "Doctor Zhivago", "The Titanic", "Ben-Hur"],
		 	answer: "Gone with the Wind",
		},
		{
			question: 'Which movie is this quote from: "A census taker once tried to test me. I ate his liver with \
			some fava beans and a nice chianti."?',
		 	options: ["Red Dragon", "Psycho", "Zodiac", "Silence of the lambs"],
		 	answer: "Silence of the lambs",
		},
	]

// Initialize the question and score counters
let currentScore = 0, currentQuestion = 0;

//Reset the score card and question card
//Hide the final score page
//Go back to first question page
function restartQuiz(){
	$('.final').on('click', '.replay', (e) => {
  		e.stopPropagation();
	   currentScore = 0, currentQuestion = 0;
	   $('.final').css("display", "none");
	   startQuiz(e);
	})
}

//Show the final score and option to replay the game
function showFinalScore(){
  $('main section').css("display", "none");
  let scoreString = `${currentScore}/${currentQuestion}`;
  $('.final .score').text(scoreString);
  $('.final').css("display", "block");
  restartQuiz();
}


//Show the right and wrong answers
//disable choices after user has clicked once
//Enable Next question
function showFeedback(correctAnswer){
	let rightString = "<span class='confirm right'>Correct</span>";
	let wrongString = "<span class='confirm wrong'>Incorrect</span>";
	//disable the option buttons
  	$('.option').attr("disabled", "disabled");
  	//Enable the next button
	$('.btnNext').attr({"disabled": false,"aria-pressed":false}).focus();
	let options = $('.option');
	options.each((index,item) => {
		if ($(item).text() === correctAnswer){
			$(item).append(rightString);
		} else{
			$(item).append(wrongString);
		}
	});

}

//Check if the user selected the right answer and
//update score accordingly
function checkAnswer(selectedAnswer, correctAnswer){
	selectedAnswer.addClass('highlight');
	//Update Score
	if(selectedAnswer.text() === correctAnswer){
		currentScore++;
	}

	updateScoreCard(currentScore, currentQuestion+1);
	showFeedback(correctAnswer);
}

//handle the answer submission event
//and update the store accordingly for the question count
//assess the results
//call the showfeedback() to update the user on his selection
function handleButtonClick(){
	$('.optionsForm').on('click', '.option', (e) => {
  	e.stopPropagation();
	let selectedAnswer = $(e.currentTarget);
	selectedAnswer.attr('aria-pressed', true); 
  	let correctAnswer = STORE[currentQuestion].answer;
  	checkAnswer(selectedAnswer, correctAnswer);
  });
}

//handle the next button clicks
function handleNextButtonClick(){
	$('.optionsForm').on('click', '.btnNext', (e)=>{
		e.preventDefault();
		$('.btnNext').attr({"aria-pressed":true});
		currentQuestion++;
		//After final question show the score page
		if(currentQuestion >= STORE.length){
			showFinalScore();
		} else{
			renderQuizPage();
		}
		
	});
}

function updateQuestionCard(currentQuestion){
	$('.questionCard').empty();
	const questionCard = `<p>Question: <span class="questionNo">${currentQuestion+1}/10</span></p>`;
	$('.questionCard').html(questionCard);
}

function updateScoreCard(currentScore, currentQuestion){
	$('.scoreCard').empty();
	const scoreCard = `<p>Score: <span class="score">${currentScore}/${currentQuestion}</span></p>`;
	$('.scoreCard').html(scoreCard);
}

function updateQuestionBox(STORE, currentQuestion){
	$('.questionBox').empty();
	const questionItem = `<h2>${STORE[currentQuestion].question}</h2>`;
	$('.questionBox').html(questionItem);
}

function updateOptions(STORE, currentQuestion){
	let list  = STORE[currentQuestion].options ;
	let options ='';
	$('.optionsForm').empty();
	list.forEach(item=>{
		 options += `<button type="button" class="option">${item}</button>`;
	});
	const optionsList = `<form action="#" method="post" >
							<fieldset>
							<legend><h2>${STORE[currentQuestion].question}</h2></legend>
							${options}
							<button type='submit' disabled class="btnNext" 
							aria-label="next question">Next</button>
							</fieldset>
						</form>`;
	$('.optionsForm').html(optionsList);
	//Add autofocus to the first option by default
	$('.optionsForm .option:first').focus();
}

//Display the current question and answer, 
//while beginning the quiz it will be the first question
// and the corresponding 4 answer options
function renderQuizPage(){
	//updateQuestionBox(STORE, currentQuestion);
	updateOptions(STORE, currentQuestion);
	updateQuestionCard(currentQuestion);
	updateScoreCard(currentScore, currentQuestion);
}

//handle the start button click feature
function startQuiz(e){
  	e.preventDefault();
  	$('main section').css("display", "none");
  	$('.tracking, .questionBox, .optionsForm').css("display", "block");
	  renderQuizPage();
	  
}

//This function runs the very first time on clicking Start Quiz button
function quizApp(){
	$('.quizHome form').submit((e)=>startQuiz(e));
	handleButtonClick();
	handleNextButtonClick();
}

$(quizApp);