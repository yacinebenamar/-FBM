const fs = require('fs');
let c = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: "Cairo", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  /* FBM Brand Colors */
  --color-fbm-green: #76BC21;
  --color-fbm-dark: #000839;
  --color-fbm-navy: #050E46;
  --color-fbm-green-dark: #5da018;
  --color-fbm-green-light: #9ed44f;
}

.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
.animate-slideIn { animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.animate-toastProgress { animation: toastProgress 6s linear forwards; }
.animate-pulse-green { animation: pulseGreen 2s ease-in-out infinite; }
.animate-shimmer { animation: shimmer 2s linear infinite; }
.animate-bounceIn { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-glow { animation: glow 2s ease-in-out infinite alternate; }
.animate-spin-slow { animation: spin 3s linear infinite; }

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes toastProgress {
  from { width: 100%; }
  to { width: 0%; }
}
@keyframes pulseGreen {
  0%, 100% { box-shadow: 0 0 0 0 rgba(118, 188, 33, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(118, 188, 33, 0); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
@keyframes glow {
  from { text-shadow: 0 0 5px rgba(118, 188, 33, 0.5); }
  to { text-shadow: 0 0 20px rgba(118, 188, 33, 0.9), 0 0 30px rgba(118, 188, 33, 0.4); }
}
@keyframes ripple {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
}
@keyframes notifPop {
  0% { transform: translateY(-100%) scale(0.8); opacity: 0; }
  60% { transform: translateY(8px) scale(1.02); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
`;

let orig = fs.readFileSync('src/index.css', 'utf-8');
// remove lines 1 to 88 from original
let rest = orig.split('\n').slice(88).join('\n');
fs.writeFileSync('src/index.css', c + '\n' + rest);
