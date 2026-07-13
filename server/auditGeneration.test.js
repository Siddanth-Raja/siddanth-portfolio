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

test('mocked valid OpenAI response normalizes overlong markdown prose', async () => {
  silenceAuditLogs()

  const input = createInput()
  const report = createFallbackReport(input)
  report.executiveSummary.body = `- ${makeWords('summary', 110)}`
  report.summaryCards[0].detail = `* ${makeWords('detail', 40)}`
  report.firstImpressionFindings[0].noticed = `1. ${makeWords('noticed', 40)}`
  report.firstImpressionFindings[0].matters = makeWords('matters', 40)
  report.firstImpressionFindings[0].instead = makeWords('instead', 42)
  report.conversionOpportunities[0].impact = 'Very High Priority Label'
  report.conversionOpportunities[0].noticed = makeWords('conversion', 42)
  report.conversionOpportunities[0].matters = makeWords('because', 44)
  report.conversionOpportunities[0].instead = makeWords('fix', 44)
  report.aiOpportunities[0].does = makeWords('automation', 38)
  report.aiOpportunities[0].helps = makeWords('helps', 40)
  report.finalNote.paragraphs = [
    makeWords('final-a', 38),
    makeWords('final-b', 38),
    makeWords('final-c', 38),
  ]

  global.fetch = async () => ({
    ok: true,
    json: async () => ({ output_text: JSON.stringify(report) }),
  })

  const result = await generateAuditReport(input, { OPENAI_API_KEY: 'test-api-key' })

  assert.equal(result.source, 'openai')
  assert.equal(countWords(result.report.executiveSummary.body), 90)
  assert.equal(countWords(result.report.summaryCards[0].detail), 28)
  assert.equal(countWords(result.report.firstImpressionFindings[0].noticed), 28)
  assert.equal(countWords(result.report.firstImpressionFindings[0].matters), 32)
  assert.equal(countWords(result.report.firstImpressionFindings[0].instead), 36)
  assert.equal(countWords(result.report.conversionOpportunities[0].impact), 3)
  assert.equal(countWords(result.report.conversionOpportunities[0].noticed), 30)
  assert.equal(countWords(result.report.conversionOpportunities[0].matters), 35)
  assert.equal(countWords(result.report.conversionOpportunities[0].instead), 38)
  assert.equal(countWords(result.report.aiOpportunities[0].does), 32)
  assert.equal(countWords(result.report.aiOpportunities[0].helps), 35)
  assert.equal(result.report.finalNote.paragraphs.reduce((total, item) => total + countWords(item), 0), 90)
  assert.match(result.report.executiveSummary.body, /\.\.\.$/)
  assert.doesNotMatch(result.report.executiveSummary.body, /^-/)
  assert.doesNotMatch(result.report.summaryCards[0].detail, /^\*/)
  assert.doesNotMatch(result.report.firstImpressionFindings[0].noticed, /^1\./)
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

function makeWords(prefix, count) {
  return Array.from({ length: count }, () => prefix.slice(0, 1)).join(' ')
}

function countWords(value) {
  return value.split(/\s+/).filter(Boolean).length
}
