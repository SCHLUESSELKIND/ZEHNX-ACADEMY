import { useState } from "react";

const C = {
  bg: "#F5F5F7", w: "#FFFFFF", x: "#18181B",
  g100: "#F4F4F5", g200: "#E4E4E7", g400: "#A1A1AA", g500: "#71717A", g600: "#52525B", g700: "#3F3F46",
  bl: "#2563EB", blXL: "#EFF6FF",
};

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: C.x, margin: "0 0 8px" }}>{title}</h3>
      <div style={{ fontSize: 13, color: C.g600, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

function Impressum() {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: C.x, letterSpacing: "-0.03em", margin: "0 0 20px" }}>Impressum</h2>

      <Section title="Angaben gemäß § 5 TMG">
        <p>Frerich United Ventures GmbH<br />
        An der Ronne 48<br />
        50859 Köln<br />
        Deutschland</p>
      </Section>

      <Section title="Vertreten durch">
        <p>Geschäftsführer: Thomas Frerich</p>
      </Section>

      <Section title="Kontakt">
        <p>E-Mail: tf@frerich-united-ventures.de</p>
      </Section>

      <Section title="Registereintrag">
        <p>Handelsregister: Amtsgericht Köln<br />
        Registernummer: HRB 112376</p>
      </Section>

      <Section title="Umsatzsteuer-ID">
        <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
        DE 356752511</p>
      </Section>

      <Section title="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
        <p>Thomas Frerich<br />
        An der Ronne 48<br />
        50859 Köln</p>
      </Section>

      <Section title="EU-Streitschlichtung">
        <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: C.bl }}>
            https://ec.europa.eu/consumers/odr/
          </a>
          <br />Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </Section>

      <Section title="Haftung für Inhalte">
        <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
        <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
      </Section>

      <Section title="Haftung für Links">
        <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
      </Section>

      <Section title="Urheberrecht">
        <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
      </Section>
    </div>
  );
}

