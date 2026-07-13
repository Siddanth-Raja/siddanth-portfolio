const CURRENT_DATE = 'July 2026'
const PREPARED_BY = 'Siddanth Raja'
const SIGNATURE_TITLE = 'AI Growth Systems'
const DEFAULT_MODEL = 'gpt-5.5'

class AuditGenerationError extends Error {
  constructor(reason, detail) {
    super(detail ? `${reason}: ${detail}` : reason)
    this.reason = reason
    this.detail = detail
  }
}

const auditReportJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
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
  ],
  properties: {
    businessName: { type: 'string', minLength: 1, maxLength: 120 },
    websiteUrl: { type: 'string', minLength: 1, maxLength: 180 },
    industry: { type: 'string', minLength: 1, maxLength: 120 },
    preparedBy: { type: 'string', minLength: 1, maxLength: 80 },
    date: { type: 'string', minLength: 1, maxLength: 60 },
    overallScore: { type: 'number' },
    executiveSummary: {
      type: 'object',
      additionalProperties: false,
      required: ['heading', 'body'],
      properties: {
        heading: { type: 'string', minLength: 1, maxLength: 180 },
        body: { type: 'string', minLength: 1, maxLength: 650 },
      },
    },
    summaryCards: {
      type: 'array',
      minItems: 4,
      maxItems: 4,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'detail'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 80 },
          detail: { type: 'string', minLength: 1, maxLength: 210 },
        },
      },
    },
    firstImpressionScores: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'score', 'note'],
        properties: {
          label: { type: 'string', minLength: 1, maxLength: 50 },
          score: { type: 'string', minLength: 1, maxLength: 20 },
          note: { type: 'string', minLength: 1, maxLength: 180 },
        },
      },
    },
    firstImpressionFindings: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: findingSchema(),
    },
    customerJourney: {
      type: 'object',
      additionalProperties: false,
      required: ['heading', 'steps', 'frictionPoints'],
      properties: {
        heading: { type: 'string', minLength: 1, maxLength: 120 },
        steps: {
          type: 'array',
          minItems: 5,
          maxItems: 5,
          items: { type: 'string', minLength: 1, maxLength: 50 },
        },
        frictionPoints: {
          type: 'array',
          minItems: 3,
          maxItems: 3,
          items: { type: 'string', minLength: 1, maxLength: 150 },
        },
      },
    },
    conversionOpportunities: {
      type: 'array',
      minItems: 4,
      maxItems: 4,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'impact', 'noticed', 'matters', 'instead'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 100 },
          impact: { type: 'string', minLength: 1, maxLength: 30 },
          noticed: { type: 'string', minLength: 1, maxLength: 230 },
          matters: { type: 'string', minLength: 1, maxLength: 270 },
          instead: { type: 'string', minLength: 1, maxLength: 300 },
        },
      },
    },
    aiOpportunities: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'does', 'helps', 'difficulty'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 100 },
          does: { type: 'string', minLength: 1, maxLength: 250 },
          helps: { type: 'string', minLength: 1, maxLength: 280 },
          difficulty: { type: 'string', minLength: 1, maxLength: 40 },
        },
      },
    },
    priorityMatrix: {
      type: 'array',
      minItems: 4,
      maxItems: 4,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'items'],
        properties: {
          label: { type: 'string', minLength: 1, maxLength: 80 },
          items: {
            type: 'array',
            minItems: 2,
            maxItems: 4,
            items: { type: 'string', minLength: 1, maxLength: 120 },
          },
        },
      },
    },
    recommendedNextSteps: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'items'],
        properties: {
          label: { type: 'string', minLength: 1, maxLength: 80 },
          items: {
            type: 'array',
            minItems: 2,
            maxItems: 4,
            items: { type: 'string', minLength: 1, maxLength: 120 },
          },
        },
      },
    },
    finalNote: {
      type: 'object',
      additionalProperties: false,
      required: ['heading', 'paragraphs', 'signatureName', 'signatureTitle'],
      properties: {
        heading: { type: 'string', minLength: 1, maxLength: 160 },
        paragraphs: {
          type: 'array',
          minItems: 3,
          maxItems: 3,
          items: { type: 'string', minLength: 1, maxLength: 240 },
        },
        signatureName: { type: 'string', minLength: 1, maxLength: 80 },
        signatureTitle: { type: 'string', minLength: 1, maxLength: 80 },
      },
    },
  },
}

function findingSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['noticed', 'matters', 'instead'],
    properties: {
      noticed: { type: 'string', minLength: 1, maxLength: 230 },
      matters: { type: 'string', minLength: 1, maxLength: 260 },
      instead: { type: 'string', minLength: 1, maxLength: 290 },
    },
  }
}

export async function handleGenerateAuditRequest(req, res, runtimeEnv = process.env) {
  if (req.method !== 'POST') {
    return writeJson(res, 405, { error: 'Use POST to generate an audit draft.' })
  }

  let input
  try {
    input = sanitizeDraftInput(await readJsonBody(req))
  } catch {
    return writeJson(res, 400, { error: 'Please enter valid audit details.' })
  }

  try {
    const result = await generateAuditReport(input, runtimeEnv)
    return writeJson(res, 200, result)
  } catch (error) {
    const isKnownGenerationError = error instanceof AuditGenerationError

    return writeJson(res, 500, {
      error: isKnownGenerationError
        ? error.message
        : error instanceof Error
          ? error.message
          : 'Audit generation failed.',
      errorReason: isKnownGenerationError ? error.reason : undefined,
      firstValidationError: isKnownGenerationError ? error.detail : undefined,
      fallbackReport: createFallbackReport(input),
      source: 'error',
    })
  }
}

export async function generateAuditReport(input, runtimeEnv = process.env) {
  const apiKey = runtimeEnv.OPENAI_API_KEY || runtimeEnv.VITE_OPENAI_API_KEY

  if (!apiKey) {
    return {
      report: createFallbackReport(input),
      source: 'sample_fallback',
      warning: 'No OpenAI API key configured. Used the sample fallback generator.',
    }
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: runtimeEnv.OPENAI_AUDIT_MODEL || runtimeEnv.OPENAI_MODEL || DEFAULT_MODEL,
      input: [
        {
          role: 'system',
          content: [
            'You write premium AI Growth Audit reports for local businesses.',
            'Return one JSON object only. It must match the AuditReport schema exactly.',
            'Use every required top-level field exactly once: businessName, websiteUrl, industry, preparedBy, date, overallScore, executiveSummary, summaryCards, firstImpressionScores, firstImpressionFindings, customerJourney, conversionOpportunities, aiOpportunities, priorityMatrix, recommendedNextSteps, finalNote.',
            `Set preparedBy to "${PREPARED_BY}" and date to "${CURRENT_DATE}".`,
            'Do not rename fields, omit fields, wrap the report in another object, or include markdown.',
            'Keep content concise so cards and PDFs remain readable.',
            'Length limits: executiveSummary.body <= 90 words; summaryCards.detail <= 28 words; firstImpressionFindings.noticed <= 28 words, matters <= 32 words, instead <= 36 words; conversionOpportunities.impact is one word or a very short label, noticed <= 30 words, matters <= 35 words, instead <= 38 words; aiOpportunities.does <= 32 words, helps <= 35 words; finalNote.paragraphs combined <= 90 words.',
            'Use business language: customers, patients, calls, bookings, trust, leads, follow-up, time saved.',
            'Avoid these words and topics: typography, hierarchy, frontend, responsive design, React, Next.js, Tailwind, generic UX filler.',
            "Every recommendation must follow What I noticed -> Why it matters -> What I'd do instead.",
            'Be practical, specific, calm, and premium. Do not invent private facts. When website details are unknown, frame observations as likely audit opportunities.',
          ].join('\n'),
        },
        {
          role: 'user',
          content: buildPrompt(input),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'audit_report',
          strict: true,
          schema: auditReportJsonSchema,
        },
      },
      max_output_tokens: 6500,
    }),
  })

  const data = await response.json()
  logOpenAIResponse(data)

  if (!response.ok) {
    throw new Error(getOpenAIErrorMessage(data))
  }

  let parsed
  try {
    parsed = parseOpenAIJson(data)
  } catch (error) {
    const detail = getErrorDetail(error)
    console.error('[audit-generation] JSON parse failed:', detail)
    throw new AuditGenerationError('JSON parse failed', detail)
  }

  const normalized = normalizeAuditReportContent(parsed)

  logParsedAuditJson(normalized)

  const validationErrors = getAuditReportValidationErrors(normalized)
  if (validationErrors.length > 0) {
    console.error('[audit-generation] Schema validation failed:', validationErrors)
    throw new AuditGenerationError('Schema validation failed', validationErrors[0])
  }

  const report = sanitizeAuditReport(normalized)

  if (!report) {
    const detail = 'AuditReport sanitizer rejected a payload that passed schema validation.'
    console.error('[audit-generation] Schema validation failed:', [detail])
    throw new AuditGenerationError('Schema validation failed', detail)
  }

  return { report, source: 'openai' }
}

