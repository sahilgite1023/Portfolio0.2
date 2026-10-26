/**
 * SAHIL GITE - INTERACTIVE RETRO TERMINAL (HOME PAGE WIDGET)
 * Supports interactive typing, command parsing, cute easter eggs & ASCII art.
 */

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const suggestionChips = document.querySelectorAll('.terminal-suggestion-chip');

  if (!terminalBody || !terminalInput) return;

  const COMMANDS = {
    help: () => `
<span style="color:var(--accent-yellow); font-weight:bold;">AVAILABLE COMMANDS:</span>
  • <span style="color:#FFF;">skills</span>        - View programming languages, databases & cloud stack
  • <span style="color:#FFF;">projects</span>      - List of featured full stack & backend systems
  • <span style="color:#FFF;">education</span>     - Sahil's academic track record (MCA / BCA)
  • <span style="color:#FFF;">experience</span>    - Internship experience at Wind Hans & TechSaksham
  • <span style="color:#FFF;">achievements</span>  - Hackathon wins, 1st prize trophies & NASA Space Apps
  • <span style="color:#FFF;">contact</span>       - Phone, email, socials & coordinates
  • <span style="color:#FFF;">cat resume.txt</span>- Display full developer summary card
  • <span style="color:#FFF;">cat</span>           - Summon a cute ASCII kitten
  • <span style="color:#FFF;">joke</span>          - Fetch a random developer joke
  • <span style="color:#FFF;">whoami</span>        - Inspect your current visitor session
  • <span style="color:#FFF;">clear</span>         - Clear the terminal console
`,

    skills: () => `
<span style="color:var(--accent-mint); font-weight:bold;">[SAHIL'S TECH ARSENAL]</span>
  ├── Languages     : <span style="color:#FFF;">Python, JavaScript (ES6+)</span>
  ├── Frontend      : <span style="color:#FFF;">React.js, Tailwind CSS, HTML5, CSS3/Grid</span>
  ├── Backend       : <span style="color:#FFF;">Node.js, Express.js, RESTful APIs, JWT Auth</span>
  ├── Databases     : <span style="color:#FFF;">MySQL (Relational), MongoDB (NoSQL)</span>
  └── Cloud/DevOps  : <span style="color:#FFF;">AWS S3, Render, Netlify, DigitalOcean, Git/GitHub</span>
`,

    projects: () => `
<span style="color:var(--accent-cyan); font-weight:bold;">[FEATURED PRODUCTION PROJECTS]</span>
  1. <span style="color:var(--accent-yellow); font-weight:bold;">CareerNova - Job Portal</span> [Full Stack]
     • Stack: React, Node.js, Express, MongoDB, JWT, AWS S3, Render, Netlify
     • Features: Secure JWT auth, resume uploads to AWS S3, employer admin dashboard.
     • Check out the full breakdown on <a href="projects.html" style="color:var(--accent-pink); text-decoration:underline;">/projects.html</a>!

  2. <span style="color:var(--accent-yellow); font-weight:bold;">Employee Attendance System</span> [Backend Focus]
     • Stack: Node.js, SQL Database, Tailwind CSS, DigitalOcean
     • Features: Role-based auth, automated leave workflows, attendance logging.
`,

    education: () => `
<span style="color:var(--accent-purple); font-weight:bold;">[ACADEMIC BACKGROUND]</span>
  🎓 <span style="color:#FFF; font-weight:bold;">Master of Computer Applications (MCA)</span> | 2025 - Present
     K. K. Wagh Institute of Engineering Education & Research (KKWIEER), Nashik
     <span style="color:var(--accent-mint);">Current SGPA: 8.27</span>

  🎓 <span style="color:#FFF; font-weight:bold;">Bachelor of Computer Applications (BCA)</span> | 2022 - 2025
     Sandip University, Nashik
     <span style="color:var(--accent-mint);">Final CGPA: 7.92</span>

  🏫 12th HSC (2019 - 2021) - Nutan Vidyamandir (67.17%)
  🏫 10th SSC (2018 - 2019) - Janata Vidyalaya (73.20%)
`,

    experience: () => `
<span style="color:var(--accent-orange); font-weight:bold;">[WORK & INTERNSHIPS]</span>
  💼 <span style="color:#FFF; font-weight:bold;">Full Stack Developer Intern</span> | Wind Hans Technology, Nashik
     • Worked on backend development tasks, built & integrated scalable REST APIs.
     • Collaborated on professional development workflow in an offline corporate setup.

  🤖 <span style="color:#FFF; font-weight:bold;">AI Intern</span> | AICTE TechSaksham (Remote)
     • Mastered Artificial Intelligence & Machine Learning fundamentals with Python.
`,

    achievements: () => `
<span style="color:var(--accent-yellow); font-weight:bold;">[HONORS & LEADERSHIP]</span>
  🥇 1st Position - Logic Hunt Coding Competition (KKWIEER)
  🏆 2x 1st Prize - Poster Presentation Competition (Sandip University)
  🎖️ Co-Head - ASCEND 2K26 Mini Hackathon (KKWIEER)
  🚀 NASA Space Apps Challenge Participant (2022, 2024, 2025)
  ⚡ SunHacks 2024 (Sandip University) & InitHacks 2023 (SVKM Dhule)
`,

    contact: () => `
<span style="color:var(--accent-pink); font-weight:bold;">[DISPATCH COORDINATES]</span>
  📧 Email   : <a href="mailto:sahilgite511@gmail.com" style="color:#FFF; text-decoration:underline;">sahilgite511@gmail.com</a>
  📱 Phone   : <a href="tel:+919373782446" style="color:#FFF; text-decoration:underline;">+91 9373782446</a>
  📍 Location: Nashik, Maharashtra, India [20.00°N, 73.78°E]
  💼 LinkedIn: <a href="https://linkedin.com" target="_blank" style="color:var(--accent-cyan);">linkedin.com/in/sahilgite</a>
  🐙 GitHub  : <a href="https://github.com" target="_blank" style="color:var(--accent-yellow);">github.com/sahilgite</a>
`,

    'cat resume.txt': () => `
<span style="color:var(--accent-yellow); font-weight:bold;">================= RESUME.TXT =================</span>
NAME: Sahil Gite
ROLE: Full Stack Developer / AI & Cloud Enthusiast
STATUS: Open for Full Stack / Backend / Frontend Roles & Internships
DEGREE: MCA @ KKWIEER (8.27 SGPA) | BCA @ Sandip Univ (7.92 CGPA)
CORE: React, Node.js, Express, Python, JavaScript, MongoDB, MySQL, AWS
SUMMARY: Passionate developer with production-level full stack experience,
winner of competitive coding contests, and active hackathon contributor.
<span style="color:var(--accent-yellow); font-weight:bold;">==============================================</span>
`,

    cat: () => `
<pre style="color:var(--accent-pink); line-height: 1.2; font-family: monospace;">
    /\\_____/\\
   /  o   o  \\
  ( ==  ^  == )    meow! thanks for visiting Sahil's site!
   )         (     ( ˘ ³˘)♥
  (           )
  ( (  )   (  ) )
  (__(__)___(__)__)
</pre>
`,

    joke: () => {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        "There are 10 types of people: those who understand binary and those who don't.",
        "!false — It's funny because it's true.",
        "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍺",
        "Why did the JavaScript developer wear glasses? Because they didn't C#!"
      ];
      return `<span style="color:var(--accent-yellow);">😄 ${jokes[Math.floor(Math.random() * jokes.length)]}</span>`;
    },

    whoami: () => `
<span style="color:#FFF;">You are: A distinguished visitor, hiring manager, or fellow engineer!</span>
<span style="color:var(--accent-mint);">Status: Authorized to inspect code, explore projects, and schedule an interview.</span>
`,

    clear: () => {
      terminalBody.innerHTML = '';
      return null;
    }
  };

  // Aliases
  COMMANDS['help'] = COMMANDS.help;
  COMMANDS['resume'] = COMMANDS['cat resume.txt'];
  COMMANDS['hire'] = COMMANDS.contact;

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Create entry in terminal
    const userLine = document.createElement('div');
    userLine.className = 'terminal-prompt-line';
    userLine.innerHTML = `<span class="terminal-prompt-user">sahil@portfolio:~$</span> <span style="color:#FFF;">${escapeHtml(rawCmd)}</span>`;
    terminalBody.appendChild(userLine);

    if (COMMANDS[cmd]) {
      const response = COMMANDS[cmd]();
      if (response !== null) {
        const respEl = document.createElement('div');
        respEl.style.marginTop = '6px';
        respEl.style.marginBottom = '14px';
        respEl.innerHTML = response;
        terminalBody.appendChild(respEl);
      }
    } else {
      const errEl = document.createElement('div');
      errEl.style.marginTop = '6px';
      errEl.style.marginBottom = '14px';
      errEl.style.color = 'var(--accent-pink)';
      errEl.innerHTML = `command not found: "${escapeHtml(rawCmd)}". Type <span style="color:var(--accent-yellow); font-weight:bold;">help</span> to see available commands.`;
      terminalBody.appendChild(errEl);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    }
  });

  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
});
