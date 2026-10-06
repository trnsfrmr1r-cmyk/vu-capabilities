<!-- Public copy of Vu Tran's "leak-finder" skill, published Oct 2026. Client and prospect names removed. Files under references/, assets/ and scripts/ are not included here. -->

---
name: leak-finder
description: Find a specific, dollar-valued, fixable problem in a prospect's business from public evidence, then write it up as a one-page findings doc. Four detectors — Meta Ad Library (screen first), customer reviews (Trustpilot, Google), speed-to-lead and missed inquiries, and website health. Runs on DataForSEO plus free public sources. Use when Vu says "leak finder," "find leaks," "run the detector," "diagnose this business," "what's broken at [company]," "build me a prospect list," "find prospects," "screen these," "are they running ads," "pull their reviews," "what can I sell them," "findings doc," or names a company and asks what's wrong with it. Also use when he's prospecting, qualifying a target list, or preparing outreach research. Do NOT use for the outreach sequence itself or free-build strategy — that's build-first. Not for scoping his own projects — that's prove-first.
---

# Leak Finder

Find something specific and expensive that's broken in a stranger's business, using only evidence they've already made public. Then hand them the diagnosis, not a pitch.

**This skill ends at the findings doc.** What happens next — the three-email sequence, the free build, proof extraction — is `build-first`. Don't duplicate it here.

**Read `references/detector-ad-library.md` before screening anything.** It runs first, it's free, and it killed 10 of 15 in the first measured batch. Read `references/dataforseo-recipes.md` before the first API call, the relevant `references/detector-*.md` before analysing. Template in `assets/findings-doc-template.md`.

---

## The loop

```
Target list → AD LIBRARY → PROFILE PAGE → IN-HOUSE CHECK → Corpus → Four questions → Verify → Findings doc → build-first
              kills ~2 in 3   kills 1 in 6      kills ~1 in 2
                              and reprices      of what's left
                              the rest
```

**All three screens are free and run before a cent is spent.** Measured 2026-08-22: **30 screened → 12 qualified → 10 live → ~5 worth a paid pull.**

Sixty percent of the funnel costs nothing. **Do not pay for a corpus until a target has cleared all three.**

### 1. Build the target list

**The discipline lives here, never in the outreach.** From `build-first`: *"you get billed at the tier you build for."*

Filter on both ends:

- **Floor** — enough public evidence to find a pattern. 150+ reviews, or an active ad footprint, or a site with real traffic.
- **Ceiling** — and this one gets forgotten. A brand large enough to have an in-house team that already owns the problem is not a prospect. Cap it.
- **Budget is live** — currently running ads, or measurable traffic. Not "was successful once."
- **One decision-maker**, findable. Founder, owner, or head of ecom.

**The in-house-team check** is not "do they have a marketing team" — it's **does anyone own the specific problem you found.** A stretched two-person growth team is a good buyer. A Head of Lifecycle whose literal job is the thing you're flagging is not.

**Free, and it killed two of the top four in the measured batch.** Full method, traps and worked examples in `references/detector-in-house.md`. The short version:

- **Follower count beats the self-reported employee range** — that range is a dropdown nobody updates. One prospect self-reported "11-50" with 3 members and 6 followers.
- **The People-tab keyword search matches the whole profile, not the job title.** `customer` returned 8 of 19 at a *2-10 employee* company. Use it to find one person, never to count a function.
- **The "parent company" affiliation goes stale by years.** One prospect still listed a parent that sold it in 2019. Verify ownership against a second source before it enters a document.
- **Check the connection degree.** A 2nd-degree path to the decision-maker beats any findings doc — when this check kills a cold target, see whether it opened a warm door.

Rough DTC read: under ~25 employees rarely has a dedicated growth function; 25–100 has one to three; 100+ has an org.

### 2. Screen with the Ad Library — free, and do it before anything paid

**Search the DOMAIN, never the brand name.** A bare brand name returns every advertiser using those words; the domain returns only the brand you mean. Full method and the disqualifying patterns in `references/detector-ad-library.md`.

Three things it settles in one search:

- **Is budget live right now?** No active ads on this channel, no spend to protect, and the pitch has nothing to attach to.
- **What kind of business is this?** Numbered sub-pages (`Brand.WH18`), multiple persona pages for one product, or unrelated product categories all mean dropship or advertorial, not a brand with customers. **Disqualify on sight.**
- **Are they closing?** *"Closing after 46 years — just cover shipping."* Invisible on every other source. Two of fifteen in the first batch.

**This beats the Trustpilot address heuristic, so it runs first.** Measured: **10 of 15 died here**, before a cent was spent. Budget roughly three qualified prospects per fifteen screened.

### 2a. 🚨 Reachability — run this BEFORE any diagnosis

**Learned by writing five outreach emails and then discovering there were no email addresses to send them to.** A prospect with a strong finding and no contact path is not a prospect. This costs four free lookups:

