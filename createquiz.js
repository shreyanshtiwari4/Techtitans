const obj = {};
const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get("userName");
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
    const quizType = document.getElementById("quizType").value;
    const quizTime = document.getElementById("quizTime").value;

    if(quizName && quizTime && quizType) {
        obj.formName = quizName;
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
    console.log(questionType);
    

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
            submitSection(sectionCounter, sectionName,questionType);
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
    questionInput.className ="label";
    questionInput.name = `question-${sectionId}-${questionCounter}:`;
    questionInput.id = `question-${questionCounter}`;

    // Add the 'for' attribute to associate the label with the input field
    questionLabel.setAttribute("for", `question-${sectionId}-${questionCounter}`);

    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(questionInput);


    if (questionType == 1) {
       // Add options and radio buttons
        for (let i = 0; i < 4; i++) {
            let optionLabel = document.createElement("label");
            optionLabel.innerHTML = `Option ${i + 1}:`;
            let optionInput = document.createElement("input");
            optionInput.type = "text";
            optionInput.name = `option-${sectionId}-${questionCounter}-${i + 1}`;
            optionInput.id = `option-${questionCounter}-${i+1}`;
            let optionRadio = document.createElement("input");
            optionRadio.type = "radio";
            optionRadio.id = `correct-${questionCounter}-${i+1}`;
            optionRadio.name = `correct-answer-${sectionId}-${questionCounter}`;
            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(optionRadio);
            questionDiv.appendChild(optionLabel);
        }
    }else if (questionType == 2) {
         
        let answerLabel = document.createElement("label");
        answerLabel.innerHTML = "Correct Answer:";

        let answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.name = `answer-${sectionId}-${questionCounter}`;
        answerInput.id = `answer-${questionCounter}`;

        questionDiv.appendChild(answerLabel);
        questionDiv.appendChild(answerInput);
    }
    else if (questionType == 3){
        let answerLabel = document.createElement("label");
        answerLabel.innerHTML = "Correct Answer:";

        let answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.name = `answer-${sectionId}-${questionCounter}`;
        answerInput.id = `answer-${questionCounter}`;

        questionDiv.appendChild(answerLabel);
        questionDiv.appendChild(answerInput);
    
    }else if (questionType == 4) {
         
        let answerLabel = document.createElement("label");
        answerLabel.innerHTML = "Correct Answer:";

        let answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.name = `answer-${sectionId}-${questionCounter}`;
        answerInput.id = `answer-${questionCounter}`;

        questionDiv.appendChild(answerLabel);
        questionDiv.appendChild(answerInput);
    }
    
    questionsContainer.appendChild(questionDiv);

    // Show submit section button after adding the first question
    if (questionCounter === 1) {
        submitSection.style = "block"
    }
}
const _sections = [];
function submitSection(sectionId, sectionName, questionType) {
    // Hide the current question form
    const sectionObj = {};
    sectionObj.sectionId = null;
    sectionObj.formId = obj.formId;
    sectionObj.sectionLabel = sectionName;
    const _fields = [];
    let ele = document.getElementsByClassName("questionDiv");
    if(ele.length){
        for(let i = 1; i<=ele.length;i++){
            console.log("hello");
            const fieldInstance = {fieldId:null, sectionId:null, fieldTypeId:questionType, isRequired:true};
            let question = document.getElementById(`question-${i}`);
            fieldInstance.fieldPrimaryData = question.value;
            if(questionType == 1){
                const _options = [];
                for(let j=1;j<=4;j++){
                    const optionInstance = {optionId:null, fieldId:null};
                    let option = document.getElementById(`option-${i}-${j}`);
                    optionInstance.optionLabel = option.value;
                    let answer = document.getElementById(`correct-${i}-${j}`);
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
                let answer = document.getElementById(`answer-${i}`);
                fieldInstance.correctAnswer = answer.value;
            }
            _fields.push(fieldInstance);
            
        }

    }
    sectionObj.fields = _fields;
    _sections.push(sectionObj);
    console.log(_sections);

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
    //alert(`Section ${sectionId} submitted successfully!`);

}


