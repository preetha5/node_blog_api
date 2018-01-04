const STORE = 
	[	
		{
			question: "Which movie is this quote from : 'You can\'t handle the truth' ?",
		 	options: ["A few Good Men", "Rules of Engagement", "The Departed", "Top Gun"],
		 	answer:"A few Good Men",
		},
		{
			question: "Which movie is this quote from : 'Keep you friends close, but enemies closer.' ?",
		 	options: ["The Godfather 1", "The Godfather 2", "The Godfather 3", "GoodFellas"],
		 	answer:"The Godfather 2",
		},
	]

let currentScore =0, currentQuestion = 0;

//Reset the score card and question card
//Go back to first question page
function restartQuiz(){
	console.log('restarting quiz ...');
}

//Show the final score and option to replay the game
function showFinalScore(){
  console.log("showing final score..");
  restartQuiz();
}


//Show the right and wrong answers
//Enable Next question
function showFeedback(correctAnswer){
	let rightString = "<span class='confirm right'>Correct</span>";
	let wrongString = "<span class='confirm wrong'>Incorrect</span>";
	//disable the option buttons
  	$('.option').attr("disabled", "disabled");
  	//Enable the next button
	$('.btnNext').attr("disabled", false);
	let options = $('.option');
	options.each((index,item) => {
		console.log($(item).text());
		if ($(item).text() === correctAnswer){
			console.log("correct");
			$(item).append(rightString);
		} else{
			console.log("wrong");
			$(item).append(wrongString);
		}
	});

}

//Check if the user selected the right answer and
//update score accordingly
function checkAnswer(selectedAnswer, correctAnswer){
	
	console.log(selectedAnswer.text());
	
	selectedAnswer.addClass('highlight');
	//Update Score
	if(selectedAnswer.text() === correctAnswer){
		currentScore++;
	}

	
	// let rightOption =  $('.option[name=correctAnswer]');
	// let wrongOptions =  $('.option').not(rightOption);
	
	// $('.option[name="Top Gun"]').css("color","pink");
	//$(rightOption).append(rightString);
	//$(wrongOptions).append(wrongString);
	updateScoreCard(currentScore, currentQuestion+1);

	showFeedback(correctAnswer);
	//disable choices after user has clicked once
}

//handle the answer submission event
//and update the store accordingly for the question count
//assess the results
//call the showfeedback() to update the user on his selection
function handleButtonClick(){
	$('.optionsForm').on('click', '.option', (e) => {
  	e.stopPropagation();
  	let selectedAnswer = $(e.currentTarget);
  	let correctAnswer = STORE[currentQuestion].answer;
  	checkAnswer(selectedAnswer, correctAnswer);

  	wrongOptions = $('.option')
  });
}

function updateQuestionCard(currentQuestion){
	$('.questionCard').empty();
	const questionCard = `<p>Question: <span class="questionNo">${currentQuestion+1}/10</span></p>`;
	$('.questionCard').html(questionCard);
}

function updateScoreCard(currentScore, currentQuestion){
	$('.scoreCard').empty();
	console.log(currentScore);
	const scoreCard = `<p>Score: <span class="score">${currentScore}/${currentQuestion}</span></p>`;
	$('.scoreCard').html(scoreCard);
}

function updateQuestionBox(STORE, currentQuestion){
	$('.questionBox').empty();
	const questionItem = `<h2>${STORE[currentQuestion].question}</h2>`;
	//const questionItem = `<h2>Which movie is this quote from : 'You can't handle the truth' ?</h2>`;
	$('.questionBox').html(questionItem);
}

function updateOptions(STORE, currentQuestion){
	let list  = STORE[currentQuestion].options ;
	let options ='';
	$('.optionsForm').empty();
	list.forEach(item=>{
		 options += `<button type="button" class="option">${item}</button>`;
	});
	console.log(options);
	const optionsList = `<form action="#" method="post" >
							${options}
							<button type='submit' disabled class="btnNext">Next</button>
						</form>`;
	$('.optionsForm').html(optionsList);
}

//Display the current question and answer, 
//while beginning the quiz it will be the first question
// and the corresponding 4 answer options
function renderQuizPage(){
	console.log("quiz page rendered..");
	updateQuestionBox(STORE, currentQuestion);
	updateOptions(STORE, currentQuestion);
	updateQuestionCard(currentQuestion);
	updateScoreCard(currentScore, currentQuestion);
	handleButtonClick();
	//handleNextButtonClick();
	//for each object in STORE
	//Show the question
	//Show the options
	//update question card
	//show current score
}

//handle the next button clicks
function handleNextButtonClick(){
	$('.optionsForm').on('click', '.btnNext', (e)=>{
		alert('next cli8cked');
		e.preventDefault();
		currentQuestion++;
		console.log(`question number ${currentQuestion}`);
		renderQuizPage();
	});
}

//handle the start button click feature
function startQuiz(){
  console.log("quiz starting....");
  $('.quizHome form').submit((e)=>{
  	e.preventDefault();
  	$('main section').css("display", "none");
  	$('.tracking, .questionBox, .optionsForm').css("display", "block");
  });
  renderQuizPage();
}

function quizApp(){
	startQuiz();
	//handleButtonClick();
	handleNextButtonClick();
	//showFinalScore();
	//restartQuiz();
}

$(quizApp);