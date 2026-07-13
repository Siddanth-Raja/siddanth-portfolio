const CURRENT_DATE = 'July 2026'
const PREPARED_BY = 'Siddanth Raja'
const SIGNATURE_TITLE = 'AI Growth Systems'
const DEFAULT_MODEL = 'gpt-5.5'

const WORD_LIMITS = Object.freeze({
  executiveSummaryBody: 90,
  summaryCardDetail: 28,
  scoreNote: 18,
  firstImpressionNoticed: 28,
  firstImpressionMatters: 32,
  firstImpressionInstead: 36,
  conversionNoticed: 30,
  conversionMatters: 35,
  conversionInstead: 38,
  aiDoes: 32,
  aiHelps: 35,
  finalNoteCombined: 90,
})

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
        body: { type: 'string', minLength: 1, maxLength: 1200 },
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
          detail: { type: 'string', minLength: 1, maxLength: 350 },
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
          note: { type: 'string', minLength: 1, maxLength: 220 },
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
          impact: { type: 'string', enum: ['High', 'Medium', 'Low'] },
          noticed: { type: 'string', minLength: 1, maxLength: 450 },
          matters: { type: 'string', minLength: 1, maxLength: 450 },
          instead: { type: 'string', minLength: 1, maxLength: 450 },
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
          does: { type: 'string', minLength: 1, maxLength: 420 },
          helps: { type: 'string', minLength: 1, maxLength: 420 },
          difficulty: { type: 'string', enum: ['Low', 'Medium', 'High'] },
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
      noticed: { type: 'string', minLength: 1, maxLength: 450 },
      matters: { type: 'string', minLength: 1, maxLength: 450 },
      instead: { type: 'string', minLength: 1, maxLength: 450 },
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
            'Write like a sharp premium consultant who inspected the supplied business context: short, specific, commercially intelligent, confident, human, and useful.',
            'Field limits are hard maximums: executiveSummary.body <= 90 words; each summaryCards[].detail <= 28 words; each firstImpressionScores[].note <= 18 words; each firstImpressionFindings[].noticed <= 28 words, matters <= 32 words, instead <= 36 words; each conversionOpportunities[].noticed <= 30 words, matters <= 35 words, instead <= 38 words; each aiOpportunities[].does <= 32 words, helps <= 35 words; all finalNote.paragraphs combined <= 90 words.',
            'Use distinct evidence across sections. Do not repeat the same observation, recommendation, or business consequence in different words.',
            'Create at least three specific, non-obvious moments grounded in the supplied notes where the owner could think, "I never noticed that."',
            'Do not use generic business advice, unnecessary introductions, bloated transitions, or restate a card title in its body.',
            'Do not use markdown, bullet prefixes, headings, or labels inside fields that expect plain prose.',
            'Do not invent metrics, analytics, review counts, customer behavior, private facts, or unsupported certainty.',
            'Treat overallScore and the three first-impression scores as directional judgments from the supplied context, not objective measurements. Do not claim a measured or scientific scoring method.',
            'Translate design observations into business consequences such as trust, contact difficulty, decision friction, lost inquiries, or staff time. Avoid design jargon with no business consequence.',
            'Use industry-appropriate business language. Do not call customers patients, clients, diners, or guests unless that term fits the supplied industry.',
            'Never expose internal phrases such as supplied notes, supplied context, limited context, prompt, model, or inability to browse in client-facing copy.',
            'Use insight-led executiveSummary.heading and finalNote.heading text. Do not repeat section labels such as Executive Summary or Final Note.',
            "Every recommendation must follow What I noticed -> Why it matters -> What I'd do instead.",
            'Every AI opportunity must map to a real workflow, trigger, handoff, or repetitive task. Do not recommend AI merely to fill the AI section.',
            'When evidence is incomplete, state a careful opportunity or risk instead of pretending the website was browsed or making a certain claim.',
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

  const validationErrors = getAuditReportValidationErrors(normalized, input)
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
    `finalNote.signatureName must equal "${PREPARED_BY}".`,
    `finalNote.signatureTitle must equal "${SIGNATURE_TITLE}".`,
    'overallScore must be a number from 0 to 100.',
    'Use exactly 4 summaryCards.',
    'Use exactly 3 firstImpressionScores.',
    'Use exactly 3 firstImpressionFindings.',
    'Use exactly 5 customerJourney.steps and exactly 3 customerJourney.frictionPoints.',
    'Write each customerJourney.steps item as a complete stage label of no more than 5 words, never as a sentence fragment.',
    'Use exactly 4 conversionOpportunities.',
    'Set each conversionOpportunities.impact to exactly High, Medium, or Low.',
    'Use exactly 5 aiOpportunities.',
    'Set each aiOpportunities.difficulty to exactly Low, Medium, or High.',
    'Use exactly 4 priorityMatrix groups, each with 2 to 4 items.',
    'Use exactly 3 recommendedNextSteps groups, each with 2 to 4 items.',
    'Use exactly 3 finalNote.paragraphs and end with a low-pressure, curiosity-building insight written as natural prose. Never label it "Curiosity note" or use similar template language.',
    'Do not use markdown bullets inside string values. Write plain sentence text.',
    'Use the optional notes as the evidence base. Do not claim you inspected anything that the notes do not support.',
    'Give each section a distinct job: summarize the business, reveal first-impression friction, map the journey, recommend conversion fixes, then identify workflow-grounded AI opportunities.',
    'Keep every card within its field-level word limit and concise enough to fit cleanly in a printable report.',
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
    businessName: normalizeText(value.businessName),
    websiteUrl: normalizeText(value.websiteUrl),
    industry: normalizeText(value.industry),
    preparedBy: normalizeText(value.preparedBy),
    date: normalizeText(value.date),
    executiveSummary: normalizeExecutiveSummaryContent(value.executiveSummary),
    summaryCards: normalizeArrayContent(value.summaryCards, normalizeSummaryCardContent),
    firstImpressionScores: normalizeArrayContent(value.firstImpressionScores, normalizeScoreContent),
    firstImpressionFindings: normalizeArrayContent(value.firstImpressionFindings, normalizeFindingContent),
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
    heading: normalizeText(value.heading),
    body: normalizeText(value.body),
  }
}

function normalizeSummaryCardContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    title: normalizeText(value.title),
    detail: normalizeText(value.detail),
  }
}

function normalizeScoreContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    label: normalizeText(value.label),
    score: normalizeText(value.score),
    note: normalizeText(value.note),
  }
}

function normalizeFindingContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    noticed: normalizeText(value.noticed),
    matters: normalizeText(value.matters),
    instead: normalizeText(value.instead),
  }
}

function normalizeCustomerJourneyContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    heading: normalizeText(value.heading),
    steps: normalizeStringArrayContent(value.steps),
    frictionPoints: normalizeStringArrayContent(value.frictionPoints),
  }
}

function normalizeConversionContent(value) {
  if (!isRecord(value)) return value
  const finding = normalizeFindingContent(value)

  return {
    ...value,
    title: normalizeText(value.title),
    impact: normalizeText(value.impact),
    noticed: finding.noticed,
    matters: finding.matters,
    instead: finding.instead,
  }
}

function normalizeAiOpportunityContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    title: normalizeText(value.title),
    does: normalizeText(value.does),
    helps: normalizeText(value.helps),
    difficulty: normalizeText(value.difficulty),
  }
}

function normalizeListGroupContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    label: normalizeText(value.label),
    items: normalizeStringArrayContent(value.items),
  }
}

function normalizeFinalNoteContent(value) {
  if (!isRecord(value)) return value

  return {
    ...value,
    heading: normalizeText(value.heading),
    paragraphs: normalizeStringArrayContent(value.paragraphs),
    signatureName: normalizeText(value.signatureName),
    signatureTitle: normalizeText(value.signatureTitle),
  }
}

function normalizeArrayContent(value, normalizeItem) {
  if (!Array.isArray(value)) return value
  return value.map(normalizeItem)
}

function normalizeStringArrayContent(value) {
  if (!Array.isArray(value)) return value
  return value.map((item) => normalizeText(item))
}

