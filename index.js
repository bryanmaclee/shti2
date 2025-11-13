// import { constants } from "buffer";
import { truncateInput, Files } from "./dep/lib";
import { tokenize } from "./dep/lexer";
import { Tokens } from "./dep/syntax";
import { environment } from "./dep/env.js";
// import { it } from "bun:test";
// import { parseEnv } from "util";

(async function () {
  const datastr = await Bun.file(Files.testFile()).text();
  const data = truncateInput(datastr);
  console.log(data);
  const env = environment();
  // console.log(env.getParent());
  const lexed = tokenize(data);
  await Bun.write(Files.outputText, JSON.stringify(lexed, null, 2));
  const woWhite = lexed.filter((thing) => thing.kind !== "format");
  // const woWhite = lexed.filter((thing) => thing.type !== "white_space");
  await Bun.write(Files.outputTrunk, JSON.stringify(woWhite, null, 2));
  const program = preParse(woWhite);
  // console.log(program)
  await Bun.write(Files.outputFile, JSON.stringify(program, null, 2));
})();

function Program() {
  return {
    kind: "Program",
    body: [],
  };
}

function preParse(data) {
  let iter = 0;
  let exit = false;
  const statements = [];

  function expect(exp, msg) {
    if (!exp()) {
      console.error(msg);
      exit = true;
    }
    // eat()
  }
  function expectBef(exp, bef, msg) {}

  function eat(i = 1) {
    iter += i;
    return data[iter - i];
  }

  function at() {
    return data[iter];
  }

  function walk(i) {
    return data[i];
  }

  function parseVarStmt(prt) {
    const stmt = {
      part: "var_dec",
      type: prt.value,
      name: "",
      isConst: false,
      dependencies: [],
      epression: [],
    };
    if (prt.value === "const") stmt.isConst = true;
    const strtNum = prt.token_num + 1;
    let num = prt.token_num;
    let nextTok = walk(num++);
    expect(() => nextTok.kind === "word", "variable name expected");
    stmt.name = nextTok.value;
    // num++;
    nextTok = walk(num++);
    expect(() => nextTok.value === "=", "expected = ");
    nextTok = walk(num++);
    while (
      nextTok.kind !== "keyword" &&
      nextTok.kind !== "EOF" &&
      nextTok.type !== "semicolon"
    ) {
      stmt.epression.push(nextTok);
      nextTok = walk(num);
      num++;
    }
    eat(num - strtNum);
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
            }
        }
    }
  // return cur;
  }

  while (at() && at().kind !== "EOF") {
    if (exit) break;
    statements.push(parseStmt());
  }

  return statements;
}