export function createFallbackReport(input) {
  const businessName = input.businessName || 'Allen Family Dental'
  const websiteUrl = input.websiteUrl || 'allenfamilydental.com'
  const industry = input.industry || 'Dental Practice'
  const industryLower = industry.toLowerCase()
  const notes = input.extraNotes ? ` Notes to consider for this draft: ${input.extraNotes}` : ''

  return {
    businessName,
    websiteUrl,
    industry,
    preparedBy: PREPARED_BY,
    date: CURRENT_DATE,
    overallScore: 82,
    executiveSummary: {
      heading: `Where ${businessName} is strong, and where more leads may be captured.`,
      body: `${businessName} has the foundation for a stronger online customer journey. This draft adapts the audit for a ${industryLower} and focuses on clearer calls, easier booking, stronger trust signals, and practical AI follow-up opportunities.${notes}`,
    },
    summaryCards: [
      {
        title: 'Strong first impression',
        detail: `${businessName} can feel credible quickly if the first screen makes trust and contact options easy to see.`,
      },
      {
        title: 'Booking path could be clearer',
        detail: `A ready customer should immediately know whether to call, book, or ask a question on ${websiteUrl}.`,
      },
      {
        title: 'Mobile contact needs priority',
        detail: `Most visitors will check a ${industryLower} from a phone, so contact actions should be visible before they scroll.`,
      },
      {
        title: 'AI follow-up could capture more leads',
        detail: 'Missed calls, after-hours questions, and incomplete forms are practical places where automation can recover inquiries.',
      },
    ],
    firstImpressionScores: [
      { label: 'Trust', score: '8/10', note: 'The business can earn confidence quickly with clearer proof near the first action.' },
      { label: 'Clarity', score: '7/10', note: 'The main offer can be clear, but the next step should be more direct.' },
      { label: 'Action', score: '6/10', note: 'Calls, bookings, and follow-up should be easier to start from mobile.' },
    ],
    firstImpressionFindings: [
      {
        noticed: `${businessName} likely has useful trust signals, but they may not be doing enough work near the top of the customer journey.`,
        matters: `People comparing a ${industryLower} often decide quickly whether the business feels safe enough to contact.`,
        instead: 'Put reviews, proof, and one clear call or booking action close to the first screen.',
      },
      {
        noticed: 'The appointment or contact action may not feel like the obvious next step.',
        matters: 'A ready customer can leave if they have to hunt for the fastest way to reach the business.',
        instead: 'Use one primary action, repeat it after important sections, and keep the wording consistent.',
      },
      {
        noticed: 'Mobile visitors may need a faster path to call, ask a question, or book.',
        matters: 'Many high-intent visitors are between tasks and will act only if the contact path is immediate.',
        instead: 'Add a prominent mobile contact action and make the phone or booking path visible before scrolling.',
      },
    ],
    customerJourney: {
      heading: 'How a search becomes a new customer.',
      steps: ['Google Search', 'Website Visit', 'Trust Building', 'Contact/Booking', 'New Customer'],
      frictionPoints: [
        'Visitor has to search for the main appointment or contact action.',
        'Phone number or contact option could be more visible on mobile.',
        'Reviews and customer proof could appear earlier.',
      ],
    },
    conversionOpportunities: [
      {
        title: 'Make booking or contact easier to find',
        impact: 'High',
        noticed: 'The next step may be available, but it should feel impossible to miss.',
        matters: `Customers comparing options often choose the ${industryLower} that makes contact easiest.`,
        instead: 'Place one clear primary action near the top and repeat it at natural decision points.',
      },
      {
        title: 'Put phone/contact actions above the fold on mobile',
        impact: 'High',
        noticed: 'On a small screen, contact can feel secondary to browsing.',
        matters: 'Mobile visitors often want to call quickly while the need is fresh.',
        instead: 'Show a clear call or booking button before long content begins.',
      },
      {
        title: 'Add stronger trust signals near the first action',
        impact: 'Medium',
        noticed: 'The page can earn trust faster by showing proof before asking for contact.',
        matters: 'Customers want to know the business is experienced, reviewed, local, and easy to work with.',
        instead: 'Place review snippets, proof points, and a short customer promise near the main action.',
      },
      {
        title: 'Simplify the page into one clear next step',
        impact: 'Medium',
        noticed: 'Visitors may be asked to consider too many choices before contacting the business.',
        matters: 'Too many equal options can slow down a customer who is already ready to act.',
        instead: 'Make the path: understand the business, see proof, choose call or booking, then confirm details.',
      },
    ],
    aiOpportunities: [
      {
        title: 'After-hours AI receptionist',
        does: 'Answers common questions, collects contact details, and points visitors to the next booking path after hours.',
        helps: 'Customers can take the next step even when the team is unavailable.',
        difficulty: 'Medium',
      },
      {
        title: 'New customer intake assistant',
        does: 'Collects basic needs, contact details, timing, and preferences before the first conversation.',
        helps: 'The team gets cleaner information and spends less time repeating the same questions.',
        difficulty: 'Medium',
      },
      {
        title: 'Missed-call follow-up automation',
        does: 'Sends a helpful text or email when the business misses a call during busy hours.',
        helps: 'A missed call can turn into a recovered lead instead of a lost opportunity.',
        difficulty: 'Low',
      },
      {
        title: 'Review request automation',
        does: 'Asks satisfied customers for a review after a successful interaction.',
        helps: 'Fresh reviews build trust for future visitors and make the business look active online.',
        difficulty: 'Low',
      },
      {
        title: 'FAQ assistant for common questions',
        does: 'Answers questions about services, hours, location, pricing expectations, and what happens next.',
        helps: 'Customers get answers faster, and the team spends less time on repetitive questions.',
        difficulty: 'Low',
      },
    ],
    priorityMatrix: [
      {
        label: 'High Impact / Low Effort',
        items: ['Mobile call button', 'Primary contact button above the fold', 'Review snippets near top'],
      },
      {
        label: 'High Impact / High Effort',
        items: ['Improved booking flow', 'After-hours AI receptionist', 'New customer intake automation'],
      },
      {
        label: 'Low Impact / Low Effort',
        items: ['Shorter service intro copy', 'Cleaner footer contact area', 'Simple FAQ additions'],
      },
      {
        label: 'Low Impact / High Effort',
        items: ['Full internal dashboard', 'Advanced inquiry routing', 'Large content rebuild before contact fixes'],
      },
    ],
    recommendedNextSteps: [
      {
        label: 'This week',
        items: ['Move appointment/contact CTA higher', 'Add stronger mobile contact button', 'Add reviews/testimonials near top'],
      },
      {
        label: 'This month',
        items: ['Improve booking flow', 'Add lead capture form', 'Set up review follow-up automation'],
      },
      {
        label: 'Later',
        items: ['AI receptionist', 'intake automation', 'internal customer inquiry dashboard'],
      },
    ],
    finalNote: {
      heading: 'A few practical next steps are already within reach.',
      paragraphs: [
        `I enjoyed putting this together because I think ${businessName} has real potential online.`,
        'Whether you use these ideas yourself or work with someone else, I hope this gives you a few practical next steps.',
        "If you're curious how I'd approach implementing any of them, just reply.",
      ],
      signatureName: PREPARED_BY,
      signatureTitle: SIGNATURE_TITLE,
    },
  }
}

