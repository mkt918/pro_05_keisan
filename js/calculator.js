/**
 * IT基礎学習 - 練習問題用 共通電卓コンポーネント
 */

class QuizCalculator {
    constructor() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
        this.history = '';

        this.init();
    }

    init() {
        this.createUI();
        this.bindEvents();
    }

    createUI() {
        // Toggle Button
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'calc-toggle-btn';
        toggleBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        `;
        document.body.appendChild(toggleBtn);

        // Modal
        const modal = document.createElement('div');
        modal.className = 'calc-modal';
        modal.id = 'quiz-calc-modal';
        modal.innerHTML = `
            <div class="calc-header">
                <h4>CALCULATOR</h4>
                <div class="calc-close" id="calc-close">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
            <div class="calc-display-area">
                <div class="calc-history" id="calc-history"></div>
                <div id="calc-display">0</div>
            </div>
            <div class="calc-grid">
                <button class="calc-btn ac" data-type="clear">AC</button>
                <button class="calc-btn op" data-type="operator" data-val="/">÷</button>
                <button class="calc-btn op" data-type="operator" data-val="*">×</button>
                <button class="calc-btn op" data-type="delete">DEL</button>
                
                <button class="calc-btn" data-type="number" data-val="7">7</button>
                <button class="calc-btn" data-type="number" data-val="8">8</button>
                <button class="calc-btn" data-type="number" data-val="9">9</button>
                <button class="calc-btn op" data-type="operator" data-val="-">-</button>
                
                <button class="calc-btn" data-type="number" data-val="4">4</button>
                <button class="calc-btn" data-type="number" data-val="5">5</button>
                <button class="calc-btn" data-type="number" data-val="6">6</button>
                <button class="calc-btn op" data-type="operator" data-val="+">+</button>
                
                <button class="calc-btn" data-type="number" data-val="1">1</button>
                <button class="calc-btn" data-type="number" data-val="2">2</button>
                <button class="calc-btn" data-type="number" data-val="3">3</button>
                <button class="calc-btn eq row-span-2" data-type="equal">=</button>
                
                <button class="calc-btn" data-type="number" data-val="0" style="grid-column: span 2">0</button>
                <button class="calc-btn" data-type="number" data-val=".">.</button>
            </div>
        `;
        document.body.appendChild(modal);

        this.modal = modal;
        this.display = modal.querySelector('#calc-display');
        this.historyDisplay = modal.querySelector('#calc-history');
    }

    bindEvents() {
        const toggleBtn = document.querySelector('.calc-toggle-btn');
        const closeBtn = document.getElementById('calc-close');

        toggleBtn.addEventListener('click', () => {
            this.modal.classList.toggle('show');
        });

        closeBtn.addEventListener('click', () => {
            this.modal.classList.remove('show');
        });

        this.modal.addEventListener('click', (e) => {
            const btn = e.target.closest('.calc-btn');
            if (!btn) return;

            const { type, val } = btn.dataset;
            this.handleInput(type, val);
        });

        // Keyboard Support
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('show')) return;

            if (/[0-9.]/.test(e.key)) this.handleInput('number', e.key);
            else if (['+', '-', '*', '/'].includes(e.key)) this.handleInput('operator', e.key);
            else if (e.key === 'Enter' || e.key === '=') this.handleInput('equal');
            else if (e.key === 'Escape') this.modal.classList.remove('show');
            else if (e.key === 'Backspace') this.handleInput('delete');
        });
    }

    handleInput(type, val) {
        switch (type) {
            case 'number':
                this.inputDigit(val);
                break;
            case 'operator':
                this.handleOperator(val);
                break;
            case 'equal':
                this.handleOperator('=');
                break;
            case 'clear':
                this.resetCalculator();
                break;
            case 'delete':
                this.deleteLastDigit();
                break;
        }
        this.updateDisplay();
    }

    inputDigit(digit) {
        if (this.waitingForSecondOperand) {
            this.displayValue = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
        }
    }

    handleOperator(nextOperator) {
        const inputValue = parseFloat(this.displayValue);

        if (this.operator && this.waitingForSecondOperand) {
            this.operator = nextOperator;
            return;
        }

        if (this.firstOperand === null && !isNaN(inputValue)) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            const result = this.calculate(this.firstOperand, inputValue, this.operator);
            this.displayValue = String(parseFloat(result.toFixed(10)));
            this.firstOperand = result;
        }

        this.waitingForSecondOperand = true;
        this.operator = nextOperator === '=' ? null : nextOperator;

        if (nextOperator === '=') {
            this.history = '';
        } else {
            this.history = `${this.firstOperand} ${this.getOpSymbol(nextOperator)}`;
        }
    }

    calculate(first, second, op) {
        if (op === '+') return first + second;
        if (op === '-') return first - second;
        if (op === '*') return first * second;
        if (op === '/') return first / second;
        return second;
    }

    getOpSymbol(op) {
        if (op === '*') return '×';
        if (op === '/') return '÷';
        return op;
    }

    resetCalculator() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
        this.history = '';
    }

    deleteLastDigit() {
        if (this.displayValue.length > 1) {
            this.displayValue = this.displayValue.slice(0, -1);
        } else {
            this.displayValue = '0';
        }
    }

    updateDisplay() {
        this.display.textContent = this.displayValue;
        this.historyDisplay.textContent = this.history;
    }
}

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
    window.quizCalc = new QuizCalculator();
});
