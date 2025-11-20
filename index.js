// import { constants } from "buffer";
import { truncateInput, Files } from "./dep/lib";
import { tokenize } from "./dep/lexer";
import { Tokens } from "./dep/syntax";
// import { environment } from "./dep/env.js";
import { preParse } from "./dep/preparser.js";
import { Environment } from "./dep/env.js";
// import { it } from "bun:test";
// import { parseEnv } from "util";

(async function () {
  const datastr = await Bun.file(Files.testFile()).text();
  const data = truncateInput(datastr);
  console.log(data);
  // const env = environment();
  // console.log(env.getParent());
  const lexed = tokenize(data);
  await Bun.write(Files.outputText, JSON.stringify(lexed, null, 2));
  const woWhite = lexed.filter((thing) => thing.kind !== "format");
  // const woWhite = lexed.filter((thing) => thing.type !== "white_space");
  await Bun.write(Files.outputTrunk, JSON.stringify(woWhite, null, 2));
  const program = instanciateProgram(woWhite, Environment());
  program.expression = preParse(program.expression, program.envir);
  // console.log(program)
  const progOut = preStringify(program);
  await Bun.write(Files.outputFile, JSON.stringify(progOut, null, 2));
  // console.log(parseProgram(program))
})();

// function Program() {
//   return {
//     kind: "Program",
//     body: [],
//   };
// }

function preStringify(data) {
  let rVal;
  let expr = {};
  if ("envir" in data) {
    rVal = JSON.parse(JSON.stringify(data.envir));
    rVal.Variables = Object.fromEntries(data.envir.Variables);
    rVal.Constants = Array.from(data.envir.Constants);

  }
  data.envir = rVal;
  if ("expression" in data) {
    if (data.expression.length) {
      for (const a of data.expression) {
        preStringify(a);
      }
    }
  }
  return data;
}

function parseProgram(data) {
  let exp = data[0].expression;
  // console.log(exp);
}

function instanciateProgram(data, env) {
  return {
    type: "program",
    envir: env,
    expression: data,
  };
}