function Datenschutz() {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: C.x, letterSpacing: "-0.03em", margin: "0 0 20px" }}>Datenschutzerklärung</h2>

      <Section title="1. Datenschutz auf einen Blick">
        <p><strong>Allgemeine Hinweise:</strong> Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
        <p><strong>Datenerfassung auf dieser Website:</strong> Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum entnehmen.</p>
      </Section>

      <Section title="2. Verantwortliche Stelle">
        <p>Frerich United Ventures GmbH<br />
        An der Ronne 48<br />
        50859 Köln<br />
        E-Mail: tf@frerich-united-ventures.de</p>
        <p>Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.</p>
      </Section>

      <Section title="3. Hosting">
        <p>Diese Website wird bei folgenden Anbietern gehostet:</p>
        <p><strong>Frontend:</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Vercel verarbeitet Zugriffsdaten (IP-Adresse, Zeitpunkt des Zugriffs) zur Auslieferung der Website. Grundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an stabiler Bereitstellung).</p>
        <p><strong>Backend:</strong> Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland. Alle Nutzerdaten werden auf Servern in Deutschland (Nürnberg) gespeichert. Grundlage ist Art. 6 Abs. 1 lit. f DSGVO. Ein Auftragsverarbeitungsvertrag (AVV) mit Hetzner ist abgeschlossen.</p>
      </Section>

      <Section title="4. Allgemeine Hinweise und Pflichtinformationen">
        <p><strong>Datenschutz:</strong> Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
        <p><strong>Widerruf Ihrer Einwilligung:</strong> Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.</p>
        <p><strong>Beschwerderecht bei der Aufsichtsbehörde:</strong> Im Falle datenschutzrechtlicher Verstöße steht dem Betroffenen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Zuständige Aufsichtsbehörde ist der Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.</p>
      </Section>

      <Section title="5. Datenerfassung auf dieser Website">
        <p><strong>Cookies:</strong> Diese Website verwendet ausschließlich technisch notwendige Cookies für die Authentifizierung (Login-Session). Es werden keine Tracking-, Marketing- oder Analyse-Cookies verwendet.</p>
        <p><strong>Server-Log-Dateien:</strong> Der Provider der Seiten erhebt und speichert automatisch Informationen in Server-Log-Dateien: Browsertyp und -version, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Grundlage ist Art. 6 Abs. 1 lit. f DSGVO.</p>
      </Section>

      <Section title="6. Registrierung und Nutzerkonto">
        <p>Sie können auf unserer Website ein Nutzerkonto anlegen. Die dabei eingegebenen Daten (E-Mail-Adresse, ggf. Name) verwenden wir zur Bereitstellung des Dienstes. Grundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
        <p><strong>Magic Link Authentifizierung:</strong> Wir verwenden ein passwortloses Login-Verfahren. Bei der Anmeldung wird ein einmaliger Link an Ihre E-Mail-Adresse gesendet. Passwörter werden nicht gespeichert.</p>
        <p><strong>Google OAuth:</strong> Optional können Sie sich über Google anmelden. Dabei werden Name, E-Mail-Adresse und Profilbild von Google übermittelt. Grundlage ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</p>
      </Section>

      <Section title="7. KI-gestützte Funktionen">
        <p>ZEHNX ACADEMY nutzt KI-Dienste (Anthropic Claude API) zur Personalisierung von Lerninhalten. Dabei werden folgende Daten verarbeitet:</p>
        <p>• Ihr Skill-Level und Assessment-Ergebnisse<br />
        • Ihre Projektbeschreibung (sofern angegeben)<br />
        • Sprint-Fortschritt und Reflexionen</p>
        <p>Diese Daten werden ausschließlich zur Personalisierung Ihres Lernerlebnisses an die Claude API übermittelt. Anthropic speichert bei API-Nutzung keine Daten zum Modelltraining (Zero Data Retention). Grundlage ist Art. 6 Abs. 1 lit. b DSGVO.</p>
        <p><strong>X-SCORE Assessment:</strong> Die Ergebnisse des X-SCORE werden lokal berechnet und nur bei registrierten Nutzern in Ihrem Profil gespeichert. Eine Weitergabe an Dritte erfolgt nicht.</p>
      </Section>

      <Section title="8. Collective Brain (Anonymisierte Lernmuster)">
        <p>ZEHNX extrahiert anonymisierte Lernmuster aus abgeschlossenen Sprints, um die Plattform zu verbessern. Dabei gelten strikte Regeln:</p>
        <p>• Keine personenbezogenen Daten fließen in das Collective Brain<br />
        • Kein Projekt-Code, keine Firmennamen, keine identifizierenden Informationen<br />
        • Nur statistische Aggregationen (Zeitdauer, Schwierigkeitsgrade, Completion-Raten)<br />
        • Mindestens 5 verschiedene Datenpunkte vor Veröffentlichung eines Musters</p>
        <p>Grundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Produktverbesserung).</p>
      </Section>

      <Section title="9. Enterprise-Daten">
        <p>Für Enterprise-Kunden gelten zusätzliche Schutzmaßnahmen:</p>
        <p>• Separate Datenbank-Schemas pro Organisation<br />
        • AES-256 Verschlüsselung aller firmenspezifischen Daten<br />
        • Kein Zugriff durch andere Organisationen oder durch ZEHNX<br />
        • Firmenspezifische Daten fließen NICHT in allgemeine Patterns<br />
        • Betriebsratskonform: Keine Verhaltensüberwachung, keine Mitarbeitervergleiche</p>
        <p>Ein gesonderter Auftragsverarbeitungsvertrag (AVV) wird mit jedem Enterprise-Kunden abgeschlossen.</p>
      </Section>

      <Section title="10. Zahlungsabwicklung">
        <p>Für kostenpflichtige Enterprise-Pläne nutzen wir Stripe (Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Irland). Stripe verarbeitet Zahlungsdaten direkt — wir speichern keine Kreditkartendaten. Grundlage ist Art. 6 Abs. 1 lit. b DSGVO. Datenschutzerklärung von Stripe: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" style={{ color: C.bl }}>stripe.com/de/privacy</a></p>
      </Section>

      <Section title="11. E-Mail-Kommunikation">
        <p>Für den Versand von Login-Links und Benachrichtigungen nutzen wir IONOS (1&1 IONOS SE, Elgendorfer Str. 57, 56410 Montabaur). IONOS verarbeitet E-Mail-Adressen als Auftragsverarbeiter. Grundlage ist Art. 6 Abs. 1 lit. b DSGVO.</p>
      </Section>

      <Section title="12. Ihre Rechte">
        <p>Sie haben jederzeit das Recht auf:</p>
        <p>• <strong>Auskunft</strong> (Art. 15 DSGVO) über Ihre gespeicherten Daten<br />
        • <strong>Berichtigung</strong> (Art. 16 DSGVO) unrichtiger Daten<br />
        • <strong>Löschung</strong> (Art. 17 DSGVO) Ihrer Daten<br />
        • <strong>Einschränkung</strong> (Art. 18 DSGVO) der Verarbeitung<br />
        • <strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)<br />
        • <strong>Widerspruch</strong> (Art. 21 DSGVO) gegen die Verarbeitung</p>
        <p>Zur Ausübung Ihrer Rechte genügt eine E-Mail an: tf@frerich-united-ventures.de</p>
      </Section>

      <Section title="13. Datenlöschung">
        <p>Bei Löschung Ihres Nutzerkontos werden alle personenbezogenen Daten innerhalb von 30 Tagen gelöscht. Anonymisierte, aggregierte Daten im Collective Brain bleiben erhalten, da sie keinen Personenbezug haben.</p>
      </Section>

      <Section title="14. Aktualität">
        <p>Diese Datenschutzerklärung ist aktuell gültig und hat den Stand März 2026. Durch die Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.</p>
      </Section>
    </div>
  );
}

export default function Legal({ initialTab = "impressum" }) {
  const [tab, setTab] = useState(initialTab);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 0 60px" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {[{ id: "impressum", l: "Impressum" }, { id: "datenschutz", l: "Datenschutz" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 18px", borderRadius: 8, border: "none",
            background: tab === t.id ? C.x : C.g100, color: tab === t.id ? C.w : C.g600,
            fontSize: 13, fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
          }}>{t.l}</button>
        ))}
      </div>
      {tab === "impressum" ? <Impressum /> : <Datenschutz />}
      <div style={{ marginTop: 30, paddingTop: 16, borderTop: `1px solid ${C.g200}`, fontSize: 11, color: C.g400 }}>
        © 2026 Frerich United Ventures GmbH · An der Ronne 48 · 50859 Köln · HRB 112376 Amtsgericht Köln
      </div>
    </div>
  );
}
