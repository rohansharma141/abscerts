# -*- coding: utf-8 -*-
"""Generate the ABS follow-up questions & confirmations Word doc."""
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

NAVY = RGBColor(0x08, 0x1F, 0x4D)
doc = Document()
sec = doc.sections[0]
sec.orientation = WD_ORIENT.LANDSCAPE
sec.page_width, sec.page_height = sec.page_height, sec.page_width
sec.left_margin = sec.right_margin = Inches(0.5)
sec.top_margin = sec.bottom_margin = Inches(0.55)
doc.styles['Normal'].font.name = 'Calibri'
doc.styles['Normal'].font.size = Pt(9)

t = doc.add_paragraph(); r = t.add_run('ABS Website — Follow-up Questions & Confirmations')
r.bold = True; r.font.size = Pt(16); r.font.color.rgb = NAVY
s = doc.add_paragraph(); r = s.add_run('For ABS Certifications & Advisory — to finalise the content-review implementation')
r.italic = True; r.font.size = Pt(10.5); r.font.color.rgb = RGBColor(0x55,0x55,0x55)

intro = doc.add_paragraph()
intro.add_run(
 'Status: the positioning correction (ABS presented as a consulting & advisory firm, not a certification body) and the '
 'verified ISO edition updates from your review are DONE and live on the test site. The items below are the remaining '
 'questions, confirmations and assets we need from ABS to complete the rest. Grouped by type; please add answers in the '
 'right-hand column. Items marked ').font.size = Pt(9)
b=intro.add_run('[BLOCKS BUILD]'); b.bold=True; b.font.size=Pt(9)
intro.add_run(' cannot be finished without your input.').font.size = Pt(9)

# (section, [ (topic, need, context) ... ])
SECTIONS = [
 ("A. Confirmations — please verify our changes", [
  ("CMMI positioning",
   "Confirm ABS does NOT itself conduct formal CMMI appraisals (no in-house authorised Lead Appraiser). If ABS DOES hold that status, tell us and we'll restore an accurate version.",
   "We removed the old “since 1991 / our Certified Lead Appraisers conduct appraisals / High Maturity Appraisals” claims and reframed CMMI as implementation + appraisal-readiness consulting, with formal appraisals via authorised professionals — per your review."),
  ("Statistics are substantiated",
   "Confirm each figure is real and documented (we now show them with “Figures updated July 2026”): 1,200+ engagements supported; first-time success rate; 40+ countries; since 2008. If any is not substantiated, give the correct figure or we remove it.",
   "Dating figures makes them read as audited — more exposure if unverified. We currently retain the numbers with reworded labels."),
  ("Experience timeline",
   "Please confirm ONE coherent public timeline so we present it consistently (e.g. “ABS Academy training since 2004; ABS Certifications & Advisory since 2008”).",
   "The site implies 2008 (company); the Lead Auditor page says “since 2004” (Academy); the old CMMI text said 1991. These need reconciling."),
  ("“1,200+ engagements supported” wording",
   "Confirm this reworded phrasing (from “1,200+ certificates issued”) is acceptable.",
   "Reworded so it doesn't imply ABS issues certificates."),
 ]),
 ("B. Standard / claim confirmations", [
  ("ISO/IEC 27017:2026 [BLOCKS BUILD]",
   "Has ISO formally PUBLISHED ISO/IEC 27017:2026 yet? If yes, we update the page from :2015 to :2026.",
   "We held 27017 at :2015 because the 2026 edition was still at FDIS (final-draft) stage as of Apr 2026. All other editions were verified published and are updated."),
  ("Personnel certification scheme [BLOCKS BUILD]",
   "Does ABS operate an approved/accredited personnel-certification scheme? If NO → we reframe the Personnel Certifications pages to competence/registration guidance with a disclaimer (course-completion ≠ accredited certification). If YES → name the scheme(s) so we state them accurately.",
   "Current pages still say ABS “certifies the competence of an individual” — not yet reframed, pending your answer."),
  ("Third-party inspection accreditation",
   "Is ABS an accredited inspection body, or are inspections delivered through qualified/accredited partners? We'll add the accreditation-status caveat accordingly.",
   "Your review asked to confirm accreditation status in the proposal and note partner delivery where required."),
  ("PCI DSS role",
   "Confirm ABS is advisory/readiness (not a QSA); the formal QSA assessment is by an authorised QSA.",
   "We've framed it this way; confirming."),
  ("HIPAA / GDPR framing",
   "Confirm the framing: no official HIPAA certification scheme; no single universal GDPR certificate — ABS provides assessment/readiness.",
   "Matches your review; already on the pages."),
 ]),
 ("C. Data & assets we need [each BLOCKS its page]", [
  ("Legal-entity details",
   "Registered legal name, registered office address, company registration number, GST number, official email, privacy contact, governing-law jurisdiction.",
   "Needed for the footer, Privacy Policy and Terms. (Privacy Policy currently still contains placeholder text incl. the wrong “hmlcerts.com” domain.)"),
  ("Scheduling tool",
   "Which tool for “Book a Call” — Calendly / Zoho Bookings / MS Bookings — and the booking link/account.",
   "“Book a call” currently routes to the contact page; you asked for a real scheduler."),
  ("Leadership & Experts",
   "For each key consultant/leader: name, role, years of experience, qualifications, ISO lead-auditor credentials, LinkedIn URL.",
   "For the new About “Leadership & Experts” section (E-E-A-T / trust)."),
  ("Customer logos",
   "Which clients have given WRITTEN permission to display their logo? Please send the logo files.",
   "The “trusted by” strip stays hidden until real, permissioned logos exist."),
  ("Case studies",
   "2–3 real, approved stories: Client profile → Challenge → Scope → Approach → Deliverables → Timeline → Outcome → Client feedback.",
   "Case-study section is scaffolded but empty (draft)."),
  ("Testimonials attribution",
   "May we show name / designation / company / country / service (with written permission)? Where confidential, confirm a labelled role (e.g. “CISO, UK-based SaaS company”).",
   "We hold 3 real testimonials with minimal attribution."),
  ("Blog authorship",
   "A real author name + professional designation, and a reviewer name. Also: which articles have ACTUALLY been reviewed/updated, so we add a truthful “reviewed/updated” notice only where true.",
   "Articles currently show author “ABS Certifications”; real named authors/reviewers are needed for credibility."),
  ("Third phone number",
   "Add the third number shown on the live site: +91 99116 02258?",
   "Contact page currently lists two numbers."),
  ("Verified social profiles",
   "Official LinkedIn / X / YouTube URLs.",
   "Footer social icons are placeholders (#)."),
  ("ISMS policy",
   "Publish the approved ISMS / Information Security Policy statement, or remove the footer link until available?",
   "Footer shows an “ISMS policy” label with no page behind it."),
 ]),
 ("D. Scope & structure decisions", [
  ("Navigation restructure",
   "Adopt “Services · Industries · Standards · Resources · About · Contact” with a Standards mega-menu? Your list omits Process and Blog — you praised the Process page, so confirm we keep it reachable, and where Blog belongs.",
   "Current nav: Home · About · Services · Process · Blog · Contact."),
  ("“Business Advisory” grouping",
   "Move HR / Data Analytics / Agile under a separate Business Advisory category?",
   "Currently all 10 areas sit as flat service categories."),
  ("Service-label renames",
   "Rename headings to “ISO 9001 Certification Consulting”, “ISO 27001 Implementation & Certification Support”, etc.? Confirm the pattern.",
   "Bulk change across ~70 service pages."),
  ("URL scheme",
   "Your review suggests short URLs like /iso-27001-consulting. Current is /services/iso-27001. As the site isn't live at abscerts.com yet, we can set final URLs now — do you want the /...-consulting scheme (we add redirects), or keep /services/...?",
   "URL changes need redirects and affect SEO; best decided pre-launch."),
  ("Country landing pages",
   "Which countries (UAE, USA, UK, …)? These need GENUINELY local content — can ABS supply local specifics per country? (Thin/duplicated per-country pages are penalised by Google.)",
   "None exist yet."),
  ("Industry landing pages",
   "Expand from the current 4 (finance, healthcare, manufacturing, SaaS) to 8 (add construction, logistics, education, IT services…)? Please supply sector specifics.",
   "4 industry pages exist."),
  ("Contact form redesign",
   "Implement the two-step form + file upload (existing certificate / RFP / scope)? Any constraints on accepted file types / size / storage?",
   "Current form is single-step, no upload."),
 ]),
 ("E. Legal / compliance sign-off", [
  ("Legal review of policy pages [BLOCKS PUBLISH]",
   "Will ABS's legal team provide or sign off the final Privacy Policy, Cookie Policy and Terms text before publish? Confirm the retention period (you suggested “up to 3 years”) is legally approved.",
   "We will draft structured content per your guidance, but AI-drafted legal text must not go live unreviewed."),
 ]),
]

