import { environment } from "./env.js";

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

  function statement(part, valu) {
    return {
      // part: "var_dec",
      part,
      type: valu,
      name: "",
      isConst: false,
      envir: environment(env),
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
    stmt.envir.declareVar(stmt.name, stmt.expression, stmt.isConst)
    console.log(JSON.stringify(stmt, null, 2))
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
    stmt.envir.declareVar(stmt.name, stmt.expression, stmt.isConst)
    console.log(JSON.stringify(stmt.envir.Variables, null, 5))
    console.log(stmt.envir.Variables);
    
    stmt.expression = preParse(stmt.expression);
    // env.declareVar(stmt.name, stmt.expression, stmt.isConst ? "const" : false);
    return stmt;
  }

  function parseFunctionStmt(prt) {
    const stmt = statement("fn_dec", "function");
    stmt.isConst = true;
    expect(() => at().kind === "identifier", "expected identifier");
    stmt.name = eat().value;
    const isParen = expect(() => at().type === "open_paren", "expected open paren");
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
      // console.log(at().value, nested);
      if (at().type === "open_curly") {
        nested++;
      } else if (at().type === "close_curly") {
        nested--;
      }
      stmt.expression.push(eat());
      // l++;
      // if (l > data.length) return stmt;
    }
    // stmt.envir.declareVar(stmt.name, stmt.expression, stmt.isConst)
    stmt.expression = preParse(stmt.expression, stmt.envir);
    return stmt;
  }

  function parseStmt(env) {
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
  return data;
}
