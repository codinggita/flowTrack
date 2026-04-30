import { useNavigate } from 'react-router-dom';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{
      fontFamily: 'Manrope, sans-serif', fontSize: 18, fontWeight: 700,
      color: '#42e5b0', marginBottom: 12, paddingBottom: 8,
      borderBottom: '1px solid #242c28',
    }}>
      {title}
    </h2>
    <div style={{ color: '#bbcac1', fontSize: 14, lineHeight: 1.8 }}>{children}</div>
  </div>
);

const P   = ({ children }) => <p style={{ marginBottom: 12 }}>{children}</p>;
const Li  = ({ children }) => (
  <li style={{ marginBottom: 8, paddingLeft: 8, listStyleType: 'disc', marginLeft: 20 }}>{children}</li>
);

const DataTable = ({ rows }) => (
  <div style={{ border: '1px solid #3c4a43', borderRadius: 8, overflow: 'hidden', marginTop: 12 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
      background: '#242c28', padding: '10px 16px',
      fontSize: 11, fontWeight: 700, color: '#85948c',
      letterSpacing: '0.05em', textTransform: 'uppercase' }}>
      {['Data Type', 'Why We Collect', 'How Long We Keep'].map(h =>
        <span key={h}>{h}</span>)}
    </div>
    {rows.map((row, i) => (
      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        padding: '12px 16px', borderTop: '1px solid #1e2e26',
        fontSize: 13, alignItems: 'start' }}>
        <span style={{ color: '#42e5b0', fontWeight: 600 }}>{row[0]}</span>
        <span style={{ color: '#bbcac1' }}>{row[1]}</span>
        <span style={{ color: '#85948c' }}>{row[2]}</span>
      </div>
    ))}
  </div>
);

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const today    = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div style={{ background: '#0e1511', minHeight: '100vh', color: '#dce4de' }}>
      <div style={{
        background: '#161d1a', borderBottom: '1px solid #3c4a43',
        padding: '16px 40px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: '1px solid #3c4a43', borderRadius: 6,
            color: '#85948c', padding: '6px 14px', cursor: 'pointer', fontSize: 13,
          }}>← Back</button>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700,
            fontSize: 16, color: '#42e5b0' }}>FlowTrack</span>
        </div>
        <span style={{ color: '#85948c', fontSize: 12 }}>Version 1.0 · {today}</span>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 36,
            fontWeight: 800, color: '#dce4de', marginBottom: 12 }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#85948c', fontSize: 14 }}>Last updated: {today}</p>
          <div style={{
            background: 'rgba(66,229,176,0.06)', border: '1px solid rgba(66,229,176,0.2)',
            borderRadius: 8, padding: '14px 20px', marginTop: 24, textAlign: 'left',
          }}>
            <p style={{ color: '#bbcac1', fontSize: 13, lineHeight: 1.6 }}>
              <strong style={{ color: '#42e5b0' }}>Our Commitment:</strong> We collect
              only what we need, we never sell your data, you always have control,
              and you can delete everything anytime.
            </p>
          </div>
        </div>

        <Section title="1. Who We Are">
          <P>
            FlowTrack ("we", "our", "us") is a personal finance management platform.
            We are the data controller for all personal data you provide when using
            our Service. For privacy matters, contact us at swaraj.prajapati.cg@gmail.com.
          </P>
        </Section>

        <Section title="2. What Data We Collect">
          <P>We collect the following categories of personal data:</P>
          <DataTable rows={[
            ['Name & Email',       'Account creation and login',              '3 years after account closure'],
            ['Phone Number',       'Account recovery (optional)',             '3 years after account closure'],
            ['Password (hashed)', 'Authentication (bcrypt, never readable)',  '3 years after account closure'],
            ['Transaction Records','Core app functionality — your records',   'Until you delete them'],
            ['Account Balances',  'Dashboard and reports',                   'Until you delete them'],
            ['IP Address',        'Security and fraud prevention',            '90 days'],
            ['Device / Browser',  'Session management and security',          '90 days'],
            ['Login Timestamps',  'Security audit trail',                     '1 year'],
            ['App Preferences',   'Personalizing your experience',            'Until you change them'],
          ]} />
        </Section>

        <Section title="3. How We Use Your Data">
          <P>We use your personal data exclusively to:</P>
          <ul>
            <Li>Provide and operate the FlowTrack Service</Li>
            <Li>Authenticate your identity and maintain account security</Li>
            <Li>Generate your personalized financial reports and charts</Li>
            <Li>Send transactional emails (password resets, security alerts)</Li>
            <Li>Send weekly spending summaries (only if you opt in)</Li>
            <Li>Send subscription renewal reminders (only if you opt in)</Li>
            <Li>Detect and prevent fraud or unauthorized access</Li>
            <Li>Comply with applicable Indian laws and regulations</Li>
          </ul>
          <P>
            <strong style={{ color: '#ff4d4d' }}>We NEVER:</strong> sell your data
            to any third party, use your financial data for advertising, share your
            data without your explicit consent, or use your data to make automated
            decisions that affect you legally.
          </P>
        </Section>

        <Section title="4. Your Rights Under DPDP Act 2023">
          <P>Under the Digital Personal Data Protection Act 2023 and related Indian laws, you have the right to:</P>
          <ul>
            <Li><strong>Access:</strong> Request a copy of all personal data we hold about you</Li>
            <Li><strong>Correction:</strong> Update or correct any inaccurate personal data</Li>
            <Li><strong>Erasure:</strong> Request deletion of your account and all associated data</Li>
            <Li><strong>Portability:</strong> Export your financial data in CSV format anytime</Li>
            <Li><strong>Withdraw Consent:</strong> Opt out of optional data processing anytime</Li>
            <Li><strong>Grievance Redressal:</strong> Raise complaints with our Data Protection Officer</Li>
            <Li><strong>Nominate:</strong> Designate a representative to exercise rights on your behalf</Li>
          </ul>
          <P>To exercise any of these rights, email swaraj.prajapati.cg@gmail.com. We will respond within 30 days.</P>
        </Section>

        <Section title="5. Data Security">
          <P>We implement the following security measures:</P>
          <ul>
            <Li>All data encrypted at rest using AES-256 encryption</Li>
            <Li>All data in transit protected with TLS 1.3</Li>
            <Li>Passwords hashed using bcrypt (cost factor 12) — never stored in plain text</Li>
            <Li>JWT tokens for session management with 7-day expiry</Li>
            <Li>Regular security audits and vulnerability assessments</Li>
            <Li>Database hosted on MongoDB Atlas with access controls</Li>
            <Li>No financial credentials (bank passwords, card PINs) are ever collected</Li>
          </ul>
        </Section>

        <Section title="6. Third-Party Services">
          <P>We use the following third-party services:</P>
          <DataTable rows={[
            ['MongoDB Atlas',   'Database hosting (USA/India)',     'MongoDB Privacy Policy'],
            ['Gmail SMTP',      'Transactional emails',             'Google Privacy Policy'],
            ['Render / Railway','Backend hosting',                  'Provider Privacy Policy'],
            ['Vercel',          'Frontend hosting',                 'Vercel Privacy Policy'],
          ]} />
          <P style={{ marginTop: 12 }}>
            These providers are contractually bound to protect your data and may only
            use it to provide services to us, not for their own purposes.
          </P>
        </Section>

        <Section title="7. Data Retention">
          <P>
            We retain your personal data for as long as your account is active.
            After account deletion, we remove all personal data within 30 days,
            except where required by Indian law to retain records longer
            (e.g., for tax or legal compliance purposes).
          </P>
          <P>
            Security logs (IP addresses, login timestamps) are retained for
            90 days to detect and investigate potential security incidents.
          </P>
        </Section>

        <Section title="8. Children's Privacy">
          <P>
            FlowTrack is not intended for users under 18 years of age. We do not
            knowingly collect personal data from minors. If you believe a minor
            has created an account, contact us at swaraj.prajapati.cg@gmail.com and we will
            delete the account immediately.
          </P>
        </Section>

        <Section title="9. Contact & Grievance Officer">
          <P>For any privacy concerns or to exercise your rights:</P>
          <div style={{ background: '#1a211d', border: '1px solid #3c4a43', borderRadius: 8, padding: '16px 20px' }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Data Protection Officer</p>
            <p style={{ margin: '0 0 6px', color: '#bbcac1' }}>📧 swaraj.prajapati.cg@gmail.com</p>
            <p style={{ margin: '0 0 6px', color: '#bbcac1' }}>📱 +91 9229095823</p>
            <p style={{ margin: '0 0 6px', color: '#bbcac1' }}>⏱️ Response within 30 days</p>
            <p style={{ margin: 0, color: '#85948c', fontSize: 12 }}>
              You also have the right to lodge a complaint with the Data Protection
              Board of India at dpboard.gov.in
            </p>
          </div>
        </Section>

      </div>
    </div>
  );
}
