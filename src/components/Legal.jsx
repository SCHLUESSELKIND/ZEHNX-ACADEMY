import { useState } from "react";

const Z = {
  bg: "#F5F5F7", w: "#FFFFFF", g50: "#FAFAFA", g100: "#F3F4F6", g200: "#E5E7EB",
  g300: "#D1D5DB", g400: "#9CA3AF", g500: "#6B7280", g600: "#4B5563",
  g700: "#374151", g800: "#1F2937", g900: "#111827", x: "#18181B",
  bl: "#2563EB", blL: "#DBEAFE",
};

const TABS = [
  { id: "impressum", l: "Impressum" },
  { id: "datenschutz", l: "Datenschutz" },
  { id: "agb", l: "AGB" },
];

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: Z.x, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{title}</h2>
      <div style={{ fontSize: 14, color: Z.g600, lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function Impressum() {
  return (
    <div>
      <Section title="Angaben gemaess § 5 DDG">
        <p><strong>Frerich United Ventures GmbH</strong></p>
        <p>An der Ronne 48<br/>50859 Koeln<br/>Deutschland</p>
        <p style={{ marginTop: 12 }}>
          Handelsregister: HRB 112376<br/>
          Registergericht: Amtsgericht Koeln
        </p>
        <p style={{ marginTop: 12 }}>
          <strong>Vertreten durch:</strong><br/>
          Thomas Frerich, Geschaeftsfuehrer
        </p>
      </Section>

      <Section title="Kontakt">
        <p>E-Mail: tf@frerich-united-ventures.de</p>
      </Section>

      <Section title="Umsatzsteuer-ID">
        <p>Umsatzsteuer-Identifikationsnummer gemaess § 27 a Umsatzsteuergesetz:<br/>
        DE 356752511</p>
      </Section>

      <Section title="Verantwortlich fuer den Inhalt nach § 18 Abs. 2 MStV">
        <p>Thomas Frerich<br/>An der Ronne 48<br/>50859 Koeln</p>
      </Section>

      <Section title="EU-Streitschlichtung">
        <p>Die Europaeische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
        <br/><a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener" style={{ color: Z.bl }}>https://ec.europa.eu/consumers/odr/</a></p>
        <p style={{ marginTop: 8 }}>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
        <p style={{ marginTop: 8 }}>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </Section>

      <Section title="Haftung fuer Inhalte">
        <p>Als Diensteanbieter sind wir gemaess § 7 Abs.1 DDG fuer eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, uebermittelte oder gespeicherte fremde Informationen zu ueberwachen oder nach Umstaenden zu forschen, die auf eine rechtswidrige Taetigkeit hinweisen.</p>
        <p style={{ marginTop: 8 }}>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberuehrt. Eine diesbezuegliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung moeglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
      </Section>

      <Section title="Haftung fuer Links">
        <p>Unser Angebot enthaelt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb koennen wir fuer diese fremden Inhalte auch keine Gewaehr uebernehmen. Fuer die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
      </Section>

      <Section title="Urheberrecht">
        <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfaeltigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechtes beduerfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
      </Section>
    </div>
  );
}

function Datenschutz() {
  return (
    <div>
      <Section title="1. Datenschutz auf einen Blick">
        <p><strong>Allgemeine Hinweise</strong></p>
        <p>Die folgenden Hinweise geben einen einfachen Ueberblick darueber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website nutzen. Personenbezogene Daten sind alle Daten, mit denen Sie persoenlich identifiziert werden koennen.</p>
      </Section>

      <Section title="2. Verantwortliche Stelle">
        <p>Frerich United Ventures GmbH<br/>
        An der Ronne 48<br/>
        50859 Koeln<br/>
        E-Mail: tf@frerich-united-ventures.de</p>
        <p style={{ marginTop: 8 }}>Verantwortliche Stelle ist die natuerliche oder juristische Person, die allein oder gemeinsam mit anderen ueber die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.</p>
      </Section>

      <Section title="3. Datenerfassung auf dieser Website">
        <p><strong>Wie erfassen wir Ihre Daten?</strong></p>
        <p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie bei der Registrierung eingeben (E-Mail-Adresse).</p>
        <p style={{ marginTop: 8 }}>Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).</p>

        <p style={{ marginTop: 16 }}><strong>Wofuer nutzen wir Ihre Daten?</strong></p>
        <p>Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewaehrleisten. Andere Daten koennen zur Analyse Ihres Nutzerverhaltens verwendet werden.</p>

        <p style={{ marginTop: 16 }}><strong>Welche Rechte haben Sie bezueglich Ihrer Daten?</strong></p>
        <p>Sie haben jederzeit das Recht, unentgeltlich Auskunft ueber Herkunft, Empfaenger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben ausserdem ein Recht, die Berichtigung oder Loeschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, koennen Sie diese Einwilligung jederzeit fuer die Zukunft widerrufen. Ausserdem haben Sie das Recht, unter bestimmten Umstaenden die Einschraenkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</p>
      </Section>

      <Section title="4. Hosting">
        <p><strong>Hetzner</strong></p>
        <p>Wir hosten unsere Website und Datenbank bei Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland. Hetzner ist ein deutscher Hosting-Anbieter mit Rechenzentren in Deutschland (Nuernberg, Falkenstein). Saemtliche Daten werden ausschliesslich auf Servern in Deutschland verarbeitet und gespeichert.</p>
        <p style={{ marginTop: 8 }}>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer zuverlaessigen und sicheren Bereitstellung unserer Website).</p>

        <p style={{ marginTop: 16 }}><strong>Vercel</strong></p>
        <p>Das Frontend unserer Anwendung wird ueber Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA bereitgestellt. Die Uebermittlung in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln.</p>
        <p style={{ marginTop: 8 }}>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
      </Section>

      <Section title="5. Registrierung und Nutzerkonto">
        <p>Sie koennen sich auf unserer Website registrieren, um zusaetzliche Funktionen zu nutzen. Die Registrierung erfolgt per Magic Link (passwortlos) ueber Ihre E-Mail-Adresse.</p>
        <p style={{ marginTop: 8 }}><strong>Verarbeitete Daten:</strong></p>
        <p>- E-Mail-Adresse (fuer Login und Kommunikation)</p>
        <p>- Lernfortschritt (abgeschlossene Sprints, Lektionen, Quiz-Ergebnisse)</p>
        <p>- Profilinformationen (sofern von Ihnen angegeben)</p>
        <p style={{ marginTop: 8 }}>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfuellung) und Art. 6 Abs. 1 lit. a DSGVO (Einwilligung bei optionalen Daten).</p>
        <p style={{ marginTop: 8 }}><strong>Speicherdauer:</strong> Ihre Daten werden gespeichert, solange Ihr Nutzerkonto besteht. Bei Loeschung Ihres Kontos werden saemtliche personenbezogene Daten innerhalb von 30 Tagen geloescht.</p>
      </Section>

      <Section title="6. Datenbank (Supabase Self-Hosted)">
        <p>Wir betreiben unsere Datenbank selbst auf einem dedizierten Hetzner-Server in Deutschland (Supabase Self-Hosted). Saemtliche Nutzerdaten werden ausschliesslich auf diesem Server in Deutschland gespeichert und verarbeitet. Es erfolgt keine Uebermittlung der Datenbankdaten an Drittstaaten.</p>
        <p style={{ marginTop: 8 }}>Row Level Security (RLS) stellt sicher, dass jeder Nutzer nur auf seine eigenen Daten zugreifen kann.</p>
      </Section>

      <Section title="7. Analyse-Tools">
        <p><strong>Plausible Analytics</strong></p>
        <p>Wir nutzen Plausible Analytics fuer die Analyse des Nutzerverhaltens. Plausible ist ein datenschutzfreundliches Analyse-Tool, das:</p>
        <p>- Keine Cookies setzt</p>
        <p>- Keine persoenlichen Daten erhebt</p>
        <p>- Keine IP-Adressen speichert</p>
        <p>- Vollstaendig DSGVO-konform ist ohne Cookie-Consent</p>
        <p style={{ marginTop: 8 }}>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Analyse des Nutzerverhaltens zur Verbesserung unseres Angebots).</p>
      </Section>

      <Section title="8. Zahlungsabwicklung">
        <p><strong>Stripe</strong></p>
        <p>Fuer die Zahlungsabwicklung nutzen wir den Dienst Stripe (Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland). Bei einer Zahlung werden Ihre Zahlungsdaten direkt an Stripe uebermittelt. Wir selbst speichern keine Kreditkarten- oder Kontodaten.</p>
        <p style={{ marginTop: 8 }}>Verarbeitete Daten: Name, E-Mail, Zahlungsinformationen, Rechnungsadresse.</p>
        <p style={{ marginTop: 8 }}>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfuellung).</p>
      </Section>

      <Section title="9. KI-Verarbeitung">
        <p><strong>Claude API (Anthropic)</strong></p>
        <p>Fuer den AI Tutor und die Generierung personalisierter Lerninhalte nutzen wir die Claude API von Anthropic, PBC (San Francisco, USA). Dabei werden Ihre Eingaben (Fragen an den AI Tutor) an die API uebermittelt. Die Uebermittlung erfolgt auf Grundlage der EU-Standardvertragsklauseln.</p>
        <p style={{ marginTop: 8 }}>Anthropic speichert keine Nutzerdaten fuer das Training ihrer Modelle bei API-Nutzung (Zero Data Retention bei kommerzieller API-Nutzung).</p>
        <p style={{ marginTop: 8 }}>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfuellung) und Art. 6 Abs. 1 lit. a DSGVO (Einwilligung bei Nutzung des AI Tutors).</p>
      </Section>

      <Section title="10. E-Mail-Versand">
        <p><strong>IONOS SMTP</strong></p>
        <p>Fuer den Versand transaktionaler E-Mails (Login-Links, Benachrichtigungen) nutzen wir den SMTP-Service von IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, Deutschland.</p>
        <p style={{ marginTop: 8 }}>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfuellung).</p>
      </Section>

      <Section title="11. Ihre Rechte">
        <p>Sie haben gegenueber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</p>
        <p>- <strong>Recht auf Auskunft</strong> (Art. 15 DSGVO)</p>
        <p>- <strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</p>
        <p>- <strong>Recht auf Loeschung</strong> (Art. 17 DSGVO)</p>
        <p>- <strong>Recht auf Einschraenkung der Verarbeitung</strong> (Art. 18 DSGVO)</p>
        <p>- <strong>Recht auf Datenuebertragbarkeit</strong> (Art. 20 DSGVO)</p>
        <p>- <strong>Recht auf Widerspruch</strong> (Art. 21 DSGVO)</p>
        <p style={{ marginTop: 12 }}>Zur Ausuebung Ihrer Rechte wenden Sie sich bitte an: tf@frerich-united-ventures.de</p>
        <p style={{ marginTop: 8 }}>Sie haben ausserdem das Recht, sich bei einer Datenschutz-Aufsichtsbehoerde ueber die Verarbeitung Ihrer personenbezogenen Daten zu beschweren. Zustaendige Aufsichtsbehoerde: Landesbeauftragte fuer Datenschutz und Informationsfreiheit Nordrhein-Westfalen.</p>
      </Section>

      <Section title="12. SSL/TLS-Verschluesselung">
        <p>Diese Seite nutzt aus Sicherheitsgruenden eine SSL- bzw. TLS-Verschluesselung. Eine verschluesselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.</p>
      </Section>

      <Section title="13. Aenderungen">
        <p>Wir behalten uns vor, diese Datenschutzerklaerung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Aenderungen unserer Leistungen in der Datenschutzerklaerung umzusetzen.</p>
        <p style={{ marginTop: 8 }}>Stand: Maerz 2026</p>
      </Section>
    </div>
  );
}

