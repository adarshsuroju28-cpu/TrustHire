import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 sm:pt-32 sm:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                <span className="block">Stop Job Scams</span>
                <span className="block text-indigo-600">Start Your Career Right</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 sm:mt-8">
                Every year, thousands of students lose their sensitive information and hard-earned money to fake internship and job calls. TrustHire uses AI to verify opportunities, giving you peace of mind.
              </p>
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start space-x-4">
                <Link to="/auth" className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-lg shadow-indigo-100 transition-all">
                  Get Started Free
                </Link>
                <button 
                  onClick={scrollToFeatures}
                  className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-slate-300 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 md:py-4 md:text-lg md:px-10 transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden bg-white border-8 border-slate-100">
                <img 
                  src="https://picsum.photos/seed/trusthire/800/600" 
                  alt="App Preview" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Everything you need to stay safe</p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">AI Scam Detector</h3>
                <p className="text-slate-600">Paste job descriptions or emails to instantly get a risk score and identified red flags.</p>
              </div>

              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Company Verification</h3>
                <p className="text-slate-600">Cross-reference unknown companies against verified databases to ensure they actually exist.</p>
              </div>

              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Career Guidance</h3>
                <p className="text-slate-600">Get personalized job suggestions based on your skills from verified and trusted companies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;