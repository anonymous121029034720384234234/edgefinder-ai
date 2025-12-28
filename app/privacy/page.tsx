'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-gray-100 overflow-hidden relative">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
        * {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
        }
      `}</style>

      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div 
          className="absolute w-[700px] h-[700px] rounded-full blur-[150px]"
          style={{
            background: 'radial-gradient(circle, rgba(59,7,100,0.5) 0%, transparent 70%)',
            top: '-10%',
            right: '20%',
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/70 border-b border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto px-10 lg:px-20">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 shadow-lg shadow-purple-600/30 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45"></div>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">Edge</span>
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
                  }}
                >
                  Finder
                </span>
                <span className="text-white text-sm ml-1.5 font-normal">AI</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative pt-28 pb-20 px-10 lg:px-20">
        <div className="max-w-[800px] mx-auto">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-2 text-white">Privacy Policy</h1>
          <p className="text-gray-400 mb-12">Last updated: December 28, 2025</p>

          {/* Content */}
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                EdgeFinder AI ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our Service.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">Personal Information</h3>
              <p className="text-gray-300 leading-relaxed">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mt-3">
                <li>First and last name</li>
                <li>Email address</li>
                <li>Password (encrypted)</li>
                <li>Account preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">Trading Data</h3>
              <p className="text-gray-300 leading-relaxed">
                When you upload trades to EdgeFinder AI, we collect and process:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mt-3">
                <li>Trade entry and exit prices</li>
                <li>Trade timestamps</li>
                <li>Trade outcomes (profit/loss)</li>
                <li>Asset symbols or identifiers</li>
                <li>Trade duration and holding time</li>
                <li>Any notes or metadata you provide</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">Usage Information</h3>
              <p className="text-gray-300 leading-relaxed">
                We automatically collect information about your interaction with our Service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mt-3">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Features used and frequency</li>
                <li>Referring/exit pages</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mt-3">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process your trades and generate personalized insights</li>
                <li>Send you transactional and service-related communications</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Personalize and improve your experience</li>
                <li>Comply with legal obligations</li>
                <li>Send promotional emails (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                EdgeFinder AI implements appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mt-3">
                <li>Encryption of data in transit (HTTPS/SSL)</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Restricted access to personal information</li>
                <li>Secure authentication mechanisms</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                However, no method of transmission over the Internet or electronic storage is completely secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">
                EdgeFinder AI retains your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. You may request deletion of your account and associated data at any time by contacting us at privacy@edgefinder.ai.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Please note that some information may be retained for legal or regulatory compliance purposes even after account deletion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Sharing Your Information</h2>
              <p className="text-gray-300 leading-relaxed">
                EdgeFinder AI does not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mt-3">
                <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (hosting, analytics, payment processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights and Choices</h2>
              <p className="text-gray-300 leading-relaxed">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mt-3">
                <li><strong>Access:</strong> You can request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> You can request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> You can request deletion of your data (right to be forgotten)</li>
                <li><strong>Portability:</strong> You can request your data in a structured, machine-readable format</li>
                <li><strong>Opt-Out:</strong> You can opt out of marketing communications and analytics</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                To exercise any of these rights, please contact us at privacy@edgefinder.ai
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-gray-300 leading-relaxed">
                EdgeFinder AI uses cookies and similar tracking technologies to enhance your experience. These include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mt-3">
                <li><strong>Session Cookies:</strong> Temporary cookies that help us manage your session</li>
                <li><strong>Persistent Cookies:</strong> Cookies that remember your preferences</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use the Service</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                You can control cookie preferences through your browser settings. Disabling cookies may affect some features of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                EdgeFinder AI is not intended for users under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information and terminate the child's account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Third-Party Links</h2>
              <p className="text-gray-300 leading-relaxed">
                Our website may contain links to third-party websites. EdgeFinder AI is not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                EdgeFinder AI may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated Privacy Policy on our website and updating the "Last updated" date above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-4 p-4 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                <p className="text-gray-300">
                  <strong>Email:</strong> privacy@edgefinder.ai<br />
                  <strong>Company:</strong> EdgeFinder AI<br />
                  <strong>Response Time:</strong> We aim to respond to all privacy inquiries within 30 days
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.03] bg-black/40 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-10 lg:px-20 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © 2025 EdgeFinder AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms</a>
              <a href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
