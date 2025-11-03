import { constants } from "buffer";
import { tokenTypes } from "./dep/syntax";

const Files = {
  inTest: "./tests/test1.js",
  outputFile: "out/output.json",
  outputText: "out/output.txt",
};

const args = process.argv.slice(2);
let testFile = "";
if (args[0]) {
  testFile = args[0];
} else {
  testFile = Files.inTest;
}

console.log(testFile);
(async function () {
  const datastr = await Bun.file(testFile).text();
  const data = truncateInput(datastr);
  // await Bun.write(Files.outputText, JSON.stringify(data, null, 2));
  // findDecs(data);
  const env = environment();
  console.log(env.getParent());
  const lexed = tokenize(data);
  await Bun.write(Files.outputText, lexed);
  console.log("output file written\n", JSON.stringify(lexed, null, 2));
})();

// function

function truncateInput(datastr) {
  const begin = "((BEGIN))";
  const dataStart = datastr.includes(begin)
    ? datastr.substring(
        datastr.indexOf("((BEGIN))") +
          begin.length +
          tokenTypes[0]?.test.exec(datastr)?.length
      )
    : datastr;
  const data = dataStart.includes("((END))")
    ? dataStart.substring(0, dataStart.indexOf("((END))"))
    : dataStart;
  return data;
}

function environment(parent) {
  const global = parent ? false : true;
  const Parent = parent;
  const Variables = new Map();
  const Constants = new Set();
  const Functions = new Map();

  return {
    declareVar(name, value, kind) {
      Variables.set(name, value);
      if ((kind = "const")) {
        constants.add(name);
      }
    },
    getParent() {
      return Parent;
    },
    assingnVar(name, value) {
      if (constants.has(name)) {
        console.log(`cannot reasign to constant ${name}`);
        return;
      }
      Variables.set(name, value);
    },
  };
}

export function Token(value, type) {
  return {
    value,
    type,
  };
}


export const TokenType = [
  "Null",
  "SemiColon",
  "Number",
  "Identifier",
  "Equals",
  "OpenParen",
  "CloseParen",
  "OpenBrace",
  "CloseBrace",
  "BinaryOperator",
  "Let",
  "Dot",
  "Colon",
  "Comma",
  "Keyword",
  "EOF",
];

const KEYWORDS = {
  let: "Let",
  const: "Const",
  null: "Null"
};
export function tokenize(src) {
  const tokens = [];
  let itter = 0;

  function skippable(str) {
    if (str === "")
    return str == " " || str == "\n" || str == "\t" || str == "\r";
  }

  function isAlpha(src) {
    const rx = /[a-zA-Z]/;
    return rx.test(src);
  }

  function isAlphaNum(src) {
    // const rx = /[a-zA-Z_$][a-zA-Z0-9_$]*/;
    const rx = /[a-zA-Z0-9_$]/;
    return rx.test(src);
  }

  function isNum(src) {
    // const rx = /[0-9]+(\.[0-9]+)?/;
    const rx = /[0-9]/;
    return rx.test(src);
  }

  function c() {
    return src[itter];
  }

  function addAndInc(val, tok) {
    add(val, tok);
    itter++;
  }

  function add(val, tok) {
    tokens.push(new Token(val, tok));
  }
  while (itter < src.length) {
    const char = c();
    if (char === "(") {
      addAndInc(char, "OpenParen");
    } else if (char === ")") {
      addAndInc(char, "CloseParen");
    } else if (char === ";") {
      addAndInc(char, "SemiColon");
    } else if (
      char === "+" ||
      char === "-" ||
      char === "*" ||
      char === "/" ||
      char === "%"
    ) {
      addAndInc(char, "BinaryOperator");
    } else if (char === "=") {
      addAndInc(char, "Equals");
    } else if (char === "{") {
      addAndInc(char, "Openbrace");
    } else if (char === "}") {
      addAndInc(char, "CloseBrace");
    } else if (char === ":") {
      addAndInc(char, "Colon");
    } else if (char === ",") {
      addAndInc(char, "Comma");
    } else if (char === ";") {
      addAndInc(char, "SemiColon");
    } else if (char === ".") {
      addAndInc(".", "Dot");
    } else {
      if (isNum(char)) {
        let num = char;
        itter++;
        while (itter < src.length && (isNum(c()) || c() === ".")) {
          num = num + c();
          itter++;
        }
        // console.log(`the nume is ${num}`)
        add(num, "Number");
      } else if (isAlpha(c())) {
        let str = char;
        itter++;
        while (itter < src.length && isAlphaNum(c())) {
          str += c();
          itter++;
        }
        const reserved = KEYWORDS[str];
        if (reserved === undefined) {
          add(str, "Identifier");
        } else {
          add(str, "Keyword");
        }
      } else if (skippable(char)) {
        itter++;
      } else {
        console.log(
          `Lexer Error:\nunrecognized character: ${char} found in source at position: ${itter}`
        );
        return tokens;
      }
    }
  }
  add("EOF", "EOF");
  // console.log(tokens)
  return tokens;
}
