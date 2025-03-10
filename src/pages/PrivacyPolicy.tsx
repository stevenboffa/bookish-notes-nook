import { Header } from "@/components/Header";
import { Meta } from "@/components/Meta";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Meta 
        title="Privacy Policy"
        description="Our privacy policy explains how we collect, use, and protect your personal information when you use BookishNotes to ensure your data remains secure."
      />
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-24">
        <div className="prose prose-gray max-w-none">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you:</p>
          <ul>
            <li>Create an account</li>
            <li>Use our services</li>
            <li>Contact us for support</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Communicate with you about products, services, and events</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We do not share your personal information except:</p>
          <ul>
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
          </ul>

          <h2>6. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at:</p>
          <p>Email: privacy@bookishnotes.com</p>
        </div>
      </main>
    </div>
  );
}