function buildPrompt(input) {
  return [
    `Business name: ${input.businessName}`,
    `Website URL: ${input.websiteUrl}`,
    `Industry: ${input.industry}`,
    `Optional notes: ${input.extraNotes || 'None provided'}`,
    '',
    'Create a customized AI Growth Audit report as the top-level JSON object.',
    'The report must feel specific to this business and industry, even if you cannot browse the website.',
    `businessName must equal "${input.businessName}".`,
    `websiteUrl must equal "${input.websiteUrl}".`,
    `industry must equal "${input.industry}".`,
    `preparedBy must equal "${PREPARED_BY}".`,
    `date must equal "${CURRENT_DATE}".`,
    'overallScore must be a number from 0 to 100.',
    'Use exactly 4 summaryCards.',
    'Use exactly 3 firstImpressionScores.',
    'Use exactly 3 firstImpressionFindings.',
    'Use exactly 5 customerJourney.steps and exactly 3 customerJourney.frictionPoints.',
    'Use exactly 4 conversionOpportunities.',
    'Use exactly 5 aiOpportunities.',
    'Use exactly 4 priorityMatrix groups, each with 2 to 4 items.',
    'Use exactly 3 recommendedNextSteps groups, each with 2 to 4 items.',
    'Use exactly 3 finalNote.paragraphs and include a final curiosity note with no hard sell.',
    'Do not use markdown bullets inside string values. Write plain sentence text.',
    'Keep every card concise enough to fit cleanly in a printable report.',
  ].join('\n')
}