function normalizeText(value) {
  if (typeof value !== 'string') return value

  return value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, ''))
    .join(' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function getAuditReportValidationErrors(value, input) {
  const errors = []

  validateRecord(value, 'report', errors)
  if (!isRecord(value)) return errors

  validateString(value, 'businessName', errors, { maxLength: 120 })
  validateString(value, 'websiteUrl', errors, { maxLength: 180 })
  validateString(value, 'industry', errors, { maxLength: 120 })
  validateString(value, 'preparedBy', errors, { maxLength: 80 })
  validateString(value, 'date', errors, { maxLength: 60 })
  validateFiniteNumber(value, 'overallScore', errors, { min: 0, max: 100 })

  validateExecutiveSummary(value.executiveSummary, 'executiveSummary', errors)
  validateArray(value.summaryCards, 'summaryCards', errors, 4, 4, (item, path) => {
    validateString(item, `${path}.title`, errors, { maxLength: 80 })
    validateString(item, `${path}.detail`, errors, {
      maxLength: 350,
      maxWords: WORD_LIMITS.summaryCardDetail,
    })
  })
  validateArray(value.firstImpressionScores, 'firstImpressionScores', errors, 3, 3, (item, path) => {
    validateString(item, `${path}.label`, errors, { maxLength: 50 })
    validateString(item, `${path}.score`, errors, { maxLength: 20 })
    validateString(item, `${path}.note`, errors, {
      maxLength: 220,
      maxWords: WORD_LIMITS.scoreNote,
    })
  })
  validateArray(value.firstImpressionFindings, 'firstImpressionFindings', errors, 3, 3, (item, path) => {
    validateFinding(item, path, errors, {
      noticed: { maxLength: 450, maxWords: WORD_LIMITS.firstImpressionNoticed },
      matters: { maxLength: 450, maxWords: WORD_LIMITS.firstImpressionMatters },
      instead: { maxLength: 450, maxWords: WORD_LIMITS.firstImpressionInstead },
    })
  })
  validateCustomerJourney(value.customerJourney, 'customerJourney', errors)
  validateArray(value.conversionOpportunities, 'conversionOpportunities', errors, 4, 4, (item, path) => {
    validateString(item, `${path}.title`, errors, { maxLength: 100 })
    validateString(item, `${path}.impact`, errors, { maxLength: 30 })
    validateAllowedString(item.impact, `${path}.impact`, errors, ['High', 'Medium', 'Low'])
    validateFinding(item, path, errors, {
      noticed: { maxLength: 450, maxWords: WORD_LIMITS.conversionNoticed },
      matters: { maxLength: 450, maxWords: WORD_LIMITS.conversionMatters },
      instead: { maxLength: 450, maxWords: WORD_LIMITS.conversionInstead },
    })
  })
  validateArray(value.aiOpportunities, 'aiOpportunities', errors, 5, 5, (item, path) => {
    validateString(item, `${path}.title`, errors, { maxLength: 100 })
    validateString(item, `${path}.does`, errors, {
      maxLength: 420,
      maxWords: WORD_LIMITS.aiDoes,
    })
    validateString(item, `${path}.helps`, errors, {
      maxLength: 420,
      maxWords: WORD_LIMITS.aiHelps,
    })
    validateString(item, `${path}.difficulty`, errors, { maxLength: 40 })
    validateAllowedString(item.difficulty, `${path}.difficulty`, errors, ['Low', 'Medium', 'High'])
  })
  validateArray(value.priorityMatrix, 'priorityMatrix', errors, 4, 4, (item, path) => {
    validateString(item, `${path}.label`, errors, { maxLength: 80 })
    validateStringArray(item?.items, `${path}.items`, errors, 2, 4, { maxLength: 120 })
  })
  validateArray(value.recommendedNextSteps, 'recommendedNextSteps', errors, 3, 3, (item, path) => {
    validateString(item, `${path}.label`, errors, { maxLength: 80 })
    validateStringArray(item?.items, `${path}.items`, errors, 2, 4, { maxLength: 120 })
  })
  validateFinalNote(value.finalNote, 'finalNote', errors)

  if (input) {
    validateExactString(value.businessName, 'businessName', errors, input.businessName)
    validateExactString(value.websiteUrl, 'websiteUrl', errors, input.websiteUrl)
    validateExactString(value.industry, 'industry', errors, input.industry)
    validateExactString(value.preparedBy, 'preparedBy', errors, PREPARED_BY)
    validateExactString(value.date, 'date', errors, CURRENT_DATE)
    validateExactString(value.finalNote?.signatureName, 'finalNote.signatureName', errors, PREPARED_BY)
    validateExactString(value.finalNote?.signatureTitle, 'finalNote.signatureTitle', errors, SIGNATURE_TITLE)
  }

  return errors
}

function validateExecutiveSummary(value, path, errors) {
  if (!validateRecord(value, path, errors)) return
  validateString(value, `${path}.heading`, errors, { maxLength: 180 })
  validateString(value, `${path}.body`, errors, {
    maxLength: 1200,
    maxWords: WORD_LIMITS.executiveSummaryBody,
  })
}

function validateCustomerJourney(value, path, errors) {
  if (!validateRecord(value, path, errors)) return
  validateString(value, `${path}.heading`, errors, { maxLength: 120 })
  validateStringArray(value.steps, `${path}.steps`, errors, 5, 5, {
    maxLength: 50,
    maxWords: 5,
  })
  validateStringArray(value.frictionPoints, `${path}.frictionPoints`, errors, 3, 3, {
    maxLength: 150,
  })
}

function validateFinding(value, path, errors, limits) {
  validateString(value, `${path}.noticed`, errors, limits.noticed)
  validateString(value, `${path}.matters`, errors, limits.matters)
  validateString(value, `${path}.instead`, errors, limits.instead)
}

