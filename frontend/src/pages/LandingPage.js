import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden font-sans text-slate-300">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/30">
              💰
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">ExpenseSplit</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/register" className="text-sm font-medium bg-white text-slate-900 px-5 py-2.5 rounded-full hover:bg-slate-100 transition-colors shadow-lg shadow-white/10">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            ExpenseSplit v2.0 is now live
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight max-w-4xl mx-auto">
            Split expenses with friends, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">zero awkwardness.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The smartest way to manage shared expenses, split bills, and settle up with friends, roommates, or any group. Professional-grade tracking made simple.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 transform hover:scale-105"
            >
              Start splitting for free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800 text-white font-semibold text-lg border border-slate-700 hover:bg-slate-700 transition-all"
            >
              See how it works
            </Link>
          </div>

          {/* Dashboard Preview Image Placeholder */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 bottom-0 h-32"></div>
              <div className="rounded-xl overflow-hidden bg-slate-800 border border-slate-700 aspect-video flex flex-col">
                {/* Mock UI header */}
                <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                {/* Mock UI Content */}
                <div className="flex-1 p-6 grid grid-cols-4 gap-6">
                  {/* Sidebar mock */}
                  <div className="col-span-1 space-y-4">
                    <div className="h-8 bg-slate-700 rounded w-3/4 mb-8"></div>
                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-700 rounded w-4/6"></div>
                  </div>
                  {/* Main content mock */}
                  <div className="col-span-3 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-500/20 rounded-xl"></div>
                      <div className="h-24 bg-slate-700/50 border border-slate-700 rounded-xl"></div>
                      <div className="h-24 bg-slate-700/50 border border-slate-700 rounded-xl"></div>
                    </div>
                    <div className="h-48 bg-slate-700/30 border border-slate-700 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need to manage expenses</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A complete suite of tools designed to handle any splitting scenario, from simple dinners to month-long trips.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-2xl">👥</div>
              <h3 className="text-xl font-bold text-white mb-3">Group Management</h3>
              <p className="text-slate-400 leading-relaxed">Create dedicated groups for your apartment, a weekend trip, or your partner. Keep everything organized contextually.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 text-2xl">⚡️</div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Splits</h3>
              <p className="text-slate-400 leading-relaxed">Split equally, by exact amounts, or by percentages. Our algorithm simplifies debts to minimize total transactions.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-2xl">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Rich Analytics</h3>
              <p className="text-slate-400 leading-relaxed">Visualize your spending habits over time. See who you owe, who owes you, and where your money is going.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
