
export function environment(parent) {
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