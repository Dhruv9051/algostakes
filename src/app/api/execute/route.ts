import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { generateExecutionScript } from '@/utils/codeRunner'

const LANGUAGE_MAP: Record<string, number> = {
  javascript: 63,
  python: 71,
  cpp: 54,
}

interface ExecutionResult {
  testCase: number
  passed: boolean
  input: string
  expected: string
  actual: string
}

export async function POST(request: Request) {
  try {
    const { code, language, problemId } = await request.json()
    const supabase = await createClient()

    const { data: problem } = await supabase
      .from('problems')
      .select('test_cases')
      .eq('id', problemId)
      .single()

    if (!problem) return NextResponse.json({ success: false, output: 'Problem not found' })

    const finalScript = generateExecutionScript(code, problem.test_cases)

    const response = await fetch(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      {
        method: 'POST',
        headers: {
          'x-rapidapi-key': process.env.JUDGE0_API_KEY || '',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language_id: LANGUAGE_MAP[language] || 63,
          source_code: finalScript,
        }),
      }
    )

    const result = await response.json()

    if (result.status?.id > 3) {
      return NextResponse.json({
        success: false,
        output: `Runtime Error (${result.status.description}): ${result.stderr || result.compile_output || 'Unknown error'}`,
      })
    }

    try {
      const testResults: ExecutionResult[] = JSON.parse(result.stdout)
      const allPassed = testResults.every(r => r.passed)

      return NextResponse.json({
        success: allPassed,
        output: testResults
          .map(
            r =>
              `${r.passed ? '✅' : '❌'} Test ${r.testCase}: ${r.passed ? 'Passed' : 'Failed'}\n   Expected: ${r.expected}\n   Actual: ${r.actual}`
          )
          .join('\n\n'),
        results: testResults,
      })
    } catch (parseErr) {
      return NextResponse.json({
        success: false,
        output: `Output Error: ${result.stdout || result.stderr || 'No output received'}`,
      })
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, output: `Server Error: ${errorMsg}. Please check your solve function signature.` },
      { status: 500 }
    )
  }
}