document.addEventListener('DOMContentLoaded', () => {
    const carriageInput = document.getElementById('carriageNumber');
    const solveButton = document.getElementById('solveButton');
    const loadingElement = document.getElementById('loading');
    const solutionElement = document.getElementById('solution');
    const errorElement = document.getElementById('error');

    // Add event listeners
    solveButton.addEventListener('click', solveGame);
    carriageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            solveGame();
        }
    });

    // Validate input to allow only numbers
    carriageInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    function solveGame() {
        // Clear previous results
        solutionElement.innerHTML = '';
        errorElement.innerHTML = '';
        
        const carriageNumber = carriageInput.value.trim();
        
        // Input validation
        if (carriageNumber.length !== 4 || !/^\d{4}$/.test(carriageNumber)) {
            errorElement.innerHTML = 'Please enter a valid 4-digit number';
            return;
        }

        // Show loading
        loadingElement.classList.remove('hide');
        
        // Use setTimeout to allow UI to update before running the potentially intensive calculation
        setTimeout(() => {
            try {
                const solution = findSolution(carriageNumber);
                loadingElement.classList.add('hide');
                
                if (solution) {
                    solutionElement.innerHTML = formatSolution(solution);
                } else {
                    errorElement.innerHTML = 'No solution found for this carriage number';
                }
            } catch (error) {
                loadingElement.classList.add('hide');
                errorElement.innerHTML = 'Error calculating solution';
                console.error(error);
            }
        }, 100);
    }

    function findSolution(number) {
        const digits = number.split('').map(d => parseInt(d));
        
        // All possible operations
        const operations = [
            { symbol: '+', func: (a, b) => a + b },
            { symbol: '-', func: (a, b) => a - b },
            { symbol: '×', func: (a, b) => a * b },
            { symbol: '÷', func: (a, b) => b !== 0 ? a / b : null },
            { symbol: '^', func: (a, b) => Math.pow(a, b) },
            { symbol: '%', func: (a, b) => b !== 0 ? a % b : null }
        ];

        // Try all combinations of operations
        for (let op1 of operations) {
            for (let op2 of operations) {
                for (let op3 of operations) {
                    // Try different groupings of operations
                    
                    // ((a op1 b) op2 c) op3 d
                    let result = tryOperation(op3.func, 
                        tryOperation(op2.func, 
                            tryOperation(op1.func, digits[0], digits[1]), 
                            digits[2]
                        ), 
                        digits[3]
                    );
                    if (result === 10) {
                        return {
                            equation: `((${digits[0]} ${op1.symbol} ${digits[1]}) ${op2.symbol} ${digits[2]}) ${op3.symbol} ${digits[3]}`,
                            operations: [op1.symbol, op2.symbol, op3.symbol]
                        };
                    }

                    // (a op1 (b op2 c)) op3 d
                    result = tryOperation(op3.func, 
                        tryOperation(op1.func, digits[0], 
                            tryOperation(op2.func, digits[1], digits[2])
                        ), 
                        digits[3]
                    );
                    if (result === 10) {
                        return {
                            equation: `(${digits[0]} ${op1.symbol} (${digits[1]} ${op2.symbol} ${digits[2]})) ${op3.symbol} ${digits[3]}`,
                            operations: [op1.symbol, op2.symbol, op3.symbol]
                        };
                    }

                    // a op1 ((b op2 c) op3 d)
                    result = tryOperation(op1.func, digits[0], 
                        tryOperation(op3.func, 
                            tryOperation(op2.func, digits[1], digits[2]), 
                            digits[3]
                        )
                    );
                    if (result === 10) {
                        return {
                            equation: `${digits[0]} ${op1.symbol} ((${digits[1]} ${op2.symbol} ${digits[2]}) ${op3.symbol} ${digits[3]})`,
                            operations: [op1.symbol, op2.symbol, op3.symbol]
                        };
                    }

                    // a op1 (b op2 (c op3 d))
                    result = tryOperation(op1.func, digits[0], 
                        tryOperation(op2.func, digits[1], 
                            tryOperation(op3.func, digits[2], digits[3])
                        )
                    );
                    if (result === 10) {
                        return {
                            equation: `${digits[0]} ${op1.symbol} (${digits[1]} ${op2.symbol} (${digits[2]} ${op3.symbol} ${digits[3]}))`,
                            operations: [op1.symbol, op2.symbol, op3.symbol]
                        };
                    }

                    // Try more groupings with different digit orderings
                    // This is just a subset of all possible arrangements
                }
            }
        }
        
        // If no solution was found with the simple patterns above,
        // try a brute force approach with all possible digit permutations
        return findSolutionBruteForce(number);
    }

    function tryOperation(operation, a, b) {
        const result = operation(a, b);
        // Check if result is valid (not null, not NaN, and a finite number)
        if (result === null || isNaN(result) || !isFinite(result)) {
            return null;
        }
        return result;
    }

    function findSolutionBruteForce(number) {
        const digits = number.split('').map(d => parseInt(d));
        const operations = [
            { symbol: '+', func: (a, b) => a + b },
            { symbol: '-', func: (a, b) => a - b },
            { symbol: '×', func: (a, b) => a * b },
            { symbol: '÷', func: (a, b) => b !== 0 && a % b === 0 ? a / b : null },
            { symbol: '^', func: (a, b) => Number.isInteger(Math.log(b) / Math.log(a)) ? Math.pow(a, b) : null },
            { symbol: '%', func: (a, b) => b !== 0 ? a % b : null }
        ];

        // Get all permutations of the digits
        const permutations = getPermutations(digits);

        // Try all permutations with all operations
        for (let perm of permutations) {
            for (let op1 of operations) {
                for (let op2 of operations) {
                    for (let op3 of operations) {
                        // Try different groupings as in the previous function
                        let result = tryOperation(op3.func, 
                            tryOperation(op2.func, 
                                tryOperation(op1.func, perm[0], perm[1]), 
                                perm[2]
                            ), 
                            perm[3]
                        );
                        if (result === 10) {
                            return {
                                equation: `((${perm[0]} ${op1.symbol} ${perm[1]}) ${op2.symbol} ${perm[2]}) ${op3.symbol} ${perm[3]}`,
                                operations: [op1.symbol, op2.symbol, op3.symbol]
                            };
                        }

                        // Try other groupings similar to before
                        result = tryOperation(op3.func, 
                            tryOperation(op1.func, perm[0], 
                                tryOperation(op2.func, perm[1], perm[2])
                            ), 
                            perm[3]
                        );
                        if (result === 10) {
                            return {
                                equation: `(${perm[0]} ${op1.symbol} (${perm[1]} ${op2.symbol} ${perm[2]})) ${op3.symbol} ${perm[3]}`,
                                operations: [op1.symbol, op2.symbol, op3.symbol]
                            };
                        }

                        // More groupings...
                        // This is just a sample, not exhaustive
                    }
                }
            }
        }

        return null; // No solution found
    }

    function getPermutations(arr) {
        if (arr.length <= 1) return [arr];
        
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const current = arr[i];
            const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
            const remainingPerms = getPermutations(remaining);
            for (let perm of remainingPerms) {
                result.push([current, ...perm]);
            }
        }
        return result;
    }

    function formatSolution(solution) {
        // Make the equation more readable with nice styling
        return solution.equation;
    }
});