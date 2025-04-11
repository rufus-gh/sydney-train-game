import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <input id="train-number" type="text" placeholder="Enter 4-digit number" />
      <button id="solve-button" type="button">Solve</button>
      <div id="result"></div>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

document.getElementById('solve-button').addEventListener('click', () => {
    const input = document.getElementById('train-number').value;
    const resultDiv = document.getElementById('result');

    if (!/^[0-9]{4}$/.test(input)) {
        resultDiv.textContent = 'Please enter a valid 4-digit number.';
        return;
    }

    const digits = input.split('').map(Number);
    const solutions = solveTrainGame(digits);

    if (solutions.length > 0) {
        resultDiv.innerHTML = solutions.map(eq => `<div>${eq}</div>`).join('');
    } else {
        resultDiv.textContent = 'No solution found.';
    }
});

function solveTrainGame(digits) {
    const operators = ['+', '-', '*', '/', '**', '%'];
    const solutions = [];

    function evaluateExpression(expression) {
        try {
            return eval(expression);
        } catch {
            return null;
        }
    }

    function generateEquations(nums, ops) {
        if (nums.length === 1) {
            const expression = nums[0];
            if (evaluateExpression(expression) === 10) {
                solutions.push(expression);
            }
            return;
        }

        for (let i = 0; i < nums.length - 1; i++) {
            for (const op of ops) {
                const newNums = [...nums];
                const a = newNums.splice(i, 1)[0];
                const b = newNums.splice(i, 1)[0];
                newNums.splice(i, 0, `(${a}${op}${b})`);
                generateEquations(newNums, ops);
            }
        }
    }

    generateEquations(digits, operators);
    return solutions;
}
