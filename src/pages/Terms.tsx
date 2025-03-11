
import { Header } from "@/components/Header";
import { Meta } from "@/components/Meta";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Meta 
        customTitle="Terms of Service | BookishNotes.com"
        description="Legal terms governing the use of BookishNotes services"
      />
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-24">
        <div className="prose prose-gray max-w-none">
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using BookishNotes ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
            If you disagree with any part of these Terms, you may not access the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            BookishNotes is a platform that allows users to track reading activity, take notes on books, create collections, 
            and connect with other readers. We may update, change, or enhance any aspect of the Service at any time.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate information and keep it updated. You are responsible for maintaining 
            the security of your account and password. BookishNotes cannot and will not be liable for any loss or damage from your failure to 
            comply with this security obligation. You are solely responsible for all activities that occur under your account.
          </p>

          <h2>4. User Content</h2>
          <p>
            Our Service allows you to post, store, and share content, including notes, reviews, and book collections ("User Content").
            You retain all rights to your User Content, but you grant BookishNotes a worldwide, non-exclusive, royalty-free license to use, 
            reproduce, adapt, publish, and distribute such content solely for the purpose of providing and improving the Service.
          </p>
          <p>
            You represent and warrant that your User Content does not violate any third-party rights, including copyright, trademark, 
            privacy, or other personal or proprietary rights, and does not contain unlawful material.
          </p>

          <h2>5. Acceptable Use</h2>
          <p>
            You agree not to use the Service to:
          </p>
          <ul>
            <li>Publish or share materials that are unlawful, defamatory, harassing, abusive, fraudulent, or obscene</li>
            <li>Impersonate another person or misrepresent your affiliation with a person or entity</li>
            <li>Engage in any activity that interferes with or disrupts the Service</li>
            <li>Attempt to gain unauthorized access to the Service or computer systems connected to the Service</li>
            <li>Collect or harvest user data without permission</li>
            <li>Use the Service for any commercial solicitation purposes without our consent</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive 
            property of BookishNotes and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks 
            and trade dress may not be used in connection with any product or service without prior written consent.
          </p>

          <h2>7. Subscription and Payment Terms</h2>
          <p>
            Some aspects of the Service may be offered on a subscription basis. By choosing a subscription plan, you agree to pay the 
            subscription fees indicated for your selected plan. Subscriptions will automatically renew unless canceled at least 24 hours 
            before the end of the current period. You can cancel your subscription through your account settings.
          </p>
          <p>
            All payments are processed through secure third-party payment processors. We do not store your full payment information on our servers.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under 
            our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.
          </p>
          <p>
            If you wish to terminate your account, you may simply discontinue using the Service, or delete your account through the 
            account settings. All provisions of the Terms which by their nature should survive termination shall survive termination, 
            including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, BookishNotes, its directors, employees, partners, agents, suppliers, or affiliates, 
            shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
            loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul>
            <li>Your access to or use of or inability to access or use the Service</li>
            <li>Any conduct or content of any third party on the Service</li>
            <li>Any content obtained from the Service</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>

          <h2>10. Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is 
            provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of 
            merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which BookishNotes is 
            established, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these 
            Terms will not be considered a waiver of those rights.
          </p>

          <h2>12. Dispute Resolution</h2>
          <p>
            Any disputes arising out of or relating to these Terms or the Service will first be resolved through informal negotiation. 
            If the dispute cannot be resolved through negotiation, both parties agree to attempt in good faith to resolve the dispute 
            through mediation administered by a mutually agreed-upon mediator. If mediation is unsuccessful, the parties may seek 
            resolution through arbitration or legal action in accordance with the governing law.
          </p>

          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the 
            new Terms on this page and updating the "Last updated" date. You are advised to review these Terms periodically for any changes. 
            Changes to these Terms are effective when they are posted on this page. Your continued use of the Service after any changes 
            constitutes acceptance of those changes.
          </p>

          <h2>14. Severability</h2>
          <p>
            If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms 
            will remain in effect.
          </p>

          <h2>15. Entire Agreement</h2>
          <p>
            These Terms constitute the entire agreement between you and BookishNotes regarding our Service, and supersede and replace 
            any prior agreements we might have had between us regarding the Service.
          </p>

          <h2>16. Contact Us</h2>
          <p>If you have questions about these Terms, please contact us at:</p>
          <p>Email: legal@bookishnotes.com</p>
        </div>
      </main>
    </div>
  );
}
