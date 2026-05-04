import { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./KasihLinkPhase1.module.css";

/*
 * KasihLink — Phase 1 case study. Bespoke editorial layout, self-contained
 * styling. Source design: claude-reference/kasih-link/Product Design Case
 * Study.html (now removed; preserved here as components + CSS module).
 */

export default function KasihLinkPhase1() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "KasihLink: Phase 1 — Ching Yen";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <span className={styles.bylineTag}>
          <Link to="/?p=crafter">Ching Yen</Link> &nbsp;·&nbsp; Product Design
        </span>
        <span className={styles.seriesTag}>
          Series: KasihLink &nbsp; Part 1 of ?
        </span>
      </header>

      <section className={styles.hero}>
        <p className={styles.heroLabel}>Case Study &nbsp;·&nbsp; Research &amp; UX Design</p>
        <h1 className={styles.heroTitle}>
          From Conversation
          <br />
          to <em>Working Prototype</em>
        </h1>
        <p className={styles.heroSub}>
          How I helped a social-impact startup turn a founder's instinct into a
          validated product concept — without writing a single line of code
          prematurely.
        </p>
        <div className={styles.metaRow}>
          <span><strong>Client</strong> &nbsp; KasihLink</span>
          <span><strong>Sector</strong> &nbsp; Social Impact / Non-Profit Tech</span>
          <span><strong>Market</strong> &nbsp; Malaysia</span>
          <span><strong>Phase</strong> &nbsp; Discovery &amp; MVP Prototype</span>
        </div>
      </section>

      <div className={styles.divider} />

      <div className={styles.bodyWrap}>
        <section className={styles.section}>
          <p className={styles.sectionLabel}>01 &nbsp; Background</p>
          <h2 className={styles.sectionHeading}>A Problem Worth Solving</h2>
          <p>
            In Malaysia, hundreds of elderly homes and orphanages operate with
            minimal infrastructure, scarce visibility, and an over-reliance on
            informal donation networks. Well-meaning donors exist in abundance,
            but the connection between intent and impact is broken. Donations
            arrive in mismatched quantities, duplicate items pile up, and urgent
            needs go unmet — not because people don't care, but because there is
            no reliable way to communicate what is actually needed.
          </p>
          <p>
            KasihLink was founded to close that gap. The concept: a digital
            platform that gives verified charitable homes a voice, and gives
            donors a transparent, trustworthy channel through which to respond.
            The founder had spent time speaking with home operators and had seen
            the inefficiencies up close. What he needed was a way to bring that
            vision to life — something tangible enough to put in front of the
            organizations themselves and test the idea. As a friend with a
            background in software and product design, I came on board to help
            him build it.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>02 &nbsp; Approach</p>
          <h2 className={styles.sectionHeading}>
            Starting With the Founder, Not the Features
          </h2>
          <p>
            Before touching any design tool or writing any code, I sat down with
            the founder to understand the origin of the idea and the long-term
            vision.
          </p>
          <p>
            A few things became clear from that conversation. The founding idea
            had grown out of observations on the organization side — the homes
            weren't struggling to find goodwill, they were struggling to
            communicate their needs clearly and consistently. That's where the
            opportunity was most visible, and where research had already begun.
            The donor side remained an open question for a later phase.
          </p>
          <p>
            Second, the immediate goal wasn't a full product launch. It was a
            working prototype — something real enough to place in front of home
            administrators and generate honest reactions. The prototype would be
            the research instrument.
          </p>

          <blockquote className={styles.pullQuote}>
            <p>"The prototype wasn't the end goal. It was the research tool."</p>
            <cite>Design principle guiding Phase 1</cite>
          </blockquote>

          <p>
            With that framing established, I could make every subsequent
            decision — from technology choices to which screens to build first —
            in service of that singular objective.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>03 &nbsp; Scoping the MVP</p>
          <h2 className={styles.sectionHeading}>
            Reducing Scope Without Reducing Signal
          </h2>
          <p>
            One of the most valuable things a consultant can do in the early
            stages of a project is help a founder distinguish between what they
            need to build and what they simply want to build. Scope creep in
            early-stage products rarely comes from bad intentions — it comes
            from excitement. My job was to channel that excitement into a
            focused, testable slice of the product.
          </p>
          <p>
            The MVP needed to answer one question:{" "}
            <em>
              Will organization administrators actually use a digital tool to
              submit and track donation requests?
            </em>{" "}
            Everything outside that question could wait.
          </p>
          <p>
            To that end, Phase 1 focused exclusively on two screens for
            organization admins:
          </p>

          <div className={styles.insightGrid}>
            <div className={styles.insightCard}>
              <p className={styles.cardLabel}>Screen 1</p>
              <p>
                <strong>Create Request</strong> — a form that lets an admin
                specify the category, item name, brand, size, quantity needed,
                and urgency of a donation request.
              </p>
            </div>
            <div className={styles.insightCard}>
              <p className={styles.cardLabel}>Screen 2</p>
              <p>
                <strong>Request List</strong> — a read-only dashboard showing
                all submitted requests with their status: how many units were
                requested, reserved, and received.
              </p>
            </div>
          </div>

          <p>
            All submissions at this stage would be manually reviewed by the
            founder before being published — an intentional constraint that kept
            the scope lean while maintaining quality control. The founder's
            admin panel, visible in the screenshots, provides a simple queue of
            pending approvals for him to action.
          </p>
        </section>

        <div className={styles.screenshotRow}>
          <figure className={styles.screenshotItem}>
            <img
              src="/work/kasih-link/admin-dashboard.jpg"
              alt="KasihLink admin dashboard"
            />
            <figcaption className={styles.screenshotCaption}>
              Founder admin panel — Add org, view requests, manage approvals
            </figcaption>
          </figure>
          <figure className={styles.screenshotItem}>
            <img
              src="/work/kasih-link/create-request.jpg"
              alt="Create request screen"
            />
            <figcaption className={styles.screenshotCaption}>
              Create Request — category selection, item details, draft or publish
            </figcaption>
          </figure>
          <figure className={styles.screenshotItem}>
            <img
              src="/work/kasih-link/request-list.jpg"
              alt="Request list screen"
            />
            <figcaption className={styles.screenshotCaption}>
              Request List — live tracking of requested, reserved, and received units
            </figcaption>
          </figure>
          <figure className={styles.screenshotItem}>
            <img
              src="/work/kasih-link/pending-approvals.jpg"
              alt="Pending approvals screen"
            />
            <figcaption className={styles.screenshotCaption}>
              Pending Approvals — founder reviews submissions before they go live
            </figcaption>
          </figure>
        </div>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>04 &nbsp; Key Design Decisions</p>
          <h2 className={styles.sectionHeading}>Every Decision Earned Its Place</h2>
          <p>
            With the scope defined, I made a series of deliberate product and
            design decisions — each one traceable back to a specific constraint
            or insight from the discovery phase.
          </p>

          <h3 className={styles.subHeading}>Distribution Strategy</h3>
          <div className={styles.decisionBlock}>
            <p className={styles.decisionTitle}>Decision</p>
            <p className={styles.decisionBody}>
              Rather than publish through app stores, the application is built
              as a Progressive Web App (PWA) — accessible via a URL that
              administrators can save directly to their phone's home screen.
              This eliminates the friction of app store reviews and approvals,
              which was critical for getting the prototype in front of
              stakeholders quickly. It also removes an ongoing maintenance
              burden for future updates.
            </p>
          </div>

          <h3 className={styles.subHeading}>Discoverability via Facebook</h3>
          <div className={styles.decisionBlock}>
            <p className={styles.decisionTitle}>Decision</p>
            <p className={styles.decisionBody}>
              To give KasihLink a public presence without the overhead of
              building a donor-facing web platform at this stage, I proposed
              establishing a Facebook page. This serves a dual purpose: it acts
              as the platform's public identity, and it becomes the destination
              where approved donation requests are surfaced to potential donors.
              It's a pragmatic use of existing infrastructure — meeting donors
              where they already are, while keeping the build scope contained to
              the org-side prototype.
            </p>
          </div>

          <h3 className={styles.subHeading}>Organization-First Build Order</h3>
          <div className={styles.decisionBlock}>
            <p className={styles.decisionTitle}>Decision</p>
            <p className={styles.decisionBody}>
              It would have been tempting to build the donor-facing side first —
              that's the side that is more visible, more marketable, and easier
              to demonstrate to external stakeholders. But the genuine pain
              point lived with the home administrators, not the donors. Building
              the org-side first meant that the prototype could generate
              authentic feedback from the people whose daily operations this
              product is actually meant to improve.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>05 &nbsp; Stakeholder Feedback</p>
          <h2 className={styles.sectionHeading}>What the Homes Actually Told Us</h2>
          <p>
            With the prototype in hand, the founder brought it to two elderly
            homes. The feedback was illuminating — not because it validated the
            original assumptions, but because it challenged them in ways that
            will meaningfully shape what gets built next.
          </p>

          <div className={styles.feedbackPair}>
            <div className={styles.feedbackCard}>
              <p className={styles.orgLabel}>Home 1 &nbsp;·&nbsp; Petaling Jaya</p>
              <p className={styles.finding}>
                "The problem isn't donations. It's loneliness and the weight of
                running this alone."
              </p>
              <p>
                The home owner operated largely solo, carrying the full
                emotional and operational burden of the home on his shoulders.
                What he expressed a need for wasn't a better way to request rice
                or cooking oil — it was human presence. Volunteers willing to
                spend time with the elderly. Someone to share the worry with.
                This is a materially different problem from the one the product
                was designed to solve.
              </p>
            </div>
            <div className={styles.feedbackCard}>
              <p className={styles.orgLabel}>Home 2 &nbsp;·&nbsp; Petaling Jaya</p>
              <p className={styles.finding}>
                "I like the idea — but I'm worried it's going to create more
                work for me."
              </p>
              <p>
                The second home administrator was receptive and genuinely
                supportive of the concept. Her concern, however, was telling:
                any tool that adds to the admin burden of an already
                overstretched team will fail on adoption regardless of how well
                it is designed. The directive this surfaces is clear — the
                product must automate administrative work, not create more of
                it.
              </p>
            </div>
          </div>

          <p>
            These are exactly the kinds of findings that early-stage research is
            designed to surface — and exactly why building a lightweight
            prototype before investing in a full product was the right call.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>06 &nbsp; Takeaways</p>
          <h2 className={styles.sectionHeading}>What Phase 1 Established</h2>

          <div className={styles.takeaway}>
            <p className={styles.takeawayLabel}>Where We Stand</p>
            <p>
              Phase 1 delivered a working prototype, surfaced real stakeholder
              feedback, and produced two findings that will directly inform what
              gets built next. The core hypothesis — that organization
              administrators need a structured digital channel to communicate
              needs — received qualified support. But the research also revealed
              a more nuanced opportunity space: a product that not only handles
              material donation requests, but accommodates volunteer
              coordination and is designed from the ground up to reduce, not add
              to, the administrative load on home operators.
            </p>
            <p>
              That's a richer, more defensible product direction than what we
              started with. And arriving at it before significant engineering
              investment is the entire point of a well-run discovery phase.
            </p>
          </div>
        </section>

        <div className={styles.appendix}>
          <p className={styles.appendixLabel}>
            Technical Appendix &nbsp;·&nbsp; For the curious
          </p>

          <details>
            <summary>Technology Stack &amp; Architecture Choices</summary>
            <div className={styles.detailsBody}>
              <p>
                The application is built in Flutter, Google's open-source UI
                framework. Flutter was chosen for its cross-platform
                capabilities — a single codebase compiles to iOS, Android, and
                web, which matters for the longer-term vision of KasihLink
                supporting diverse devices without maintaining separate
                codebases.
              </p>
              <p>
                Critically, the web compilation capability allows the
                organization admin app to be deployed as a Progressive Web App
                (PWA). This means there is no app store dependency;
                administrators receive a URL, visit it in their mobile browser,
                and save it to their home screen like any other app. Updates
                propagate instantly without requiring user action — a
                significant operational advantage for a small team managing a
                growing network of homes.
              </p>
              <p>
                At this stage, submitted requests flow through a manual approval
                queue managed by the founder before being surfaced publicly.
                This is a deliberate product decision as much as a technical
                one: it keeps content quality high during the validation phase
                and ensures the founder remains close to the feedback loop as
                the first users onboard.
              </p>
            </div>
          </details>

          <details>
            <summary>Why Facebook — Not a Custom Donor Portal</summary>
            <div className={styles.detailsBody}>
              <p>
                Building a full donor-facing portal was out of scope for Phase 1
                — and intentionally so. The open question at this stage was not
                "Can we build a donor portal?" but "Do the organizations have a
                need that's worth solving?" Answering the second question first
                is sound product thinking.
              </p>
              <p>
                Facebook as a distribution channel for approved donation
                requests is a pragmatic interim solution: it has an established
                user base in Malaysia, supports post formats that translate well
                to donation request listings, and requires zero additional
                engineering. It also allows the team to observe donor engagement
                organically before investing in purpose-built discovery
                features.
              </p>
            </div>
          </details>
        </div>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerName}>Ching Yen</span>
      </footer>
    </article>
  );
}