function AGB() {
  return (
    <div>
      <Section title="1. Geltungsbereich">
        <p>Diese Allgemeinen Geschaeftsbedingungen (AGB) gelten fuer die Nutzung der Lernplattform ZEHNX ACADEMY, betrieben von der Frerich United Ventures GmbH, An der Ronne 48, 50859 Koeln (nachfolgend "Anbieter").</p>
        <p style={{ marginTop: 8 }}>Mit der Registrierung akzeptiert der Nutzer diese AGB.</p>
      </Section>

      <Section title="2. Leistungsbeschreibung">
        <p>ZEHNX ACADEMY ist eine Online-Lernplattform fuer AI-Weiterbildung. Die Plattform bietet:</p>
        <p>- Sprint-basierte Lerneinheiten (3-5 Tage pro Sprint)</p>
        <p>- Lektionen mit Text-Content und Quizzes</p>
        <p>- AI Tutor (KI-gestuetzte Lernunterstuetzung)</p>
        <p>- Zertifikate bei Sprint-Abschluss</p>
        <p>- Community-Features (Netzwerk, Events)</p>
      </Section>

      <Section title="3. Vertragsschluss und Registrierung">
        <p>Die Registrierung erfolgt per E-Mail (Magic Link). Mit der Registrierung kommt ein Nutzungsvertrag zwischen dem Nutzer und dem Anbieter zustande.</p>
        <p style={{ marginTop: 8 }}>Der Nutzer muss mindestens 16 Jahre alt sein.</p>
      </Section>

      <Section title="4. Preise und Zahlung">
        <p><strong>Free Plan:</strong> Zugang zu ausgewaehlten Sprints, dauerhaft kostenlos.</p>
        <p><strong>Starter Plan (19 EUR/Monat):</strong> Zugang zu allen Sprints, AI Tutor, Zertifikate.</p>
        <p><strong>Pro Plan (49 EUR/Monat):</strong> Alle Starter-Features plus Priority Support, erweiterte AI-Features, Team-Features.</p>
        <p style={{ marginTop: 8 }}>Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt ueber Stripe. Die Abrechnung erfolgt monatlich im Voraus.</p>
      </Section>

      <Section title="5. Widerrufsrecht">
        <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gruenden diesen Vertrag zu widerrufen. Die Widerrufsfrist betraegt vierzehn Tage ab dem Tag des Vertragsschlusses.</p>
        <p style={{ marginTop: 8 }}>Um Ihr Widerrufsrecht auszuueben, muessen Sie uns (Frerich United Ventures GmbH, An der Ronne 48, 50859 Koeln, E-Mail: tf@frerich-united-ventures.de) mittels einer eindeutigen Erklaerung ueber Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>
        <p style={{ marginTop: 8 }}>Im Falle eines wirksamen Widerrufs werden die beiderseits empfangenen Leistungen zurueckgewaehrt.</p>
      </Section>

      <Section title="6. Kuendigung">
        <p>Kostenpflichtige Abonnements koennen jederzeit zum Ende der laufenden Abrechnungsperiode gekuendigt werden. Die Kuendigung erfolgt ueber das Stripe Customer Portal oder per E-Mail an tf@frerich-united-ventures.de.</p>
        <p style={{ marginTop: 8 }}>Nach Kuendigung behaelt der Nutzer bis zum Ende der bezahlten Periode Zugang zu allen Paid-Features. Danach wird das Konto auf den Free Plan zurueckgestuft.</p>
      </Section>

      <Section title="7. Nutzungsrechte">
        <p>Der Anbieter raeumt dem Nutzer ein einfaches, nicht uebertragbares Recht zur Nutzung der Plattform und ihrer Inhalte fuer den persoenlichen Gebrauch ein.</p>
        <p style={{ marginTop: 8 }}>Es ist nicht gestattet, Inhalte der Plattform zu kopieren, zu verbreiten, oeffentlich zugaenglich zu machen oder fuer kommerzielle Zwecke zu nutzen.</p>
      </Section>

      <Section title="8. Verfuegbarkeit">
        <p>Der Anbieter bemuecht sich um eine moeglichst unterbrechungsfreie Verfuegbarkeit der Plattform. Ein Anspruch auf staendige Verfuegbarkeit besteht nicht. Wartungsarbeiten werden nach Moeglichkeit vorab angekuendigt.</p>
      </Section>

      <Section title="9. Haftung">
        <p>Der Anbieter haftet unbeschraenkt fuer Vorsatz und grobe Fahrlaessigkeit. Fuer leichte Fahrlaessigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten und beschraenkt auf den vorhersehbaren, vertragstypischen Schaden.</p>
        <p style={{ marginTop: 8 }}>Die Inhalte der Plattform dienen der Weiterbildung und stellen keine rechtsverbindliche Beratung dar. Insbesondere ersetzen sie keine rechtliche, steuerliche oder medizinische Beratung.</p>
      </Section>

      <Section title="10. Schlussbestimmungen">
        <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Koeln, soweit gesetzlich zulaessig.</p>
        <p style={{ marginTop: 8 }}>Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der uebrigen Bestimmungen unberuehrt.</p>
        <p style={{ marginTop: 12 }}>Stand: Maerz 2026</p>
      </Section>
    </div>
  );
}

const PAGES = { impressum: Impressum, datenschutz: Datenschutz, agb: AGB };

export default function Legal() {
  const [tab, setTab] = useState("impressum");
  const Page = PAGES[tab];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 20px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: Z.x, margin: "0 0 4px", letterSpacing: "-0.03em" }}>Rechtliches</h1>
        <p style={{ fontSize: 13, color: Z.g400, margin: 0 }}>Frerich United Ventures GmbH · ZEHNX ACADEMY</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: `1px solid ${Z.g200}`, paddingBottom: -1 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 16px", border: "none",
            borderBottom: tab === t.id ? `2px solid ${Z.bl}` : "2px solid transparent",
            background: "none", color: tab === t.id ? Z.bl : Z.g400,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", marginBottom: -1,
          }}>{t.l}</button>
        ))}
      </div>

      {/* Content */}
      <Page />
    </div>
  );
}
