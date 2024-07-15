document.addEventListener('DOMContentLoaded', function () {
    const quizLink = document.getElementById('quiz-link');
    const dashboardLink = document.getElementById('dashboard-link');
    const createdQuizLink = document.getElementById('created-quiz-link');
    const contentFrame = document.getElementById('content-frame');

    quizLink.addEventListener('click', function (e) {
        e.preventDefault();
        contentFrame.src = '/html/quizDisplay.html';
        setActiveLink(quizLink);
    });

    dashboardLink.addEventListener('click', function (e) {
        e.preventDefault();
        contentFrame.src = '/html/dashboard.html';
        setActiveLink(dashboardLink);
    });

    createdQuizLink.addEventListener('click', function (e) {
        e.preventDefault();
        contentFrame.src = '/html/student_quiz.html';
        setActiveLink(createdQuizLink);
    });

    // By default, show the student dashboard section
    contentFrame.src = '/html/dashboard.html';
    setActiveLink(dashboardLink);

    function setActiveLink(activeLink) {
        quizLink.classList.remove('active');
        dashboardLink.classList.remove('active');
        createdQuizLink.classList.remove('active');
        activeLink.classList.add('active');
    }
});