function parseOpenAIJson(data) {
  if (typeof data.output_text === 'string') {
    return JSON.parse(data.output_text)
  }

  const text = data.output
    ?.flatMap((item) => item.content || [])
    ?.find((content) => content.type === 'output_text' && typeof content.text === 'string')
    ?.text

  if (!text) {
    throw new Error('OpenAI returned an empty audit draft.')
  }

  return JSON.parse(text)
}

function normalizeAuditReportContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    businessName: normalizeText(value.businessName, undefined, 120),
    websiteUrl: normalizeText(value.websiteUrl, undefined, 180),
    industry: normalizeText(value.industry, undefined, 120),
    preparedBy: normalizeText(value.preparedBy, undefined, 80),
    date: normalizeText(value.date, undefined, 60),
    executiveSummary: normalizeExecutiveSummaryContent(value.executiveSummary),
    summaryCards: normalizeArrayContent(value.summaryCards, normalizeSummaryCardContent),
    firstImpressionScores: normalizeArrayContent(value.firstImpressionScores, normalizeScoreContent),
    firstImpressionFindings: normalizeArrayContent(value.firstImpressionFindings, (item) =>
      normalizeFindingContent(item, {
        noticed: 28,
        matters: 32,
        instead: 36,
      }),
    ),
    customerJourney: normalizeCustomerJourneyContent(value.customerJourney),
    conversionOpportunities: normalizeArrayContent(value.conversionOpportunities, normalizeConversionContent),
    aiOpportunities: normalizeArrayContent(value.aiOpportunities, normalizeAiOpportunityContent),
    priorityMatrix: normalizeArrayContent(value.priorityMatrix, normalizeListGroupContent),
    recommendedNextSteps: normalizeArrayContent(value.recommendedNextSteps, normalizeListGroupContent),
    finalNote: normalizeFinalNoteContent(value.finalNote),
  }
}

function normalizeExecutiveSummaryContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    heading: normalizeText(value.heading, undefined, 180),
    body: normalizeText(value.body, 90, 650),
  }
}

function normalizeSummaryCardContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    title: normalizeText(value.title, undefined, 80),
    detail: normalizeText(value.detail, 28, 210),
  }
}

function normalizeScoreContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    label: normalizeText(value.label, undefined, 50),
    score: normalizeText(value.score, undefined, 20),
    note: normalizeText(value.note, 26, 180),
  }
}

function normalizeFindingContent(value, limits) {
  if (!isRecord(value)) return value

  return {
    ...value,
    noticed: normalizeText(value.noticed, limits.noticed, 230),
    matters: normalizeText(value.matters, limits.matters, 260),
    instead: normalizeText(value.instead, limits.instead, 290),
  }
}

function normalizeCustomerJourneyContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    heading: normalizeText(value.heading, undefined, 120),
    steps: normalizeStringArrayContent(value.steps, 8, 50),
    frictionPoints: normalizeStringArrayContent(value.frictionPoints, 18, 150),
  }
}

function normalizeConversionContent(value) {
  if (!isRecord(value)) return value
  const finding = normalizeFindingContent(value, {
    noticed: 30,
    matters: 35,
    instead: 38,
  })

  return {
    ...value,
    title: normalizeText(value.title, undefined, 100),
    impact: normalizeText(value.impact, 3, 30),
    noticed: finding.noticed,
    matters: finding.matters,
    instead: finding.instead,
  }
}

function normalizeAiOpportunityContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    title: normalizeText(value.title, undefined, 100),
    does: normalizeText(value.does, 32, 250),
    helps: normalizeText(value.helps, 35, 280),
    difficulty: normalizeText(value.difficulty, 4, 40),
  }
}

function normalizeListGroupContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    label: normalizeText(value.label, undefined, 80),
    items: normalizeStringArrayContent(value.items, 14, 120),
  }
}

function normalizeFinalNoteContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    heading: normalizeText(value.heading, undefined, 160),
    paragraphs: normalizeStringArrayContent(value.paragraphs, 30, 150),
    signatureName: normalizeText(value.signatureName, undefined, 80),
    signatureTitle: normalizeText(value.signatureTitle, undefined, 80),
  }
}

