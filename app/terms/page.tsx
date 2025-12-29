'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-5xl font-bold mb-2 text-white">Terms of Service</h1>
          <p className="text-gray-400 mb-12">Last updated: December 28, 2025</p>

          {/* Content */}
          <div className="space-y-10 prose prose-invert max-w-none">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using EdgeFinder AI ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on EdgeFinder AI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose, or for any public display (commercial or non-commercial)</li>
                <li>Attempting to decompile or reverse engineer any software contained on EdgeFinder AI</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Uploading false, misleading, or fraudulent trading data</li>
                <li>Using the Service to develop competing trading analysis tools</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Disclaimer</h2>
              <p className="text-gray-300 leading-relaxed">
                The materials on EdgeFinder AI are provided on an 'as is' basis. EdgeFinder AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Further, EdgeFinder AI does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Trading Disclaimer</h2>
              <p className="text-gray-300 leading-relaxed">
                EdgeFinder AI provides algorithmic analysis and insights based on your historical trading data. We are not financial advisors, and our analysis should not be considered financial advice. Trading and investing involve substantial risk of loss. Past performance is not indicative of future results. You are solely responsible for your trading decisions.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                The insights and patterns identified by our algorithms are tools to help you analyze your trading behavior—they do not guarantee profit or prevent losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Limitations</h2>
              <p className="text-gray-300 leading-relaxed">
                In no event shall EdgeFinder AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EdgeFinder AI, even if EdgeFinder AI or a representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Accuracy of Materials</h2>
              <p className="text-gray-300 leading-relaxed">
                The materials appearing on EdgeFinder AI could include technical, typographical, or photographic errors. EdgeFinder AI does not warrant that any of the materials on its website are accurate, complete, or current. EdgeFinder AI may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Materials and Content</h2>
              <p className="text-gray-300 leading-relaxed">
                You are responsible for ensuring that the trading data you upload to EdgeFinder AI is accurate and that you have the right to share this data with us. You grant EdgeFinder AI a worldwide, non-exclusive license to use, process, and analyze your trading data for the purpose of providing the Service.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                You may not upload data that is confidential, proprietary, or obtained without proper authorization.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Links</h2>
              <p className="text-gray-300 leading-relaxed">
                EdgeFinder AI has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by EdgeFinder AI of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Modifications</h2>
              <p className="text-gray-300 leading-relaxed">
                EdgeFinder AI may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Account Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                EdgeFinder AI reserves the right to suspend or terminate any account that violates these terms or for any reason at its sole discretion. Upon termination, your right to use the Service immediately ceases.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at support@edgefinder.ai
              </p>
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
