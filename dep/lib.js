import { tokenTypes } from "../dep/syntax";

export function truncateInput(datastr) {
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

const args = process.argv.slice(2);

export const Files = {
  inTest: "./tests/test1.js",
  outputFile: "out/program.json",
  outputText: "out/tokens.json",
  outputTrunk: 'out/truncated.json',
  testFile: function (){
    return args[0] ? args[0] : this.inTest;
  }
};

// let testFile = "";
// if (args[0]) {
//   testFile = args[0];
// } else {
//   testFile = Files.inTest;
// }