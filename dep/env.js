// export function environment(parent) {
//   const global = parent ? false : true;
//   const Parent = parent;
//   const Variables = new Map();
//   const Constants = new Set();
//   const Functions = new Map();

//   return {
//     // things: [],
//     Parent,
//     Variables,
//     Constants,
//     Functions,
//     declareVar(name, value, kind) {
//       Variables.set(name, value);
//       if ((kind = "const")) {
//         Constants.add(name);
//       }
//       // console.log(Variables)
//     },
//     getParent() {
//       return Parent;
//     },
//     assingnVar(name, value) {
//       if (Constants.has(name)) {
//         console.log(`cannot reasign to constant ${name}`);
//         return;
//       }
//       Variables.set(name, value);
//     },
//   };
// }

// export function environment(parent = false) {
//   const global = parent ? false : true;
//   const Parent = global ? "global" : parent;
//   const Variables = new Map();
//   const Constants = new Set();
//   const Functions = new Map();

//   function declareVar(name, value, kind) {
//     Variables.set(name, value);
//     if ((kind = "const")) {
//       Constants.add(name);
//     }
//     // console.log(Variables)
//   }
//   function getParent() {
//     return Parent;
//   }
//   function assingnVar(name, value) {
//     if (Constants.has(name)) {
//       console.log(`cannot reasign to constant ${name}`);
//       return;
//     }
//     Variables.set(name, value);
//   }
//   return {
//     Parent,
//     Variables,
//     Constants,
//     Functions,
//     declareVar,
//     getParent,
//     assingnVar,
//   };
// }

export function Environment(e = false, name = "global") {
  const global = e ? false : true;
  const linAr = [];
  // const Lineage = global ? Array.of('global') : e.Lineage.push(e.Name);
  let Lineage;
  if (global) {
    // Lineage = Array.of("global")
    Lineage = [];
  } else {
    Lineage = Array.from(e.Lineage);
    Lineage.push(e.Name);
  }
  const Name = name;
  const Variables = new Map();
  const Constants = new Set();
  const Functions = [];

  function declareVar(name, value, kind) {
    Variables.set(name, value);
    if ((kind = "const")) {
      Constants.add(name);
    }
    // console.log(Variables)
  }
  function getParent() {
    return Parent;
  }
  function assignVar(name, value) {
    if (Constants.has(name)) {
      console.log(`cannot reasign to constant ${name}`);
      return;
    }
    Variables.set(name, value);
  }

  function assignFn(name) {
    if (Functions.includes(name)) {
      console.log(`function ${name} has already been declared`);
    }
    Functions.push(name);
    // console.log(env)
  }

  return {
    Lineage,
    Name,
    Variables,
    Constants,
    Functions,
    declareVar,
    getParent,
    assignVar,
    assignFn,
  };
}