headers = ["No.", "Topic", "What we need from ABS", "Why / current status", "ABS response"]
widths = [Inches(0.4), Inches(1.9), Inches(3.4), Inches(2.9), Inches(2.4)]
table = doc.add_table(rows=1, cols=5); table.style = 'Table Grid'; table.autofit = False

def shade(cell, hexc):
    tcPr = cell._tc.get_or_add_tcPr(); sh = OxmlElement('w:shd')
    sh.set(qn('w:val'),'clear'); sh.set(qn('w:color'),'auto'); sh.set(qn('w:fill'),hexc); tcPr.append(sh)
def setc(cell, text, w, bold=False, white=False, size=9):
    cell.width = w; p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2); p.paragraph_format.space_before = Pt(2)
    run = p.add_run(text); run.bold = bold; run.font.size = Pt(size)
    if white: run.font.color.rgb = RGBColor(0xFF,0xFF,0xFF)

hdr = table.rows[0].cells
for i,h in enumerate(headers):
    setc(hdr[i], h, widths[i], bold=True, white=True, size=9.5); shade(hdr[i], '081F4D')
trPr = table.rows[0]._tr.get_or_add_trPr(); th=OxmlElement('w:tblHeader'); th.set(qn('w:val'),'true'); trPr.append(th)

n = 0
for section, items in SECTIONS:
    row = table.add_row().cells
    # merge across the row for section header
    merged = row[0].merge(row[1]).merge(row[2]).merge(row[3]).merge(row[4])
    setc(merged, section, widths[0], bold=True, size=10.5)
    shade(merged, 'D8E0EE')
    for topic, need, ctx in items:
        n += 1
        c = table.add_row().cells
        setc(c[0], str(n), widths[0]); setc(c[1], topic, widths[1], bold=True)
        setc(c[2], need, widths[2]); setc(c[3], ctx, widths[3]); setc(c[4], "", widths[4])

doc.add_paragraph()
f = doc.add_paragraph(); fr = f.add_run(
 'Once we have A–C answered we can complete the remaining copy; D sets the build scope; E gates the legal pages. '
 'Prepared from the ABS Website Gap Correction Table review. Positioning correction + ISO edition updates already implemented and live.')
fr.italic = True; fr.font.size = Pt(8); fr.font.color.rgb = RGBColor(0x77,0x77,0x77)

doc.save('ABS_followup_questions.docx'); print('SAVED ABS_followup_questions.docx  | items:', n)
