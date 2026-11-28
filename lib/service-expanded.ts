// Explanatory copy for the existing service catalogue. Actual scope and terms are agreed per project.
export const serviceExpanded = {
  software: {
    introduction: 'When work depends on disconnected spreadsheets, repeated data entry or processes that only one person understands, a purpose-built application can give your team a clearer way to work. We develop desktop or web software around the people, records and decisions involved—not around features you do not need.',
    sections: [
      { title: 'Software shaped around your operations', text: 'We can help turn a workflow into an application for managing records, inventory, business processes or educational activities. Together we identify the users, the information they need and the situations the system must handle, including corrections and exceptions.' },
      { title: 'Build for use and handover', text: 'A suitable engagement may cover interface design, database-backed functionality, access controls, testing and documentation. We discuss deployment, maintenance and ownership as part of the proposal; hosting and third-party costs are not assumed to be included.' },
      { title: 'A good starting brief', text: 'Tell us who will use the system, what you currently use, the most important tasks and reports, and any constraints around existing data, devices or connectivity. We can then agree on a practical first release and any later phases.' },
    ],
  },
  web: {
    introduction: 'Your website should explain what you offer, work comfortably across devices and make it easy for visitors to take the next step. We create and improve business, portfolio and campaign websites with the content and the customer journey considered alongside the technology.',
    sections: [
      { title: 'More than a visual refresh', text: 'Depending on the brief, work can include page structure, responsive interfaces, contact journeys, WordPress customisation or a custom React and Next.js build. For a storefront, we define the catalogue and required purchase or enquiry flow before selecting integrations.' },
      { title: 'Findable and maintainable', text: 'We consider page titles, structure, performance and accessibility as part of development. Technical SEO helps search engines understand a site, but rankings, traffic and sales cannot be guaranteed. Editing guidance can help your team keep approved content current.' },
      { title: 'Plan a confident launch', text: 'Bring your existing site or brand materials, the pages and features you need, examples you like and your preferred launch timeline. We will clarify responsibilities for copy, hosting, domains, third-party subscriptions and support in the quote.' },
    ],
  },
  ai: {
    introduction: 'AI can assist with tasks such as organising documents, extracting information or preparing a first draft, but it can also make mistakes. We focus on a defined business problem, evaluate representative examples and design the workflow so a person can review important results.',
    sections: [
      { title: 'Choose a useful task', text: 'We identify the input, desired output and decision the feature should support. Possible work includes document classification, assisted reporting or a language-model feature inside an existing application, subject to the quality and suitability of available information.' },
      { title: 'Evaluate rather than assume', text: 'A prototype can be tested against examples you are entitled to use. We examine incorrect, incomplete and uncertain responses, identify where manual checks are necessary and discuss how the system should behave when a provider is unavailable.' },
      { title: 'Privacy, cost and control', text: 'Model providers may process submitted data and charge for usage. We discuss what information is appropriate to send, provider terms, operating costs and human review before implementation. No model is infallible, and sensitive or consequential decisions need appropriate oversight.' },
    ],
  },
  automation: {
    introduction: 'Re-entering the same information across systems wastes time and creates opportunities for error. We design APIs and integrations that move information between tools you are authorised to use, with the handoffs and failure cases considered from the start.',
    sections: [
      { title: 'Connect the right pieces', text: 'We map the source of each record, the destination, the fields that need to move and the permissions available. Work may involve REST APIs, webhooks, database integrations, scheduled reports or messaging providers where access is available.' },
      { title: 'Prepare for real-world failures', text: 'Systems can time out, send duplicate events or change their requirements. We agree on validation, error visibility, appropriate retries and how to reconcile records, then test representative success and failure cases within the agreed scope.' },
      { title: 'Before we begin', text: 'Share the current process, the applications involved, their documentation and the outcome you want. API access, provider approval, subscription fees and any limits are checked separately; an integration cannot promise capabilities a provider does not permit.' },
    ],
  },
  design: {
    introduction: 'Good design makes information easier to recognise, understand and use. We create digital visual materials around your audience, message and channels so that a presentation, campaign or website interface feels coherent rather than assembled at random.',
    sections: [
      { title: 'One direction, practical formats', text: 'We can develop business graphics, social and advertising creatives, flyers, presentations or website UI designs from an agreed brief. The right format depends on where the material will be used and what you need the audience to notice or do.' },
      { title: 'A collaborative creative process', text: 'We review your existing brand assets and references, establish a direction, then refine layout, typography, imagery and hierarchy with your feedback. Deliverables, sizes, revision rounds and editable source files are specified in the proposal.' },
      { title: 'What to bring', text: 'Share your audience, key message, brand guidelines or logo, required dimensions, examples and deadline. Please provide or approve the rights to any text, photography, logos or other materials supplied for the work.' },
    ],
  },
  writing: {
    introduction: 'The right words help an idea travel: from a founder’s experience to an article, from complex software to a useful guide, or from scattered notes to a clear proposal. We work with your goals, source material and intended readers to develop writing that is structured, purposeful and true to your voice.',
    sections: [
      { title: 'What is ghostwriting?', text: 'Ghostwriting is a collaboration in which a writer develops content for a client who may publish or present it under their own name or brand. You bring the ideas, experience, direction or source material; we help research within the agreed scope, structure, draft and refine the work with your review. Examples include articles and other professional content.' },
      { title: 'Your voice, your review', text: 'We discuss the audience, purpose, tone and intended format before drafting. You can review drafts and provide corrections, while we revise for clarity and consistency. You remain responsible for approving the final text and verifying personal, factual or specialist claims.' },
      { title: 'Confidentiality and attribution', text: 'Your ideas, drafts and working relationship may be sensitive. We discuss confidentiality, permitted access, attribution, ownership and any non-disclosure agreement before work begins, and set them out in the engagement terms. Please avoid sending highly sensitive material until an appropriate handling arrangement is agreed.' },
      { title: 'Editing and documentation too', text: 'Not every project needs a ghostwriter. We can edit and proofread existing material, organise business reports and proposals, or prepare technical documentation and handover guides so the right reader can find and use the information.' },
    ],
  },
  training: {
    introduction: 'Learning technology is more useful when it connects to something you want to do. Our tutoring and training focuses on practical explanations, guided exercises and feedback at a pace suited to the learner and the goals agreed in advance.',
    sections: [
      { title: 'Start from where you are', text: 'We discuss your current experience and the outcome you want, whether that is understanding programming concepts, practising Java or Python, building a web page, working with databases or improving digital productivity.' },
      { title: 'Practise with purpose', text: 'Sessions can combine demonstrations, exercises and discussion of your own work. The format, topics, duration and any practice materials are agreed beforehand; progress depends on the learner’s starting point and continued practice.' },
      { title: 'Planning your learning', text: 'Tell us the topic, your experience, preferred schedule and any project or assessment you are preparing for. We can shape an appropriate plan and quote; we do not guarantee grades, certifications or employment outcomes.' },
    ],
  },
} as const;
