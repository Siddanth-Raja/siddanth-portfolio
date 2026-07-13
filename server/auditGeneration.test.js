import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { createFallbackReport, generateAuditReport } from './auditGeneration.js'

const originalFetch = global.fetch
const originalConsoleLog = console.log
const originalConsoleError = console.error

afterEach(() => {
  global.fetch = originalFetch
  console.log = originalConsoleLog
  console.error = originalConsoleError
})

test('mocked valid OpenAI response passes AuditReport validation', async () => {
  silenceAuditLogs()

  const input = createInput()
  const validReport = createFallbackReport(input)

  global.fetch = async (_url, options) => {
    const requestBody = JSON.parse(options.body)
    const schema = requestBody.text.format.schema

    assert.deepEqual(schema.required, [
      'businessName',
      'websiteUrl',
      'industry',
      'preparedBy',
      'date',
      'overallScore',
      'executiveSummary',
      'summaryCards',
      'firstImpressionScores',
      'firstImpressionFindings',
      'customerJourney',
      'conversionOpportunities',
      'aiOpportunities',
      'priorityMatrix',
      'recommendedNextSteps',
      'finalNote',
    ])
    assert.equal(schema.additionalProperties, false)
    assert.equal(schema.properties.summaryCards.minItems, 4)
    assert.equal(schema.properties.summaryCards.maxItems, 4)
    assert.equal(schema.properties.firstImpressionScores.minItems, 3)
    assert.equal(schema.properties.customerJourney.properties.steps.minItems, 5)
    assert.equal(schema.properties.finalNote.properties.paragraphs.minItems, 3)
    assert.deepEqual(schema.properties.conversionOpportunities.items.properties.impact.enum, [
      'High',
      'Medium',
      'Low',
    ])
    assert.deepEqual(schema.properties.aiOpportunities.items.properties.difficulty.enum, [
      'Low',
      'Medium',
      'High',
    ])

    const systemPrompt = requestBody.input[0].content
    assert.match(systemPrompt, /executiveSummary\.body <= 90 words/)
    assert.match(systemPrompt, /summaryCards\[\]\.detail <= 28 words/)
    assert.match(systemPrompt, /Do not repeat the same observation/)
    assert.match(systemPrompt, /Do not invent metrics/)
    assert.match(systemPrompt, /Every AI opportunity must map to a real workflow/)

    return {
      ok: true,
      json: async () => ({ output_text: JSON.stringify(validReport) }),
    }
  }

  const result = await generateAuditReport(input, {
    OPENAI_API_KEY: 'test-api-key',
    OPENAI_AUDIT_MODEL: 'test-model',
  })

  assert.equal(result.source, 'openai')
  assert.deepEqual(result.report, validReport)
})

test('mocked malformed OpenAI response fails AuditReport validation loudly', async () => {
  silenceAuditLogs()

  global.fetch = async () => ({
    ok: true,
    json: async () => ({ output_text: '{not valid json' }),
  })

  await assert.rejects(
    () => generateAuditReport(createInput(), { OPENAI_API_KEY: 'test-api-key' }),
    /JSON parse failed:/,
  )
})

test('mocked response with a missing required field fails clearly', async () => {
  silenceAuditLogs()

  const input = createInput()
  const malformedReport = createFallbackReport(input)
  delete malformedReport.finalNote

  global.fetch = async () => ({
    ok: true,
    json: async () => ({ output_text: JSON.stringify(malformedReport) }),
  })

  await assert.rejects(
    () => generateAuditReport(input, { OPENAI_API_KEY: 'test-api-key' }),
    /Schema validation failed: finalNote: expected object, received undefined/,
  )
})

test('mocked response with incorrect client metadata fails clearly', async () => {
  silenceAuditLogs()

  const input = createInput()
  const report = createFallbackReport(input)
  report.finalNote.signatureTitle = 'AI Growth Consultant'

  global.fetch = async () => ({
    ok: true,
    json: async () => ({ output_text: JSON.stringify(report) }),
  })

  await assert.rejects(
    () => generateAuditReport(input, { OPENAI_API_KEY: 'test-api-key' }),
    /finalNote\.signatureTitle: expected exact value "AI Growth Systems"/,
  )
})

test('mocked valid OpenAI response normalizes formatting without damaging correct prose', async () => {
  silenceAuditLogs()

  const input = createInput()
  const report = createFallbackReport(input)
  const correctProse = 'A clear contact path preserves meaning, punctuation, and the business-specific recommendation.'
  report.executiveSummary.body = `  ${correctProse}  `
  report.summaryCards[0].detail = '* Clear proof near the first action can reduce hesitation.'
  report.firstImpressionFindings[0].noticed = '1. The contact link sits below a long introduction.\nIt is easy to miss.'
  report.aiOpportunities[0].does = '**Collects details** after a missed call and routes them to the right person.'

  global.fetch = async () => ({
    ok: true,
    json: async () => ({ output_text: JSON.stringify(report) }),
  })

  const result = await generateAuditReport(input, { OPENAI_API_KEY: 'test-api-key' })

  assert.equal(result.source, 'openai')
  assert.equal(result.report.executiveSummary.body, correctProse)
  assert.equal(
    result.report.summaryCards[0].detail,
    'Clear proof near the first action can reduce hesitation.',
  )
  assert.equal(
    result.report.firstImpressionFindings[0].noticed,
    'The contact link sits below a long introduction. It is easy to miss.',
  )
  assert.equal(
    result.report.aiOpportunities[0].does,
    'Collects details after a missed call and routes them to the right person.',
  )
})

test('over-limit prose fails explicitly instead of being truncated', async () => {
  silenceAuditLogs()

  const input = createInput()
  const report = createFallbackReport(input)
  report.executiveSummary.body = makeWords('word', 91)

  global.fetch = async () => ({
    ok: true,
    json: async () => ({ output_text: JSON.stringify(report) }),
  })

  await assert.rejects(
    () => generateAuditReport(input, { OPENAI_API_KEY: 'test-api-key' }),
    /executiveSummary\.body: expected at most 90 words, received 91/,
  )
})

test('final note combined word limit is deterministic and explicit', async () => {
  silenceAuditLogs()

  const input = createInput()
  const report = createFallbackReport(input)
  report.finalNote.paragraphs = [makeWords('word', 31), makeWords('word', 30), makeWords('word', 30)]

  global.fetch = async () => ({
    ok: true,
    json: async () => ({ output_text: JSON.stringify(report) }),
  })

  await assert.rejects(
    () => generateAuditReport(input, { OPENAI_API_KEY: 'test-api-key' }),
    /finalNote\.paragraphs: expected at most 90 words combined, received 91/,
  )
})

test('sample fallback still works when no API key is configured', async () => {
  const input = createInput()
  const result = await generateAuditReport(input, {})

  assert.equal(result.source, 'sample_fallback')
  assert.deepEqual(result.report, createFallbackReport(input))
})

function createInput() {
  return {
    businessName: 'Allen Family Dental',
    websiteUrl: 'allenfamilydental.com',
    industry: 'Dental Practice',
    extraNotes: '',
  }
}

function silenceAuditLogs() {
  console.log = () => {}
  console.error = () => {}
}

function makeWords(word, count) {
  return Array.from({ length: count }, () => word).join(' ')
}
