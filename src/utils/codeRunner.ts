interface TestCase {
  input: string
  expected: string
  [key: string]: unknown
}

export const generateExecutionScript = (userCode: string, testCases: TestCase[]) => {
  return `
${userCode}

const testCases = ${JSON.stringify(testCases)};
const results = [];

try {
  testCases.forEach((tc, index) => {
    try {
      const args = eval(\`[\${tc.input}]\`);
      const actual = solve(...args);
      
      // Safely stringify the actual result
      let actualStr;
      try {
        actualStr = JSON.stringify(actual);
      } catch (e) {
        actualStr = String(actual);
      }
      
      const passed = actualStr === tc.expected;
      results.push({
        testCase: index + 1,
        passed,
        input: tc.input,
        expected: tc.expected,
        actual: actualStr,
      });
    } catch (testErr) {
      results.push({
        testCase: index + 1,
        passed: false,
        input: tc.input,
        expected: tc.expected,
        actual: \`Error: \${testErr.message}\`,
      });
    }
  });
  console.log(JSON.stringify(results));
} catch (err) {
  console.error(JSON.stringify({
    error: err.message,
    type: 'ExecutionError',
    stack: err.stack,
  }));
  process.exit(1);
}
`
}