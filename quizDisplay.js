
function onloadMethod() {
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get("formId");
    if(formId){
      // fetch the formId details from backend and store in window Quiz Data
      window.fetch('http://localhost:3010/getFormDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({formId})
    })
    .then(response => response.json())
    .then(res => {
      console.log(res);
      const obj = res.data;
      console.log(obj);
      renderQuizzes(res.data);
        // Handle the response from the backend

    })
    .catch(error => {
        console.error('Error:', error);
    });// Let assume got the data from backend using promise.
      // Lets store the data in window object as well as start the form details creation html
      
      // Lets start the form details html creation 
      
    } else {
      alert("Should have formId");
    }
  }
function renderQuizzes(quiz){
    const typeMap = {
        1: 'Business',
        2: 'Education',
        3: 'Sports',
        4: 'Other'
    };
    const quizTypeName = typeMap[quiz.typeId];
    const quizName = quiz.formName;
    const sections = quiz.sections;
    console.log(sections);
    renderSections(sections,quizName,quizTypeName);

}

function renderSections(sections, quizName, quizTypeName){
    const quizContainer = document.getElementById('quizContainer');
    const totalSections = sections.length;

     // Displaying quiz name and type on top
     const quizHeader = document.createElement('div');
     quizHeader.classList.add('quiz-header');
     quizHeader.innerHTML = `
         <h2>${quizName}</h2>
         <h4>Type: ${quizTypeName}</h4>
     `;
     quizContainer.appendChild(quizHeader);
     const questionTypeName = {
        1: 'Multiple Choice Question',
        2: 'True/False Question',
        3: 'Short Answer Question',
        4: 'Long Answer Question'
     }

    sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('section-item');
        let questionName = questionTypeName[section.fields[0].fieldTypeId];
        const sectionNumber = sections.indexOf(section) + 1;
        sectionDiv.innerHTML = `
            <h3><span class="section-number">${sectionNumber}/${totalSections}</span> <span class="section-info">${section.sectionLabel} ( ${questionName} )</span></h3>
            <div class="section-divider"></div>
            <div class="questionContainer"></div>
        `;
       
        const questionsContainer = sectionDiv.querySelector('.questionContainer');
        section.fields.forEach(field => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-item');
            const questionNumber = section.fields.indexOf(field) + 1;
            questionDiv.innerHTML = `
                <h4>Question ${questionNumber}:</h4>
                <label>${field.fieldPrimaryData}</label>
            `;

            if(field.fieldTypeId == 1){
                // Displaying options with indication of correct option
                const optionsContainer = document.createElement('div');
                optionsContainer.classList.add('options-container');
                field.options.forEach((option, index) => {
                    const optionDiv = document.createElement('div');
                    optionDiv.classList.add('option-item');
                    const optionLabel = option.isCorrect ? `<span class="correct-option"> &#x2713;</span>` : '';
                    optionDiv.innerHTML = `
                    <label>
                        ${index + 1}. ${option.optionLabel} ${optionLabel}
                    </label>
                    `;
                    optionsContainer.appendChild(optionDiv);
                });
                questionDiv.appendChild(optionsContainer);
            }else{
                const answerDiv = document.createElement('div');
                answerDiv.classList.add('answer-item');
                answerDiv.innerHTML = `
                <p>Correct Answer: ${field.answer}</p>
                `;
                questionDiv.appendChild(answerDiv);
            }
            questionsContainer.appendChild(questionDiv);
        });
        quizContainer.appendChild(sectionDiv);
    });
}
