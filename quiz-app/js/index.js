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
//update the score card
//Change button to move to Next question
function showFeedback(){
	console.log("showing the correct answers..");
	//update the score card
}


//handle the answer submission event
//and update the store accordingly for the question count
//assess the results
//call the showfeedback() to update the user on his selection
function handleSubmit(){
	console.log("Answer submitted ....");
}

//Display the current question and answer, 
//while beginning the quiz it will be the first question
// and the corresponding 4 answer options
function renderQuizPage(){
	console.log("quiz page rendered..");
	//update question card
	//show current score
}

//handle the start button click feature
function startQuiz(){
  console.log("quiz starting....");
  renderQuizPage();
}

function quizApp(){
	alert('hello');
	startQuiz();
	renderQuizPage();
	handleSubmit();
	showFeedback();
	showFinalScore();
	restartQuiz();
}

$(quizApp);