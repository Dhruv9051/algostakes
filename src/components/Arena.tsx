'use client'

import Editor, { loader } from '@monaco-editor/react'
import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { soundEngine } from '@/utils/soundEngine'
import { motion, AnimatePresence } from 'framer-motion'
import WagerModal from './WagerModal'
import { useCasino } from '@/context/CasinoContext'

type EditorOptions = Parameters<typeof Editor>[0]['options']

type Problem = {
  id: string
  title: string
  description: string
  difficulty: string
  topic: string
  starter_codes: Record<string, string>
  sample_cases: Array<{ input: string; output: string }>
  constraints: string[]
}

type ExecutionResult = { testCase: number; passed: boolean; input: string; expected: string; actual: string }

const LANGS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python',     label: 'Python' },
  { value: 'cpp',        label: 'C++' },
]

const DIFF_COLORS: Record<string, string> = {
  Easy:   'var(--em)',
  Medium: 'var(--or)',
  Hard:   'var(--rose)',
}

export default function Arena({ problem }: { problem: Problem }) {
  const { setChips }          = useCasino()
  const [lang, setLang]       = useState('javascript')
  const [code, setCode]       = useState(problem.starter_codes['javascript'] || '')
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<ExecutionResult[] | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [tab, setTab]         = useState<'problem' | 'code'>('problem')
  const [wide, setWide]       = useState(true)
  const [wager, setWager]     = useState(false)
  const [winnings, setWinnings] = useState(0)

  useEffect(() => {
    const fn = () => setWide(window.innerWidth >= 1024)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const changeLang = useCallback((l: string) => {
    setLang(l)
    setCode(problem.starter_codes[l] || '')
    setResults(null)
    setError(null)
  }, [problem.starter_codes])

  const execute = async () => {
    setRunning(true)
    setResults(null)
    setError(null)
    try {
      const res  = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: lang, problemId: problem.id }),
      })
      const data = await res.json()

      if (data.success) {
        soundEngine.playJackpot()
        // Parse structured results if possible
        try {
          const parsed = typeof data.output === 'string'
            ? data.output.split('\n\n').map((_: string, i: number) => ({
                testCase: i + 1, passed: true, input: '', expected: '', actual: '',
              }))
            : []
          setResults(parsed)
        } catch { setResults([]) }

        // Award chips
        const earned = { Easy: 150, Medium: 300, Hard: 600 }[problem.difficulty] ?? 150
        setWinnings(earned)
        await fetch('/api/ledger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: earned, action: 'ADD' }),
        })
        setChips(p => p + earned)
        setTimeout(() => setWager(true), 400)
      } else {
        soundEngine.playError()
        setError(data.output)
      }
    } catch {
      soundEngine.playError()
      setError('Execution engine offline.')
    } finally {
      setRunning(false)
    }
  }

  const allPassed = results !== null && error === null

  return (
    <>
      <div
        style={{
          display: 'flex',
          height: '100%',
          gap: '1px',
          background: 'var(--border)',
          overflow: 'hidden',
        }}
      >
        {wide ? (
          <>
            {/* Desktop: side-by-side */}
            <div style={{ width: '38%', minWidth: 0, background: 'var(--bg-base)', overflow: 'hidden' }}>
              <ProblemPane problem={problem} />
            </div>
            <div style={{ flex: 1, minWidth: 0, background: 'var(--bg-base)', overflow: 'hidden' }}>
              <EditorPane
                lang={lang}
                code={code}
                running={running}
                results={results}
                error={error}
                allPassed={allPassed}
                changeLang={changeLang}
                execute={execute}
                setCode={setCode}
              />
            </div>
          </>
        ) : (
          /* Mobile: tabs */
          <div style={{ flex: 1, background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Tab bar */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg-raised)',
                flexShrink: 0,
              }}
            >
              {(['problem', 'code'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-display)',
                    border: 'none',
                    borderBottom: tab === t ? `2px solid var(--em)` : '2px solid transparent',
                    background: 'transparent',
                    color: tab === t ? 'var(--em)' : 'var(--tx-3)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              {tab === 'problem' ? (
                <ProblemPane problem={problem} />
              ) : (
                <EditorPane
                  lang={lang}
                  code={code}
                  running={running}
                  results={results}
                  error={error}
                  allPassed={allPassed}
                  changeLang={changeLang}
                  execute={execute}
                  setCode={setCode}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <WagerModal
        isOpen={wager}
        winnings={winnings}
        onAccept={async () => {
          setWager(false)
          await fetch('/api/ledger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: winnings, action: 'WAGER' }),
          })
        }}
        onDecline={() => setWager(false)}
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .prose-problem p  { color: var(--tx-2); font-size: 13px; line-height: 1.65; margin: 0 0 8px; }
        .prose-problem code {
          background: rgba(255,255,255,0.07);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 11px;
          font-family: var(--font-mono);
          color: var(--tx-1);
        }
      `}</style>
    </>
  )
}

// ─── Sub-components declared outside of render ───────────

function ProblemPane({ problem }: { problem: Problem }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-raised)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--tx-2)' }}>Problem</span>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: DIFF_COLORS[problem.difficulty] ?? 'var(--tx-2)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {problem.difficulty}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* Title + badges */}
        <h2 style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '10px', lineHeight: 1.25 }}>
          {problem.title}
        </h2>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <span className="badge badge-topic">{problem.topic}</span>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '13px',
            color: 'var(--tx-2)',
            lineHeight: 1.65,
            marginBottom: '20px',
          }}
          className="prose-problem"
        >
          <ReactMarkdown>{problem.description}</ReactMarkdown>
        </div>

        {/* Test cases */}
        <div style={{ marginBottom: '20px' }}>
          <div className="label" style={{ marginBottom: '10px' }}>Test Cases</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {problem.sample_cases.map((tc, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  padding: '10px 12px',
                }}
              >
                <div className="label" style={{ marginBottom: '6px' }}>Case {String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.7 }}>
                  <div>
                    <span style={{ color: 'var(--tx-3)' }}>input  </span>
                    <span style={{ color: 'var(--em)' }}>{tc.input}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--tx-3)' }}>output </span>
                    <span style={{ color: 'var(--cyan)' }}>{tc.output}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div>
          <div className="label" style={{ marginBottom: '10px' }}>Constraints</div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {problem.constraints.map((c, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--tx-3)',
                }}
              >
                <span style={{ color: 'var(--border-hi)', flexShrink: 0 }}>{"//"}</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function EditorPane({
  lang,
  code,
  running,
  results,
  error,
  allPassed,
  changeLang,
  execute,
  setCode,
}: {
  lang: string
  code: string
  running: boolean
  results: ExecutionResult[] | null
  error: string | null
  allPassed: boolean
  changeLang: (l: string) => void
  execute: () => Promise<void>
  setCode: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-raised)',
          flexShrink: 0,
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--border-hi)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--border-hi)' }} />
          </div>
          <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />
          {/* Lang selector */}
          <select
            value={lang}
            onChange={e => changeLang(e.target.value)}
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border)',
              color: 'var(--tx-1)',
              fontSize: '12px',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              padding: '4px 8px',
              borderRadius: 'var(--r-sm)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        {/* Run button */}
        <button
          onClick={execute}
          disabled={running}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            background: running ? 'var(--bg-overlay)' : 'var(--em)',
            color: running ? 'var(--tx-2)' : '#000',
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            border: running ? '1px solid var(--border-md)' : 'none',
            borderRadius: 'var(--r-sm)',
            cursor: running ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {running ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ animation: 'spin 0.7s linear infinite' }}>
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
                <path d="M6 1.5A4.5 4.5 0 0 1 10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Running
            </>
          ) : (
            <>▶ Execute</>
          )}
        </button>
      </div>

      {/* Monaco */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          language={lang}
          theme="vs-dark"
          value={code}
          onChange={v => setCode(v || '')}
          options={{
            // Layout
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'var(--font-mono), JetBrains Mono, Menlo, monospace',
            fontLigatures: true,
            padding: { top: 14, bottom: 14 },
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: false,
            renderLineHighlight: 'gutter',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            automaticLayout: true,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            
            // Selection & Keyboard
            selectionHighlight: true,
            occurrencesHighlight: 'multiFile',
            contextmenu: true,
            copyWithSyntaxHighlighting: true,
            
            // IntelliSense & Autocomplete
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            quickSuggestionsDelay: 100,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: 'on',
            parameterHints: {
              enabled: true,
              cycle: true,
            },
          } as EditorOptions}
        />
      </div>

      {/* Console */}
      <div
        style={{
          height: '130px',
          flexShrink: 0,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-base)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 12px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-raised)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--tx-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Console
          </span>
          <AnimatePresence>
            {(results !== null || error !== null) && (
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`badge ${allPassed ? 'badge-easy' : 'badge-hard'}`}
              >
                {allPassed ? 'Passed' : 'Failed'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
          }}
        >
          {error ? (
            <pre style={{ color: 'var(--rose)', whiteSpace: 'pre-wrap', margin: 0 }}>{error}</pre>
          ) : results ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {results.map((r, i) => (
                <div key={i} style={{ color: r.passed ? 'var(--em)' : 'var(--rose)' }}>
                  {r.passed ? '✓' : '✗'} Test {r.testCase}
                  {!r.passed && <span style={{ color: 'var(--tx-3)', marginLeft: '8px' }}>expected {r.expected} · got {r.actual}</span>}
                </div>
              ))}
            </div>
          ) : (
            <span style={{ color: 'var(--tx-3)', fontStyle: 'italic', fontSize: '11px' }}>
              Ready for execution...
            </span>
          )}
        </div>
      </div>
    </div>
  )
}