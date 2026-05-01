import { useNavigate } from 'react-router-dom';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{
      fontFamily: 'Manrope, sans-serif',
      fontSize: 18,
      fontWeight: 700,
      color: '#42e5b0',
      marginBottom: 12,
      paddingBottom: 8,
      borderBottom: '1px solid #242c28',
    }}>
      {title}
    </h2>
    <div style={{ color: '#bbcac1', fontSize: 14, lineHeight: 1.8 }}>
      {children}
    </div>
  </div>
);

const P = ({ children }) => <p style={{ marginBottom: 12 }}>{children}</p>;
const Li = ({ children }) => (
  <li style={{ marginBottom: 8, paddingLeft: 8, listStyleType: 'disc', marginLeft: 20 }}>{children}</li>
);

export default function TermsOfService() {
  const navigate = useNavigate();
  const today    = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div style={{ background: '#0e1511', minHeight: '100vh', color: '#dce4de' }}>

      {/* Header */}
      <div style={{
        background: '#161d1a',
        borderBottom: '1px solid #3c4a43',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: '1px solid #3c4a43', borderRadius: 6,
            color: '#85948c', padding: '6px 14px', cursor: 'pointer', fontSize: 13,
          }}>
            ← Back
          </button>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700,
            fontSize: 16, color: '#42e5b0' }}>FlowTrack</span>
        </div>
        <span style={{ color: '#85948c', fontSize: 12 }}>Version 1.0 · {today}</span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Title */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 36,
            fontWeight: 800, color: '#dce4de', marginBottom: 12 }}>
            Terms of Service
          </h1>
          <p style={{ color: '#85948c', fontSize: 14 }}>
            Last updated: {today} · Effective immediately upon account creation
          </p>
          <div style={{
            background: 'rgba(66,229,176,0.06)', border: '1px solid rgba(66,229,176,0.2)',
            borderRadius: 8, padding: '14px 20px', marginTop: 24, textAlign: 'left',
          }}>
            <p style={{ color: '#bbcac1', fontSize: 13, lineHeight: 1.6 }}>
              <strong style={{ color: '#42e5b0' }}>Plain English Summary:</strong> FlowTrack
              is a personal finance tracker. You manually enter your financial data.
              We store it securely, use it only to show you your own reports, and
              never sell it to anyone. You own your data. You can delete it anytime.
            </p>
          </div>
        </div>

        <Section title="1. Acceptance of Terms">
          <P>
            By creating an account on FlowTrack ("the Service", "we", "our", "us"),
            you agree to be bound by these Terms of Service ("Terms"). If you do not
            agree to these Terms, do not create an account or use the Service.
          </P>
          <P>
            These Terms constitute a legally binding agreement between you and
            FlowTrack operated under Indian law. By clicking "Create Account" or
            "Initialize Session", you confirm that you have read, understood, and
            agree to these Terms and our Privacy Policy.
          </P>
        </Section>

        <Section title="2. Description of Service">
          <P>FlowTrack is a personal finance management platform that allows you to:</P>
          <ul>
            <Li>Manually record and categorize your financial transactions</Li>
            <Li>Track multiple payment accounts (bank, UPI, wallet, credit card)</Li>
            <Li>View spending reports, charts, and financial summaries</Li>
            <Li>Monitor recurring subscriptions and get renewal reminders</Li>
            <Li>Receive intelligent spending alerts and insights</Li>
          </ul>
          <P style={{ marginTop: 12 }}>
            <strong style={{ color: '#ffbca2' }}>IMPORTANT:</strong> FlowTrack does NOT
            connect to your actual bank accounts, access your real transactions automatically,
            store banking credentials, or process any payments. All financial data is entered
            manually by you.
          </P>
        </Section>

        <Section title="3. User Eligibility">
          <P>To use FlowTrack, you must:</P>
          <ul>
            <Li>Be at least 18 years of age</Li>
            <Li>Be a resident of India or a jurisdiction where the Service is available</Li>
            <Li>Have the legal capacity to enter into binding contracts</Li>
            <Li>Not have been previously banned from the Service</Li>
            <Li>Provide accurate and truthful registration information</Li>
          </ul>
        </Section>

        <Section title="4. Your Account Responsibilities">
          <P>You are responsible for:</P>
          <ul>
            <Li>Keeping your login credentials confidential and secure</Li>
            <Li>All activity that occurs under your account</Li>
            <Li>Notifying us immediately at swaraj.prajapati.cg@gmail.com of any unauthorized access</Li>
            <Li>Ensuring the accuracy of all data you enter into the platform</Li>
            <Li>Using the Service only for lawful personal finance management purposes</Li>
          </ul>
          <P>
            You must not share your account with others, use another person's account,
            or create accounts for purposes other than personal finance tracking.
          </P>
        </Section>

        <Section title="5. Data You Provide">
          <P>
            When you use FlowTrack, you voluntarily provide us with personal and
            financial information including your name, email, phone number, transaction
            records, account balances, and spending patterns. This data is entered
            manually by you and is not sourced from any financial institution.
          </P>
          <P>
            You represent and warrant that all data you enter is your own personal
            financial data and that you have the right to store and process it using
            our Service. You retain full ownership of all data you enter.
          </P>
        </Section>

        <Section title="6. Prohibited Uses">
          <P>You agree NOT to:</P>
          <ul>
            <Li>Use the Service for any illegal or unauthorized purpose</Li>
            <Li>Enter false, misleading, or fraudulent financial data</Li>
            <Li>Attempt to hack, reverse engineer, or disrupt the Service</Li>
            <Li>Scrape, crawl, or extract data from the platform</Li>
            <Li>Use the Service to track finances of another person without their consent</Li>
            <Li>Upload malicious code, viruses, or harmful files</Li>
            <Li>Violate any applicable Indian or international laws</Li>
            <Li>Resell or commercially exploit the Service without written permission</Li>
          </ul>
        </Section>

        <Section title="7. Intellectual Property">
          <P>
            FlowTrack and its original content, features, functionality, logo,
            design, and codebase are owned by FlowTrack and are protected by
            Indian copyright, trademark, and other intellectual property laws.
          </P>
          <P>
            You retain ownership of all financial data you enter. By using the
            Service, you grant FlowTrack a limited, non-exclusive license to
            store, process, and display your data solely for the purpose of
            providing the Service to you.
          </P>
        </Section>

        <Section title="8. Privacy and Data Protection">
          <P>
            Your use of FlowTrack is also governed by our Privacy Policy, which is
            incorporated into these Terms by reference. We comply with the
            Information Technology Act, 2000, the Information Technology
            (Reasonable Security Practices and Procedures and Sensitive Personal
            Data or Information) Rules, 2011, and the Digital Personal Data
            Protection Act, 2023 (DPDP Act).
          </P>
          <P>
            We implement industry-standard security measures including AES-256 encryption
            for data at rest, TLS 1.3 for data in transit, and bcrypt hashing for passwords.
          </P>
        </Section>

        <Section title="9. Service Availability">
          <P>
            We strive for 99.9% uptime but do not guarantee uninterrupted availability.
            The Service may be temporarily unavailable due to maintenance, updates, or
            circumstances beyond our control. We will attempt to notify users of
            planned maintenance in advance.
          </P>
          <P>
            FlowTrack reserves the right to modify, suspend, or discontinue any
            part of the Service at any time with reasonable notice to users.
          </P>
        </Section>

        <Section title="10. Disclaimer of Warranties">
          <P>
            FlowTrack is provided "AS IS" and "AS AVAILABLE" without warranties of
            any kind. We do not provide financial advice. The reports, charts, and
            insights generated by FlowTrack are for informational purposes only and
            should not be relied upon as financial, tax, legal, or investment advice.
          </P>
          <P>
            Always consult a qualified financial advisor for important financial decisions.
          </P>
        </Section>

        <Section title="11. Limitation of Liability">
          <P>
            To the maximum extent permitted by Indian law, FlowTrack shall not be
            liable for any indirect, incidental, special, consequential, or punitive
            damages, including but not limited to loss of profits, data, or business
            opportunities, arising from your use of the Service.
          </P>
          <P>
            Our total liability to you for any claims shall not exceed the amount
            paid by you for the Service in the 12 months preceding the claim.
          </P>
        </Section>

        <Section title="12. Termination">
          <P>
            You may terminate your account at any time by going to Settings → Account
            and selecting "Delete Account". Upon termination, we will delete your
            personal data within 30 days, except where we are required by law to
            retain certain records.
          </P>
          <P>
            We may suspend or terminate your account immediately if you violate
            these Terms, engage in fraudulent activity, or use the Service in a
            manner harmful to other users or FlowTrack.
          </P>
        </Section>

        <Section title="13. Governing Law">
          <P>
            These Terms are governed by the laws of India. Any disputes arising
            from these Terms or your use of the Service shall be subject to the
            exclusive jurisdiction of the courts of Mumbai, Maharashtra, India.
          </P>
          <P>
            We encourage resolving disputes amicably. Please contact
            swaraj.prajapati.cg@gmail.com before initiating any legal proceedings.
          </P>
        </Section>

        <Section title="14. Changes to Terms">
          <P>
            We may update these Terms from time to time. When we make material
            changes, we will notify you via email and in-app notification at least
            14 days before the changes take effect. Your continued use of the
            Service after the effective date constitutes acceptance of the new Terms.
          </P>
          <P>
            We maintain a version history of all Terms changes. Current version: v1.0
          </P>
        </Section>

        <Section title="15. Contact Us">
          <P>For questions about these Terms, contact us at:</P>
          <div style={{
            background: '#1a211d', border: '1px solid #3c4a43',
            borderRadius: 8, padding: '16px 20px', marginTop: 8,
          }}>
            <p style={{ margin: '0 0 6px' }}>📧 swaraj.prajapati.cg@gmail.com</p>
            <p style={{ margin: '0 0 6px' }}>📱 +91 9229095823</p>
            <p style={{ margin: '0 0 6px' }}>🌐 https://flow-track-full-stack.vercel.app/legal</p>
            <p style={{ margin: 0, color: '#85948c', fontSize: 12 }}>
              Response time: Within 72 hours on business days
            </p>
          </div>
        </Section>

      </div>
    </div>
  );
}
