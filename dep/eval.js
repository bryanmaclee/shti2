const operators = ["*", "/", "+", "-"];

export function evaluateExpr(tokens, env) {
  let iter = 0;
  let exit = false;
  const statements = [];

  function eat(i = 1) {
    iter += i;
    return tokens[iter - i];
  }

  function at(i = 0) {
    return tokens[iter + i];
  }

  // let part = 0;
  for (const operator of operators) {
    // console.log(operator)
    iter = 0;
    while (at()) {
      if (at().value === operator) {
        // console.log(operator)
        let preAtom = at(-1);
        let postAtom = at(1);
        const thisOp = at();
        // console.log(preAtom, thisOp, postAtom);
        if (preAtom.type === "word") {
          // console.log(`lookup var: ${JSON.stringify(preAtom)}` );
          if(env.Variables.has(preAtom.value)){
            preAtom = {value: env.Variables.get(preAtom.value)}
          }else{
            throw "undefined!!!"
          }
        } else if (preAtom.type === "number") {
        }
        // console.log("*********************", preAtom);
        if (!preAtom) preAtom = { value: 0 };
        if (!postAtom) postAtom = { value: 0 };
        const part = evaluatePart(
          parseFloat(preAtom.value),
          parseFloat(postAtom.value),
          thisOp.value
        );
        tokens.splice(iter - 1, 3, part);
        if (tokens.length === 1) {
          return part;
        }
      } else {
        eat();
      }
    }
  }
  function evaluatePart(pre, post, op) {
    switch (op) {
      case "*":
        return { value: pre * post };
      case "/":
        return { value: pre / post };
      case "+":
        return { value: pre + post };
      case "-":
        return { value: pre - post };
    }
  }
}