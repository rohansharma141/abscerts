# ABS Review — Risk & Conflict Register

Critical assessment of the ABS "Website Gap Correction Table" (accepted as source of truth).
Purpose: note risks / conflicts / dependencies before absorbing wholesale. **No item here is a
rejection** — they are "do carefully / verify first / sequence right / get sign-off."

Companion docs: [[abs-review-crosscheck]] (item-by-item vs current site), and the ABS doc itself
(`ABS_Certifications_review.docx`).

---

## 1. Fact-check result — ISO edition claims (VERIFIED CORRECT)
Checked against iso.org on 2026-08-03. ABS's standards knowledge is accurate and current.

| Standard | ABS claim | Verified |
|---|---|---|
| ISO/IEC 27701 | :2025, standalone | ✅ Published 14 Oct 2025; standalone (no 27001 prerequisite) |
| ISO/IEC 27018 | :2025 | ✅ Published, 3rd edition |
| ISO 55001 | :2024 | ✅ Published Jul 2024 (2nd ed.) |
| ISO 37001 | :2025 | ✅ Published Feb 2025; transition to Feb 2027 |
| ISO 21001 | :2025 | ✅ Published Jul 2025 (2nd ed.) |
| ISO 14001 | 2026 transition | ✅ Published 15 Apr 2026; transition to Apr 2029 |
| ISO 19600 | → 37301:2021 | ✅ Withdrawn, replaced |
| ISO 29990 | withdrawn | ✅ Withdrawn (→ 29993:2017 / 21001) |
| ISO/IEC 27017 | :2026 | ⚠️ FDIS as of Apr 2026 — publishing imminently; **confirm formal publication before printing ":2026"** (the guidance reframe is safe regardless) |

**Implication:** Batch 2 (edition updates) is low-risk. Only 27017:2026 needs a "is it published yet?" check.

---

## 2. Risks worth flagging
1. **Dating unverified statistics raises exposure.** ABS keeps 1,200+, 98%, 40+ countries, 18 years
   and adds "Figures updated July 2026." A freshness date makes numbers read as audited.
   → **ABS must confirm each figure is real and documented** before we date them.
2. **"High first-time certification success rate" mildly undercuts the positioning.** The doc
   distances ABS from the certification *decision*; a success-rate stat implies influence over it.
   Minor internal tension — keep the wording clearly about *implementation readiness*.
3. **Country landing pages = SEO trap if thin/duplicated** (Google "doorway pages"). ABS's caveat
   ("genuinely local information") is right but needs *real* local content, else it hurts rankings.
4. **Blog "reviewed and updated August 2026" must be truthful.** Only stamp posts actually reviewed;
   author/reviewer names must be **real people** (E-E-A-T), not "ABS Certifications."
5. **Legal pages must not go live unreviewed.** Privacy / Terms / retention ("up to 3 years") — ABS
   itself says "legally review." We draft; a lawyer signs off; then publish.
6. **File upload on the contact form is a security/abuse surface** (malware, spam, storage). Needs
   file-type/size limits and hardening on Pages Functions.

## 3. Internal conflicts in the doc
1. **Strict CSP/security headers vs third-party embeds.** CSP/HSTS + Calendly/Zoho scheduler +
   Google Fonts + Tabler CDN must each be explicitly allowlisted — in tension; needs careful config.
2. **Nav drops Process & Blog** (Services·Industries·Standards·Resources·About·Contact) yet the same
   doc calls the **Process page the strongest**. Keep Process reachable (nav or prominent link).
3. **Inconsistent experience dates:** 2008 (company), 2004 (academy), old 1991 (CMMI, now removed).
   → ABS should reconcile one coherent timeline before we print "18 years / since 2008."

## 4. Overrides vs the earlier ChatGPT review (ABS wins as source of truth)
- Nav naming: ChatGPT "ISO Management System Consulting" → ABS "Standards/Resources" structure.
- Personnel page: ChatGPT "remove/noindex" → ABS "clarify & keep."
- Hero heading: ChatGPT phrasing → ABS "Global ISO, SOC 2 and Compliance Advisory Services."

## 5. Dependencies on ABS (block their specific rows only)
- Verified statistics (1,200+, success rate, countries, years) + reconciled timeline.
- Real author/reviewer + leadership/consultant profiles (names, quals, LinkedIn).
- Legal-entity details: registered name, office, company reg number, GST, privacy contact.
- Scheduling tool choice + account (Calendly / Zoho / MS Bookings).
- Case-study content; customer-logo written permissions; 3rd phone number confirmation.
- Legal review sign-off for Privacy / Cookie / Terms.

## 6. Clearly worth absorbing — no reservations
Role clarification; all ISO edition updates (verified); 27017/27018/27701 reframe; HIPAA/GDPR
"no certificate"; Annex A / SoA nuance; IAF / CertSearch accuracy; privacy `hmlcerts.com` removal;
consent checkboxes; honest response-time; disclaimer; ProfessionalService + Article schema; branded
404; image SEO; accessibility; security headers (config permitting).

---

## Verdict
The doc is sound and worth absorbing — **no factual errors found; standards knowledge is expert.**
Nothing to reject. The work splits into: (a) safe copy — **Batch 1, done**; (b) verified edition
updates — **Batch 2, ready**; (c) larger builds and legal/trust content — **Batch 3, gated on ABS
data + sign-off**. Primary residual dependency: ABS-supplied verified numbers, real identities,
legal review, and entity/scheduler facts.