| Source | Gives you |
|---|---|
| **Trustpilot profile contact block** (and its JSON-LD) | Street address, phone, email. ⚠️ **Filter by `name`** — the same block carries Trustpilot's own Copenhagen address |
| **Google Maps listing** | Phone + website for any local business — **plus a "Sponsored" tag, which is the local equivalent of the Ad Library budget check** |
| **`/pages/contact-us`** | Shopify stores nearly always publish a real support email here. `/policies/contact-information` usually only links to it |
| **A named person** | LinkedIn, press, About page. **A named founder beats a support inbox by a wide margin** and usually takes one search |

**Demote anything that fails this**, however good the finding. One prospect had a sharp two-ad finding, an anonymized founder profile, six LinkedIn followers, and an overseas registered address. That should have died at screening, not after the email was written.

### 2a-ii. 🚨 THE THREE-SOURCE GATE — mandatory for every local prospect

**No local business gets contacted until all three sources have run.** Learned by clearing 18 leads as "no website" from a single API field, reporting *"0 falsified,"* and having **six of them turn out to have live websites** — one of them visible in Google's own Web results panel, which nobody ever opened.

| # | Source | How | What ONLY this catches |
|---|---|---|---|
| **1** | **DataForSEO listing** | `business_listings/search/live` | Rating distribution · `place_topics` · services · attributes · hours · claimed status · **`last_updated_time`** |
| **2** | 🔥 **The live GBP, eyes-on** | Open the place page in a browser — `check_url` in the API response is the direct link | **What actually renders** vs what's merely stored — and 🚨 **the "Web results" panel**, which lists their site, directories and aggregator pages |
| **3** | **Plain Google search** | `"<business name>" <city>` | Socials · former domains · scraped microsites · directory errors · dead links · owner names |

**Each catches what the others structurally cannot.** One source is not a check, and **re-reading one source twice is not verification.**

#### 🔑 Disagreement between sources IS the wedge

**This gate is not overhead — it is where the findings come from.** Every miss in the failed pass was two sources disagreeing, and every disagreement was something worth selling:

| API said | Reality said | The wedge |
|---|---|---|
| no domain | Web results shows a live site | **Misclassified** — sell site quality, not absence |
| no domain | Facebook links a dead domain | 🔥 **Their own page sends customers to a competitor** |
| no domain | Search finds a microsite with their logo and a **different phone** | 🔥 **Somebody is intercepting their calls** |
| — | BBB publishes a URL that 404s | **Dead link on a trusted directory** |
| Google phone | Yelp shows a different phone | 🔥 **Half their inbound goes somewhere they don't watch** |

> **Sources that agree give you a clean prospect. Sources that disagree give you the opener.**

#### Grade every claim

**CONFIRMED** = two independent sources agree, one of them eyes-on · **INDICATED** = one source, say *"unverified"* · **STALE** = snapshot older than ~30 days, quote the date with the claim.

🚨 **Never write "confirmed" or "0 falsified" from a single lookup.** That language stops the next person looking, which is what made the original miss dangerous rather than merely wrong.

**Full protocol, the recorded output block, the resolution-check trap, the name-collision rule and the domain-ownership rule: `references/detector-web-presence.md`.**

### 2b. Load the review profile page — still free, and it reprices everything

**One page load, no API call.** Trustpilot publishes the reply rate, the reply *latency*, whether they solicit reviews, whether they pay for a subscription, whether replies are AI-assisted, and the pre-coded complaint themes — all as badges on the profile. Full method in `references/detector-reviews.md`.

Two hard checks here:

- **Is the rating suppressed?** A **"Breach of guidelines"** warning replaces the rating. **Two of twelve.** Both showed clean ratings on the Trustpilot *category listing* — the listing goes stale, the profile page is the truth. **Never quote a category-listing rating.**
- **Is there actually a leak?** 🚨 **"Nobody replies to your reviews" does not survive this screen.** In an ad-screened cohort it was 0 of 10 — because this screen selects for brands that fund reputation management. **Look for latency instead:** 100% reply rate at *over a month* is an unowned queue, and a same-category competitor at 24 hours is your control, free.

### 2c. Run the in-house check — still free, and it kills about half of what's left

See §1 and `references/detector-in-house.md`. **Two of the top four died here**, both after passing the two earlier screens: one had a VP of Growth in seat, one turned out to be a 45-store retail chain with a Chapter 11 history. Neither was visible on Trustpilot or in the Ad Library.

### 3. Pull the corpus

Pick the detector that matches the business:

| Detector | Best for | Reference |
|---|---|---|
| **Ad Library** ← screen first | Every prospect, always. Budget check + legitimacy check | `references/detector-ad-library.md` |
| **Reviews** | Anything with review volume — DTC brands (Trustpilot), local service businesses (Google) | `references/detector-reviews.md` |
| **Speed to lead** | Businesses where an inbound inquiry is the revenue event — home services, property management, dental, med spa | `references/detector-speed-to-lead.md` |
| **Site health** | Any business with a transactional website | `references/detector-site-health.md` |
| **In-house team** ← last free filter | Every prospect, before any paid pull | `references/detector-in-house.md` |

Detectors compose. Two corpora that disagree is the strongest finding available — see §6.

### 4. Run the four questions

