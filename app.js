const DIGIT_EXPRESSION = /^\d$/;
const OP_EXPRESSION = /^\+|\-|\*|\/$/;
const operators = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
};
const priorities = {
  "+": 0,
  "-": 0,
  "*": 1,
  "/": 1,
};
const app = Vue.createApp({
  data() {
    return {
      text: "",
      result: "",
      isResult: false,
      isFloat: false,
    };
  },
  methods: {
    isDigit(char) {
      return DIGIT_EXPRESSION.test(char);
    },
    checkPriority(op1, op2) {
      return priorities[op2] >= priorities[op1];
    },
    isOperation(char) {
      return OP_EXPRESSION.test(char);
    },
    btnSmileClick() {
      console.log("It's my Calculator!");
    },
    btnHeartClick() {
      console.log("❤️");
    },
    btnDigitClick(e) {
      if (this.isResult) {
        this.text = "";
        this.isResult = false;
      }
      this.text += e.target.innerText;
    },
    btnOpClick(e) {
      if (this.isResult) {
        this.text = "";
        this.isResult = false;
      }
      if (!this.isOperation(this.text[this.text.length - 1])) {
        this.text += e.target.innerText;
        this.isFloat = false;
      }
    },
    btnOtherClick(e) {
      val = e.target.innerText;
      switch (val) {
        case "C":
          this.text = this.text.slice(0, -1);
          this.result = 0;
          break;
        case "CE":
          this.text = "";
          this.result = 0;
          break;
        case ".":
          if (!this.isFloat) {
            if (this.isResult) {
              this.text = "";
              this.isResult = false;
            }
            this.text += ".";
            this.isFloat = true;
          }
          break;
        case "=":
          if (this.isResult) {
            this.text = "";
            this.isResult = false;
          }
          this.text += "=";
          this.isResult = true;
          this.isFloat = false;
          this.calc();
          break;
      }
    },
    execute(expr) {
      let stack = [];
      expr.forEach((token) => {
        if (token in operators) {
          let [y, x] = [stack.pop(), stack.pop()];
          stack.push(operators[token](parseFloat(x), parseFloat(y)));
        } else {
          stack.push(parseFloat(token));
        }
      });

      return stack.pop();
    },
    calc() {
      let outstr = [];
      let ops = [];
      let isOp = true;
      for (let i = 0; i < this.text.length; i++) {
        let c = this.text[i];
        if (this.isDigit(c)) {
          if (isOp) {
            outstr.push(c);
            isOp = false;
          } else {
            outstr[outstr.length - 1] = [outstr[outstr.length - 1], c].join("");
          }
        } else if (c == ".") {
          if (isOp) {
            outstr.push(["0", c].join(""));
            isOp = false;
          } else {
            outstr[outstr.length - 1] = [outstr[outstr.length - 1], c].join("");
          }
        } else if (this.isOperation(c)) {
          isOp = true;
          if (i == 0) {
            outstr.push("0");
            ops.unshift(c);
          } else {
            if (this.checkPriority(c, ops[0])) {
              outstr.push(ops.shift());
              ops.push(c);
            } else {
              ops.unshift(c);
            }
          }
        }
      }
      for (let i = 0; i < ops.length; i++) {
        outstr.push(ops[i]);
      }
      console.log(outstr);
      console.log(ops);
      this.result = this.execute(outstr);
    },
  },
});

app.mount("#app");
