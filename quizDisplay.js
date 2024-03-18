const getDummyData = () => {
    return {
      formId: 6,
      formName: "tcs",
      createdBy: "guru21792",
      typeId: 1,
      sections: [
          {
              sectionId: null,
              formId: 6,
              sectionLabel: "section A",
              sectionOrder: 1,
              fields: [
                  {
                      fieldId: null,
                      sectionId: null,
                      fieldPrimaryData: "2+2=?",
                      fieldSecondaryData: "Addition",
                      fieldTypeId: 1,
                      isRequired: true,
                      options: [
                          {
                              optionId: null,
                              fieldId: null,
                              optionLabel: 8,
                              isCorrect: false
                          },
                          {
                              optionId: null,
                              fieldId: null,
                              optionLabel: 5,
                              isCorrect: false
                          },
                          {
                              optionId: null,
                              fieldId: null,
                              optionLabel: 4,
                              isCorrect: true
                          },
                          {
                              optionId: null,
                              fieldId: null,
                              optionLabel: 11,
                              isCorrect: false
                          }
                      ]
                  }
              ]
          },
          {
            sectionId: null,
            formId: 6,
            sectionLabel: "section A",
            sectionOrder: 1,
            fields: [
                {
                    fieldId: null,
                    sectionId: null,
                    fieldPrimaryData: "2+2=?",
                    fieldSecondaryData: "Addition",
                    fieldTypeId: 1,
                    isRequired: true,
                    options: [
                        {
                            optionId: null,
                            fieldId: null,
                            optionLabel: 8,
                            isCorrect: false
                        },
                        {
                            optionId: null,
                            fieldId: null,
                            optionLabel: 5,
                            isCorrect: false
                        },
                        {
                            optionId: null,
                            fieldId: null,
                            optionLabel: 4,
                            isCorrect: true
                        },
                        {
                            optionId: null,
                            fieldId: null,
                            optionLabel: 11,
                            isCorrect: false
                        }
                    ]
                }
            ]
          },
          {
            sectionId: null,
            formId: 6,
            sectionLabel: "section A",
            sectionOrder: 1,
            fields: [
                {
                    fieldId: null,
                    sectionId: null,
                    fieldPrimaryData: "2+2=?",
                    fieldSecondaryData: "Addition",
                    fieldTypeId: 1,
                    isRequired: true,
                    options: [
                        {
                            optionId: null,
                            fieldId: null,
                            optionLabel: 8,
                            isCorrect: false
                        },
                        {
                            optionId: null,
                            fieldId: null,
                            optionLabel: 5,
                            isCorrect: false
                        },
                        {
                            optionId: null,
                            fieldId: null,
                            optionLabel: 4,
                            isCorrect: true
                        },
                        {
                            optionId: null,
                            fieldId: null,
                            optionLabel: 11,
                            isCorrect: false
                        }
                    ]
                }
            ]
          },
          {
            sectionId: null,
            formId: 6,
            sectionLabel: "s2",
            sectionOrder: 1,
            fields: [
                {
                    fieldId: null,
                    sectionId: null,
                    fieldPrimaryData: "temp",
                    fieldSecondaryData: "Addition",
                    fieldTypeId: 1,
                    isRequired: true,
                    options: [
                        { optionId: null, fieldId: null, optionLabel: "1", isCorrect: false },
                        { optionId: null, fieldId: null, optionLabel: "23", isCorrect: false },
                        { optionId: null, fieldId: null, optionLabel: "211", isCorrect: true },
                        { optionId: null, fieldId: null, optionLabel: "??", isCorrect: false }
                    ]
                }
            ]
        },
          {
            sectionId: null,
            formId: 6,
            sectionLabel: "s1",
            sectionOrder: 1,
            fields: [
                {
                    fieldId: null,
                    sectionId: null,
                    fieldPrimaryData: "d",
                    fieldTypeId: 2,
                    correctAnswer: "yes",
                    fieldSecondaryData: "Addition",
                    isRequired: true
                },
                {
                    fieldId: null,
                    fieldPrimaryData: "why",
                    fieldSecondaryData: "Addition",
                    fieldTypeId: 2,
                    correctAnswer: "no",
                    isRequired: true
                }
            ]
        }
      ]
    }
  }
  const quizData = getDummyData();
  console.log(quizData);
// function fetchQiuzData() {
//     fetch()
//         .then(response => response.json())
//         .then(data => {
//             // console.log(data);
//             renderQuizzes(data);  
//         });
//         .catch(error => {
//             console.error("Error fetching data: ", error);
//         });
// }
function renderQuizzes(quiz){
    //getting the container where quizzes will be displayed
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';//clearing any previous content

    //mapping the values with the respective quiztype
    const typeMap = {
        1: 'Business',
        2: 'Education',
        3: 'Sports',
        4: 'Other'
    };

    //creating elements to display quiz details
    const quizDiv = document.createElement('div');
    quizDiv.classList.add('quiz');
    const quizTypeName = typeMap[quiz.typeId];
    quizDiv.innerHTML = `<h2>${quiz.formName}</h2>
                        <h4>Type: ${quizTypeName}</h4>`;

    quizDiv.addEventListener('click', () => {
        renderSections(quiz.sections, quiz.formName, quizTypeName);
    });

    //appending the quizDiv to the quizContainer
    quizContainer.appendChild(quizDiv); 
}

function renderSections(sections, quizName, quizTypeName){
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';
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
            <h3><span class="section-number">${sectionNumber}/${totalSections}</span> <span class="section-info">${section.sectionLabel} - ${questionName}</span></h3>
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
                <p>Correct Answer: ${field.correctAnswer}</p>
                `;
                questionDiv.appendChild(answerDiv);
            }
            questionsContainer.appendChild(questionDiv);
        });
        quizContainer.appendChild(sectionDiv);
    });
}
renderQuizzes(quizData);