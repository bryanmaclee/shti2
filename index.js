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
  const program = preParse(lexed);
  // console.log(program)
  await Bun.write(Files.outputFile, JSON.stringify(program, null, 2));
})();

function Program() {
  return {
    kind: "Program",
    body: [],
  };
}

function preParse(dat) {
  const data = dat.filter((thing) => thing.type !== "white_space");
  let iter = 0;
  const statements = [];

  function eat() {
    return data[iter++];
  }

  function at() {
    return data[iter];
  }

  function walk(i) {
    return data[i];
  }

  function parseConstStmt(prt) {
    const stmt = [prt];
    let num = prt.token_num + 1;
    let nextTok = walk(num++);
    while (
      nextTok.kind !== "keyword" &&
      nextTok.kind !== "EOF" &&
      nextTok.type !== "semicolon" 
    ) {
      // console.log(nextTok);
      stmt.push(nextTok);
      nextTok = walk(num++);
    }
    return stmt;
  }

  while (at().kind !== "EOF") {
    // console.log(eat())
    const cur = eat();
    switch (cur.type) {
      case "word":
        switch (cur.kind) {
          case "keyword":
            console.log(cur.value);
            statements.push(parseConstStmt(cur));
        }
    }
  }

  return statements;
}
