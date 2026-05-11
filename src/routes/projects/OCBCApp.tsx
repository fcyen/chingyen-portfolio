import { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./OCBCApp.module.css";

/*
 * Redesigning the OCBC App Experience — UX case study. Self-contained
 * editorial layout that pairs slide artefacts with lightweight connector
 * text drawn from the slides themselves. Source: Vertical Institute UX
 * Design Course capstone project.
 */

const SLIDES = "/work/ocbc-app";

export default function OCBCApp() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Redesigning the OCBC App Experience — Ching Yen";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <span className={styles.bylineTag}>
          <Link to="/?p=crafter">Ching Yen</Link> &nbsp;·&nbsp; UX Case Study
        </span>
        <span className={styles.seriesTag}>
          Vertical Institute &nbsp; UX Capstone
        </span>
      </header>

      <section className={styles.hero}>
        <p className={styles.heroLabel}>Case Study &nbsp;·&nbsp; Research &amp; UX Design</p>
        <h1 className={styles.heroTitle}>
          Redesigning the
          <br />
          <em>OCBC App</em> Experience
        </h1>
        <p className={styles.heroSub}>
          A focused redesign of OCBC's Payment &amp; Transfer flow — taking a
          frustrating, security-heavy journey and making it faster, clearer,
          and easier to trust.
        </p>
        <div className={styles.metaRow}>
          <span><strong>Subject</strong> &nbsp; OCBC mobile app</span>
          <span><strong>Scope</strong> &nbsp; Payments &amp; Transfers</span>
          <span><strong>Market</strong> &nbsp; Singapore</span>
          <span><strong>Context</strong> &nbsp; UX course capstone</span>
        </div>
      </section>

      <div className={styles.divider} />

      <div className={styles.bodyWrap}>
        <section className={styles.section}>
          <p className={styles.sectionLabel}>01 &nbsp; Overview</p>
          <h2 className={styles.sectionHeading}>About the Project</h2>
          <p>
            OCBC is a Singaporean multinational bank and the second-largest in
            Southeast Asia by assets. Its mobile app is the day-to-day banking
            channel for millions of customers — and the Payment &amp; Transfer
            flow is one of its most frequently used surfaces.
          </p>
          <p>
            This project investigates that surface end-to-end. Beginning with
            competitor analysis and user interviews, I identified gaps in the
            current experience, then designed an enhanced user journey aimed
            at addressing the key pain points and improving everyday usability.
          </p>

          <figure className={styles.slide}>
            <img src={`${SLIDES}/02-overview.jpg`} alt="Case study overview slide" loading="lazy" />
          </figure>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>02 &nbsp; Problem Space</p>
          <h2 className={styles.sectionHeading}>Where the Journey Breaks Down</h2>
          <p>
            Walking through the existing flow — login, accounts overview, pay
            &amp; transfer, payee list, transfer page, confirmation, review —
            three pain points kept surfacing: an alert modal heavy on text but
            light on focus, an inability to filter payees, and friction every
            time a user tried to add a new one.
          </p>

          <figure className={styles.slide}>
            <img src={`${SLIDES}/03-problem-space.jpg`} alt="Existing user journey with pain points" loading="lazy" />
          </figure>

          <blockquote className={styles.pullQuote}>
            <p>
              "The account and fund management experience in OCBC is too
              frustrating and lacks effective security measures. As a result,
              users are less motivated to use OCBC for their day-to-day banking
              needs."
            </p>
            <cite>Problem statement guiding the project</cite>
          </blockquote>

          <p>
            Scoping the project around two concrete tasks — adding a new
            payee, and making a fund transfer — kept the work tractable while
            still touching the moments where users feel the most friction.
          </p>

          <figure className={styles.slide}>
            <img src={`${SLIDES}/04-scope-goals.jpg`} alt="Scope and goals" loading="lazy" />
          </figure>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>03 &nbsp; Research</p>
          <h2 className={styles.sectionHeading}>What the Market and Users Said</h2>
          <p>
            Comparing OCBC against DBS and CIMB surfaced an uncomfortable
            truth: OCBC is feature-competitive at the performance tier
            (recurring transfers, cooling-period safeguards, transaction limit
            controls) but those features are buried. Users couldn't reach
            them, so they didn't use them.
          </p>

          <figure className={styles.slide}>
            <img src={`${SLIDES}/05-market-research.jpg`} alt="Market research comparison: OCBC, DBS, CIMB" loading="lazy" />
          </figure>

          <h3 className={styles.subHeading}>How Might We…</h3>
          <p>
            That gap reframed the design question: not <em>what new feature
            should we add</em>, but <em>how do we make what already exists
            more discoverable and intuitive</em>?
          </p>

          <figure className={styles.slide}>
            <img src={`${SLIDES}/06-how-might-we.jpg`} alt="How Might We question" loading="lazy" />
          </figure>

          <h3 className={styles.subHeading}>User Research</h3>
          <p>
            User interviews with six current OCBC customers tested both
            usability and usage. Usability surfaced the alert modal as a
            recurring complaint, an unawareness of the 12-hour cooling period,
            and a wish for a way to sort payees with similar names. Usage
            patterns showed that lighter users (less than 50% of their
            transfers through OCBC) rated the app noticeably lower than
            heavier users — a sign that the experience pays off only once a
            user has already pushed through its friction.
          </p>

          <figure className={styles.slide}>
            <img src={`${SLIDES}/07-user-research-usability.jpg`} alt="Usability research: questions and insights" loading="lazy" />
          </figure>

          <figure className={styles.slide}>
            <img src={`${SLIDES}/08-user-research-usage.jpg`} alt="Usage research: questions and insights" loading="lazy" />
          </figure>

          <p>
            Both research strands pointed to the same conclusion: OCBC offers
            competitive features, but many remain undiscovered because of how
            users navigate the app.
          </p>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>04 &nbsp; Synthesis</p>
          <h2 className={styles.sectionHeading}>From Insights to Stories</h2>
          <p>
            The research synthesized into a small set of user stories,
            prioritised must-have / should-have / could-have, and grounded in
            two personas: a fresh graduate setting up his first banking
            essentials, and a small-business owner running quick, frequent
            transfers to suppliers.
          </p>

          <figure className={styles.slide}>
            <img src={`${SLIDES}/09-user-stories.jpg`} alt="User stories and prioritization" loading="lazy" />
          </figure>

          <div className={styles.personaPair}>
            <figure className={styles.slide}>
              <img src={`${SLIDES}/10-persona-primary.jpg`} alt="Primary persona: Mina, 25, engineer" loading="lazy" />
              <figcaption className={styles.slideCaption}>Primary persona — Mina, 25, engineer</figcaption>
            </figure>
            <figure className={styles.slide}>
              <img src={`${SLIDES}/11-persona-secondary.jpg`} alt="Secondary persona: Clara, 31, business owner" loading="lazy" />
              <figcaption className={styles.slideCaption}>Secondary persona — Clara, 31, business owner</figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>05 &nbsp; Proposed Journey</p>
          <h2 className={styles.sectionHeading}>A Shorter Path to a Trusted Transfer</h2>
          <p>
            The proposed journey adds a <em>Favourites</em> shortcut at L2 so
            repeat payees are one tap away, and threads a <em>mark as
            favourite</em> action through the add-payee flow so the
            optimisation accumulates as users go.
          </p>

          <figure className={styles.slide}>
            <img src={`${SLIDES}/12-user-journey.jpg`} alt="Existing vs proposed user journey" loading="lazy" />
          </figure>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>06 &nbsp; High-Fidelity Mockups</p>
          <h2 className={styles.sectionHeading}>Designing for Discoverability</h2>

          <h3 className={styles.subHeading}>Payment &amp; Transfer Page</h3>
          <p>
            Icons are enlarged to emphasise primary payment actions over the
            "Manage Transfer" menu. A new <em>Favourites</em> action gives
            quick access to frequently used payees across all payment options.
          </p>
          <figure className={styles.slide}>
            <img src={`${SLIDES}/14-hifi-payment-transfer.jpg`} alt="High-fidelity: Payment & Transfer page" loading="lazy" />
          </figure>

          <h3 className={styles.subHeading}>Local &amp; Favourite Transfer Pages</h3>
          <p>
            Users can favourite or remove a payee directly from the list with
            an inline heart icon. <em>Add payee</em> moves to the top right to
            free vertical space for the payee list itself. The Favourite
            Transfer page surfaces all favourited payees across every
            transfer type.
          </p>
          <figure className={styles.slide}>
            <img src={`${SLIDES}/15-hifi-local-favourite.jpg`} alt="High-fidelity: Local and Favourite Transfer pages" loading="lazy" />
          </figure>

          <h3 className={styles.subHeading}>Alerts &amp; Confirmations</h3>
          <p>
            The alert modal shrinks to keep users oriented in the app. Its
            content is more concise, with a <em>Learn more</em> link out to a
            help-centre page for users who want the full context. For
            transfers to existing payees, the modal is replaced entirely by an
            alert section on the confirmation page that prompts users to
            double-check details before proceeding.
          </p>
          <figure className={styles.slide}>
            <img src={`${SLIDES}/16-hifi-alerts.jpg`} alt="High-fidelity: Alerts and confirmations" loading="lazy" />
          </figure>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>07 &nbsp; Results</p>
          <h2 className={styles.sectionHeading}>What User Testing Showed</h2>
          <p>
            User testing with three of the originally interviewed participants
            validated the direction.
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statNumber}>3/3</p>
              <p className={styles.statLabel}>
                found the redesigned Payment &amp; Transfer page easier to
                navigate with the larger icons.
              </p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statNumber}>3 fewer</p>
              <p className={styles.statLabel}>
                clicks to add a new payee versus the original flow.
              </p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statNumber}>25% quicker</p>
              <p className={styles.statLabel}>
                to transfer funds to a favourited payee, thanks to the new
                UI placement.
              </p>
            </div>
          </div>

          <figure className={styles.slide}>
            <img src={`${SLIDES}/17-results-testing.jpg`} alt="Results and user testing" loading="lazy" />
          </figure>

          <div className={styles.takeaway}>
            <p className={styles.takeawayLabel}>What's Next</p>
            <p>
              Beyond the redesigned flow, the testing surfaced one more
              opportunity: pairing the 12-hour cooling period with an in-app
              notification when it ends. The security benefit stays intact;
              the wait becomes a moment of feedback instead of a dead zone.
            </p>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerName}>Ching Yen</span>
        <span className={styles.footerNote}>
          Capstone project, Vertical Institute UX Design Course
        </span>
      </footer>
    </article>
  );
}
