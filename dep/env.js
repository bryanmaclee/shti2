
export function Environment(e = false, name = "global") {
  const global = e ? false : true;
  const linAr = [];
  let Lineage;
  if (global) {
    Lineage = [];
  } else {
    Lineage = Array.from(e.Lineage);
    Lineage.push(e.Name);
  }
  const Name = name;
  const Variables = new Map();
  const Constants = new Set();
  const Functions = [];
  const Children = [];

  function declareVar(name, value, kind) {
    Variables.set(name, value);
    if ((kind = "const")) {
      Constants.add(name);
    }
  }

  function getParent() {
    return Parent;
  }

  function assignVar(name, value) {
    if (Constants.has(name)) {
      console.log(`cannot reasign to constant ${name}`);
      return;
    }
    console.log("got here. not the prob")
    Variables.set(name, value);
  }

  function assignFn(name) {
    if (Functions.includes(name)) {
      console.log(`function ${name} has already been declared`);
    }
    Functions.push(name);
  }

  return {
    Lineage,
    Name,
    Variables,
    Constants,
    Functions,
    Children,
    declareVar,
    getParent,
    assignVar,
    assignFn,
  };
}
