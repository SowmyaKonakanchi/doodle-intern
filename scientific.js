class ScientificCalculator {
  constructor() {
    this.operators = {
      "+": { precedence: 1, assoc: "L", fn: (a, b) => a + b },
      "-": { precedence: 1, assoc: "L", fn: (a, b) => a - b },
      "*": { precedence: 2, assoc: "L", fn: (a, b) => a * b },
      "/": { precedence: 2, assoc: "L", fn: (a, b) => a / b },
      "^": { precedence: 3, assoc: "R", fn: (a, b) => Math.pow(a, b) }
    };

    this.functions = {
      sin: x => Math.sin(x * Math.PI / 180),
      cos: x => Math.cos(x * Math.PI / 180),
      tan: x => Math.tan(x * Math.PI / 180),
      log: x => Math.log10(x),
      ln: x => Math.log(x),
      sqrt: x => Math.sqrt(x)
    };
  }

  tokenize(expr) {
    return expr
      .replace(/\s+/g, "")
      .match(/sin|cos|tan|log|ln|sqrt|\d+(\.\d+)?|[+\-*/^()]|\S/g);
  }

  toPostfix(tokens) {
    const output = [];
    const stack = [];

    for (const token of tokens) {
      if (!isNaN(token)) {
        output.push(Number(token));
      } else if (this.functions[token]) {
        stack.push(token);
      } else if (this.operators[token]) {
        while (
          stack.length &&
          this.operators[stack[stack.length - 1]] &&
          (
            this.operators[stack[stack.length - 1]].precedence >
            this.operators[token].precedence ||
            (
              this.operators[stack[stack.length - 1]].precedence ===
              this.operators[token].precedence &&
              this.operators[token].assoc === "L"
            )
          )
        ) {
          output.push(stack.pop());
        }
        stack.push(token);
      } else if (token === "(") {
        stack.push(token);
      } else if (token === ")") {
        while (stack.length && stack[stack.length - 1] !== "(") {
          output.push(stack.pop());
        }
        stack.pop();
        if (this.functions[stack[stack.length - 1]]) {
          output.push(stack.pop());
        }
      }
    }

    while (stack.length) output.push(stack.pop());
    return output;
  }

  evaluatePostfix(postfix) {
    const stack = [];

    for (const token of postfix) {
      if (typeof token === "number") {
        stack.push(token);
      } else if (this.operators[token]) {
        const b = stack.pop();
        const a = stack.pop();
        stack.push(this.operators[token].fn(a, b));
      } else if (this.functions[token]) {
        const a = stack.pop();
        stack.push(this.functions[token](a));
      }
    }
    return stack[0];
  }

  calculate(expression) {
    const tokens = this.tokenize(expression);
    const postfix = this.toPostfix(tokens);
    return this.evaluatePostfix(postfix);
  }
}

const calc = new ScientificCalculator();
console.log(calc.calculate("3 + sin(30) * sqrt(16)"));