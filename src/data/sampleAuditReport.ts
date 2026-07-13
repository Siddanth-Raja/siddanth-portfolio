import type { AuditReport } from '../types/audit'

export type AuditDraftInput = {
  businessName: string
  websiteUrl: string
  industry: string
  extraNotes?: string
}

export const sampleAuditReport: AuditReport = {
  businessName: 'Allen Family Dental',
  websiteUrl: 'allenfamilydental.com',
  industry: 'Dental Practice',
  preparedBy: 'Siddanth Raja',
  date: 'July 2026',
  overallScore: 82,
  executiveSummary: {
    heading: 'Where the practice is strong, and where leads may be leaking.',
    body:
      'Allen Family Dental already feels like a reliable local practice with a strong base of patient trust. The largest opportunities are not dramatic changes. They are clearer booking actions, stronger mobile contact paths, earlier proof that new patients can trust the office, and simple AI follow-up for the moments when the team cannot respond right away.',
  },
  summaryCards: [
    {
      title: 'Strong first impression',
      detail:
        'The practice feels established and trustworthy. The main opportunity is to make the next step easier to see immediately.',
    },
    {
      title: 'Booking path could be clearer',
      detail:
        'A patient who is ready to schedule should not have to scan the page to figure out where to go next.',
    },
    {
      title: 'Mobile CTA needs improvement',
      detail:
        'Most patients will check the site from a phone, so calling or booking should be visible before they scroll.',
    },
    {
      title: 'AI follow-up could capture more leads',
      detail:
        'After-hours visits, missed calls, and incomplete forms are practical places where automation can recover lost inquiries.',
    },
  ],
  firstImpressionScores: [
    { label: 'Trust', score: '8/10', note: 'Friendly, local, and credible.' },
    {
      label: 'Clarity',
      score: '7/10',
      note: 'The services are clear, but the next step could be stronger.',
    },
    {
      label: 'Action',
      score: '6/10',
      note: 'Booking and calling need more visual priority.',
    },
  ],
  firstImpressionFindings: [
    {
      noticed:
        'The site gives a welcoming first impression, but the appointment action does not feel like the main thing to do.',
      matters:
        'A ready-to-book patient may hesitate or get distracted if calling or scheduling takes extra searching.',
      instead:
        'Place one clear appointment action near the top of the page, paired with the phone number for patients who prefer to call.',
    },
    {
      noticed:
        'Trust signals appear present, but they could show up earlier in the first visit.',
      matters:
        'Dental patients often need reassurance before they share information or book a first appointment.',
      instead:
        'Move patient reviews, years in practice, accepted insurance notes, or family-care language closer to the first screen.',
    },
    {
      noticed: 'The mobile path to contact the office could be more obvious.',
      matters:
        'Many patients search for a dentist while between tasks, and a hidden phone or booking path can cost calls.',
      instead:
        'Add a persistent mobile call button and make the appointment button visible before the patient scrolls.',
    },
  ],
  customerJourney: {
    heading: 'How a search becomes a new patient.',
    steps: ['Google Search', 'Website Visit', 'Trust Building', 'Contact/Booking', 'New Patient'],
    frictionPoints: [
      'Visitor has to search for the appointment action.',
      'Phone number or contact action could be more visible.',
      'Reviews and patient proof could appear earlier.',
    ],
  },
  conversionOpportunities: [
    {
      title: 'Make appointment booking easier to find',
      impact: 'High',
      noticed:
        'The booking path is available, but it does not feel like the obvious first action for a ready patient.',
      matters:
        'Patients who are comparing dentists often choose the office that makes scheduling feel easiest.',
      instead:
        'Use one primary appointment button near the top, repeat it after service sections, and keep the wording consistent.',
    },
    {
      title: 'Put phone/contact actions above the fold on mobile',
      impact: 'High',
      noticed: 'On a small screen, the contact path can feel secondary to browsing the page.',
      matters:
        'Mobile visitors often want to call quickly, ask about insurance, or book while the need is fresh.',
      instead:
        'Show a clear call button and appointment button at the top of the mobile page before any long content.',
    },
    {
      title: 'Add stronger patient trust signals near the top',
      impact: 'Medium',
      noticed: 'The page can earn trust faster by showing proof before asking for action.',
      matters:
        'New patients want to know the practice is experienced, reviewed, family-friendly, and easy to work with.',
      instead:
        'Place review snippets, star rating, insurance acceptance, and a short local-care promise close to the first action.',
    },
    {
      title: 'Simplify the homepage into one clear next step',
      impact: 'Medium',
      noticed: 'The page can ask visitors to consider several things before making contact.',
      matters:
        'Too many equal choices can slow down a patient who only needs to know whether to call, book, or ask a question.',
      instead:
        'Make the main path: understand the practice, see proof, choose call or appointment, then confirm details.',
    },
  ],
  aiOpportunities: [
    {
      title: 'After-hours AI receptionist',
      does:
        'Answers common questions, collects contact details, and offers the next available booking path after the office closes.',
      helps:
        'Patients who search at night or on weekends can still take the next step instead of waiting and forgetting.',
      difficulty: 'Medium',
    },
    {
      title: 'New patient intake assistant',
      does: 'Guides new patients through basic intake questions before their first visit.',
      helps:
        'The front desk gets cleaner information earlier, and patients spend less time sorting details over the phone.',
      difficulty: 'Medium',
    },
    {
      title: 'Missed-call follow-up automation',
      does: 'Sends a helpful text or email when the office misses a call during busy hours.',
      helps: 'A missed call can turn into a booked appointment instead of a lost lead.',
      difficulty: 'Low',
    },
    {
      title: 'Review request automation',
      does:
        'Asks satisfied patients for a review after completed visits using a simple follow-up message.',
      helps:
        'Fresh reviews build trust for future patients and make the practice look active online.',
      difficulty: 'Low',
    },
    {
      title: 'FAQ assistant for common patient questions',
      does:
        'Answers questions about services, insurance, location, hours, and what to expect before the first visit.',
      helps:
        'Patients get answers faster, and the team spends less time repeating the same information.',
      difficulty: 'Low',
    },
  ],
  priorityMatrix: [
    {
      label: 'High Impact / Low Effort',
      items: ['Mobile call button', 'Appointment button above the fold', 'Review snippets near top'],
    },
    {
      label: 'High Impact / High Effort',
      items: ['Improved booking flow', 'After-hours AI receptionist', 'New patient intake automation'],
    },
    {
      label: 'Low Impact / Low Effort',
      items: ['Shorter service intro copy', 'Cleaner footer contact area', 'Insurance note near contact form'],
    },
    {
      label: 'Low Impact / High Effort',
      items: ['Full internal dashboard', 'Advanced patient inquiry routing', 'Large content rebuild before contact fixes'],
    },
  ],
  recommendedNextSteps: [
    {
      label: 'This week',
      items: [
        'Move appointment/contact CTA higher',
        'Add stronger mobile contact button',
        'Add reviews/testimonials near top',
      ],
    },
    {
      label: 'This month',
      items: ['Improve booking flow', 'Add lead capture form', 'Set up review follow-up automation'],
    },
    {
      label: 'Later',
      items: ['AI receptionist', 'intake automation', 'internal patient inquiry dashboard'],
    },
  ],
  finalNote: {
    heading: 'A few practical next steps are already within reach.',
    paragraphs: [
      'I enjoyed putting this together because I think your business has real potential online.',
      'Whether you use these ideas yourself or work with someone else, I hope this gives you a few practical next steps.',
      "If you're curious how I'd approach implementing any of them, just reply.",
    ],
    signatureName: 'Siddanth Raja',
    signatureTitle: 'AI Growth Systems',
  },
}

export function createAuditDraftFromInputs(input: AuditDraftInput): AuditReport {
  const businessName = input.businessName.trim() || sampleAuditReport.businessName
  const websiteUrl = input.websiteUrl.trim() || sampleAuditReport.websiteUrl
  const industry = input.industry.trim() || sampleAuditReport.industry
  const extraNotes = input.extraNotes?.trim()
  const notesSentence = extraNotes ? ` Notes to consider for this draft: ${extraNotes}` : ''

  return {
    ...sampleAuditReport,
    businessName,
    websiteUrl,
    industry,
    executiveSummary: {
      ...sampleAuditReport.executiveSummary,
      body: `${businessName} already has the foundation for a stronger online customer journey. This draft keeps the same audit structure and adapts the report for a ${industry.toLowerCase()} so the next review can focus on clearer calls, easier bookings, stronger trust signals, and practical AI follow-up opportunities.${notesSentence}`,
    },
  }
}
