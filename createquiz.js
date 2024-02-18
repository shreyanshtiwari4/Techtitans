let quizDetailsForm = document.getElementById("quizDetailsForm");
let sectionForm = document.getElementById("sectionForm");
let quizForm = document.getElementById("questionForm");
let sectionCounter = 0;
let questionCounter = 0;

let menu_visible = false;
function toggle_dropdown() {
	let dd = document.querySelector('.dd_wrapper');
	if (menu_visible) {
		dd.classList.remove('show');
		menu_visible = false;
	} else {
		dd.classList.add('show');
		menu_visible = true;
	}
}

const toDashboard = () => {
	window.location = './dashboard.html';
};

const signOut = () => {
	sessionStorage.clear();

	let requestOptions = {
		method: 'GET',
		mode: 'cors',
		credentials: 'include'
	};
	fetch(`${baseURL}/user/signOut`, requestOptions)
		.then(result => result.json())
		.then(res => {
			if (res.STATUS === 1) {
				window.location = 'signIn.html';
			} else {
				alert(res.MESSAGE);
			}
		})
		.catch(error => console.log('error', error));
};


function addQuizDetails() {
    const quizName = document.getElementById("quizName").value;
    const quizType = document.getElementById("quizName").value;
    const quizTime = document.getElementById("quizName").value;

    if(quizName && quizTime && quizType) {
        quizDetailsForm.style.display = "none";
        sectionForm.style.display = "block";
    }else{
        alert("Please fill in all the details inorder to create a quiz.")
    }
}

function addSection() {
    const sectionName = document.getElementById("sectionName").value;
    const questionType = document.getElementById("questionType").value;

    if(sectionName && questionType){
        document.getElementById("sectionForm").style.display = "none";
        sectionCounter++;
        // console.log(sectionName);
        // console.log(sectionCounter);
        let sectionDiv = document.createElement("div");
        sectionDiv.id = `section-${sectionCounter}`;
        sectionDiv.innerHTML = `<h3>Section ${sectionCounter}: ${sectionName}</h3>`;

        let questionForm = document.createElement("form");
        questionForm.id = `questionForm-${sectionCounter}`;

        let questionsContainer = document.createElement("div");
        questionsContainer.id = `questionsContainer-${sectionCounter}`;
        questionForm.appendChild(questionsContainer);

        let addQuestionButton = document.createElement("button");
        addQuestionButton.type = "button";
        addQuestionButton.textContent = "Add Question";
        addQuestionButton.onclick = function() {
            addQuestion(sectionCounter, questionType);
        };
        questionForm.appendChild(addQuestionButton);
        
        let submitSectionButton = document.createElement("button");
        submitSectionButton.type = "button";
        submitSectionButton.textContent = "Submit Section";
        submitSectionButton.onclick = function() {
            submitSection(sectionCounter, sectionName);
        };
        submitSectionButton.style = "none";
        questionForm.appendChild(submitSectionButton);

        sectionDiv.appendChild(questionForm);

        document.getElementById("quizForm").appendChild(sectionDiv);

        // document.getElementById("questionForm").style.display = "block";
    }else{
        alert("Please fill in all the details to create a new section.");
    }
}
function addQuestion(sectionId, questionType) {
    questionCounter++;

    // const questionType = document.getElementById("questionType").value;
    let questionsContainer = document.getElementById(`questionsContainer-${sectionId}`); //here the labels and inputs will be added based on the type of question

    let questionDiv = document.createElement("div");
    questionDiv.className = "questionDiv";

    let questionLabel = document.createElement("label");
    questionLabel.innerHTML = `Question ${questionCounter}:`;

    let questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.name = `question-${sectionId}-${questionCounter}:`;

    // Add the 'for' attribute to associate the label with the input field
    questionLabel.setAttribute("for", `question-${sectionId}-${questionCounter}`);

    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(questionInput);

    if (questionType === "MCQ") {
       // Add options and radio buttons
        for (let i = 0; i < 4; i++) {
            let optionLabel = document.createElement("label");
            optionLabel.innerHTML = `Option ${i + 1}:`;
            let optionInput = document.createElement("input");
            optionInput.type = "text";
            optionInput.name = `option-${sectionId}-${questionCounter}-${i + 1}`;
            let optionRadio = document.createElement("input");
            optionRadio.type = "radio";
            optionRadio.name = `correct-answer-${sectionId}-${questionCounter}`;
            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(optionRadio);
            questionDiv.appendChild(optionLabel);
        }
    }else if (questionType === "ShortAnswer") {
         
        let answerLabel = document.createElement("label");
        answerLabel.innerHTML = "Correct Answer:";

        let answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.name = `answer-${sectionId}-${questionCounter}`;

        questionDiv.appendChild(answerLabel);
        questionDiv.appendChild(answerInput);
    }
    else if (questionType === "truefalse"){
        let answerLabel = document.createElement("label");
        answerLabel.innerHTML = "Correct Answer:";

        let answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.name = `answer-${sectionId}-${questionCounter}`;

        questionDiv.appendChild(answerLabel);
        questionDiv.appendChild(answerInput);
    
    }else if (questionType === "LongAnswer") {
         
        let answerLabel = document.createElement("label");
        answerLabel.innerHTML = "Correct Answer:";

        let answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.name = `answer-${sectionId}-${questionCounter}`;

        questionDiv.appendChild(answerLabel);
        questionDiv.appendChild(answerInput);
    }
    
    questionsContainer.appendChild(questionDiv);

    // Show submit section button after adding the first question
    if (questionCounter === 1) {
        submitSectionButton.style = "block"
    }
}

function submitSection(sectionId, sectionName) {
    // Hide the current question form
    document.getElementById(`questionForm-${sectionId}`).style.display = "none";

    // Display the newly created section
    const sectionSummary = document.createElement("div");
    sectionSummary.textContent = `Section ${sectionId}: ${sectionName}`;
    sectionSummary.style.border = "1px solid black"; // Add border for visualization

    const addSectionButton = document.createElement("button");
    addSectionButton.textContent = "Add New Section";
    addSectionButton.onclick = function() {
        document.getElementById("sectionForm").style.display = "block";
    };
    
    const submitQuizButton = document.createElement("button");
    submitQuizButton.textContent = "Submit Quiz";
    // Append section summary and buttons to the quiz form
    document.getElementById("quizForm").appendChild(sectionSummary);
    document.getElementById("quizForm").appendChild(addSectionButton);
    document.getElementById("quizForm").appendChild(submitQuizButton);

    // Reset questionCounter and clear the form
    questionCounter = 0;
    document.getElementById(`questionsContainer-${sectionId}`).innerHTML = "";

    // Alert the user
    alert(`Section ${sectionId} submitted successfully!`);
}
