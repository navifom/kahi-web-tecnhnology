/* Calculator form (variant 5): validates the input for the chosen
   function, calculates the result and compares it with the typed one. */

var NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseNumber(text) {
    var s = String(text).replace(/^\s+|\s+$/g, '').replace(',', '.');
    if (!NUMBER_PATTERN.test(s)) {
        return null;
    }
    return Number(s);
}

function calculate(func, a, b) {
    switch (func) {
        case 'sum':
            return a + b;
        case 'sub':
            return a - b;
        case 'mul':
            return a * b;
        case 'div':
            return a / b;
        case 'pow':
            return Math.pow(a, b);
        case 'sqrt':
            return Math.sqrt(a);
    }
    return NaN;
}

function formatNumber(value) {
    return String(parseFloat(value.toPrecision(12)));
}

function showMessage(lines, isError) {
    var box = document.getElementById('calc-message');
    box.className = isError ? 'message message-error' : 'message message-ok';
    box.innerHTML = lines.join('<br>');
}

function updateSecondNumber() {
    var form = document.getElementById('calc-form');
    var isSqrt = form.func.value === 'sqrt';
    form.number2.disabled = isSqrt;
    document.getElementById('number2-row').className = isSqrt ? 'form-row form-row-off' : 'form-row';
}

function checkForm() {
    var form = document.getElementById('calc-form');
    var func = form.func.value;
    var errors = [];

    var a = parseNumber(form.number1.value);
    var b = null;
    var entered = parseNumber(form.result.value);

    if (a === null) {
        errors.push('Number 1 must be a valid number.');
    }
    if (func !== 'sqrt') {
        b = parseNumber(form.number2.value);
        if (b === null) {
            errors.push('Number 2 must be a valid number.');
        }
    }
    if (entered === null) {
        errors.push('Result must be a valid number.');
    }

    if (a !== null && func === 'div' && b !== null && b === 0) {
        errors.push('Division by zero: Number 2 must not be 0.');
    }
    if (a !== null && func === 'sqrt' && a <= 0) {
        errors.push('For sqrt Number 1 must be greater than 0.');
    }

    if (errors.length > 0) {
        showMessage(errors, true);
        return false;
    }

    var expected = calculate(func, a, b);
    if (!isFinite(expected)) {
        showMessage(['The operation has no finite result for these numbers.'], true);
        return false;
    }

    var tolerance = 1e-9 * Math.max(1, Math.abs(expected));
    if (Math.abs(expected - entered) > tolerance) {
        showMessage(['The result is wrong: you entered ' + formatNumber(entered) + ', but ' + func + ' gives ' + formatNumber(expected) + '.'], true);
        return false;
    }

    showMessage(['Correct! ' + func + ' = ' + formatNumber(expected)], false);
    return false;
}

window.onload = function () {
    var form = document.getElementById('calc-form');
    form.onsubmit = checkForm;
    form.func.onchange = updateSecondNumber;
    updateSecondNumber();
};
