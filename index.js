import { truncateInput, Files, deps, preStringify } from "./dep/lib";
import { tokenize } from "./dep/lexer";
import { preParse } from "./dep/preparser.js";
import { Environment } from "./dep/env.js";

(async function () {
  const datastr = await Bun.file(Files.testFile()).text();
  const data = truncateInput(datastr);
  console.log(data);
  const lexed = tokenize(data);
  await Bun.write(Files.outputText, JSON.stringify(lexed, null, 2));
  // return;
  const woWhite = lexed.filter((thing) => thing.kind !== "format");
  await Bun.write(Files.outputTrunk, JSON.stringify(woWhite, null, 2));
  const program = instanciateProgram(woWhite );
  // const program = instanciateProgram(woWhite, Environment());
  // program.expression = preParse(program.expression, program.envir);
  program.expression = startParse(program.expression, program.envir);
  // console.log(program)
  // const progOut = preStringify(program);
  // await Bun.write(Files.outputFile, JSON.stringify(progOut, null, 2));
  // console.log(JSON.stringify(progOut, null, 2));
  // console.log(parseProgram(program))
  // console.log(deps);
  console.log(program);
})();

function startParse(data) {
  let iter = 0;
  let exit = false;
  const statements = [];
  // console.log(env)

  while (at() && at().kind !== "EOF" && iter < data.length) {
    if (exit) break;
    const curStmt = parseStmt();

    if (curStmt) {
      statements.push(curStmt);
    }
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
                return parseVarDec(cur);
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

  function parseVarAssignStmt(token){
    return token;
  }
  function parseVarDec(token){
    return token
  }

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
  return data;
}

function instanciateProgram(data) {
  return {
    type: "program",
    expression: data,
  };
}

// const worker = new Worker(new URL("./worker.js", import.meta.url));
// worker.postMessage("hello");
// console.log(worker.postMessage('msg'))
// process.on("worker", (worker) => {
//   console.log("New worker created:", worker.threadId);
// });
// worker.onmessage = (ev) => {
//   console.log(ev.data);
// };
// worker.addEventListener("open", () => {
//   console.log("worker is ready");
// });
