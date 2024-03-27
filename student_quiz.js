const getDummyData = () => {
    return {
      formId: 6,
      formName: "tcs",
      createdBy: "guru21792",
      typeId: 1,
      duration: 10,
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

let currentSectionIndex = 0;
let totalTime = 0;
let timerInterval;



function renderQuizzes(quiz) {
    // Getting the container where quizzes will be displayed
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = ''; // Clearing any previous content

    // Mapping the values with the respective quiz type
    const typeMap = {
        1: 'Business',
        2: 'Education',
        3: 'Sports',
        4: 'Other'
    };

    // Creating elements to display quiz details
    const quizDiv = document.createElement('div');
    quizDiv.classList.add('quiz');
    const quizTypeName = typeMap[quiz.typeId];
    quizDiv.innerHTML = `<h2>${quiz.formName}</h2>
                        <h4>Type: ${quizTypeName}</h4>`;

    totalTime = quiz.duration;

    // Appending the quizDiv to the quizContainer
    quizContainer.appendChild(quizDiv);

    renderSections(quiz.sections, quiz.formName, quizTypeName);

    const navButtons = document.createElement('div');
    navButtons.classList.add('navigation-buttons');
    navButtons.innerHTML = `
        <button id="prevButton" onclick="prevSection()">Prev</button>
        <button id="nextButton" onclick="nextSection()">Next</button>
        <span id="timer"></span>
    `;
    quizContainer.appendChild(navButtons);

    const submitQuizBtn = document.createElement('button');
    submitQuizBtn.id = 'submitQuizBtn';
    submitQuizBtn.textContent = 'Submit Quiz';
    submitQuizBtn.addEventListener('click', submitQuiz);
    quizContainer.appendChild(submitQuizBtn);

    const sections = document.querySelectorAll('.section-item');
    for (let i = 1; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }
    startTimer();//to add the timer to the quiz
}

function startTimer() {
    const timerDisplay = document.getElementById('timer');
    let timeLeft = totalTime * 60; // Convert minutes to seconds

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timerDisplay.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            // auto submit kr skte hai
            submitAnswers();
        } else {
            timeLeft--;
        }
    }, 1000);
}

function renderSections(sections, quizName, quizTypeName) {
    const quizContainer = document.getElementById('quizContainer');
    const totalSections = sections.length;

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
        // Render questions
        section.fields.forEach(field => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-item');
            const questionNumber = section.fields.indexOf(field) + 1;
            questionDiv.innerHTML = `
                <h4>Question ${questionNumber}:</h4>
                <label>${field.fieldPrimaryData}</label>
            `;

            // Check field type and render accordingly
            if (field.fieldTypeId == 1) {
                // Display question and radio options
                const optionsContainer = document.createElement('div');
                optionsContainer.classList.add('options-container');

                field.options.forEach((option, index) => {
                    const optionDiv = document.createElement('div');
                    optionDiv.classList.add('option-item');

                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `question_${questionNumber}`;
                    input.value = option.optionLabel;

                    const label = document.createElement('label');
                    label.appendChild(input);
                    label.appendChild(document.createTextNode(`${index + 1}. ${option.optionLabel}`));

                    optionDiv.appendChild(label);
                    optionsContainer.appendChild(optionDiv);
                });
                questionDiv.appendChild(optionsContainer);
            } else {
                const inputDiv = document.createElement('div');
                inputDiv.classList.add('answer-item');
                inputDiv.innerHTML =  `
                    <input type="text" class="student-answer" placeholder="Your Answer">
                `;
                questionDiv.appendChild(inputDiv);
            }

            sectionDiv.appendChild(questionDiv);
        });

        // Append section to quiz container
        quizContainer.appendChild(sectionDiv);
    });
}

function renderCurrentSection() {
    const sections = document.querySelectorAll('.section-item');

    sections.forEach((section, index) => {
        if (index === currentSectionIndex) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });

    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    // Enable/disable previous button based on current section index
    prevButton.disabled = currentSectionIndex === 0;

    // Enable/disable next button based on current section index
    nextButton.disabled = currentSectionIndex === sections.length - 1;
}

function prevSection() {
    const sections = document.querySelectorAll('.section-item');
    if (currentSectionIndex > 0) {
        currentSectionIndex--;
        renderCurrentSection();
    }
}


function nextSection() {
    const sections = document.querySelectorAll('.section-item');
    if (currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
        renderCurrentSection();
    }
}

// Example function to submit student answers
function submitQuiz() {

}

renderQuizzes(quizData);