function normalizeArrayContent(value, normalizeItem) {
  if (!Array.isArray(value)) return value
  return value.map(normalizeItem)
}

function normalizeStringArrayContent(value, wordLimit, charLimit) {
  if (!Array.isArray(value)) return value
  return value.map((item) => normalizeText(item, wordLimit, charLimit))
}

function normalizeText(value, wordLimit, charLimit) {
  if (typeof value !== 'string') return value

  const cleaned = value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s+/, ''))
    .join(' ')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const wordLimited = wordLimit ? truncateWords(cleaned, wordLimit) : cleaned

  return charLimit ? truncateCharacters(wordLimited, charLimit) : wordLimited
}

function truncateWords(value, wordLimit) {
  const words = value.split(/\s+/).filter(Boolean)
  if (words.length <= wordLimit) return value
  return `${words.slice(0, wordLimit).join(' ')}...`
}

function truncateCharacters(value, charLimit) {
  if (value.length <= charLimit) return value

  const shortened = value.slice(0, Math.max(0, charLimit - 3)).replace(/\s+\S*$/, '').trim()
  return `${shortened}...`
}

function getAuditReportValidationErrors(value) {
  const errors = []

  validateRecord(value, 'report', errors)
  if (!isRecord(value)) return errors

  validateString(value, 'businessName', errors)
  validateString(value, 'websiteUrl', errors)
  validateString(value, 'industry', errors)
  validateString(value, 'preparedBy', errors)
  validateString(value, 'date', errors)
  validateFiniteNumber(value, 'overallScore', errors)

  validateExecutiveSummary(value.executiveSummary, 'executiveSummary', errors)
  validateArray(value.summaryCards, 'summaryCards', errors, 4, 4, (item, path) => {
    validateString(item, `${path}.title`, errors)
    validateString(item, `${path}.detail`, errors)
  })
  validateArray(value.firstImpressionScores, 'firstImpressionScores', errors, 3, 3, (item, path) => {
    validateString(item, `${path}.label`, errors)
    validateString(item, `${path}.score`, errors)
    validateString(item, `${path}.note`, errors)
  })
  validateArray(value.firstImpressionFindings, 'firstImpressionFindings', errors, 3, 3, (item, path) => {
    validateFinding(item, path, errors)
  })
  validateCustomerJourney(value.customerJourney, 'customerJourney', errors)
  validateArray(value.conversionOpportunities, 'conversionOpportunities', errors, 4, 4, (item, path) => {
    validateString(item, `${path}.title`, errors)
    validateString(item, `${path}.impact`, errors)
    validateFinding(item, path, errors)
  })
  validateArray(value.aiOpportunities, 'aiOpportunities', errors, 5, 5, (item, path) => {
    validateString(item, `${path}.title`, errors)
    validateString(item, `${path}.does`, errors)
    validateString(item, `${path}.helps`, errors)
    validateString(item, `${path}.difficulty`, errors)
  })
  validateArray(value.priorityMatrix, 'priorityMatrix', errors, 4, 4, (item, path) => {
    validateString(item, `${path}.label`, errors)
    validateStringArray(item?.items, `${path}.items`, errors, 2, 4)
  })
  validateArray(value.recommendedNextSteps, 'recommendedNextSteps', errors, 3, 3, (item, path) => {
    validateString(item, `${path}.label`, errors)
    validateStringArray(item?.items, `${path}.items`, errors, 2, 4)
  })
  validateFinalNote(value.finalNote, 'finalNote', errors)

  return errors
}

function validateExecutiveSummary(value, path, errors) {
  if (!validateRecord(value, path, errors)) return
  validateString(value, `${path}.heading`, errors)
  validateString(value, `${path}.body`, errors)
}

function validateCustomerJourney(value, path, errors) {
  if (!validateRecord(value, path, errors)) return
  validateString(value, `${path}.heading`, errors)
  validateStringArray(value.steps, `${path}.steps`, errors, 5, 5)
  validateStringArray(value.frictionPoints, `${path}.frictionPoints`, errors, 3, 3)
}

function validateFinding(value, path, errors) {
  validateString(value, `${path}.noticed`, errors)
  validateString(value, `${path}.matters`, errors)
  validateString(value, `${path}.instead`, errors)
}

