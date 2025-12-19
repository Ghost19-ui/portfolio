// src/pages/Home.jsx
const Home = () => (
  <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-900 text-slate-100">
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Navbar */}
      <header className="flex items-center justify-between mb-10">
        <a href="/" className="text-sm font-semibold tracking-wide uppercase">
          🚀 Tushar Saini
        </a>
        <nav className="space-x-6 text-sm">
          <a href="#about" className="hover:text-cyan-300">Home</a>
          <a href="#projects" className="hover:text-cyan-300">Projects</a>
          <a href="#contact" className="hover:text-cyan-300">Contact</a>
          <a href="/admin" className="hover:text-cyan-300">Admin</a>
        </nav>
      </header>

      {/* Hero */}
      <section id="about" className="mt-8">
        <p className="text-sm font-medium text-cyan-300 mb-3">
          3rd Year CSE | Cybersecurity &amp; VAPT
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Hi, I&apos;m <span className="text-cyan-300">Tushar Saini</span>
        </h1>
        <p className="max-w-2xl text-sm md:text-base text-slate-200 leading-relaxed">
          Building secure, interactive web applications and offensive security tools.
          Passionate about penetration testing, ethical hacking, and web security.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a
            href="#projects"
            className="px-4 py-2 rounded-full bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="px-4 py-2 rounded-full border border-cyan-400 text-cyan-300 hover:bg-cyan-500/10"
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* Socials */}
      <section className="mt-8 text-sm space-x-4">
        <a href="https://linkedin.com" className="hover:text-cyan-300">LinkedIn</a>
        <a href="https://instagram.com" className="hover:text-cyan-300">Instagram</a>
        <a href="https://github.com" className="hover:text-cyan-300">GitHub</a>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-xs text-slate-400">
        © {new Date().getFullYear()} Tushar Saini. All rights reserved.
      </footer>
    </div>
  </main>
);

export default Home;
-