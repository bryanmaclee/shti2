import { constants } from "buffer";
import { truncateInput, Files } from "./dep/lib";
import { tokenize } from "./dep/lexer";
import { Tokens } from "./dep/syntax";
// import { parseEnv } from "util";

(async function () {
  const datastr = await Bun.file(Files.testFile()).text();
  const data = truncateInput(datastr);
  console.log(data);
  const env = environment();
  // console.log(env.getParent());
  const lexed = tokenize(data);
  await Bun.write(Files.outputText, JSON.stringify(lexed, null, 2));
  const program = parse(lexed);
  // console.log(program)
  await Bun.write(Files.outputFile, JSON.stringify(program, null, 2));
})();

function environment(parent) {
  const global = parent ? false : true;
  const Parent = parent;
  const Variables = new Map();
  const Constants = new Set();
  const Functions = new Map();

  return {
    // things: [],
    Variables,
    Constants,
    Functions,
    declareVar(name, value, kind) {
      Variables.set(name, value);
      if ((kind = "const")) {
        Constants.add(name);
      }
    },
    getParent() {
      return Parent;
    },
    assingnVar(name, value) {
      if (Constants.has(name)) {
        console.log(`cannot reasign to constant ${name}`);
        return;
      }
      Variables.set(name, value);
    },
  };
}

function Program() {
  return {
    kind: "Program",
    body: [],
  };
}

function parse(da) {
  const dat = da.filter((thing) => thing.type !== "white_space");
  let itter = 0;

  function parseProgram() {
    const program = Program(); // let program = []
    const env = new environment();
    while (dat[itter].type !== "EOF") {
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

  function parseExp(){
    // while
    if (at().kind !== 'operator'){
      const left = eat().value;

    }
    let right;
    console.log(left)
    while (precede(eat()) > -1){
       right =  parseExp()
    }
    console.log(right)
    return {left, right};
  }

  function parseConst(env) {
    const dec = eat();
    const next = eat();
    let val;
    if (next.type === "Word") {
      if (env.Constants.has(next.value)) console.error(`${next.value} cannot be redeclared`);
      else {
        expect("equals", "const must be declared with a value. missing =  ");
        val = parseExp();
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
    'star',
    'forward_slash',
    'plus',
    'minus'
  ]
  function precede(op){
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
