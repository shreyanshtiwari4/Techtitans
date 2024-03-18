function onloadMethod(){
    const urlParams = new URLSearchParams(window.location.search);
    const obj = {1:"Business",2:"Education",3:"Sports",4:"others"}
    const userName = urlParams.get("userName");
    window.fetch('http://localhost:3010/getFormId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userName})
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the backend
        console.log(data);
        const quizContainer = document.getElementById("quizContainer");
        data.userName.forEach(param=>{
            const quizDiv = document.createElement('div');
            quizDiv.classList.add('quiz');
            const quizTypeName = obj[param.formType];
            quizDiv.innerHTML = `<h2>${param.formName}</h2>
                                <h4>Type: ${quizTypeName}</h4>`;

            //appending the quizDiv to the quizContainer
            
            quizDiv.addEventListener('click',()=>{window.location.href = `http://127.0.0.1:5500/quizDisplay.html?formId=${param.formId}`});
            quizContainer.appendChild(quizDiv); 
        })

    })
    .catch(error => {
        console.error('Error:', error);
    });

}