function translateIfElse(jsCode) {
  // parse the JavaScript code to extract the if-else statement
  const ifElseStatement = parseJavaScriptCode(jsCode);

  // translate the if-else statement into SAS code
  const sasCode = translateToSAS(ifElseStatement);

  // translate the if-else statement into SQL code
  const sqlCode = translateToSQL(ifElseStatement);

  // return the SAS and SQL code
  return { sas: sasCode, sql: sqlCode };
}

// helper function to parse the JavaScript code and extract the if-else statement
function parseJavaScriptCode(code) {
  // use a JavaScript parser library, such as Esprima, to analyze the syntax of the code
  const ast = esprima.parse(code);

  // traverse the abstract syntax tree (AST) to find the if-else statement
  let ifElseStatement = null;
  traverseAST(ast, (node) => {
    if (node.type === 'IfStatement' && (node.alternate || node.alternate.type === 'IfStatement')) {
      ifElseStatement = node;
      return false; // stop traversal
    }
  });

  // if no if-else statement was found, throw an error
  if (!ifElseStatement) {
    throw new Error('No if-else statement found in code');
  }

  // traverse the abstract syntax tree (AST) to find variable declarations
  const variableDeclarations = [];
  traverseAST(ast, (node) => {
    if (node.type === 'VariableDeclaration') {
      variableDeclarations.push(node);
    }
  });

  // return the if-else statement and the variable declarations
  return { ifElseStatement, variableDeclarations };
}

// helper function to translate the if-else statement into SAS code
// helper function to translate the if-else statement into SAS code
function translateToSAS(ifElse) {
  let sasCode = '';

  // translate the if-else statement into SAS code
  sasCode += `if ${translateCondition(ifElse.test)} then\n`;
  sasCode += translateStatement(ifElse.consequent);
  sasCode += `else\n`;
  sasCode += translateStatement(ifElse.alternate);
  sasCode += `end;\n`;

  return sasCode;
}
// helper function to translate the if-else statement into SQL code
function translateToSQL(ifElse) {
  let sqlCode = '';

  // translate the if-else statement into SQL code
  sqlCode += `if ${translateCondition(ifElse.test)} then\n`;
  sqlCode += translateStatement(ifElse.consequent);
  if (ifElse.alternate.type === 'IfStatement') {
    sqlCode += `else if ${translateCondition(ifElse.alternate.test)} then\n`;
    sqlCode += translateStatement(ifElse.alternate.consequent);
  } else {
    sqlCode += `else\n`;
    sqlCode += translateStatement(ifElse.alternate);
  }
  sqlCode += `end if;\n`;

  return sqlCode;
}
