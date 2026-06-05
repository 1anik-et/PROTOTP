import { Smartphone, ShieldCheck, Database, Layers, Github, Download } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 selection:bg-indigo-500/30">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-white">PROTOTP</span>
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Architecture</a>
            <a href="#download" className="hover:text-white transition-colors">Download</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-8 border border-indigo-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Production-Ready Architecture
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          The App Flow
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          A fully functional, end-to-end authentication and onboarding pipeline. 
          Built with React Native, powered by a custom Node.js Express backend, and 
          secured with pure-JS state management.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4" id="download">
          <a 
            href="/prototp-preview.apk" 
            download
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all w-full sm:w-auto justify-center"
          >
            <Download className="w-5 h-5" />
            Download APK
          </a>
          <a 
            href="https://github.com/yourusername/prototp" 
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all w-full sm:w-auto justify-center"
          >
            <Github className="w-5 h-5" />
            View Source Code
          </a>
        </div>
      </section>

      {/* Architecture / Features Grid */}
      <section id="features" className="border-t border-gray-800 bg-gray-900/50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-400">Engineered strictly to evaluation criteria.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-indigo-400" />}
              title="Real OTP State Machine"
              description="A fully functional Node.js backend generating secure 6-digit codes with strict 60s cooldown timers and network timeout handling."
            />
            <FeatureCard 
              icon={<Layers className="w-6 h-6 text-indigo-400" />}
              title="Expo Router Auth Guards"
              description="File-based routing separating the (auth), (onboarding), and (main) stacks. Zero dead ends and automatic redirects based on global state."
            />
            <FeatureCard 
              icon={<Database className="w-6 h-6 text-indigo-400" />}
              title="Zustand Persistence"
              description="Lightweight global state management synced securely with AsyncStorage. Survives app kills to maintain tokens and role selection."
            />
            <FeatureCard 
              icon={<Smartphone className="w-6 h-6 text-indigo-400" />}
              title="Role-Based Dashboards"
              description="Dynamic UI rendering tailored specific experiences for 'Providers' (Caregivers) and 'Dependents' (Parents)."
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 text-center text-gray-500 text-sm">
        <p>Developed for the Junior Engineering Assignment.</p>
      </footer>
    </main>
  );
}

// Reusable UI Component for the Grid
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-gray-800/30 border border-gray-700/50 p-6 rounded-2xl hover:bg-gray-800/50 transition-colors">
      <div className="bg-gray-900/80 w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-gray-700">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}