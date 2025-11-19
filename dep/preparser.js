// import { unchangedTextChangeRange } from "typescript";
import { Environment } from "./env.js";

export function preParse(data, env = false) {
  // console.log(env);
  let iter = 0;
  let exit = false;
  const statements = [];

  function eat(i = 1) {
    iter += i;
    return data[iter - i];
  }
  function at() {
    return data[iter];
  }
  function walk(i = 1) {
    return data[i];
  }

  function expect(exp, msg) {
    if (!exp()) {
      console.error(msg);
      exit = true;
      return false;
    }
    return true;
  }

  function statement(part, valu, nam) {
    return {
      // part: "var_dec",
      part,
      type: valu,
      name: nam,
      isConst: false,
      // envir: environment(env),
      envir: Environment(env, nam),
      params: [],
      dependencies: [],
      expression: [],
    };
  }

  function parseVarAssignStmt(prt) {
    const stmt = statement("var_assignment", prt.value);
    stmt.name = prt.value;
    const strtNum = iter + 1;
    let num = iter;
    let nextTok = walk(num++);
    expect(() => nextTok.value === "=", `expected "=" got ${nextTok.value}`);
    nextTok = walk(num++);
    while (
      nextTok &&
      nextTok.kind !== "keyword" &&
      nextTok.kind !== "EOF" &&
      nextTok.type !== "semicolon"
    ) {
      stmt.expression.push(nextTok);
      nextTok = walk(num++);
    }
    eat(num - strtNum);
    stmt.envir.declareVar(stmt.name, stmt.expression, stmt.isConst);
    // console.log(JSON.stringify(stmt, null, 2))
    stmt.expression = preParse(stmt.expression);
    // env.declareVar(stmt.name, stmt.expression, stmt.isConst ? "const" : false);
    return stmt;
  }

  function parseVarStmt(prt) {
    const stmt = statement("var_dec", prt.value);
    if (prt.value === "const") stmt.isConst = true;
    const strtNum = iter + 1;
    let num = iter;
    let nextTok = walk(num++);
    expect(() => nextTok.kind === "identifier", "variable name expected");
    stmt.name = nextTok.value;
    nextTok = walk(num++);
    expect(() => nextTok.value === "=", "expected = ");
    nextTok = walk(num++);
    while (
      nextTok !== undefined &&
      nextTok.kind !== "keyword" &&
      nextTok.kind !== "EOF" &&
      nextTok.type !== "semicolon"
    ) {
      stmt.expression.push(nextTok);
      nextTok = walk(num++);
    }
    eat(num - strtNum);
    stmt.envir.declareVar(stmt.name, stmt.expression, stmt.isConst);
    // console.log(JSON.stringify(stmt.envir.Variables, null, 5))
    // console.log(stmt.envir.Variables);

    stmt.expression = preParse(stmt.expression);
    // env.declareVar(stmt.name, stmt.expression, stmt.isConst ? "const" : false);
    return stmt;
  }

  function parseFunctionStmt(prt) {
    expect(() => at().kind === "identifier", "expected identifier");
    env.assignFn(at().value);
    const stmt = statement("fn_dec", "function", at().value);
    stmt.isConst = true;
    stmt.name = eat().value;
    const isParen = expect(
      () => at().type === "open_paren",
      "expected open paren"
    );
    if (!isParen) {
      return stmt;
    }
    eat();
    while (at().type !== "close_paren") {
      if (at().kind === "identifier") {
        stmt.params.push(eat().value);
        if (at().type === "comma") {
          eat();
        }
      }
    }
    eat();
    let l = 0;
    expect(() => at().type === "open_curly", "expected {");
    eat();
    let nested = 1;
    while (walk().type !== "close_curly" && nested !== 0) {
      if (at().type === "open_curly") {
        nested++;
      } else if (at().type === "close_curly") {
        nested--;
      }
      stmt.expression.push(eat());
    }
    stmt.expression = preParse(stmt.expression, stmt.envir);
    return stmt;
  }

  function parseStmt() {
    const cur = eat();
    switch (cur.type) {
      case "word":
        switch (cur.kind) {
          case "keyword":
            switch (cur.value) {
              case "const":
              case "let":
                return parseVarStmt(cur);
              case "function":
                return parseFunctionStmt(cur);
            }
          case "identifier":
            if (walk(iter).type === "equals") {
              return parseVarAssignStmt(cur);
            }
        }
    }
    return false;
  }

  while (at() && at().kind !== "EOF" && iter < data.length) {
    if (exit) break;
    const curStmt = parseStmt();

    if (curStmt) {
      statements.push(curStmt);
    }
  }

  if (statements.length > 0) {
    return statements;
  }
  stmt.value = evaluateExpr(data)
  return stmt;
}

function evaluateExpr(tokens) {
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
          console.log("lookup var");
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
        // console.log(part);
        // const newTokens = tokens.filter(
        //   (a, i) => (i < iter - 1 || i > iter + 1)
        // );

        // console.log(part)
        // console.log("----------------------------------");
        tokens.splice(iter - 1, 3, part);
        // console.log(tokens);
        if (!tokens.length) return part;
      } else {
        eat();
      }
    }
    // console.log(tokens)
    // console.log(part)
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
const operators = ["*", "/", "+", "-"];

// function infixBindingPower(op) {
//   switch (op) {
//     case "+":
//     case "-":
//       return [1, 1.1];
//     case "*":
//     case "/":
//       return [2, 2.1];
//     default:
//       console.error(`unknown operator: '${op}'`);
//   }
// }
// function evalThis(mbp){
//   // console.log('doin it')
//   let left = eat();
//   if (left.type !== "number" && left.type !== "Word" ) {
//     console.error(`Bad Token: '${left.value}'`);
//     return null;
//   }
//   let inter = eat();
//   if (!inter)return left.value;
//   let loop =true;
//   while (at() || !loop){
//     if (inter.type === 'operator'){
//       let [lbp, rpb] = infixBindingPower(inter.value);
//       let right = evalThis(rbp)
//       if ()
//     }
//   }
// }
// console.log(evalThis(0));

// function walk() {
//   let left;
//   if (at()) {
//     if (at().kind === "operator") {
//     } else if (at().type === "number") {
//       left = eat();
//     }
//   }else{
//     return;
//   }
//   console.log("blah: ", at().kind);
// }
// function parseExpr(minBp) {
//   // console.log("value: ", at().value);
//   let left = eat();
//   if (left.type !== "number" && left.type !== "Word") {
//     console.error(`Bad Token: '${left.value}'`);
//     return null;
//   }
//   // console.log("left: ", left);
//   let oper = eat();
//   if (!oper) return left.value;
//   // console.log("operator: ", oper);
//   let loop = true;
//   while (loop && oper !== undefined) {
//     // console.log("we in hea");
//     if (!oper) {
//       console.log("no oper");
//       return left.value;
//     }
//     if (oper.type === "EOF") {
//       return left.value;
//     } else if (oper.kind !== "operator") {
//       console.error(`expected operator`);
//       return null;
//     }
//     // eat();
//     let [leftBp, rightbp] = infixBindingPower(oper.value);
//     if (leftBp < minBp) break;
//     // if (leftBp < minBp) loop = false;
//     let right = parseExpr(rightbp);
//     left = { op: oper.value, l: [left.value, right] };
//     oper = eat();
//   }
//   console.log(left);
//   return left;
// }
// // parseExpr(0)
// console.log(JSON.stringify(parseExpr(0), null, 2));
// // walk();
// return tokens;