function validateFinalNote(value, path, errors) {
  if (!validateRecord(value, path, errors)) return
  validateString(value, `${path}.heading`, errors, { maxLength: 160 })
  validateStringArray(value.paragraphs, `${path}.paragraphs`, errors, 3, 3, { maxLength: 240 })
  validateCombinedWordLimit(
    value.paragraphs,
    `${path}.paragraphs`,
    errors,
    WORD_LIMITS.finalNoteCombined,
  )
  validateString(value, `${path}.signatureName`, errors, { maxLength: 80 })
  validateString(value, `${path}.signatureTitle`, errors, { maxLength: 80 })
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

function validateStringArray(value, path, errors, minLength, maxLength, constraints = {}) {
  if (!Array.isArray(value)) {
    errors.push(`${path}: expected array, received ${describeValue(value)}`)
    return
  }

  if (value.length < minLength || value.length > maxLength) {
    errors.push(`${path}: expected ${formatLengthRange(minLength, maxLength)} items, received ${value.length}`)
  }

  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`
    validateStringValue(item, itemPath, errors, constraints)
  })
}

function validateRecord(value, path, errors) {
  if (!isRecord(value)) {
    errors.push(`${path}: expected object, received ${describeValue(value)}`)
    return false
  }

  return true
}

function validateString(record, path, errors, constraints = {}) {
  const value = getPathValue(record, path)
  validateStringValue(value, path, errors, constraints)
}

function validateStringValue(value, path, errors, { maxLength, maxWords } = {}) {
  if (typeof value !== 'string') {
    errors.push(`${path}: expected non-empty string, received ${describeValue(value)}`)
    return
  }

  if (!value.trim()) {
    errors.push(`${path}: expected non-empty string, received empty string`)
    return
  }

  if (maxLength && value.length > maxLength) {
    errors.push(`${path}: expected at most ${maxLength} characters, received ${value.length}`)
  }

  const wordCount = countWords(value)
  if (maxWords && wordCount > maxWords) {
    errors.push(`${path}: expected at most ${maxWords} words, received ${wordCount}`)
  }
}

function validateCombinedWordLimit(value, path, errors, maxWords) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) return
  const wordCount = value.reduce((total, item) => total + countWords(item), 0)
  if (wordCount > maxWords) {
    errors.push(`${path}: expected at most ${maxWords} words combined, received ${wordCount}`)
  }
}

function validateExactString(value, path, errors, expected) {
  if (typeof value === 'string' && value !== expected) {
    errors.push(`${path}: expected exact value "${expected}", received "${value}"`)
  }
}

function validateAllowedString(value, path, errors, allowedValues) {
  if (typeof value === 'string' && !allowedValues.includes(value)) {
    errors.push(`${path}: expected one of ${allowedValues.join(', ')}, received "${value}"`)
  }
}

function countWords(value) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

function validateFiniteNumber(record, path, errors, { min, max } = {}) {
  const value = getPathValue(record, path)

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    errors.push(`${path}: expected finite number, received ${describeValue(value)}`)
    return
  }

  if ((min != null && value < min) || (max != null && value > max)) {
    errors.push(`${path}: expected number from ${min} to ${max}, received ${value}`)
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
    preparedBy: cleanString(value.preparedBy),
    date: cleanString(value.date),
    overallScore: sanitizeScoreNumber(value.overallScore),
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
    !report.preparedBy ||
    !report.date ||
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
    extraNotes: cleanString(value.extraNotes, 6000),
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
  const steps = sanitizeStringArray(value.steps, 5, 5, 50)
  const frictionPoints = sanitizeStringArray(value.frictionPoints, 3, 3, 150)
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
  const items = sanitizeStringArray(value.items, 2, 4, 120)
  return label && items ? { label, items } : null
}

function sanitizeFinalNote(value) {
  if (!isRecord(value)) return null
  const heading = cleanString(value.heading, 160)
  const paragraphs = sanitizeStringArray(value.paragraphs, 3, 3, 240)
  const signatureName = cleanString(value.signatureName, 80)
  const signatureTitle = cleanString(value.signatureTitle, 80)
  return heading && paragraphs && signatureName && signatureTitle
    ? { heading, paragraphs, signatureName, signatureTitle }
    : null
}

function sanitizeArray(value, sanitizer, min, max) {
  if (!Array.isArray(value)) return null
  if (value.length < min || value.length > max) return null

  const items = value.map(sanitizer)
  return items.every(Boolean) ? items : null
}

function sanitizeStringArray(value, min, max, itemMaxLength) {
  return sanitizeArray(value, (item) => cleanString(item, itemMaxLength) || null, min, max)
}

function cleanString(value, maxLength = 1000) {
  if (typeof value !== 'string') return ''
  const cleaned = value.replace(/\s+/g, ' ').trim()
  return cleaned.length <= maxLength ? cleaned : ''
}

function sanitizeScoreNumber(value) {
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0 || number > 100) return null
  return Math.round(number)
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
