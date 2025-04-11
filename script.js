var operations = ['+', '-', '*', '/', '%', '**'];
const input = document.getElementById('number');
const output = document.querySelector('.output');

input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        calculateResult(input.value);
    }
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

function calculateResult(expression) {
    expression = expression.split('');
    keepGoing = true;
    let attempts = 0;
    const maxAttempts = 10000;

    while (keepGoing) {
        equation = `${expression[0]}${operations[0]}${expression[1]}${operations[1]}${expression[2]}${operations[2]}${expression[3]}`;
        if (eval(equation) == 10) {
            output.innerText = `${equation} = 10`.replace('*', '×').replace('/', '÷').replace('**', '^').replace(/(\d+)%(\d+)/g, 'mod($1, $2)');
            output.style.opacity = 1;
            keepGoing = false;
        }
        operations = shuffleArray(operations);
        expression = shuffleArray(expression);
        attempts++; // Increment the counter
        if (attempts >= maxAttempts) {
            output.innerText = "No solution found after maximum attempts.";
            output.style.opacity = 1;
            keepGoing = false;
        }
    }
}