function validateFinalNote(value, path, errors) {
  if (!validateRecord(value, path, errors)) return
  validateString(value, `${path}.heading`, errors)
  validateStringArray(value.paragraphs, `${path}.paragraphs`, errors, 3, 3)
  validateString(value, `${path}.signatureName`, errors)
  validateString(value, `${path}.signatureTitle`, errors)
}

function validateArray(value, path, errors, minLength, maxLength, validateItem) {
  if (!Array.isArray(value)) {
    errors.push(`${path}: expected array, received ${describeValue(value)}`)
    return
  }

  if (value.length < minLength || value.length > maxLength) {
    errors.push(`${path}: expected ${formatLengthRange(minLength, maxLength)} items, received ${value.length}`)
  }

  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`
    if (!validateRecord(item, itemPath, errors)) return
    validateItem(item, itemPath)
  })
}

function validateStringArray(value, path, errors, minLength, maxLength) {
  if (!Array.isArray(value)) {
    errors.push(`${path}: expected array, received ${describeValue(value)}`)
    return
  }

  if (value.length < minLength || value.length > maxLength) {
    errors.push(`${path}: expected ${formatLengthRange(minLength, maxLength)} items, received ${value.length}`)
  }

  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`
    if (typeof item !== 'string') {
      errors.push(`${itemPath}: expected non-empty string, received ${describeValue(item)}`)
      return
    }

    if (!item.trim()) {
      errors.push(`${itemPath}: expected non-empty string, received empty string`)
    }
  })
}

function validateRecord(value, path, errors) {
  if (!isRecord(value)) {
    errors.push(`${path}: expected object, received ${describeValue(value)}`)
    return false
  }

  return true
}

function validateString(record, path, errors) {
  const value = getPathValue(record, path)

  if (typeof value !== 'string') {
    errors.push(`${path}: expected non-empty string, received ${describeValue(value)}`)
    return
  }

  if (!value.trim()) {
    errors.push(`${path}: expected non-empty string, received empty string`)
  }
}

function validateFiniteNumber(record, path, errors) {
  const value = getPathValue(record, path)

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    errors.push(`${path}: expected finite number, received ${describeValue(value)}`)
  }
}

function getPathValue(record, path) {
  return record[path.split('.').pop()]
}

function describeValue(value) {
  if (value == null) return String(value)
  if (Array.isArray(value)) return `array(${value.length})`
  return typeof value
}

function formatLengthRange(minLength, maxLength) {
  return minLength === maxLength ? String(minLength) : `${minLength}-${maxLength}`
}

function logOpenAIResponse(data) {
  console.log('[audit-generation] Raw OpenAI response before validation:', formatForLog(data))
}

function logParsedAuditJson(parsed) {
  console.log('[audit-generation] Parsed audit JSON before validation:', formatForLog(parsed))
}

function formatForLog(value) {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return value
  }
}

function getErrorDetail(error) {
  return error instanceof Error ? error.message : String(error)
}

function sanitizeAuditReport(value) {
  if (!isRecord(value)) return null

  const report = {
    businessName: cleanString(value.businessName),
    websiteUrl: cleanString(value.websiteUrl),
    industry: cleanString(value.industry),
    preparedBy: cleanString(value.preparedBy) || PREPARED_BY,
    date: cleanString(value.date) || CURRENT_DATE,
    overallScore: clampScore(value.overallScore),
    executiveSummary: sanitizeExecutiveSummary(value.executiveSummary),
    summaryCards: sanitizeArray(value.summaryCards, sanitizeSummaryCard, 4, 4),
    firstImpressionScores: sanitizeArray(value.firstImpressionScores, sanitizeScore, 3, 3),
    firstImpressionFindings: sanitizeArray(value.firstImpressionFindings, sanitizeFinding, 3, 3),
    customerJourney: sanitizeCustomerJourney(value.customerJourney),
    conversionOpportunities: sanitizeArray(value.conversionOpportunities, sanitizeConversionOpportunity, 4, 4),
    aiOpportunities: sanitizeArray(value.aiOpportunities, sanitizeAiOpportunity, 5, 5),
    priorityMatrix: sanitizeArray(value.priorityMatrix, sanitizeListGroup, 4, 4),
    recommendedNextSteps: sanitizeArray(value.recommendedNextSteps, sanitizeListGroup, 3, 3),
    finalNote: sanitizeFinalNote(value.finalNote),
  }

  if (
    !report.businessName ||
    !report.websiteUrl ||
    !report.industry ||
    report.overallScore == null ||
    !report.executiveSummary ||
    !report.customerJourney ||
    !report.finalNote ||
    !report.summaryCards ||
    !report.firstImpressionScores ||
    !report.firstImpressionFindings ||
    !report.conversionOpportunities ||
    !report.aiOpportunities ||
    !report.priorityMatrix ||
    !report.recommendedNextSteps
  ) {
    return null
  }

  return report
}