Every finding, no exceptions. Most die here, and that's the point.

1. **Is it recurring?** A pattern, not an incident. One angry review is noise; fourteen across two years is a process failure.
2. **Can I put a defensible dollar number on it?** If not, don't pitch it.
3. **Is it fixable with a system?** Missed follow-ups, unanswered reviews, broken checkout — yes. "The owner shouts at customers" — no.
4. **Is the leak bigger than the fix?** Target a payback inside 60–90 days. Then it's a maths conversation, not a persuasion one.

### 5. Verify before you write

**Two failure modes, both learned the hard way.**

**Provenance, not just numbers.** On the first live run of this method, the pull returned the correct review count and then asserted the wrong source profile for it. Nothing crashed. The numbers were right and the sentence about where they came from was invented. **In a findings doc that's the sentence that gets you caught.** Check every claim about *where* data came from against the live page, not just the figures.

**Never quote a platform's own summary badge as evidence.** Trustpilot's *"typically takes over 1 month to reply"* badge was measured against the underlying timestamps on the first live target: **100% replied, median under 48 hours.** That badge was the entire reason the prospect ranked #1. Reply *rate* held; latency was wrong by a factor of about fifteen. **Any number a platform computes for you gets recomputed from the raw records before it enters a document.**

**Run a control.** Before reporting that a field is empty — no owner responses, no verified reviews — pull the same field for a different company through the same endpoint. If it populates there and not here, the finding is real. If it's null everywhere, it's a parsing artifact. This costs cents and it is the difference between a finding and an embarrassment.

**Control the distribution too, not just field population.** A 19% one-star share reads as damning until a same-category control comes back at 14% — at which point it's context, not a finding. On the first live run this killed a headline claim, and saying so in the doc was worth more than the claim would have been.

**Then cross-check the headline number against the public page.** Rating and review count are visible on Trustpilot and Google. If those don't match, stop.

### 6. Compose detectors — the sharpest finding

One corpus gives you a complaint. **Two corpora that contradict each other give you a leak with a number attached.**

> **Ad Library = what they promise. Reviews = what customers say they got. The delta is the leak.**
>
> *"Your ads have said 2-day shipping since March. 34 reviews since May say it took nine."*

Other pairs that work: site speed vs. an ad driving paid traffic to that page · a hiring post for a role vs. reviews complaining about that exact function · high ad spend vs. a checkout that fails on mobile.

Both halves public, both verifiable by the recipient, and essentially nobody does this.

### 7. Write the findings doc

One page. Three to five named problems, at least one carrying a number. An observation, never a pitch. Template in `assets/findings-doc-template.md`.

**Quantify in units, not invented dollars.** *"41 reviews since March name sizing."* *"0 of 200 reviews have an owner response."* *"9 creatives live, unchanged, 11 weeks."* Verifiable from public data — your research, not a model's guess.

**Then attach the dollar range separately, with the arithmetic shown and the assumptions labeled**, so they can overwrite your assumption with their real number. They know their fee structure; you don't. Handing them the calculation rather than the conclusion is what makes it credible.

---

## Standing rules

**Never present an unverified statistic.** This category is saturated with fabricated numbers — see `references/detector-speed-to-lead.md` for a named list of the common ones and what they actually trace to. Using them puts the whole diagnostic at risk with any prospect who checks. **The source-tracing is itself the differentiator**: every competitor pitching this work quotes numbers that don't exist.

**Attribute every finding to the public artefact.** "Your last 200 Trustpilot reviews," "your Meta Ad Library footprint," "your careers page." They can check it. That's the point.

**Acknowledge what the data can't tell you.** Trustpilot is a solicited corpus. Review samples skew recent. Estimates are estimates. Saying so reads as competence, not weakness.

**One case is not a prior.** One early pull returned 0 owner responses in 200 reviews and that single result set the opener for a whole batch. The next twelve prospects returned reply rates of 34–100% and it was wrong for all of them. **Run the free screen across the cohort before deciding what the pitch is.** The cohort tells you the leak; the first case only tells you that a leak exists somewhere.

**Most findings die in the four questions.** A pipeline that can generate forty signals per prospect makes it *easier* to send a complaint dump, which is exactly what gets ignored. More data raises the bar on judgment; it never replaces it.

**Do the ten by hand before automating anything.** The tool finds complaints. It does not find clients. Judgment is the product.

---

## Output

**Two artefacts per prospect:**

1. **The findings doc** — one page, for them. `assets/findings-doc-template.md`.
2. **The internal record** — target, corpus pulled, what survived the four questions, what died and why, the dollar range and its assumptions, and the verification steps run.

**Where to save:** `~/Projects/VTDO/leak-finder/<YYYY-MM-DD>-<company>.md`. If the device isn't reachable, deliver with `SendUserFile` and say it isn't filed yet.

**In chat, lead with:**

1. **The finding** — one sentence, with the number
2. **The evidence** — which public artefact, and the counts
3. **What died in the filter** — and why, briefly
4. **The dollar range** — with the assumption named
5. **Verdict** — is this a prospect, and what's the opener

Then stop. The outreach is `build-first`.
