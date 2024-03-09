const obj = {};
const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get("userName");
let quizDetailsForm = document.getElementById("quizDetailsForm");
let sectionForm = document.getElementById("sectionForm");
let quizForm = document.getElementById("questionForm");
let sectionCounter = 0;
let questionCounter = 0;

let menu_visible = false;

function submitQuizForm() {

}

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
    const quizType = document.getElementById("quizType").value;
    const quizTime = document.getElementById("quizTime").value;

    if(quizName && quizTime && quizType) {
        obj.formName = quizName;
        obj.formId = null;
        obj.createdBy = userName;
        obj.typeId = quizType;
        obj.duration = quizTime;
        window.fetch('http://localhost:3010/newForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the backend
            obj.formId = data.formId;
            console.log(obj);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        quizDetailsForm.style.display = "none";
        sectionForm.style.display = "block";


    }
        
    else{
        alert("Please fill in all the details inorder to create a quiz.")
    }
}
function addSection() {
    const sectionName = document.getElementById("sectionName").value;
    const questionType = document.getElementById("questionType").value;

    if(sectionName && questionType){
        document.getElementById("sectionForm").style.display = "none";
        sectionCounter++;
       
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
        submitSectionButton.id = `submitSectionButton-${sectionCounter}`;
        submitSectionButton.type = "button";
        submitSectionButton.textContent = "Submit Section";
        submitSectionButton.onclick = function() {
            submitSection(sectionCounter, sectionName, questionType);
        };
        submitSectionButton.style.display = "none";
        questionForm.appendChild(submitSectionButton);

        sectionDiv.appendChild(questionForm);

        document.getElementById("quizForm").appendChild(sectionDiv);

    }else{
        alert("Please fill in all the details to create a new section.");
    }
}
function addQuestion(sectionId, questionType) {
    questionCounter++;

    let questionsContainer = document.getElementById(`questionsContainer-${sectionId}`); //here the labels and inputs will be added based on the type of question

    let questionDiv = document.createElement("div");
    questionDiv.className = "questionDiv";

    let questionLabel = document.createElement("label");
    questionLabel.innerHTML = `Question ${questionCounter}:`;

    let questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.className ="label";
    questionInput.name = `question-${sectionId}-${questionCounter}:`;
    questionInput.id = `question-${sectionId}-${questionCounter}`;

    // Add the 'for' attribute to associate the label with the input field
    questionLabel.setAttribute("for", `question-${questionCounter}`);

    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(questionInput);


    if (questionType == 1) {
       // Add options and radio buttons
        for (let i = 0; i < 4; i++) {
            let optionLabel = document.createElement("label");
            optionLabel.innerHTML = `Option ${i + 1}:`;
            optionLabel.setAttribute("for", `option-${sectionId}-${questionCounter}-${i + 1}`);

            let optionInput = document.createElement("input");
            optionInput.type = "text";
            optionInput.name = `option-${sectionId}-${questionCounter}-${i + 1}`;
            optionInput.id = `option-${sectionId}-${questionCounter}-${i + 1}`;

            let optionRadio = document.createElement("input");
            optionRadio.type = "radio";
            optionRadio.value = `option${i+1}`;
            optionRadio.name = `correct-answer-${sectionId}-${questionCounter}`;
            optionRadio.id = `correct-${sectionId}-${questionCounter}-${i + 1}`;

            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(optionRadio);
            questionDiv.appendChild(optionLabel);
        }
    }else if (questionType == 2 || questionType == 3 || questionType == 4) {
        let answerLabel = document.createElement("label");
        answerLabel.innerHTML = "Correct Answer:";
        answerLabel.setAttribute("for", `answer-${sectionId}-${questionCounter}`);

        let answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.name = `answer-${sectionId}-${questionCounter}`;
        answerInput.id = `answer-${sectionId}-${questionCounter}`;

        questionDiv.appendChild(answerLabel);
        questionDiv.appendChild(answerInput);
    }
    
    questionsContainer.appendChild(questionDiv);

    // Show submit section button after adding the first question
    if (questionCounter == 1) {
        document.getElementById(`submitSectionButton-${sectionId}`).style.display = "block";
    }
}
const _sections = [];
function submitSection(sectionId, sectionName, questionType) {

    let questionsContainer = document.getElementById(`questionsContainer-${sectionId}`);
    let questions = questionsContainer.querySelectorAll(".questionDiv input[type=text], .questionDiv input[type=radio]");
    let allFieldsFilled = true;

    questions.forEach(ques => {
        if (!ques.value && ques.type !== "radio") {
            allFieldsFilled = false;
        }
    });

    if (allFieldsFilled) {
        const sectionObj = {};
        sectionObj.sectionId = null;
        sectionObj.formId = obj.formId;
        sectionObj.sectionLabel = sectionName;
        const _fields = [];
        let ele = document.getElementsByClassName("questionDiv");
        if(ele.length){
            for(let i = 1; i<=ele.length;i++){
                const fieldInstance = {fieldId:null, sectionId:null, fieldTypeId:questionType, isRequired:true};
                let question = document.getElementById(`question-${sectionId}-${i}`);
                fieldInstance.fieldPrimaryData = question.value;
                if(questionType == 1){
                    const _options = [];
                    for(let j=1;j<=4;j++){
                        const optionInstance = {optionId:null, fieldId:null};
                        let option = document.getElementById(`option-${sectionId}-${i}-${j}`);
                        optionInstance.optionLabel = option.value;
                        let answer = document.getElementById(`correct-${sectionId}-${i}-${j}`);
                        if(answer.checked){
                            optionInstance.isCorrect = true;
                        }
                        else{
                            optionInstance.isCorrect = false;
                        }
                        _options.push(optionInstance);

                    }
                    fieldInstance.options = _options;

                }
                else{
                    let answer = document.getElementById(`answer-${sectionId}-${i}`);
                    fieldInstance.correctAnswer = answer.value;
                }
                _fields.push(fieldInstance);
                
            }

        }
        sectionObj.fields = _fields;
        _sections.push(sectionObj);
        console.log(_sections);

        // Hide the current question form
        document.getElementById(`questionForm-${sectionId}`).style.display = "none";

        // Display the newly created section
        const sectionSummary = document.createElement("div");
        sectionSummary.textContent = `Section ${sectionId}: ${sectionName}`;
        sectionSummary.style.border = "2px solid black"; // Add border for visualization

        document.getElementById("quizForm").appendChild(sectionSummary);

        questionCounter = 0;
        questionsContainer.innerHTML = "";

        // Alert the user
        alert(`Section ${sectionId} submitted successfully!`);

        // Show the "Add New Section" and "Submit Quiz" buttons
        document.getElementById("addNewSectionButton").style.display = "block";
        document.getElementById("submitQuizButton").style.display = "block";

        // Move the buttons to the end of the form
        document.getElementById("quizForm").appendChild(document.getElementById("addNewSectionButton"));
        document.getElementById("quizForm").appendChild(document.getElementById("submitQuizButton"));

        
    } else {
        alert("Please fill in all the fields for all questions before submitting the section.");
    }
}
function addNewSection(){
    document.getElementById("sectionForm").style.display = "block";

    document.getElementById("addNewSectionButton").style.display = "none";
    document.getElementById("submitQuizButton").style.display = "none";
}


