
import { Header } from "@/components/Header";
import { Meta } from "@/components/Meta";

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString();
  
  return (
    <div className="min-h-screen bg-background">
      <Meta 
        customTitle="Privacy Policy | BookishNotes.com"
        description="Our commitment to protecting your privacy and personal data"
      />
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-24">
        <div className="prose prose-gray max-w-none">
          <h1>Privacy Policy</h1>
          <p>Last updated: {lastUpdated}</p>
          
          <h2>1. Introduction</h2>
          <p>
            At BookishNotes ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data.
            This privacy policy explains how we collect, use, and protect your information when you use our service.
          </p>

          <h2>2. Information We Collect</h2>
          <p>We collect and process the following types of information:</p>
          <ul>
            <li><strong>Account Information:</strong> Email address, username, and profile information you provide</li>
            <li><strong>Usage Data:</strong> Reading history, notes, book collections, and interactions with other users</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
            <li><strong>User Content:</strong> Books, notes, highlights, and any other content you create using our service</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We process your data based on the following legal grounds:</p>
          <ul>
            <li><strong>Contract Performance:</strong> To provide our services and features</li>
            <li><strong>Legitimate Interests:</strong> To improve our services and protect against fraud</li>
            <li><strong>Legal Obligations:</strong> To comply with applicable laws</li>
            <li><strong>Consent:</strong> For marketing communications (where applicable)</li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>
            We retain your personal data for as long as necessary to provide our services and comply with legal obligations.
            You can request deletion of your account and associated data at any time through your account settings.
          </p>

          <h2>5. Third-Party Services</h2>
          <p>We use the following third-party services to operate our platform:</p>
          <ul>
            <li><strong>Supabase:</strong> For database and authentication services</li>
            <li><strong>Resend:</strong> For email communications</li>
          </ul>

          <h2>6. Cookies and Tracking</h2>
          <p>
            We use essential cookies to maintain your session and preferences. You can control cookie settings through your browser.
          </p>

          <h2>7. International Data Transfers</h2>
          <p>
            Your data may be processed in countries outside your residence. We ensure appropriate safeguards are in place
            for international transfers through standard contractual clauses and other legal mechanisms.
          </p>

          <h2>8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
            <li>Withdraw consent (where applicable)</li>
          </ul>

          <h2>9. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your data,
            including encryption, access controls, and regular security assessments.
          </p>

          <h2>10. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13. We do not knowingly collect data from children under 13.
          </p>

          <h2>11. Updates to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any significant changes
            through our service or via email.
          </p>

          <h2>12. Contact Us</h2>
          <p>For privacy-related inquiries, contact us at:</p>
          <p>Email: privacy@bookishnotes.com</p>

          <h2>13. Data Protection Authority</h2>
          <p>
            If you are in the EU/EEA, you have the right to lodge a complaint with your local data protection authority
            if you believe we have not addressed your concerns appropriately.
          </p>
        </div>
      </main>
    </div>
  );
}
