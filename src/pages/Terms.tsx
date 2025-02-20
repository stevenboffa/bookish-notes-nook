
import { Header } from "@/components/Header";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-24">
        <div className="prose prose-gray max-w-none">
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Agreement to Terms</h2>
          <p>By accessing our service, you agree to be bound by these Terms of Service.</p>

          <h2>2. Use of Service</h2>
          <p>You agree to use the service only for lawful purposes and in accordance with these Terms.</p>

          <h2>3. User Accounts</h2>
          <p>When you create an account with us, you must provide accurate information. You are responsible for maintaining the security of your account.</p>

          <h2>4. Intellectual Property</h2>
          <p>The service and its original content, features, and functionality are owned by BookNotes and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>

          <h2>5. Termination</h2>
          <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.</p>

          <h2>6. Limitation of Liability</h2>
          <p>In no event shall BookNotes, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>

          <h2>7. Changes to Terms</h2>
          <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>

          <h2>8. Contact Us</h2>
          <p>If you have questions about these Terms, please contact us at:</p>
          <p>Email: legal@booknotes.com</p>
        </div>
      </main>
    </div>
  );
}
