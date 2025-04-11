var operations = ['+', '-', '*', '/',  '%', '^'];
const input = document.getElementById('number');

input.addEventListener('keydown', function(event) {
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
    //var nums = [];
    //expression.split('').forEach(num => {nums.push(+num)});
    expression = expression.split('');
    keepGoing = true;
    while (keepGoing) {
        equation = `${expression[0]}${operations[0]}${expression[1]}${operations[1]}${expression[2]}${operations[2]}${expression[3]}`;
        if (eval(equation) == 10) {
            console.log(`The equation ${equation} = 10`);
            keepGoing = false;
        }
        operations = shuffleArray(operations);
        //console.log('checking', equation);
    }
}