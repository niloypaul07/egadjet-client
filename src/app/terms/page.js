export default function TermsPage() {
  return (
    <div className="container-main max-w-3xl py-16">
      <h1 className="section-title">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-muted">Last updated: January 1, 2025</p>

      <div className="prose mt-10 space-y-8 text-sm leading-relaxed text-slate-muted">
        <section>
          <h2 className="text-lg font-semibold text-slate">1. Acceptance of Terms</h2>
          <p className="mt-3">
            By accessing or using eGadjet, you agree to be bound by these Terms of Service. If you do not agree,
            please do not use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate">2. Account Registration</h2>
          <p className="mt-3">
            You must provide accurate information when creating an account. You are responsible for maintaining
            the confidentiality of your login credentials and for all activities under your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate">3. Product Listings</h2>
          <p className="mt-3">
            Sellers listing products on eGadjet must provide accurate descriptions, pricing, and images. All
            products must be authentic and sourced from authorized distributors. eGadjet reserves the right to
            remove listings that violate these standards.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate">4. Orders and Payments</h2>
          <p className="mt-3">
            All prices are listed in USD. Orders are confirmed upon successful payment. We offer a 7-day return
            policy for unopened products in original packaging. Refunds are processed within 5-7 business days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate">5. AI Assistant Disclaimer</h2>
          <p className="mt-3">
            Our AI Shopping Assistant provides recommendations based on available catalog data and should not be
            considered professional advice. Product specifications should be verified on individual product pages
            before purchase.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate">6. Limitation of Liability</h2>
          <p className="mt-3">
            eGadjet is not liable for indirect, incidental, or consequential damages arising from the use of our
            platform. Our total liability is limited to the amount paid for the specific product or service in
            question.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate">7. Contact</h2>
          <p className="mt-3">
            For questions about these terms, contact support@egadjet.com.
          </p>
        </section>
      </div>
    </div>
  );
}
