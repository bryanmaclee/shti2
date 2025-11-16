// import { constants } from "buffer";
import { truncateInput, Files } from "./dep/lib";
import { tokenize } from "./dep/lexer";
import { Tokens } from "./dep/syntax";
import { environment } from "./dep/env.js";
import { preParse } from "./dep/preparser.js";
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
  const program = preParse(woWhite);
  // console.log(program)
  await Bun.write(Files.outputFile, JSON.stringify(program, null, 2));
  // console.log(parseProgram(program))
})();

// function Program() {
//   return {
//     kind: "Program",
//     body: [],
//   };
// }


function parseProgram(data){
  let exp = data[0].expression;
  // console.log(exp);
}
