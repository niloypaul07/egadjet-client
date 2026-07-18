export default function PrivacyPage() {
  return (
    <div className="container-main max-w-3xl py-16">
      <h1 className="section-title">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-muted">Last updated: January 1, 2025</p>

      <div className="prose mt-10 space-y-8 text-sm leading-relaxed text-slate-muted">
        <section>
          <h2 className="text-lg font-semibold text-slate">1. Information We Collect</h2>
          <p className="mt-3">
            When you use eGadjet, we collect information you provide directly, including your name, email address,
            shipping details, and payment information. We also collect usage data such as pages visited, search
            queries, and interactions with our AI Shopping Assistant to improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate">2. How We Use Your Information</h2>
          <p className="mt-3">
            We use your information to process orders, provide customer support, personalize product recommendations
            through our AI assistant, send order updates, and improve our platform. We never sell your personal
            data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate">3. AI Assistant Data</h2>
          <p className="mt-3">
            Conversations with our AI Shopping Assistant are processed to generate relevant product recommendations.
            Chat history may be stored temporarily to maintain conversation context. You can request deletion of
            your chat history by contacting support@egadjet.com.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate">4. Data Security</h2>
          <p className="mt-3">
            We implement industry-standard security measures including encrypted connections (HTTPS), secure
            password hashing, and JWT-based authentication. Payment processing is handled by certified payment
            providers and we do not store full credit card numbers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate">5. Your Rights</h2>
          <p className="mt-3">
            You have the right to access, update, or delete your personal data. You may also opt out of marketing
            communications at any time. To exercise these rights, contact us at support@egadjet.com.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate">6. Contact</h2>
          <p className="mt-3">
            For privacy-related inquiries, reach us at support@egadjet.com or House 42, Road 7, Dhanmondi,
            Dhaka 1205, Bangladesh.
          </p>
        </section>
      </div>
    </div>
  );
}
