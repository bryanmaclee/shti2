import { Tokens } from "./syntax";

function Token(value, type, posit, line, chr) {
  return {
    value,
    type,
    posit,
    line,
    chr,
  };
}

export function tokenize(src) {
  const tokens = [];
  let itter = 0;
  let startCol = 1;
  let char = 1;
  let line = 1;
  let tokenNumber = 0;
  let lineStartPos = 1;

  function inc() {
    char++;
    itter++;
  }

  function skippable(str) {
    if (str === " " || str === "\t") {
      // char++;
      return "s";
    } else if (str === "\n" || str === "\r") {
      // lineStartPos = itter;
      // char = 1;
      // line++;
      return "l";
    }
    return false;
  }

  function isKeyword(word) {
    const kw = ["const", "let"];
    return kw.includes(word);
  }

  function isAlpha(src) {
    const rx = /[a-zA-Z_$]/;
    return rx.test(src);
  }

  function isAlphaNum(src) {
    const rx = /[a-zA-Z0-9_$]/;
    return rx.test(src);
  }

  function isNum(src) {
    const rx = /[0-9]/;
    return rx.test(src);
  }

  function c() {
    return src[itter];
  }

  function addAndInc(val, tok) {
    add(val, tok);
    inc();
  }

  function add(value, type, kind, addTok = true) {
    // startCol = itter;
    // char = itter - lineStartPos + 1;
    // console.log(JSON.stringify(Tokens.operator, null, 2))
    // startCol = char - value.length;
    tokens.push({
      value,
      length: value.length,
      type,
      kind,
      position: itter - value.length + 1,
      line: line,
      start_col: char - value.length,
      end_col: char - 1,
      token_num: addTok ? ++tokenNumber : null,
    });
  }

  lexloop: while (itter < src.length) {
    let chunk = "";
    let usefullVar;
    chunk += c();
    // console.log('"', chunk, '"');
    if (isNum(chunk)) {
      inc();
      while (itter < src.length && (isNum(c()) || c() === ".")) {
        chunk += c();
        inc();
      }
      add(chunk, "number", "numeric_lit");
      continue;
    } else if (isAlpha(c())) {
      inc();
      while (itter < src.length && isAlphaNum(c())) {
        chunk += c();
        inc();
      }
      if (isKeyword(chunk)) {
        add(chunk, "word", "keyword");
      } else {
        add(chunk, "Word", "word");
      }
      continue;
    } else if ((usefullVar = skippable(chunk))) {
      inc();
      if (usefullVar === "l") {
        char = 1;
        add(chunk, "new_line", "format", false);
        lineStartPos = itter;
        line++;
      } else {
        add(chunk, "white_space", "format", false);
      }
      continue;
    } else {
      inc();
      for (const i of Tokens.operator) {
        if (i.test.test(chunk)) {
          add(chunk, i.type, "operator");
          continue lexloop;
        }
      }
    }
    console.error(
      `Lexer Error:\nunrecognized character: "${chunk}" found in source at line ${line} char ${
        char - chunk.length
      } position: ${itter}`
    );
    return tokens;
  }
  add("EOF", "EOF", "EOF");
  return tokens;
}