function sanitizeDraftInput(value) {
  if (!isRecord(value)) {
    throw new Error('Invalid input.')
  }

  return {
    businessName: cleanString(value.businessName, 120) || 'Allen Family Dental',
    websiteUrl: cleanString(value.websiteUrl, 180) || 'allenfamilydental.com',
    industry: cleanString(value.industry, 120) || 'Dental Practice',
    extraNotes: cleanString(value.extraNotes, 700),
  }
}

function sanitizeExecutiveSummary(value) {
  if (!isRecord(value)) return null
  const heading = cleanString(value.heading, 180)
  const body = cleanString(value.body, 1200)
  return heading && body ? { heading, body } : null
}

function sanitizeSummaryCard(value) {
  if (!isRecord(value)) return null
  const title = cleanString(value.title, 80)
  const detail = cleanString(value.detail, 350)
  return title && detail ? { title, detail } : null
}

function sanitizeScore(value) {
  if (!isRecord(value)) return null
  const label = cleanString(value.label, 50)
  const score = cleanString(value.score, 20)
  const note = cleanString(value.note, 220)
  return label && score && note ? { label, score, note } : null
}

function sanitizeFinding(value) {
  if (!isRecord(value)) return null
  const noticed = cleanString(value.noticed, 450)
  const matters = cleanString(value.matters, 450)
  const instead = cleanString(value.instead, 450)
  return noticed && matters && instead ? { noticed, matters, instead } : null
}

function sanitizeCustomerJourney(value) {
  if (!isRecord(value)) return null
  const heading = cleanString(value.heading, 120)
  const steps = sanitizeStringArray(value.steps, 5, 5)
  const frictionPoints = sanitizeStringArray(value.frictionPoints, 3, 3)
  return heading && steps && frictionPoints ? { heading, steps, frictionPoints } : null
}

function sanitizeConversionOpportunity(value) {
  if (!isRecord(value)) return null
  const finding = sanitizeFinding(value)
  const title = cleanString(value.title, 100)
  const impact = cleanString(value.impact, 30)
  return title && impact && finding ? { title, impact, ...finding } : null
}

function sanitizeAiOpportunity(value) {
  if (!isRecord(value)) return null
  const title = cleanString(value.title, 100)
  const does = cleanString(value.does, 420)
  const helps = cleanString(value.helps, 420)
  const difficulty = cleanString(value.difficulty, 40)
  return title && does && helps && difficulty ? { title, does, helps, difficulty } : null
}

function sanitizeListGroup(value) {
  if (!isRecord(value)) return null
  const label = cleanString(value.label, 80)
  const items = sanitizeStringArray(value.items, 2, 4)
  return label && items ? { label, items } : null
}

function sanitizeFinalNote(value) {
  if (!isRecord(value)) return null
  const heading = cleanString(value.heading, 160)
  const paragraphs = sanitizeStringArray(value.paragraphs, 3, 3)
  const signatureName = cleanString(value.signatureName, 80)
  const signatureTitle = cleanString(value.signatureTitle, 80)
  return heading && paragraphs && signatureName && signatureTitle
    ? { heading, paragraphs, signatureName, signatureTitle }
    : null
}

function sanitizeArray(value, sanitizer, min, max) {
  if (!Array.isArray(value)) return null
  const items = value.map(sanitizer).filter(Boolean).slice(0, max)
  return items.length >= min ? items : null
}

function sanitizeStringArray(value, min, max) {
  return sanitizeArray(value, (item) => cleanString(item, 160), min, max)
}

function cleanString(value, maxLength = 1000) {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function clampScore(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return null
  return Math.max(0, Math.min(100, Math.round(number)))
}

function isRecord(value) {
  return typeof value === 'object' && value != null && !Array.isArray(value)
}

function getOpenAIErrorMessage(data) {
  return cleanString(data?.error?.message, 300) || 'OpenAI could not generate the audit draft.'
}

async function readJsonBody(req) {
  if (isRecord(req.body)) {
    return req.body
  }

  const chunks = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

function writeJson(res, statusCode, payload) {
  if (typeof res.status === 'function') {
    return res.status(statusCode).json(payload)
  }

  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}
