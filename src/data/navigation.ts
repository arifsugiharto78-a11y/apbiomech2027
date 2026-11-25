export const navigation = [
  { label: 'Home', slug: '', items: [] },
  { label: 'About', slug: 'about', items: [
    ['About 14th APBiomech',''], ['About APAB','apab'], ['Organizing Committee','organizing-committee'], ['Scientific Committee','scientific-committee'], ['Host Institution','host']
  ] },
  { label: 'Scientific Programme', slug: 'programme', items: [
    ['Conference Theme and Topics','topics'], ['Keynote Speakers','keynote-speakers'], ['Invited Speakers','invited-speakers'], ['Scientific Programme',''], ['Workshops and Special Sessions','workshops']
  ] },
  { label: 'Abstract Submission', slug: 'abstracts', items: [
    ['Call for Abstracts',''], ['Submission Guidelines','guidelines'], ['Abstract Template','template'], ['Submission Portal','portal'], ['Presentation Guidelines','presentations']
  ] },
  { label: 'Registration', slug: 'registration', items: [
    ['Registration Fees',''], ['Registration Portal','portal'], ['Payment Information','payment'], ['Cancellation and Refund Policy','cancellation']
  ] },
  { label: 'Awards', slug: 'awards', items: [
    ['Best Paper Awards','best-paper'], ['Young Investigator Awards','young-investigator'], ['Student Awards','student'], ['Travel Fellowships','travel-fellowships']
  ] },
  { label: 'Venue & Travel', slug: 'travel', items: [
    ['Conference Venue',''], ['Accommodation','accommodation'], ['Travel and Transportation','transportation'], ['Visa Information','visa'], ['Explore Bali','bali']
  ] },
  { label: 'Sponsorship', slug: 'sponsorship', items: [
    ['Sponsorship Opportunities',''], ['Sponsorship Prospectus','prospectus'], ['Sponsors and Exhibitors','partners']
  ] },
  { label: 'Contact', slug: 'contact', items: [
    ['Conference Secretariat',''], ['Frequently Asked Questions','faq']
  ] }
] as const;
export const routeOf = (group: string, page = '') => `${group}/${page ? `${page}/` : ''}`;
