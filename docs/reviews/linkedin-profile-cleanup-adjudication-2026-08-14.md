# LinkedIn Profile Cleanup — Local Adjudication

Date: 2026-08-14 (Asia/Taipei)

## Review provenance

- Frozen packet SHA-256:
  `b8b7aee32179c98c1e090cbc5ab78fbce0b293a677a7aa3a2d14f59fa231e455`
- Gemini official API: requested/observed/completed
  `gemini-3.7-flash`; verdict `PASS_WITH_REVISIONS`; 2,477 input / 2,603
  output / 5,411 total tokens.
- Claude subscription wrapper: requested dynamic `opus`; timeout after
  preflight, with no observed or completed model and ambiguous request state.
  The attempt remains `incomplete`; no second request and no dual-review
  consensus are claimed.

## Verdict

`APPROVE_BOUNDED_LIVE_EDIT`

The current profile contains one factual attribution error and a consistent
presentation problem: new positioning copy is concise, but older Experience
entries still use raw resume fragments, inconsistent capitalization,
parenthetical broadcast shorthand, and low-context metrics. The cleanup should
remove those collisions rather than add more sections or keyword cards.

## Accepted findings

1. Correct the Top Gear description. The 200M wording incorrectly reads as a
   single-episode result; the external source covers aggregate Season 2
   television-plus-online viewing across five episodes.
2. Remove `Founder, Team Geek Production` from the headline because the company
   already appears in the top card. Add `Editing`, retain the central role,
   service, and Taiwan terms.
3. Replace the About credit block with one compact selected-work paragraph.
4. Expand the current-role title to describe the work function, not only the
   ownership status.
5. Normalize all nine Experience entries and remove weak, misleading, or
   resume-only metrics from the short LinkedIn descriptions.
6. Retain only ten non-duplicate, work-supported Skills.
7. Leave Services and the single Featured portfolio link unchanged.

## Adjusted or rejected reviewer suggestions

- Reject `Developed the project and secured a production grant` for *Lying
  Game*. The live profile supports the grant claim but does not independently
  establish both of those personal actions. The clean replacement states the
  credited screenwriting role only.
- Replace the proposed *Overclocking* `co-produced` wording with the canonical
  portfolio wording: producer/writer; developed with ScreenHouse; adapted for
  Tamil-language broadcast in South India.
- Do not add `BBC` to the current Top Gear role. The canonical verified wording
  is `the original Top Gear team`.
- Do not install Teal, Resume Worded, or another browser extension for this
  package. Their generic score would add an account/permission surface without
  improving the already-converged factual and structural diagnosis.

## Exact live target

### Headline

`Documentary Director & Bilingual Producer | Factual Series, Field Production & Editing | Taiwan`

### About

I’m a Taiwan-based documentary director and bilingual producer working across
factual series, arts and culture, technology, and travel.

I work from research and story development through directing, interviewing,
and editing. For international teams filming in Taiwan, I provide bilingual
field production with editorial input—connecting local research, interviews,
logistics, and story decisions.

Selected work includes Tech Dreamers and My Art, My Voice for TaiwanPlus, Slow
Steps, and Top Gear China: UK Special for Dragon TV. Earlier work includes
episode development and writing for PTS Taigi’s Nothing by Bus and directing
and editing design and brand films for Gorgeous Space.

I’m open to documentary and factual commissions, series development,
director/editor roles, and bilingual field-production partnerships in Taiwan.

Portfolio: https://hsinhsinyuan.com

### Experience 1 — Team Geek Production

Title: `Founder / Documentary Director & Producer`

Description:

Direct and produce documentary, factual, educational, and branded projects
through Team Geek Production in Taiwan.

• Lead projects from research and story development through interviewing,
field production, directing, and editing.

• Provide bilingual field production with editorial input for international
teams filming in Taiwan.

• Recent work includes Tech Dreamers, My Art, My Voice, and Slow Steps. Earlier
work includes How-to Master for PTS and documentary projects for Yahoo! Taiwan
Real Estate.

Portfolio: https://hsinhsinyuan.com

### Experience 2 — Top Gear China

`Directed Top Gear China Season 2, Episode 5: UK Special, leading the shoot in Britain and coordinating editorial and production requirements across Dragon TV, the Chinese production team, and the original Top Gear team.`

### Experience 3 — Taiwan Int'l Children’s Film Festival

`Selected film entries and coordinated communication with international judges and production teams.`

### Experience 4 — Heart of Steel

`Screenwriter for the 13-episode Taiwanese drama series.`

### Experience 5 — Lying Game

`Screenwriter for the 13-episode Taiwanese drama series.`

### Experience 6 — Overclocking

`Producer and writer for an international science and factual production developed with UK production company ScreenHouse and adapted for Tamil-language broadcast in South India.`

### Experience 7 — Public Television Service Taiwan

Title: `Producer & Writer`

Description:

Produced and wrote educational, science, reality, and documentary programming
for PTS.

Selected credits include How to Master (Producer / Writer), Southern Power
(Director / Editor), Explore the Unknown, Follow Me, E4Kids, Guess Who, and
Gachago.

### Experience 8 — Academia Sinica, Taiwan

`Produced and wrote six documentary short films for the Digital Libraries Program.`

### Experience 9 — Chinese Television System Taiwan

Title: `Producer & Writer`

Description:

`Produced and wrote the educational television series JSN School.`

### Skills

Keep and order the strongest ten where LinkedIn permits:

1. Documentaries
2. Film Direction
3. Video Production
4. Field Production
5. Video Editing
6. Story Development
7. Interviewing
8. Television
9. Film Production
10. Translation

Remove these duplicate or low-signal entries:

- Short Films
- Editing
- TV Production
- Reality TV
- Writing
- Film
- Video
- Photography
- Directing

## Frozen fields

Do not change the name, profile photograph, cover state, location, education,
language levels, current dates/employers, public URL, website/contact details,
Open to Work settings, Services labels/description, Featured item, or external
links.

## Applied result

The bounded target above was applied to the live LinkedIn profile on
2026-08-14. LinkedIn displayed the intended headline, all five About
paragraphs, the nine normalized Experience entries, and exactly the ten
retained Skills. The three visible top Skills remain Video Production,
Documentaries, and Film Direction.

Readback also confirmed that the prior headline, `SELECTED WORK` block, Top
Gear 200M attribution, resume-strip title, and the nine removed Skills no
longer appear. Services and the single Featured portfolio link remain intact;
all frozen fields remained unchanged. The live package verdict is `PASS`.
