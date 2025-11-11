
function parse(da) {
  let itter = 0;

  const dat = da.filter((thing) => thing.type !== "white_space");
  function parseProgram() {
    const program = Program(); // let program = []
    const env = new environment();
    // console.log(dat)
    while (dat[itter].type !== "EOF") {
      console.log(itter);
      program.body.push(parseStmt(env));
    }
    return program;
  }

  function expect(type, msg) {
    if (at().type !== type) {
      console.error(msg);
    }
    return eat();
  }

  // function parseExp() {
  //   // while
  //   let left;
  //   if (at().kind !== "operator") {
  //     left = eat().value;
  //   } else {
  //   }
  //   let right;
  //   console.log(`left: ${left}`);
  //   while (precede(eat()) > -1) {
  //     right = parseExp();
  //   }
  //   console.log(right);
  //   return { left, right };
  // }

  function parseExpr(minBp) {
    let left = eat();
    if (left.type !== "Number" && left.type !== "Word") {
      console.error(`Bad Token: '${left.value}'`);
      return null;
    }
    console.log(left);
    let oper = at();
    let loop = true;
    while (loop) {
      console.log(oper);
      if (oper.type === "EOF") {
        return left;
      } else if (oper.kind !== "operator") {
        console.error(`expected operator`);
        return null;
      }
      eat();
      let [leftBp, rightbp] = infixBindingPower(oper.value);
      if (leftBp < minBp) loop = false;
      let right = parseExpr(rightbp);
      left = { oper, l: [left, right] };
    }
    return left;
  }

  function infixBindingPower(op) {
    switch (op) {
      case "+":
      case "-":
        return [1, 1.1];
      case "*":
      case "/":
        return [2, 2.1];
      default:
        console.error(`unknown operator: '${op}'`);
    }
  }

  function parseConst(env) {
    const dec = eat();
    // console.log(dec);
    const next = eat();
    let val;
    if (next.type === "Word") {
      if (env.Constants.has(next.value))
        console.error(`${next.value} cannot be redeclared`);
      else {
        expect("equals", "const must be declared with a value. missing =  ");
        val = parseExpr(0.0);
        console.log(val);
        // val = at()
        env.declareVar(next.value, val.value, dec.value);
        return {
          kind: "const_declaration",
          name: next.value,
          value: val,
        };
      }
    }
    return null;
    // expect
  }

  const precedence = [
    "open_paren",
    "expone",
    "star",
    "forward_slash",
    "plus",
    "minus",
  ];
  function precede(op) {
    // console.log(op.type)
    // console.log(precedence.indexOf(op.type))
    return precedence.indexOf(op.type);
  }

  // function parseExp(){
  //   return {value: "uo"}
  // }

  // function parseArithExp(){

  // }

  function parseStmt(env) {
    // console.log(at().type)
    switch (at().type) {
      case "white_space":
        eat();
        break;
      case "Word":
        const word = at().value;
        // console.log(word)
        // for (const i of Tokens.keyword) {
        //   if (word === i) {
        switch (word) {
          case "const":
            return parseConst(env);
        }
      //   }
      // }
      default:
        console.error(`${eat().value} has not been set up to parse.`);
    }
  }

  function peak() {
    return dat[itter + 1];
  }
  function at() {
    return dat[itter];
  }
  function eat() {
    itter++;
    return dat[itter - 1];
  }

  return parseProgram();
}