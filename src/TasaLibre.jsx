import { useState, useRef, useEffect } from "react";

const ADMIN_PASS = "tasalibre2025";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300;1,9..144,400&display=swap');

  :root {
    --azul: #1B4FD8;
    --azul-hover: #1640B8;
    --azul-light: #EEF3FF;
    --azul-mid: #C7D7FA;
    --verde: #0EA66B;
    --bg: #F7F8FC;
    --white: #FFFFFF;
    --ink: #0F1923;
    --ink-2: #2C3A4A;
    --ink-3: #556070;
    --ink-4: #8896A5;
    --border: #E2E8F0;
    --border-2: #CBD5E1;
    --shadow-sm: 0 1px 3px rgba(15,25,35,.08), 0 1px 2px rgba(15,25,35,.04);
    --shadow-md: 0 4px 16px rgba(15,25,35,.08), 0 2px 6px rgba(15,25,35,.04);
    --shadow-lg: 0 12px 40px rgba(15,25,35,.1), 0 4px 12px rgba(15,25,35,.06);
    --radius: 12px;
    --radius-sm: 8px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .tasa-root {
    background: var(--bg);
    color: var(--ink);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 400;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ── NAV ── */
  .tasa-nav {
    position: sticky; top: 0; z-index: 100;
    padding: 0 24px;
    height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  .tasa-logo {
    display: flex; align-items: center; gap: 8px;
    cursor: pointer; text-decoration: none;
  }
  .logo-mark {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--azul);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .logo-mark svg { display: block; }
  .logo-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 17px; font-weight: 700;
    color: var(--ink); letter-spacing: -.3px;
  }
  .logo-text span { color: var(--azul); }
  .nav-right { display: flex; align-items: center; gap: 8px; }
  .nav-tag {
    background: var(--azul-light); color: var(--azul);
    font-size: 11px; font-weight: 600; letter-spacing: .02em;
    padding: 4px 10px; border-radius: 100px;
  }
  .nav-admin-btn {
    width: 32px; height: 32px; border-radius: 50%;
    background: none; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-4); transition: background .15s, color .15s;
  }
  .nav-admin-btn:hover { background: var(--border); color: var(--ink-2); }

  /* ── HERO ── */
  .hero {
    min-height: calc(100vh - 60px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 24px 72px;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 50% -5%, rgba(27,79,216,0.07) 0%, transparent 65%),
      radial-gradient(ellipse 50% 40% at 90% 90%, rgba(14,166,107,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 10% 70%, rgba(27,79,216,0.04) 0%, transparent 50%);
  }
  .hero-inner { position: relative; z-index: 1; max-width: 560px; width: 100%; }
  .hero-logo-wrap { margin-bottom: 28px; display: flex; justify-content: center; }
  .hero-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--white); border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    border-radius: 100px; padding: 6px 14px 6px 8px;
    font-size: 12px; font-weight: 500; color: var(--ink-2);
    margin-bottom: 24px;
  }
  .pill-dot {
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--verde); display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .hero h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(38px, 8vw, 64px);
    font-weight: 700; line-height: 1.08; letter-spacing: -.025em;
    color: var(--ink); margin-bottom: 18px;
  }
  .hero h1 em { font-style: italic; color: var(--azul); font-weight: 300; }
  .hero-sub {
    font-size: 16px; color: var(--ink-3); line-height: 1.7;
    margin-bottom: 36px; max-width: 400px; margin-left: auto; margin-right: auto;
  }
  .hero-actions { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-bottom: 0; }
  .hero-trust {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--ink-4);
  }
  .hero-trust svg { color: var(--verde); }
  .hero-stats {
    display: flex; gap: 0; margin-top: 52px;
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: var(--shadow-md);
    overflow: hidden;
  }
  .hero-stat {
    flex: 1; padding: 20px 16px; text-align: center;
    border-right: 1px solid var(--border);
  }
  .hero-stat:last-child { border-right: none; }
  .stat-num { display: block; font-size: 22px; font-weight: 800; color: var(--azul); letter-spacing: -0.5px; }
  .stat-label { display: block; font-size: 10px; color: var(--ink-4); margin-top: 3px; text-transform: uppercase; letter-spacing: 0.06em; }
  .stat-num {
    font-family: 'Fraunces', serif;
    font-size: 28px; font-weight: 600; color: var(--azul);
    display: block; line-height: 1;
  }
  .stat-label {
    font-size: 11px; color: var(--ink-4);
    margin-top: 4px; display: block; font-weight: 500;
  }

  /* ── BUTTONS ── */
  .btn-primary {
    background: var(--azul); color: #fff;
    border: none; border-radius: var(--radius-sm);
    padding: 14px 28px; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 14px rgba(27,79,216,.3);
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-primary:hover { background: var(--azul-hover); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(27,79,216,.35); }
  .btn-primary:active { transform: translateY(0); }
  .btn-outline {
    background: var(--white); color: var(--azul);
    border: 1.5px solid var(--azul-mid); border-radius: var(--radius-sm);
    padding: 13px 24px; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all .2s; display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-outline:hover { background: var(--azul-light); border-color: var(--azul); }
  .btn-ghost {
    background: none; border: 1.5px solid var(--border); color: var(--ink-3);
    border-radius: var(--radius-sm); padding: 13px 24px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all .2s;
  }
  .btn-ghost:hover { border-color: var(--border-2); color: var(--ink); }

  /* ── WIZARD ── */
  .wizard { max-width: 620px; margin: 0 auto; padding: 40px 20px 80px; }
  .prog-wrap { margin-bottom: 40px; }
  .prog-track { display: flex; align-items: center; }
  .dot {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600;
    border: 2px solid var(--border-2); background: var(--white); color: var(--ink-4);
    transition: all .3s;
  }
  .dot.active { border-color: var(--azul); background: var(--azul-light); color: var(--azul); }
  .dot.done { border-color: var(--azul); background: var(--azul); color: #fff; }
  .prog-line { flex: 1; height: 2px; background: var(--border); position: relative; }
  .prog-line-fill { position: absolute; left:0; top:0; height:100%; background: var(--azul); transition: width .5s ease; border-radius: 2px; }
  .prog-labels { display: flex; justify-content: space-between; margin-top: 8px; }
  .prog-lbl { font-size: 11px; font-weight: 500; color: var(--ink-4); flex:1; text-align:center; transition: color .3s; }
  .prog-lbl:first-child { text-align: left; } .prog-lbl:last-child { text-align: right; }
  .prog-lbl.active { color: var(--azul); }

  .step-title { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; line-height: 1.15; margin-bottom: 8px; color: var(--ink); }
  .step-title em { font-style: italic; color: var(--azul); font-weight: 300; }
  .step-desc { font-size: 14px; color: var(--ink-3); line-height: 1.6; margin-bottom: 28px; }

  /* ── FIELDS ── */
  .field { margin-bottom: 18px; }
  .field label { display: block; font-size: 12px; font-weight: 600; color: var(--ink-2); margin-bottom: 6px; letter-spacing: .01em; }
  .field input, .field select {
    width: 100%; background: var(--white); border: 1.5px solid var(--border);
    color: var(--ink); padding: 11px 14px; border-radius: var(--radius-sm);
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 400;
    outline: none; transition: border-color .2s, box-shadow .2s; appearance: none; -webkit-appearance: none;
  }
  .field input:focus, .field select:focus {
    border-color: var(--azul); box-shadow: 0 0 0 3px rgba(27,79,216,.1);
  }
  .field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238896A5' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    background-color: var(--white); padding-right: 36px; cursor: pointer;
  }
  .field select option { background: var(--white); color: var(--ink); }
  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

  .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
  .chip {
    padding: 7px 14px; border: 1.5px solid var(--border); border-radius: 100px;
    font-size: 12px; font-weight: 500; color: var(--ink-3);
    cursor: pointer; transition: all .15s; user-select: none; background: var(--white);
  }
  .chip:hover { border-color: var(--azul-mid); color: var(--azul); background: var(--azul-light); }
  .chip.on { border-color: var(--azul); color: var(--azul); background: var(--azul-light); }

  /* ── UPLOAD ── */
  .upload-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .upload-slot {
    aspect-ratio: 1; border: 2px dashed var(--border-2); border-radius: var(--radius-sm);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s; background: var(--white); position: relative; overflow: hidden;
  }
  .upload-slot:hover { border-color: var(--azul); background: var(--azul-light); }
  .upload-slot.filled { border-style: solid; border-color: var(--azul); }
  .upload-slot img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  .upload-overlay { position:absolute; inset:0; background:rgba(27,79,216,.7); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; border-radius: var(--radius-sm); }
  .upload-slot:hover .upload-overlay { opacity:1; }
  .upload-lbl { font-size: 10px; font-weight: 600; color: var(--ink-4); text-align: center; padding: 0 6px; margin-top: 6px; }
  .upload-hint { font-size: 12px; color: var(--ink-4); margin-top: 10px; line-height: 1.6; }

  .step-nav { display:flex; justify-content:space-between; align-items:center; margin-top:32px; padding-top:24px; border-top: 1px solid var(--border); }

  /* ── CONTACT ── */
  .contact-screen { max-width: 460px; margin: 0 auto; padding: 48px 20px 80px; }
  .contact-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--azul); margin-bottom: 12px; }
  .contact-title { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 600; line-height: 1.1; margin-bottom: 14px; color: var(--ink); }
  .contact-title em { font-style: italic; color: var(--azul); font-weight: 300; }
  .contact-sub { font-size: 14px; color: var(--ink-3); line-height: 1.65; margin-bottom: 32px; }
  .contact-card { background: var(--white); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow-sm); }
  .contact-field { margin-bottom: 20px; }
  .contact-field:last-of-type { margin-bottom: 0; }
  .contact-field label { display: block; font-size: 12px; font-weight: 600; color: var(--ink-2); margin-bottom: 8px; }
  .contact-input {
    width: 100%; background: var(--bg); border: 1.5px solid var(--border);
    color: var(--ink); padding: 13px 16px; border-radius: var(--radius-sm);
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 400;
    outline: none; transition: all .2s;
  }
  .contact-input:focus { border-color: var(--azul); background: var(--white); box-shadow: 0 0 0 3px rgba(27,79,216,.1); }
  .contact-input::placeholder { color: var(--ink-4); }
  .contact-wa-hint { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-4); margin-top: 8px; }
  .contact-submit {
    width: 100%; background: var(--azul); color: #fff; border: none;
    border-radius: var(--radius-sm); padding: 15px; margin-top: 24px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all .2s; box-shadow: 0 4px 14px rgba(27,79,216,.3);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .contact-submit:hover { background: var(--azul-hover); transform: translateY(-1px); }
  .contact-submit:disabled { opacity: .45; pointer-events: none; transform: none; box-shadow: none; }
  .contact-skip { display: block; text-align: center; font-size: 12px; color: var(--ink-4); margin-top: 14px; cursor: pointer; background: none; border: none; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; transition: color .2s; }
  .contact-skip:hover { color: var(--ink-2); }

  /* ── LOADING ── */
  .loading-screen {
    position: fixed; inset: 0; background: var(--white); z-index: 200;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px;
  }
  .ring {
    width: 52px; height: 52px; border-radius: 50%;
    border: 3px solid var(--azul-light); border-top-color: var(--azul);
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color: var(--ink); }
  .loading-sub { font-size: 13px; color: var(--ink-4); }
  .loading-steps { display: flex; flex-direction: column; gap: 10px; width: 280px; margin-top: 8px; }
  .ls { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--ink-4); opacity: .4; transition: all .4s; }
  .ls.active { opacity: 1; color: var(--ink-2); }
  .ls.done { opacity: 1; color: var(--verde); }
  .ls-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

  /* ── RESULT ── */
  .result { max-width: 740px; margin: 0 auto; padding: 32px 20px 80px; }
  .result-header {
    background: var(--azul); color: #fff; border-radius: var(--radius);
    padding: 32px; text-align: center; margin-bottom: 20px;
    box-shadow: var(--shadow-lg);
  }
  .res-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.15); border-radius: 100px;
    padding: 4px 12px; font-size: 11px; font-weight: 600;
    letter-spacing: .04em; margin-bottom: 16px; color: #fff;
  }
  .res-price { font-family: 'Fraunces', serif; font-size: clamp(40px,8vw,68px); font-weight: 600; line-height: 1; margin-bottom: 8px; color: #fff; }
  .res-range { font-size: 14px; color: rgba(255,255,255,.7); margin-bottom: 6px; }
  .res-addr { font-size: 12px; color: rgba(255,255,255,.55); }
  .res-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .res-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow-sm); }
  .res-card-full { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow-sm); margin-bottom: 16px; }
  .card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--ink-3); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .card-title::after { content:''; flex:1; height:1px; background: var(--border); }
  .score-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .score-name { font-size: 12px; font-weight: 500; width: 110px; flex-shrink: 0; color: var(--ink-2); }
  .score-bg { flex: 1; height: 6px; background: var(--bg); border-radius: 100px; }
  .score-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--azul), #4F7EF0); }
  .score-val { font-size: 12px; font-weight: 600; color: var(--azul); width: 36px; text-align: right; }
  .comp-item { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .comp-item:last-child { border-bottom: none; }
  .comp-addr { font-size: 13px; font-weight: 500; color: var(--ink); }
  .comp-detail { font-size: 11px; color: var(--ink-4); margin-top: 2px; }
  .comp-price { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; color: var(--azul); white-space: nowrap; text-align: right; }
  .comp-sqm { font-size: 11px; color: var(--ink-4); text-align: right; }
  .factor { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .factor:last-child { border-bottom: none; }
  .ficon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
  .ficon.pos { background: #DCFCE7; color: #16A34A; }
  .ficon.neg { background: #FEE2E2; color: #DC2626; }
  .ficon.neu { background: var(--azul-light); color: var(--azul); }
  .factor-body { font-size: 13px; line-height: 1.5; color: var(--ink); }
  .factor-impact { font-size: 11px; color: var(--ink-4); margin-top: 3px; font-weight: 500; }
  .analysis-text { font-size: 13px; line-height: 1.8; color: var(--ink-3); }
  .disclaimer { text-align: center; font-size: 12px; color: var(--ink-4); line-height: 1.7; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border); }

  /* ── ADMIN ── */
  .admin-screen { max-width: 960px; margin: 0 auto; padding: 32px 20px 80px; }
  .admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .admin-title { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; color: var(--ink); }
  .admin-stats { display: flex; gap: 14px; margin-bottom: 28px; }
  .admin-stat { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; flex: 1; box-shadow: var(--shadow-sm); }
  .admin-stat-n { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 600; color: var(--azul); display: block; }
  .admin-stat-l { font-size: 11px; font-weight: 600; color: var(--ink-4); margin-top: 2px; display: block; }
  .leads-table { width: 100%; border-collapse: separate; border-spacing: 0; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-sm); }
  .leads-table th { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-4); padding: 12px 16px; text-align: left; background: var(--bg); border-bottom: 1px solid var(--border); }
  .leads-table td { font-size: 13px; padding: 14px 16px; border-bottom: 1px solid var(--border); vertical-align: top; }
  .leads-table tr:last-child td { border-bottom: none; }
  .leads-table tr:hover td { background: var(--bg); }
  .lead-name { font-weight: 600; color: var(--ink); margin-bottom: 3px; }
  .lead-contact { font-size: 12px; color: var(--ink-3); margin-top: 2px; }
  .lead-prop { font-size: 12px; color: var(--ink-3); margin-bottom: 2px; }
  .lead-price { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; color: var(--azul); }
  .lead-date { font-size: 11px; color: var(--ink-4); }
  .badge-hot { display: inline-flex; align-items: center; gap: 4px; background: #DCFCE7; color: #16A34A; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 100px; margin-top: 6px; }
  .badge-cold { display: inline-flex; align-items: center; gap: 4px; background: var(--bg); color: var(--ink-4); font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 100px; margin-top: 6px; border: 1px solid var(--border); }
  .status-select { background: var(--bg); border: 1px solid var(--border); border-radius: 100px; padding: 4px 10px; font-size: 11px; font-weight: 600; cursor: pointer; outline: none; font-family: "Plus Jakarta Sans", sans-serif; transition: all .2s; appearance: none; -webkit-appearance: none; }
  .status-pendiente { color: #92400E; background: #FFF8ED; border-color: #F59E0B; }
  .status-contactado { color: #1E40AF; background: #EEF3FF; border-color: #93C5FD; }
  .status-en_proceso { color: #065F46; background: #ECFDF5; border-color: #6EE7B7; }
  .status-cerrado { color: #374151; background: #F3F4F6; border-color: #D1D5DB; }
  .empty-leads { text-align: center; padding: 60px 0; color: var(--ink-4); font-size: 14px; }

  /* ── LOGIN ── */
  .login-screen { min-height: calc(100vh - 60px); display: flex; align-items: center; justify-content: center; padding: 24px; }
  .login-box { width: 100%; max-width: 360px; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 36px; box-shadow: var(--shadow-md); }
  .login-title { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
  .login-sub { font-size: 13px; color: var(--ink-4); margin-bottom: 24px; }
  .login-err { color: #DC2626; font-size: 12px; margin-top: 6px; font-weight: 500; }

  .err { color: #DC2626; font-size: 12px; margin-top: 6px; font-weight: 500; }
  .err-box { margin-top: 12px; background: #FEF2F2; border: 1px solid #FCA5A5; color: #DC2626; padding: 12px 14px; font-size: 12px; line-height: 1.5; border-radius: var(--radius-sm); }

  @media(max-width:640px){
    .row2,.row3 { grid-template-columns: 1fr; }
    .res-grid { grid-template-columns: 1fr; }
    .upload-grid { grid-template-columns: repeat(2,1fr); }
    .hero-stats { flex-direction: column; border-radius: var(--radius); }
    .hero-stat { border-right: none; border-bottom: 1px solid var(--border); padding: 16px; }
    .hero-stat:last-child { border-bottom: none; }
    .stat-num { font-size: 24px; }
    .admin-stats { flex-wrap: wrap; }
    .admin-stat { min-width: calc(50% - 7px); }
    .tasa-nav { padding: 0 16px; height: 54px; }
    .logo-text { font-size: 15px; }
    .nav-tag { display: none; }
    .wizard { padding: 24px 16px 100px; }
    .result { padding: 20px 16px 100px; }
    .contact-screen { padding: 28px 16px 100px; }
    .result-header { padding: 24px 20px; }
    .res-price { font-size: 38px; }
    .res-range { font-size: 12px; }
    .hero { padding: 40px 20px 60px; min-height: calc(100vh - 54px); }
    .hero h1 { font-size: clamp(32px,8vw,48px); }
    .hero-sub { font-size: 14px; margin-bottom: 28px; }
    .hero-pill { font-size: 11px; padding: 5px 12px 5px 6px; margin-bottom: 20px; }
    .step-title { font-size: 26px; }
    .contact-title { font-size: 30px; }
    .chips { gap: 6px; }
    .chip { padding: 7px 12px; font-size: 12px; }
    .btn-primary { padding: 14px 24px; font-size: 13px; width: 100%; justify-content: center; }
    .btn-outline { padding: 12px 20px; font-size: 12px; }
    .step-nav { margin-top: 28px; padding-top: 20px; }
    .prog-wrap { margin-bottom: 32px; }
    .dot { width: 26px; height: 26px; font-size: 10px; }
    .prog-lbl { font-size: 9px; }
    .contact-card { padding: 20px; }
    .contact-input { font-size: 18px; }
    .leads-table { display: block; overflow-x: auto; }
    .admin-screen { padding: 24px 16px 80px; }
    .loading-steps { width: 260px; }
    .loading-title { font-size: 18px; }
  }
  @media(max-width:380px){
    .upload-grid { grid-template-columns: repeat(2,1fr); }
    .hero h1 { font-size: 28px; }
    .res-price { font-size: 32px; }
  }
`

const SLOT_LABELS = ["Sala / Living","Cocina","Dormitorio","Baño","Fachada","Otro"];
const AMENITY_DEPTO = ["Cochera","Pileta","Gimnasio","SUM","Seguridad 24h","Parrilla"];
const AMENITY_CASA = ["Cochera","Pileta","Patio","Jardín","Terraza","Parrilla","Galería/Quincho","Playroom","Dormitorio principal en suite","Techos altos","Aberturas DVH","Lavadero"];
const AMENITY_PH = ["Cochera","Pileta","Patio","Parrilla","Aberturas DVH"];
const LOAD_STEPS = ["Analizando fotos con IA","Buscando comparables en ZonaProp","Buscando en Argenprop y MercadoLibre","Calculando valor de mercado","Generando informe de tasación"];

const LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABAQUlEQVR42u2dd5hkRdW436obunt6cthMzhIlipIkIypRQQQkmwhi4OPT76coiqIoOeccBSRIliAIKpJVMhKXDbOTO91bdX5/3J7ZzA7sLizreZ+nn11mm7l9u+99+9SpU6eMiKAoivJxwOpboCiKCktRFEWFpSiKCktRFEWFpSiKosJSFEWFpSiKosJSFEVRYSmKosJSFEVRYSmKoqiwFEVRYSmKoqiwFEVRVFiKoqiwFEVRVFiKoigqLEVRVFiKoigqLEVRFBWWoigqLEVRFBWWoiiKCktRFBWWoiiKCktRFEWFpSiKCktRFEWFpSiKCktRFEWFpSiKosJSFEWFpSiKosJSFEVRYSmKosJSFEVRYSmKoqiwFEVRYSmKoqiwFEVRVFiKoqiwFEVRVFiKoigqLEVRVFiKoigqLEVRFBWWoigqLEVRFBWWoiiKCktRFBWWoiiKCktRFEWFpSiKCktRFEWFpSiKosJSFEWFpSiKosJSFEWFpSiKosJSFEVRYSmKosJSFEVRYSmKoqiwFEVRYSmKoqiwFEVRVFiKoqiwFEVRVFiKoigqLOUj5tiz7pE3SiL6TiiLg1DfAmVRsf0X9pV73tmEJ2vbcNd3jL4hikZYypLJtl/9rtzz0F9pm9jG3f82bP3rPo2yFBWWsuSxw55fl/vu+wuFzokk3jO2yfDXV2N2PLVfpaWosJQlaBi45yFy971/pqGliEvKEIQ4C605y13/KrD5CT0qLUWFpXz0fGHfo+Se+x8n3zWWJKmCTxDxOIFBZ2nPhzz8WiNfOHVQpaWosJSPjl32O0puu/tRCl3j8KkDDOJSfJJAAmIcqXFMaLLc/3yeHU/W4aGiwlI+Ar649zflllvvJd/WhEsqGGPBBoDBiMcbMBISOEMlFRrzwl3Pxmxx4oBKS1FhKR8eexx8jNx616M0dHaQ1CogghgQQIwFE2IEjBdEBCdC2Rk6GkMefrnAF07R2UNFhaV8CHzp0GPlxlv+RGFsFzUnWOMRSXHegxGsDbFBTADgPYiA9xif4DFMKlr+9EqB3c7USEtRYSmLkb0P+b7ccMMfybe3k9SqGGNAAkQMIh7jQGxEYCPEAsbjBbwEWAkR4xkkpTVnuPWZPJ/9jUZaigpLWQx85evHyrU33ElDRxuuVsZgMDJ8+RgCDFbAmRRMGW+Gh4dgjOARjAecoZp4OgqOB/4dsdNpmohXVFjKImT/b/9Yrvn9veTHjKOWegyCEY+QLb0xxkAgiPUYb6kNksnMGKyBwGTPEQERQ+IMFRcypiXPn/6Z5/Onap2WosJSFoWsDv+pXH7VH8h3NOKSGsYYHAFODILPhAV4QmyQw5V7mdSeUir7LPluDMZ4IEvAewfGGRBH1RnaGgy3P9vAF0/pVWkpKizlg3PId4+Xy6+6mVzXWFwtHfm5IXOL8QaDIAhREFLpns7ee+/OgxfsxQGf6qO/VMGGmdAQi3hDNpdoMd4iklDxnjGNEXc/38je52lOS1kwRrQTiDIHB3/vZ3LRRdfR0DWGJPF10cxynYhgMHhjsFFEbepkdt9jO35/4SkjLRoOv7ZXLrg3T2shR9V7xGdyM1liCxGHtYYgFBojS0/Fs+1aNX7/9UZt86CosJTR8a0fHC9nX/h7Cp0d+LSGYPAYzGzXSaaeIM5RnT6VXXfZlpsu+u1cojniirKc+aDQWcyRJMz2/4PPoq9QMCYiZw3T+hK2XafMHUe1qLQUHRIq7823j/mFnH3+teQ7OqilKSI+e8zjuUEUUZ0+lc9//rPzlBXA6fsWzDe2SOjpSwmtRYxHEBBGIq0gFYyrUUmFtka486kGdj9Tc1qKRljKe/CdH/1KTj3zMnJd4xDnGL4uhv80JpsXFCxBHFOZMpltt9+ce647Z4HR0BFX9MmZf4poawxxqc1iNiNZUh6D4PDGgAhhFDKj7NlrnSpXfatJIy1FIyxljmHgj34tp551OYUxY3AuwftkjmdkA0OPJYhzVGZMZ6utNx6VrLJIq8V8extPX68liAQCMNbWB4aCxyI+uxy9F8bnYq57NmCfCzTSUlRYyiz84LjfytlnXUXUNZ7UOax4xJhZIiuDMSAebBhS6Z7GVptvwP03Xvy+op/Tv9povrF9hZ4BTxSE9TS+xYtBxAAWg0XEM0RCVyHPzY8V2UtnDxUVlgJwzE9/KyeddhmFjk5MkmCdAAaRcCSyyh6GMM5R657Gphuvxf03XviBhmpn7NtovvXZhO6+BEOIyzJaGGw26+gBF4A40pqhucly/d/y7HWuVsQrGZrD+i/l2ONPlhN/dyFx53gkrY6IaeblkA0DBSHKFSj39rHReqvxt7uuXOi80rev6JWz7s/R2RCROlNvR+PrNV42q4zPcvLYUOjpd3x145TLvl7UnJZGWMp/G//z89PkxN9dSK5zLN47qFetZ0PA+gPBi8VGeco9vWy8/lqLRFYAZ+7bag7fukbPoEeiOWciBS+CeMkWTyeGMYUcl//Ds8/ZGmmpsJT/Kn50wuny699eSNwxBucTkOEEu5kz9iaII2ozprHuGstw0+WnLNLXcfpXW8zXNkvo608JA4thOF+WXZIyLC2bMhTUGJtr5Nq/5dhHh4cqLOW/g/894VQ54TfnkW/vwvgE6xOMd3gZXhlYz1mJJ4hy1Ab6WWuNFbnlyrOZ0Nm6yIdjFx5cNAdvkdA3lJALQ8QKmLRep1V/uIBAPIl42lst1/w1z77naT+t/1Y0h/Vfwo9PPEuO/9UZRJ1jwPmslbFktVDDEc1wnBXEOSoDA6y52nLcdtXZLD+ha7Hmjr5xeZ9c+FBMRy5HxfusfY2pvyYjZEFXVgUWBtDT6/jKZypcdmir5rQ0wlKWNo476QI5/jcXEHeOw3vJOoFiZpOVlWypTBBGVHpmsOryE7j9itMXu6wAztmvxRy4ecqUoQqhtSNFpdZmh/YevM+WAznnaWvKcfnfQg66SIeHKixlKZPVufLTE84g39aJeIeVlHpnvbqwDBhwxmKiPJWBflaY2MbNV5zBcpPGf2gRzHn7N5kDNkvpLdeIAks2EVBfLC0G8SAOnHiqpIzPNXLpIzFfu1DrtHRIqCwVHH/y+fLj408n19YBkpLVlYMXi5BFVcPZIhvGVEtlVpjUxm1XnsknVlnhIxluHXpJr1z6cExrMSZxZMNWGY4EIcBAkGIJIIDu3hr7fNpx5dd1GY9GWMrHlhNOvUB+/IsziNs78ZLgJc2WwEhWtm7E1Rc3O4LAUh0YYPkJLdx69TkfmawAzj+g1eyzSYlpg47QCsYPvxSDNSbrFy8hHovzlvaWBq59NOCgK7r1m1cjLOXjyImnXSzH/uxU4rZOvPeIq2KNzPb9ZLzHYwgCQ3Wgh4kTx3P39ed/pLKalS+f0y/XP5anoynAeV8vdxCQmXk3CSwYRxyG9JfKHLRJjbMO1ES8RljKx4ZfnHaRHPvj35BrbgWXYHyt3sa4fqPXSzTFGmycozpUYnx7M7dcceYSIyuA677RbL606QD9lZQ4DrNG8aZ+BvUyDPEePDhXozMucPaf8xxyiea0VFjKx4LfnHmJ/N9xJxG1d4IkiE+z5S7GYOo73FgsiMFGeWrlKhMnjOG2Gy5l/bVWW+Iik+u+3mG+tGGVvqEqQWAxLtuYVaQ+0+nBOov3IYkVCsWIh15IeaO7otJSYSlLMiedeakc8+OTiFu76hVLvl4GakaKMKlHWjYOqJYrLDO2hVuvOov11151iR1GXfn1ZrPzOgNM73MYa7DejCwkEjxiPAWxDCWwfFMfVx/RyLId+YU6nxPv6pO3+51KbwlEc1hLCW2rbCZ9VYjiGHwCs2zFJULWz8oYrA1IhvoY19XBHdedx3prrPyxyPns9NsZcuczRdqaA7zzWdQoEIaWwdSyTFMv1x5R4JOTFk5Wh17UJxfcH7PjRiXuOLJD82EaYSmLmnemTJF8Qx6Lw/oaiCBzfLSebDYwKVfpKjRw40WnfGxkBXDH99rN9mv30V/25OIAjGADGKga2gs9XP6t3ELL6uuX9Mqlj0d0LZPnz/9qYedTdQmQCktZ9IghrO+p5clql7KShXq+B8HagNrgIGMa8/zhunPZdKN1PnbRw13fH2O+sE6FobJQzAmDqaElN8B1hxfYZLmGhTqf/c+fLhc9VKC5oYAdhOai5Y5n8+z46xkqLR0SKouaSZ/cUSbP6CcMAub+TAVJhK7miOsuPZXNNlpvoWX1yN+fkUf/8QyFQh4fRKTlEquvtCw7bf0Z8+Ir/5Fb7n+UfJQDY6hVq4xtb+Gre+y0SCS5+2m9ctPTDYxrHuKqb+T47GoLKauLZ8jl9xdoa43qw00ITEBkAqZUy+y6dpWbDtdyiSWBUN+CpSTI8p75ffkEQUClr5c9DtxvkcgK4Na7H+DE40+H1lawAUx9lz32342dtv4Mz77wMj/4znFQbAIMDA6x2nqr8dU9dlok53rjka1mr3MnyyFbtCy0rL57VZ9c80iRlrYcaZrWN4gFseBtwqRigdtfMOx+Vp+ctm+RSc2hikuFpSwMk6dME+G9ImWTdT1g0UXTuYYGwjHjKRTziE+oVIs0FgvZv+VigtYWomKRWBylXANtHV2L9Jyv/frCr3P8xmV9ctmDedraQpJaFesjHFl7G+8dibWYJGVMPuamx2pssVoP39mmSy+4jxDNYS0FjB87s6OCmeM2Hs5h4SFYhMd01QSfJIg4RFK8HylCxyUOSWqIgBPBk+IkXaLesyMu7ZZz78tTKEbUqgKu3o8Lk23CgQEnmNAydUaZr2/j+c42XRpdaYSlLJJvHpsVhr5XSnJR3m3V0hB+xlQGwy6wIVQNqc++/9LE4UtDVHMNVDEwVGOoVFlyZHVFj5xRz1m51CO+XgBisq6nItl/h9bS3e84aKuUc/bTHJYKS1mEmJHoarYtumZRlV+EEyyTxo5lzbVXorG9C5vPU+0bYLXlJwLQ1tTMOuuuRUNTC16gMtjPJ1acsES8S8dcM0POeKiRztYYX0txM6vVsk6nxmCtJQgM0wcqHLB5lXP3a1NZLSlXuc4SLh1M+uSOMrm7nzCcc5ZQCIKQyowZHPWtr3LKz4/9r735vntlr5x8X8CYpkbEO6oi4AWReqLdCIEERLmA3oEqu3+6wjUHt6isNMJSPszIa6TD6CIcFE6e1i2Tp07H1juBgqetrY3lJ40zAP/414sSGY9LhVSEYkOBT6z80S2uPvbqGXLqPXnamwvUUkfWrsZjbCYs7w1GPFEEvYNV9tl0kEsO1kp3FZayWN1krcHNuQwu27cLaxbd/XfBZddz3AkXUmgO8MZR7enlgAP24sKTf84t9z4gexz0I4q5RpKkm/LgIOuvtxaP33vDRyOra/vkxLsbaG2J8ImrD40FY83IbhfGesIgpLsk7LVxhUsOUVmpsJTF7Kss6T7nxhL1/0AWYVlDJQVvLD5sxBuHp0TNzfz31CdULJiogMQBCfFH8p786PoZcuKdBdpa8phaSlrfeCPbRgywFmM8cWTpHkzZbf0hrjqsXWW1hKJlDcoHwqUJJqgSBhAYkw2tfFa64GoOk1QRn2DIYcIcURx9+LK6oU9+dXuUySpJSeY8B2Ow3hEFlt6yZ5f1ytzwLZWVCktZrEyeMl2y1nzziaAkmwHzi3B+xRqQmpAmjhQQE2ODeqWXFyT1SOpxkmSN9j7kS+34m3rll3dAa1MTJJ7Ug6lHnMORZ+ggiISeIdh5rTI36vIbHRIqSydxGICvEKWDBISkFvJ1YcVxRBBAnA4iTqhVE6gOfWiv7Rc398hxt0S0NDXiXVofJo/MPYxMPkSxYXolYse1S9x0hM4GqrCUDwnhPctT6kn3RZhz59ADvsznd9ianBWcNTgX0N7eCMDO229pHrvv9xKKwxtIvadYKHwo78QJf5ghP7klprm5AeNqeJkjshODsRAFAd3VKtutWuWOo1RWKizlQyNbmmNk9lHgzOLRurUWaaX7xDGdZuKYzvn++4YfQRfTX9w2ID+5KaCppYh1nmSWrmBS3y7M25QgjOkvC5uvUuHu7+sw8OOE5rCWrkBr7h8Nzw6KZFsoL6X85o5e+clNhqamZkgcznkCH8x8D0QQPFEIg/2w0bK9XPGtol4zGmEpH4mr6v0aZh0ajkRZmHoHgqVzVcPv7uqTY6+PaG5qwHiPExkZ/ppZxsFxZBgohay7Uj9XHtHEpGKk0ZVGWMqSF3hlW2QtyjqsJYXT7+uTH1xraWosEvmsa8TISua6rkWEKLQMlA3rLNPLtUcWWbZFZaXCUpaI8eCcawmzx8xNKZYWznugLD+4OqCxoUjgPYlYjPUMT0IIHnxKaEMGKo41x/Zz9eFNLN+sstIhofKRMuvQZ+4ZQ5/lr8zSc59e8FBJjr7GUSwUEe8ZWY1khgVtcN4SxxUGK46VOhKuPLLISh0qK42wlCVBWVnHgfrSk+HlJ3NYbak404sf6ZNvXC7ko0ZgFlnVxW2MRYBcAJVKAyu1V7n+Ow2sPiZWWamwlCVucDgiqvqauaUodXXpX/rl0AsNhSgPpkbqzVyLuq2FXGgppYYJ7X1cd1Qja47TXuwqLGUJiq/qAyEzc3hohpPPYsEEi7Sn+8Kw20mT5Ygr+9/3i7nh8QE5/BKhkCsSWKg5O8sFnInZOAgxDKUwtnmAK45sYK3xKqulBc1hLTXGMgv37x8S2540XR78VyfpK56GXL+cuGfzqF7Y758sy2GXGOK4BSHFOY/FIEbqgjYIQmCFQWdpzdW4/Ft5NpmQU1lphKUsiRGWgSx/M8sYcDiftSQIa7ffzpD7nm2isTlgfN5x+h9jjrlhwZHWjU9X5JDzLfgGsAnih8929jcgsjAgQke+yo1HWDZbIa+yUmEpSyLDtVbv+ZyPcES4y+nT5Q//aqKj1WBrCSWXp7k55sx7Q354c898X9mNTw7Jfmck1CwYI2QdbGRE0ILB4IkCSyIhXdEQV3zb8qmVNLJSYSlLJJOnTJ9tQnDOGUJjDFm3uo+GPU6dLLc82UhnY4B3Bm8sRhxeHI35HL+6JeC7188trXv+NSSHnFtDbJ7YWGoiI6sDjalry6VE4qk5oRD2c8G3GthyJY2sVFjKxyfamqW0YdY7138EIdbup/fL7c+309qcx9SqdZEGWG9wzuBSobWpkVPvyvG9G/tGXuCfX6zIgRdUqNk28pHBpdQnDWTk0jXiCKyn7HIEDHHeYQE7rKayWprRpPtSwPixncZkjVNmRlTDkRazF5V+mLw8pSzPvW2xUUToy1SCEGdD4hTEGPCCs0Lsoa2xgd/d0k9An3xh7YgDzk/oS5opBFIvXciEKwwn2YUgDKk6sGEflx8asfNaDSorjbCUj0VUtYCIC+cWcYOZBbPy2IL5w3diJsZD9JZiTGjJpw7E473gAeMMiXhSL7Q2NnHeXTG7nuHpHWomDoRU3Ih8rTFYIGvFbjBYYoa48FDLzuuprFRYyseGLJqSuUU1/KddkNYWD2uMi801R0cs31VCKg4bGBwua+gsWaQlHqwXjBFsmCNJCmA9rhYgftbzyFZEWmMQ8TjXx2kHRXxpvSaVlQpL+bjFWHOvxJlliGhj4saPpv/TBhPz5uajYpZpS5iRptggu+ysyR4jUq13prd4UucR8SP5uOw8wAcRgXhKvspJX8uz70YFldV/0xez7vy8dDBx3e1l8owBoiic7SbP/m5xqWP9T36CbTddh+pQud4q2BJYO9uYUuYYYGYzjjN/NFzTJQZcUmVsZwfHfOfgUUnj6ckV2eU3KW/1NtDc4EHAGsHN0sZY5tgoYviYxoC1ARZHf1rhjH1DDv2MJthVWMrHV1g9A0RhWL/h/WzRF2FEWnPI4BD4BIzNFt1ll0HW5UCYWaw1S2vl+s4NM4028ncP5RKHfvNrnHfSj0Ylj7+/XpI9f5cyrdxIUzHF1QLcHLKa7e8GrBjEQmgttaTCr7+a8I3NtQ/7fyM6S7jUfPXMrP6e9WaXevdN4xy50GLaWxDAmmCOljRu5LmZoILhf5j5M4bbDfv6msUAYy3nX3oTUT4vZ/78ewuUyEbLNZibj6nIfmcP8fa0IjZOEWfnvfkrghUDFkKBwfIAJ+5nVVb/xWgOa+m0V91Www9L1h/KkyQpLk1J648kSUiShDQZ/pkjTbPnzHyeG3n+nA+XJBTGdHLW+ddw5A9PHlW4/smJeXPdt3J0NJeYUXMEdpa+67MJy+AwBBh60irH72U5aktNsKuwlKWA+nKVer4nu+8txgSArf/37NHLrJIYnmGc7Wez5MJmD+ayGUnx9fKEapVCWyunn3ku3/7+T0clrU9MiM1VR4as0OipJAGhnfm7h/8MAksYGnqrJX65t/CD7VRWKixlKRkRmlmGhWZmshxmkZUZkda8opnZH3PocJaku4jB1BPlHkGcx1dLxB0tnHXOFRz1w9+MSlobL5M3N3w3YGJriYEamAjE1hffGAisJUlSfr6355itG1VWigpraWDylGlibUBWVjmrtGQkmhr1MHIOYc0mtvpuYcORHNbUR52SVaF7Q3HCJE674Hq+f/xpo5LW+hPz5qojQtpbylRLAbkAjA0ICZlR6uN/d6tx7Laas1JUWEsN48d2GWuyST+DBzzGCIE1WCMEdmabGWvNXH8PrMVaM8/HcENAa7OJRWMEMQI2+/8CY7D15TI2iPEYiuPG8Nszr+KYn54+KmltOClnbjjc0t5apuQD8rGlO63ywy8G/HAHHQYqs3ytalnD0hBhTZe1t9qT7u4+yEVZGDRcojAylrOzR1PG1L+vZN69smSWsaCZ7QfZ822Q/ZsDfLX+swKEBoNgcPjJb3P4d7/N6b/6n1FJ58+vVuQrZ6W83ef46W6WH39OZaWosJZKNtthb5neWyIu5BAv+PoGfTMrEmYf5g136TQ2a0Uz0mKZmZuyjgwUZy1/mOVP8R68YKzBWouxYfbztIr3CUEYUR4Y4mfHfJt9vvLFUcnnjueH5IlXK/zocx0qK0WFpSjKxxfNYSmKosJSFEVRYSmKosJSFEVRYSmKoqiwFEVRYSmKoqiwFEVRVFiKoqiwFEVRVFiKoigqLEVRVFiKoigqLEVRlPeDbvOlLNU8+tqQ3PaMIRTLNmvBFivr5qsfZ5boflhX3/hH+cvjzxJEFu8c1liCIMAGtt5Mc2a/cVPfqt3X980DGdk3z5og263YO7x3zLpRQ2BDrBESl9AQ5vjF/ztCL+jFyC9u75P+SkRoLUnNU6oKq4z3HLUYdsS54OEhOfqyGqWgkTiCmD5+sUuOw7eZ+1g//UO3PD05JLaCCSy11LPLurD/p1r1etAIa3Rc84d7ueXqO6C1AVyaicaamS19h1sA+/oux7P+3NZHvHVZIR7EZX8am7X4NTZ7jq9BrUJYyHHg/rvLystN1It0MXH+nyyv90TEkUUQkgFhwzVqHLXdoj3O5MFUfn1TjUrQQnsBIoGy6+SkO/v5/IZVWb4lN9tnfN8/8/z55QaiwCMW0gFPV2vC/p/Sz0yFNUqKDUXCzlYKrU045/CzRINmuEd5PaKy4ut7hxrEBFlf8Vla/fp6G2BjTb0VsBmOy7CSkEgzLbmIyKqrFictTZZiNSAfegILgyG0Ni76VOprU1O6kxxNOUEST1WEBgJKZXh1eoXlW3KzPb8hgMYGT0Mo2ACmi9AY6LWgwnofBOLBl/G+Iesdjp/5j+JmygvwGJxziGHkeSKCsQHWmJm9ycVg8dmwcXg4GQTZ0DCOCKzOQyxOail4b0jTbENq4+tR7iKmuRASU6FKQCCCSMAQQjkNaI3mvuzLqaGaSrbNmGRbjRmT6gemwho9ff39pNOmkUoAqTCyMV4WM83cV8EYiELCYguIw/ok28zFhPjBPqglEOZmDg29yx7U98YK4yxSS3Ikek0sVlwqGA82yPZNnHtD10XDWuNDs+3aXq54uEpjY0gijmpvlb02q7D+sp1zhU4mC8Ozy0sstv7lpqiwRs1OW3+GtrYGisVGxGfCmrmb8cx9XfL5iHd7+rntT38j9QGII0DwpUE2XHNFNvrkWngTYG2WvPfOZ/vt2ezCDIIQJ5BryLPCxHF6lS5GRCwGg61v+4oI3i+eiZ/LD202y3X1yN1Ph1TKAVt9Bk77aqeZ9+uSbKcyTJZKSD3Oe/3AVFij55uH7G2+yd6jeu5zL78ht933VwSDMZYwDKkmA+y268788IiDVEJLCJZsBhfq+UUz720RFxU/37XN/HzXUak0y3sagzeGFIPXMkUV1uKiNDCAS7IZHvHZ1ukEMYlz+ikvScKyWTTjvWDNzP1eP/rXZUb2ZEQM3gvO6xZ4S94X3lKDwbt09qvfudk2AV1UTJ489UO5kt+ZPE3eemvKUnXX2CDbdHUk/7iYcljvl2zfWTP7rtm89+t6e0b1Y/HZvNGTyht9yVJxHS01EZYRRpKkc+9T/MF4/tU35c+P/p3H/v40r7z2Ju9O62agVMY5TxTFUiw2Mn5MF2uttgLbbbEhX9xxqw9sxxdee1Nuv/shHnn8Kd58ewrdvQMMDQ6RJgmFQkFaWloY09nGqstPZJNPrsWWn9mQFT9Avdhj/3hOHn7sCZ56/jVee2syM7q7GRgYwHtPLopoLuaZNGE8n9pgXT63w+ZssPbqi974H9Ktc8Z9vfLXV4U4MAQBlBNYf5mEo3fomjvpbua4bozBzlHicuczg3L7k8Iz0zyTp1sqqaeYr0lnE0xqFzZbxfCF9UOWbS4s8D17/u1BOfmerLawljgwEU35Kkd/sYkVmmfWiJ18T5/c8++A3iGhWouI7QAXf7OZ1Ttz8z3GPc+V5K7nEp57N+bd7pQZpez8OhtTWaZD+MSyKVutEbD9qkWjwvqoviGR4X3VMVLfoh3JRPY+uen2e+WCK27kL0+9QG93L6QVCEOIYjARxgZgakh3iRdee5MHHniQM869iPXXWVt+8r+H88XtNx/1hTB52nT52e8u5tpb7qHn3anZOeRjbJjDWAsuYUapylszBvnnS69z/31/5lzj6ZgwkW023UAO+PIX2GnbTy/weJdee5tccNn1/O2Jp6mVa5AvQhTVk0h+5H0TLzzzwpv88b6/8Mtzr2TnrTeV475/GGuussIiubiz4bqvT/gKHkvgF0+gf9fTltueKBAWLAYh6RWmbNDD0TvMe6iR1fDVV0AE1Cd64Nk3y3LMdRXu+meOQGLinEWMh8DQUzO8NUN49CXHNY/VOPUux/d3HJDDtnzvyv3JA3DxgxEuyGcz1i4iDmG/rYUVmuHqvw7KT2+s8cKUHDZooLHgsGFIYGsk86m2ePjFIfnZTcK9L4C4mFwuIAoCnAkJxNM7BP+earn7Wcepd1b59Co98vNd82yyYsGosD7yASIgfuSiGy3b7XO43HvPI+ANcVMTDS0tiDQBKWIMBLnMi+IRcSAx5Dvx4nni+VfY5YDvctwPviE/OfrgBV4ETzz7gux98DG89Nq7hK0tFNrbsT7NRGVjnDEYsVhxYAJ8HEIhk0x/qcZ1t97HddfcyveOOkhOOv678zze25OnyZ6HHMtjj/8TTEqQayBfbMLYKPOUOLAgJsIYWz8vjzeexBtuuPlO/nTvn7j4rF/LF3fY0iwKYc3+IS2+pHscWcKiob1oMSL0CDQ2zfuSnzV1YIzBO09DwfPACzXZ84waPaVG2poiIusQ5xDAInix+EDI5QOsKfDuIPzg2ioPv94nl+3fMt8zCwNLsQFMaAnwgMcmObpiw2n39sgxV1nCfDudLQ7EZQs2rGCtxfq5f+0vbx2QX94GVWJaG2x2DuIJgcA6Emsx4ogFgtBStXnufT7Hv06tcep+Zdlzw4+HtMKlUVSCzFYV/36oVFNsrpl8sQGXlBHxpIkjqQxCmkCQr9d0AYEhDkOseFKEuLkZY2OOO/5UGosF+d5h+8z3Injz3emy+wFH8vrb3RS6OkjTEkldsG5gqL6kKMqWJLkEggACQ5gvEOfyREYI2hpJrGPjTT853/OZOL7LlFMkaGghij3OJXiEWrUGlUFIKkAAUQ7CCOKYOI4xSYIRS76llRkDg3zla4dz5x8ukc032cAs7Adk6isMTH1p1eJKYdkgm+lLEgciOB8g86mtEj+cSzM45ymE8PeXDTf8uUJ/rZHOpgQjnoFaSKmaJb2MteTCgIbIISab3CkEjiBu4MoHEmb09sltR85bWlUHlcQTW0/gDTXvKeRrnPMXx7l3ROQbGwmpICIkJsY4g0+zYWpiUiAe+V0/vKpbfnlnSHN7E+1SI0kdzuRInWWompDaAGscoQhRTggjR5iEjCsKlSDk6xc5rJRk940ajArrY8bxRx/Mdl/6BkKOai2B6hANzQ2svNKyLDNhHF1jxmLDiL7+fl58+VWef/FlMJZcYzM+SQmsELe08OPjf8PWn15fPrnWvHNAPz/lQl5/vZuGzmbScgUTxyRDg+QDw6c3XJdVVl+Frq42rPP09PXx5jtTePWNt3ntrSmUevsJGhuRUpktNliLL3/us+95oR156J4cfPiPieI2koESWOhqb2K5lcYxflwHbe3jCKKI6TNm8NyLr/HaK29g4pAotLhKlVwxT6m3ynf/77f8/Z6rFk4ixs6WyvLef+AvlwW6sX4sX0+ie+/nm+Cf1WNeDIW84fFXYsRY2gqeiouRWsJy7RVWbHM0NySkWP4zLeKZyZ6qydEVxSQ+xPmEsU2e2x9v4Pu/75OT9phbWokb/lI1IA6xFleNOffOFIICeVtjqGYpD0TkckMU8kJgI+Jcmcg0jvyesx4clF/eHtHUWSSQNDu+NfQNetoLg3xmNcNK46tYk/LiNMvTrxqm9hVpbBK8EwoS02OFwy+fwRrLhbLGmNiosD6s6MrUL86RIeFsGfhRsdVmG5ntttpA7rjxT2y4zZbss+vWbLPFp1hn9ZXm+Zvu/NPD8uNfn83fn36BuKmFNK0RBVDqSzj9/Cu56NTj585fTJkuN//xPoKWRnytRmADyqUKG6+3Bmed8D9ssO4a833Vz/zzRbnjob9xxe//yHOPPs63D91/ged00J47mZ//+nT5z+uT2XXnz/KlXXdk8w3XYZkJ8y6SPeuSG+THvziV3sEhgnwBlwpxexePP/0K19/2oHzp8wszNDQzPxjJZuUWV+HJcBW9F4ORBVwOZnhiUDDWYoBcHACeoapl5XEDHLl9wEGbNs71K37/TElOuWOQp18ukm+ISAUqBjqbQs64y/CFtcuy5apzDLk8GBGsFVIJCEyK8wGhCyHMjjmuqcpuWydst0bI+HZDIRAwDazUlbXIeb27Jr+8OSHf0kxQn930JgBf5ahtEg7YJmbd8bMf94V3K3LSPUNc8UhAHBeo+JSGKGB6XzNn3lnmjP1jjbA+rLFg9uUpCz0LdeyRh7HDFptx1Df3X+CNuePWm5kdt96MzXc5WB558mXifIz4Gqa1k/see3re0nnueaa+O5WguRUvIGmNxtBzwSk/Ze1VlnvPY66z5qpmnTVX5X++uS+XXH2z7PmFbUYljxOO/SbNzS18btstFvj8bx2wp1l7teVk5/2+R0kiQqkiOAwpN956J1/6/JYffHLECx/m/PrwMM/UZ/3eq8zFGFOvbBA8EGDpTQybLt/HpYcWWb593tHHHus0mD3WaeCwK3rkikdCGvJCmsT4XIIv5znjbseWq84ZaQqBzar9nfUYiYlEoFCjd8iy+WpDnHVAkVU7wvm+4HMfrDJ5sIGWJkuYVKmGeYJkiBP3shy6+byT/quNy5vz98uz/NhBOeWmMi5fwHihrSXizmervDS9Iqt0Lrk9w5baUt6FuSm22HRDMxpZzcoPjz4UI2m2flGEIAh4693pPPS3p+d6KZOn9mCcJ7SWwAakTmhvb1mgrObkgK/sOurn7737F8xoZDXM5ptuZPb7ym64gUFMEIJLkMDz+FNPL6xBZj4W+zUwe0y1oMoqM1LImi3TSdOEZTqGuPjQhvnKalbO27fNbLTCEP2lFBvUMM7Q3Gp55HXHM+/OXgcVWIiCLNq0OHIuBSt0l/NsMKmXe7/XYt5LVgC3Pyk0xrkst2oDBgaq7P2pGoduvuAE+o+2bzQbrywMVcB4j1jPm715/vDUkl1orWsPFhFrrLwCHa1FkloFRLC+hh/o4z+vvznXcxuKDUiuQGACRIQojnj7rclcddPtS1Rx39afWhdDldQbcB7CkKnTunnh1Tfkg/vqQzxFmdlEaDSR37DRvHjAMpB6frSTsGJ7btSiP3bHECuCszGxt1gD07tD7nq2OvuNZ7PqekvW+qgaGKqh0MggJ+xdWOBxbniiLC9NzRGHKSKGslia8zUO+mzDqN+eXTZy1KoJQkjqPSZxPPYKKqwPaUQ48p068t/GYPhwotvlJ401LTmB6iAikq2ZE0epVJ7ruWuusRL5xiZSRzZrJQlEMd/43i85+v/9Th549B/y9rvTPnJ5TZw4ARN4xDvAEgQxiRfK8zin95VonO1zy7o2LJ7hINls3vD6RZl/CYUxFsTWZxEt5Ros2+446NPN7+sC2mmdoll3WYereRIjpDVLkoY88dLs5xgE2bXpPPXrBWply5ZrW7YaRUHn31+uUq6BeJctcapU2Xz1gA0mjl6un1ktR2OckIoh8BDnAqb3LNkThUtRDsvMnlJdRMU99/75Mfn3C6/w9rvTmdrbz9BQGZ+mxHFEsbGRtsYCnS2NRIUiQ1WHseHIAmyCcJ5p3jVXWd5sueEactedD9HQ2UZSswRRnrI3nHLWZZx64ZWMH9POpAkTZNKEcUyaNI4J47pYYdI4Vl95edZZfeUPfHJvT+2Wx5/+Jy+/8iZTpnYzo6eXoVIJwpg4F1GMQpriiPET2pnSV8EEcVbPZurnZDwLX6peb6L4ASZF3q+x5ozo5pfDGukmI54gMAyWE9aa8MGaDa013vDEq56oWBdKaHizz80lSI/gEcQHSOhJk5St1hjdG/Kf6WBsSFp/zXkrDAxZfn77DKm5CBtm49vUCc4YArJeX4HxOGcZEujpF8IoZng6IopD+ssVFdaHmbQaTpwuzH3wymtvyJkXXsXN9zzCa6+/A5US2BjifH0qst6u2VhIa5BWIQyxTc0EUS67wbHZjTmfIdCvjv0mf3nkMQZ6Z1Bs7cQ7AWrEbU0gAZN7h3hn+ov87amXZrZ2dtBQCFl95Ymy0/Zbsv/eu7Hq8pNGdar3/uUfcsEVN/DQw39n8jvd2XRqGGZ/BgHYEPBZ3VetClKFKCYsNo8E4mLMcE+DDx7Sm3oNVj0MNqMasC3M95iZ5btL5ltI7D14PGKFwGStuFcY88FmzMY2QeqytH3Wqs0wWJ59MON8va2OtRjrEbF441itIxjVMaaXQ3KBwVgwTvC5Bp58w/Pwy2GWFzPZuTvJpkuCepI/xJCkUHOCsY6GhpCYLIIWL/QOed7oL8tolhepsBbqy9TPNhQcfrzfOalrbrlPvn3sicx4+21sQ558Q56gsYgNAsSE2awePhtqGMGaBoan6pO0iheTFX3aAFxWZzQv1lvnE+aGK8+WbxzxA157bRo0txHFESECJiSKQ3w+S/4aAbyQSEI1SXjiX6/zxFMXc+alv+f4Y74lhx/45fe8uH5w3O/kpPOuAZ8jyEHcUiQOI2wQ1G9U8MYieIx47PDCX+dJEoc1HjEB1ljELVz/KqnfSJhZB+uL6d4ws/9V6vmieQsrK9o1WCwQhiFNxQ/WDysX2bqcs/c0DAzpHL8qSYWaE+Iok4kRSxR7Woqjk2SpKljjsZJ1F0MS4tBTyOVweAxgra1PJHgEgx8eEotky7DE1jdlCTDi69euEJold1i4lA0JZw24TL3UZ/Q317W33C1f/eaPMLkixbFjSZIazgRUBktQ7gcbYRubCKIQXysjLsEbAw6oOUxzE2FkESxiLHUVzPd422+2oXn1yfv56W/Pk+tvv5cXXn2D8kA5i2iiHIQWApM1GTSGMAwJowBCwQYBg4lwxP+cSLlSkx98c995XmXHHP87OemkC8hNHI81Bp8kGITB/iFIUjBCkM8T5XJIWiOplutdL7JcjmnuICTFDvew8u49z2mBye1ZRu7Z8EwW6yVhMIj4rO3xe6RszfCSSqm/Ludx6Qc7T5F65FTvkBtYQxjKHBGWYab3DaExFGJDbpQVBQ1hgKufm8NhJCaRGkmpROrtSBQcZP188JIF0yJZlGuMEJjsk0xcFYuQ+pAxjcKEpiW3rGHp6dZQX7Q6kmGR4STr6N77t96dIUf97y+RMCYXWqpOMDYi6ZnOJz6xAjtvvzfrfmI1xo8bT6FYQLzHpwmDpTKlUpnX357CCadcQM9QBRvFIze4MQue1/jJ9w4zP/neYfzl8aflqede5PkXX+ONd6YxZfo0umf00D2jh/7+Acr9AsUmokIO0gpxGEDbWP7fL05jy43Xlo03WHe2k33o0X/Ib865lmj8RExaIzXgkypuqI/PfGoDdtx2a1ZbaTnGdHaSa8jhvaNWq1IaGsIlnr8/8wK/POdqJLDg0yyyZCG7cM72uSxeYWV5dpk9spvfUNUaTJBF5M4b0sTz5owP1tN92pAQGluPrgURQ/McVREyR/saY4QwsASj/ILtakrB5OoLyS1DZc9266YcuElABRDjEcl+7/Cw2wn1KJL6l2D2CpzPojEvnvaGvOawPrqU1uh7Ld142z1MeWca+TEduCTFRDncYC/fP/IgfnPc0aOy3oVX3CTd/W8QRFKPUjzvZxOeT2+4rvn0huvOnWB9a7JMnjyFvz75HOddfSv/fuktomKBJK0SBlUqA/1cfM3NbLzB7P/vZdfcCtUU25iAM4ikxFLjtJN/yiH7f3mBr2zllZaXk865EicBgsc7wSILNZ8x3Gt0+KYxZuEd+F5HG8lpLuAysNZgg+EbO2ub/dzbH+yFPfuWIwyH976ENHG0zDnxN4tA67Es9d4VozrG+BYQSbO9OiUkCco0Gdhjk8JS3V13KStrmHVAOFxXM7rP729PPIOJslYfxnqSwUE23nCdUcvqnSnTpa+cZG1hRvZAZL6Lbd8Py08abzbdaD3zncP2Nf+6/1rz6fVXww/0Z1FBWsXkc7zw8htz/X9PPvc8RBbrUkwQkPb2cMBeu4xKVgBvvPUOlSTNNqStJ4nN8AzoB/2c6kOzLKdSz5uIW0zXxMw8mZhhSch8Az/IquEFTyEPr06BR/8z9L5CwMdeLck//hMS5STbzMIakiRhubEyR6RgiEKDDYajHIdPR/++rj7RUqsNL/VPKBRz/O2NkBe7a6LC+rjJS2bZUGeUCd1p3d2INXjqG69Wymy43lqjPubT/3yBd954I8sxSX2Rrw0WS/BwyFd2ww0N1csNAiRXpFSb+6af0T8AUR4xUf2GjdjyM5uM+jgP/O1pJHFYUvDZOVkbLFQXV1uvjRPv8VKflYvdYrq4zUiCf9a4e95Jd/AuG/IahDgEocBv7y69r2P+9u6UShLVk9pVREKCnLD5qtFsz4uG9/eVLN50IqSOUS8E32qNiPbmKiUPYgIajWHqkOWcO0uosD42Q8B5J1NHdyPZrKUyBksEUcD06TNGffxfnHohYgIY7j4w3ExwPsJ8a1qP7LLfkXLvnx9/39+IU6dNh8DOzNU5TxzPPbsU5XJgIlw9l0EQ8m7v0KiO8a+X/iPnX3krQbEZn6aIrc98WrtQWadh2Q0vTDYiNATB4rkoDDPX45jZj/9eV5E1lhQhXzDc/XgT37t2dFHWL+4ekD8+lae1McQ7MBJQqlVZsc2z1/qzD9WywlHJhsOSRZypG30f+dXG5MxOa6YkNZDAkroKNg446/6Yk/80MOqP6JKHB2Tb06bJO6WPRwvlpSfpzszEO2a4dcfoP4Nx48dhvGTi8kLU2MTtdz3AfQ88Jtts9an597V6+135xv+eyCOPv0Dc3IJPsh5Gw9uSzW9f1vMuv4lb/vAQdz3yOF/6/A5y2D67sPmn1lugXu/481/l5At+T9DSmuWCjGDKvSzT1TrXcyeM7eLl16ZjI4N3CbahyNmXXc8Xt/m0rLDs+Pke68FHn5CDv3McM/qGKEZCrV5PZE0WfyzM3gzDOcXhwlFjDFMGLLc+NyRWLC611ERG8k+BySZLh+XjMbMsRxQiI9QMjGlI2GyV2avSzaxiHMmZLWDxM1n3WuMFV7NEccgpdw0ytb9HfvDFPOuMnTtH9Oy0ITn5tio3/DVPnA9wTohwRFFAz0CFfTaVeefXROrba5p6pEVW2zdKjto2z51PVXFicS5HgCPI5fjx1SnTewbl4G0iVmydd+X7k29W5PQ/1bjsMYsrt3PIeQP88TutKqwPLVQ0BsI4a12LG16XkRVcjoJtt9iES66+A2xA6soYDEOlEnse+B2+fuDe8oUdNmfZZSaxzISx5j9vT5YXX3mDex98lCuuu5HJ7/YQt40jqVWIA4t4MCYAM++396W3JstZ511KobMLCT1X3HAn19x6H6uvOFE2XHMl1lhleZadNInWthbECH39Q7z8yms8/OjfufeRf+BMnlwuyiqlozziPF/cYau5jvPpDdbiwfsewxZa8GlCEBV44bXJfHb3Qzls311k6y02YcKE8Sw7rsu88Mrr8q8XX+Xmux/muhtvo5oKUaGBNKnho2I2LARMksBC7ESU+ixHZGy2A3QceJ6fHPCVU8GRbXjqfGYnYwMCk21pb4zJ9sCVbNg03IUhCi21Gmy2UpWH/m/uY2U1ZhAgWZHlfIRlrWT5q3reUYBaTSBOaG2OufmJPI++VGODlftl9bFQiAzlxPH8ZMOf/w2TexppaQpxzhOklnxoGPSez6zi+b9d5u6cIAhist0ZRVK8z479fgbbG61YMAdv1ye/vrFGc2sDNvUUjcfkA06523L5XwfYYNlE1l3OM6E1JHHw6lTHU284nnwrZKjUSLFQIwzgzidzHHhhv1x8cLP2w/rQhoXi6sWiw43iRl84+tXddjAnnX25PPXcq+SaCqTVCkEupi91nPi78/j1ORfR2TmeONcglUqF7r5+KJWhIUe+qZla33SamlsopSnGxtkQKgiY1yX4o+NOpnvKNAoTJ+CqhnxzI957nnv+Pzz31L9BUohz2QOTrcYvl8A4gqYWQmvAOYJ8I5Vp0/ji7juz1x6fm+tAB+6zG2dfeBV9pZR8Q5E0rRLnCrw5tYcfHXcyQbFAa3sHURRLqero7x8ClxC1NBKWq0ilRNhQIEmqYIOF6uQ6jEsdToR4OLfkfbZIOYDQegrWZkPp4Rm04ajHDUdVHmNstvMOYAJDOXCYODfXsZK0Hl3VZwq9eNLEL2BImM3111KYOLbC1BlCzTfQmC/RO1TgD08I1yVptiKACII8zVFAa1ONBE+UQhCl9NYCuvIVzvxaNM8jJUn2iOLhoucwk+r7XFd54m4t5qW3uuWmJ6CrKSZ1Kc7F5CJhRn8LNz/huPkJQy7OorkkCSEQ8oWYxpxgkoAosDQ157j6wYTDtijLpqsUtL3MYpeVl2zGDI8JAkwQYMMI8z7yI2ef8H0aI091Rje5MMDYgDCKKHS1YwvNTOsv887UXvoGqhRyDTSN7SIIYyrvvMmPjjqQT31ybdxAf/ZtbQQraX3l/+ysMGk8+aZWytN6cT4F77HOUciHFDtaaegaS765hThXIM4VyBcbaejopNDRSRDFhGGM847KW6+zxWbr8oeLT57nBbbK8pPM6b/+P0x1iEo1IReH4B1RnKOhcww2aqCnv8KUGYMMVQcoNOZobu8gLaVQG+LE445m7LixSLVMaDxGhCCMsOEH/56zwfDGIJmIbBDM3BPQD3dNyJYiiXh8vYDTOZ/10pJZG/MJiCdxUKnNK+rzGOvJdhXLIt80cfOJsBjpKRiGUK54dt3IcPKeAdVymYFyIy70FCPoKsS0F/O0Nca0FwQT1UgJKZAg+ZTukqUtP4PzDwtYd+K8izBTX0+wm0yokTUU8pYoeP+35I1HdJiDNy/TXU5xSURgs++B0AodBcOYRigWYhoLAe2NAY35mMg7jIfUBPRUUiY2DHDldwOWZFktVcLyItTKZZJymUo1oZp4fOJI3ke18qc2XM/cds2ZrLLCGEpT3qI2VEYkwkkOG+bIRYZcUMNQplzqZ2BKN3lr+NVJx/GzHx5phkr9SK1KrTRAZagfPziAS+cuPjzxuKPNX+64mK8f8CU6CjGVKW9TmTGFcqVMJYWat4h3mLSESYfwrko1qVGuJtQqNSo9vcQGjjhyPx68+aL3vMD23WNnc+3lpzCurYHS5HepDQ2ReENNLCYIyOdC8qFAklKe0U3/W68yaWwTN15xGkcf8hXT11/CO0ulUiGp1khTz0ItpbERNRdQrgilqlCuCpXEUk3rj8RSqQaUq5ZK1VKuWso1QyWpP2pQSaBcEyo1oZwItZql5sw8rgmL+ICas1Rq4CuQyLwvebG2/vuFUi0bFroqHPjZgrnka47mhhn09ngGK0IFQxIYUmPw3mLSmFpq6B2KSUuGXdbt5+5jm9n+E/PvkR5GHuehUoNSTaikQroQzQ0vOKjDnLtPlbGt/fQMJvRVPVVvSAlwWII0xXlDTQJIs6U93QMJSbnMlzYc5LZj8uyxXlF7un9Y5HMxKy47htSERGFElC8y1BjQUSy8r9+z5aYbmBf/djennnu53Hjnw/zr1bfpHiwhQyWoDoF3xLkCK04cyw7bbc03D/gSa6+aNd5bZmIXy6wwiXyhABhqLQU6WuedyPzkmquZc078H354xNfk9nsf4u4H/sK/X3mTKT0V+ktl0vIgVAezcVAUEcY52ppbWW2lZdlui0348m6fY62VR9fwb8/PfdZsusE6ct5FV3Hb/Y/yyuQeBvr7SYcGqRmDzeUo5vOsvOIy7LLzVhx24FcY39FuAFZfcQJv5iNC8ThjaAg8uYWIsFbtKBFai/W1eiosK9g0IzOqMlveceaC63reShzWGoLhIaoRyiXL8h1loDjbsSa2J6wwVshHkCZCKfYs21ab5+tarmWI5TpSYmOwJqDU5OhqzPSxz2bNZv3VanLePYPc80+YOpAjqSYMuhgnnqYYJjYJG67r+NrmOXZeu32Bn0tjwbDm+ISahzSFIExoNmk9hPhg7+8hn20xO27o5MbHhrjzmRovTc0xWDKUqsJQavFAMfC0FgxrTHRstopn1w0LbLZy28em2NQsCbvuLsm8PnmKvPVuN9OnTqNcrlAsFFhmfBfrrbPGYvmQX3vrbZna3Ud/dy+DpSGcQGNjkc7OdsZ3dTBxXNdCH/fVN9+Wd6Z0M/ndqaTO0d7exoqTxrHKCssa/cQXzHPv1OTt/ho9Q0IxFJZpCVhv+SUzOnnmzbK80+/pHcp61Xc2wcSO4D03YlVhKYqiaA5LURQVlqIoigpLURRFhaUoigpLURRFhaUoiqLCUhRFhaUoiqLCUhRFUWEpiqLCUhRFUWEpiqKosBRFUWEpiqKosBRFUVRYiqKosBRFUVRYiqIoKixFUVRYiqIoKixFURQVlqIoKixFURQVlqIoKixFURQVlqIoigpLURQVlqIoigpLURRFhaUoigpLURRFhaUoiqLCUhRFhaUoiqLCUhRFUWEpiqLCUhRFUWEpiqKosBRFUWEpiqKosBRFUVRYiqKosBRFUVRYiqIoKixFUVRYiqIoKixFURQVlqIoKixFURQVlqIoigpLURQVlqIoigpLURQVlqIoigpLURRFhaUoigpLURRFhaUoiqLCUhRFhaUoiqLCUhRFUWEpiqLCUhRFUWEpiqKosBRFUWEpiqKosBRFUVRYiqKosBRFUVRYiqIoKixFUVRYiqIoKixFURQVlqIoKixFURQVlqIoigpLURQVlqIoigpLURRFhaUoigpLURRFhaUoigpLURRFhaUoiqLCUhRFhaUoiqLCUhRFUWEpiqLCUhRFUWEpiqKosBRFUWEpiqKosBRFUVRYiqKosBRFUVRYiqIoKixFUVRYiqIoHwn/H3F2tGldM+GvAAAAAElFTkSuQmCC";

export default function TasaLibre() {
  const [screen, setScreen] = useState("hero"); // hero | wizard | contact | loading | result | admin-login | admin
  const [step, setStep] = useState(1);

  // Property
  const [tipo, setTipo] = useState("departamento");
  const [barrio, setBarrio] = useState("");
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [provincia, setProvincia] = useState("Buenos Aires");
  const [operacion, setOperacion] = useState("venta");
  const [supTotal, setSupTotal] = useState("");
  const [supCub, setSupCub] = useState("");
  const [antiguedad, setAntiguedad] = useState("");
  const [ambientes, setAmbientes] = useState("3");
  const [dormitorios, setDormitorios] = useState("2");
  const [banos, setBanos] = useState("2");
  const [amenities, setAmenities] = useState([]);
  const [estado, setEstado] = useState("muy_bueno");
  const [photos, setPhotos] = useState(Array(6).fill(null));

  // Contact — solo nombre y whatsapp
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Casa extras
  const [casaSubtipo, setCasaSubtipo] = useState(""); // "tradicional" | "cerrado"
  const [casaNombreBarrio, setCasaNombreBarrio] = useState("");

  // Departamento extras
  const [piso, setPiso] = useState("");
  const [ascensor, setAscensor] = useState(false);
  const [balcon, setBalcon] = useState(false);
  const [disposicion, setDisposicion] = useState("");
  const [orientacion, setOrientacion] = useState("");
  const [hallEstado, setHallEstado] = useState("");
  const [expensas, setExpensas] = useState(""); // "frente" | "contrafrente"

  // PH extras
  const [phUbicacion, setPhUbicacion] = useState("");
  const [phAlFrente, setPhAlFrente] = useState(false);
  const [phPasillo, setPhPasillo] = useState(false);
  const [phEscalera, setPhEscalera] = useState("");
  const [phAccesoEstado, setPhAccesoEstado] = useState("");

  // Lote extras
  const [loteSubtipo, setLoteSubtipo] = useState(""); // "cerrado" | "urbano"
  const [barrioPrivado, setBarrioPrivado] = useState(false);
  const [nombreBarrioPrivado, setNombreBarrioPrivado] = useState("");
  const [zonificacion, setZonificacion] = useState("");
  const [loteAdicionales, setLoteAdicionales] = useState([]);
  const [loteFondo, setLoteFondo] = useState("");
  const [loteFrente, setLoteFrente] = useState("");
  const [loteConEdificacion, setLoteConEdificacion] = useState(false);

  // Local extras
  const [alturaVigas, setAlturaVigas] = useState(false);
  const [vidriera, setVidriera] = useState(false);
  const [cortinasMetalicas, setCortinasMetalicas] = useState(false);
  const [entrepiso, setEntrepiso] = useState(false);

  // State
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState(null);
  const [errPhoto, setErrPhoto] = useState(false);
  const [errBarrio, setErrBarrio] = useState(false);
  const [apiError, setApiError] = useState("");
  const [rawDebug, setRawDebug] = useState("");

  // Admin
  const [adminPass, setAdminPass] = useState("");
  const [adminErr, setAdminErr] = useState("");
  const [leads, setLeads] = useState([]);
  const [leadStatuses, setLeadStatuses] = useState({}); // {id: "pendiente"|"contactado"|"en_proceso"|"cerrado"}

  const fileRef = useRef(null);
  const slotRef = useRef(0);
  const timerRef = useRef(null);
  const nombreRef = useRef(null);

  useEffect(() => {
    if (screen === "admin") loadLeads();
  }, [screen]);

  useEffect(() => {
    if (screen === "contact" && nombreRef.current) {
      setTimeout(() => nombreRef.current && nombreRef.current.focus(), 100);
    }
  }, [screen]);

  const loadLeads = async () => {
    try {
      const r = await fetch("/api/leads");
      if (r.ok) {
        const data = await r.json();
        setLeads(data);
        const statuses = {};
        data.forEach(l => { if (l.status) statuses[l.id] = l.status; });
        setLeadStatuses(statuses);
      }
    } catch(e) { setLeads([]); }
  };

  const updateLeadStatus = async (id, status) => {
    const updated = { ...leadStatuses, [id]: status };
    setLeadStatuses(updated);
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
    } catch(e) {}
  };

  const saveLead = async (lead) => {
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });
    } catch(e) {
      console.error("Error guardando lead:", e);
    }
  };

  const toggleAmenity = v => setAmenities(a => a.includes(v) ? a.filter(x=>x!==v) : [...a,v]);
  const openFile = idx => {
    slotRef.current = idx;
    // iOS Safari requires input to be in DOM and visible briefly
    const input = fileRef.current;
    input.value = "";
    // Force synchronous click
    input.style.display = "block";
    input.click();
    setTimeout(() => { input.style.display = "none"; }, 100);
  };
  // Smart adaptive compression:
  // 1024px is plenty for AI to detect materials, humidity, finishes
  // Tries quality 0.82 first, if still too big reduces further
  const compressImage = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1024; // enough detail for AI analysis
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        // Try quality levels until under 400KB base64 (~300KB actual)
        const TARGET = 400 * 1024;
        let quality = 0.82;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        while (dataUrl.length > TARGET && quality > 0.35) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        const byteStr = atob(dataUrl.split(",")[1]);
        const arr = new Uint8Array(byteStr.length);
        for (let i = 0; i < byteStr.length; i++) arr[i] = byteStr.charCodeAt(i);
        const jpegFile = new File([arr], "photo.jpg", { type: "image/jpeg" });
        resolve({ dataUrl, file: jpegFile });
      };
      img.onerror = () => resolve({ dataUrl: ev.target.result, file });
      img.src = ev.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

  const onFile = async e => {
    const file = e.target.files[0]; if (!file) return;
    const result = await compressImage(file);
    if (result) {
      setPhotos(prev => { const n=[...prev]; n[slotRef.current]=result; return n; });
    }
  };

  const goStep = n => {
    if (n > 1 && step === 1) {
      if (tipo === "casa" && !casaSubtipo) { setErrBarrio(true); return; }
      if (!barrio.trim() && tipo !== "casa") { setErrBarrio(true); return; }
      if (tipo === "casa" && casaSubtipo === "cerrado" && !barrio.trim()) { setErrBarrio(true); return; }
      if (tipo === "casa" && casaSubtipo === "tradicional" && !barrio.trim()) { setErrBarrio(true); return; }
    }
    setErrBarrio(false); setStep(n); window.scrollTo(0, 0);
  };

  const goContact = () => {
    const valid = photos.filter(Boolean);
    const minPhotos = tipo === "lote" ? 1 : 2;
    if (valid.length < minPhotos) { setErrPhoto(true); return; }
    setErrPhoto(false);
    setScreen("contact");
    window.scrollTo(0, 0);
  };



  
  // ─── Generador de PDF via print ─────────────────────────────────────────
  const generatePDF = (result, address, photos = []) => {
    const fmt = n => 'USD ' + Number(n).toLocaleString('es-AR');
    const today = new Date().toLocaleDateString('es-AR', { day:'2-digit', month:'long', year:'numeric' });
    const comps = (result.comparables || []).filter(c => c.precio_usd > 0 && c.m2 > 0);
    const avgM2 = comps.length ? Math.round(comps.reduce((s,c) => s + c.precio_usd/c.m2, 0) / comps.length) : 0;

    const factorIcon = t => t === 'pos' ? '▲' : t === 'neg' ? '▼' : '→';
    const factorColor = t => t === 'pos' ? '#16A34A' : t === 'neg' ? '#DC2626' : '#1B4FD8';
    const factorBg = t => t === 'pos' ? '#DCFCE7' : t === 'neg' ? '#FEE2E2' : '#EEF3FF';

    const scoresHtml = (result.scores||[]).map(s => `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="font-size:11px;color:#556070;width:100px;flex-shrink:0;">${s.nombre}</span>
        <div style="flex:1;height:6px;background:#E2E8F0;border-radius:3px;">
          <div style="width:${s.valor*10}%;height:100%;background:#1B4FD8;border-radius:3px;"></div>
        </div>
        <span style="font-size:11px;font-weight:700;color:#1B4FD8;width:32px;text-align:right;">${s.valor}/10</span>
      </div>`).join('');

    const comparablesHtml = (result.comparables||[]).map((c,i) => `
      <div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid #F1F5F9;background:${i%2===0?'#F8FAFC':'white'};padding:8px 10px;margin:0 -10px;">
        <div>
          <div style="font-size:11px;font-weight:600;color:#0F1923;">${c.direccion}</div>
          <div style="font-size:10px;color:#8896A5;margin-top:2px;">${c.barrio} · ${c.m2} m² · ${c.fuente}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:13px;font-weight:700;color:#1B4FD8;">${fmt(c.precio_usd)}</div>
          <div style="font-size:10px;color:#8896A5;">USD ${Math.round(c.precio_usd/c.m2)}/m²</div>
        </div>
      </div>`).join('');

    const factoresHtml = (result.factores||[]).map(f => `
      <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #F1F5F9;">
        <div style="width:24px;height:24px;border-radius:50%;background:${factorBg(f.tipo)};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;font-weight:700;color:${factorColor(f.tipo)};">${factorIcon(f.tipo)}</div>
        <div style="flex:1;">
          <div style="font-size:11px;font-weight:600;color:#0F1923;">${f.titulo} <span style="font-weight:400;color:#556070;">— ${f.descripcion}</span></div>
          <div style="font-size:10px;color:${factorColor(f.tipo)};font-weight:600;margin-top:2px;">${f.impacto}</div>
        </div>
      </div>`).join('');

    const validPhotos = (photos || []).filter(p => p && p.dataUrl);
    const fotosHtml = validPhotos.length > 0 ? `
      <div style="margin-top:24px;">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8896A5;margin-bottom:12px;">FOTOS DE LA PROPIEDAD</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
          ${validPhotos.map(p => `<img src="${p.dataUrl}" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;border:1px solid #E2E8F0;"/>`).join('')}
        </div>
      </div>` : '';


    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>TasaLibre — Informe de Tasación</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; color: #0F1923; background: white; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      @page { margin: 0; size: A4; }
    }
    .page { max-width: 794px; margin: 0 auto; padding: 0; }
    .header { background: #1B4FD8; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; }
    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-mark { width: 36px; height: 36px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .logo-text { font-size: 22px; font-weight: 700; color: white; }
    .logo-text span { font-weight: 300; }
    .header-right { text-align: right; }
    .header-date { font-size: 11px; color: rgba(255,255,255,0.7); }
    .badge { display: inline-flex; align-items: center; gap: 5px; background: #0EA66B; color: white; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 100px; margin-top: 6px; }
    .price-hero { background: #1B4FD8; padding: 28px 32px; text-align: center; margin-bottom: 24px; }
    .price-main { font-size: 44px; font-weight: 700; color: white; line-height: 1; margin-bottom: 8px; }
    .price-range { font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 6px; }
    .price-addr { font-size: 11px; color: rgba(255,255,255,0.5); }
    .content { padding: 0 32px 32px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .card { background: #F7F8FC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px; }
    .card-full { background: white; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px; margin-bottom: 14px; }
    .card-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #8896A5; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #E2E8F0; }
    .avg-price { text-align: center; padding: 12px 0; }
    .avg-price-num { font-size: 28px; font-weight: 700; color: #1B4FD8; }
    .avg-price-label { font-size: 10px; color: #8896A5; margin-top: 4px; }
    .footer { background: #1B4FD8; padding: 12px 32px; text-align: center; margin-top: 24px; }
    .footer p { font-size: 9px; color: rgba(255,255,255,0.6); margin-bottom: 4px; }
    .footer strong { color: white; font-size: 11px; }
    .print-btn { position: fixed; bottom: 24px; right: 24px; background: #1B4FD8; color: white; border: none; padding: 14px 24px; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 8px 24px rgba(27,79,216,0.4); z-index: 999; display: flex; align-items: center; gap: 8px; }
    .print-btn:hover { background: #1640B8; }
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-mark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B4FD8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
      <div>
        <div class="logo-text">Tasa<span>Libre</span></div>
        <div style="font-size:10px;color:rgba(255,255,255,0.6);margin-top:2px;">Tasación Inteligente · Argentina</div>
      </div>
    </div>
    <div class="header-right">
      <div class="header-date">${today}</div>
      <div class="header-date" style="margin-top:2px;">Informe de Tasación</div>
      <div class="badge">✓ Tasación Completada</div>
    </div>
  </div>

  <div class="price-hero">
    <div class="price-main">${fmt(result.valor_usd)}</div>
    <div class="price-range">Rango: ${fmt(result.rango_min_usd)} — ${fmt(result.rango_max_usd)} · ${fmt(result.precio_m2_usd)}/m²</div>
    <div class="price-addr">${address}</div>
  </div>

  <div class="content">
    <div class="grid-2">
      <div class="card">
        <div class="card-title">Estado del inmueble</div>
        ${scoresHtml}
      </div>
      <div class="card">
        <div class="card-title">Precio promedio/m²</div>
        ${avgM2 > 0 ? `
        <div class="avg-price">
          <div class="avg-price-num">USD ${avgM2.toLocaleString('es-AR')}</div>
          <div class="avg-price-label">precio promedio por m²</div>
          <div class="avg-price-label">en base a ${comps.length} comparables</div>
        </div>` : '<div style="color:#8896A5;font-size:11px;text-align:center;padding:20px 0;">Sin datos suficientes</div>'}
      </div>
    </div>

    <div class="card-full">
      <div class="card-title">Comparables de mercado</div>
      ${comparablesHtml}
    </div>

    <div class="card-full">
      <div class="card-title">Factores que influyen en el precio</div>
      ${factoresHtml}
    </div>

    ${result.analisis ? `
    <div class="card-full">
      <div class="card-title">Análisis detallado</div>
      <p style="font-size:12px;color:#556070;line-height:1.8;">${result.analisis}</p>
    </div>` : ''}
  ${fotosHtml}
  </div>

  <div class="footer">
    <p>Tasación orientativa generada por inteligencia artificial con datos de mercado públicos. Para una valuación oficial consultá con un martillero matriculado.</p>
    <strong>TasaLibre.com.ar</strong>
  </div>
</div>

<button class="print-btn no-print" onclick="window.print()">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
  Guardar como PDF
</button>

<script>
  // Auto-trigger print on load for better UX
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Don't auto-print, let user click the button
    }, 500);
  });
</script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) {
      alert('Por favor habilitá las ventanas emergentes para descargar el PDF.');
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };



  // ─── API Call ─────────────────────────────────────────────────────────────
  const callApi = async (skipContact = false) => {
    setApiError("");
    setRawDebug("");
    setScreen("loading");
    setLoadStep(1);
    window.scrollTo(0, 0);

    const controller = new AbortController();
    const globalTimeout = setTimeout(() => controller.abort(), 120000);

    const esCasaCerrada = tipo === "casa" && casaSubtipo === "cerrado";
    const address = esCasaCerrada
      ? [casaNombreBarrio, barrio, provincia].filter(Boolean).join(", ")
      : [calle, numero, barrio, provincia].filter(Boolean).join(", ");

    try {
      const calleRef = calle ? calle + " " : "";
      const zonaRef = barrio + " " + provincia;
      const supRef = supTotal ? supTotal + "m2 " : "";
      const dormRef = (tipo === "departamento" || tipo === "casa" || tipo === "ph") ? dormitorios + " dormitorios " : "";

      const buildQueries = () => {
        if (tipo === "lote" && loteSubtipo === "cerrado") {
          return [
            nombreBarrioPrivado + " lote venta precio dolares zonaprop",
            nombreBarrioPrivado + " terreno venta dolares argenprop",
            nombreBarrioPrivado + " " + barrio + " lote venta precio dolares",
          ];
        }
        if (tipo === "lote" && loteSubtipo === "urbano") {
          return [
            "lote venta " + calleRef + barrio + " " + provincia + " precio dolares zonaprop",
            "terreno venta " + barrio + " " + provincia + " " + supRef + "precio dolares argenprop",
            "lote urbano " + barrio + " " + provincia + " venta dolares mercadolibre inmuebles",
          ];
        }
        if (tipo === "departamento") {
          const cocheraFilter = amenities.includes("Cochera") ? "con cochera " : "sin cochera ";
          return [
            "departamento venta " + calleRef + barrio + " " + provincia + " " + dormRef + cocheraFilter + "precio dolares zonaprop",
            "departamento venta " + barrio + " " + provincia + " " + ambientes + " ambientes " + cocheraFilter + "dolares argenprop",
            "depto venta " + barrio + " " + provincia + " " + supRef + dormRef + cocheraFilter + "dolares",
          ];
        }
        if (tipo === "casa" && casaSubtipo === "cerrado") {
          return [
            casaNombreBarrio + " casa venta precio dolares zonaprop",
            casaNombreBarrio + " " + barrio + " casa venta dolares argenprop",
            casaNombreBarrio + " housing venta dolares",
          ];
        }
        if (tipo === "casa") {
          return [
            "casa venta " + calleRef + barrio + " " + provincia + " " + dormRef + "precio dolares zonaprop",
            "casa venta " + barrio + " " + provincia + " " + supRef + "dolares argenprop",
            "casa " + barrio + " " + provincia + " " + dormRef + supRef + "venta dolares",
          ];
        }
        if (tipo === "ph") {
          return [
            "PH venta " + calleRef + barrio + " " + provincia + " precio dolares zonaprop",
            "PH venta " + barrio + " " + provincia + " " + ambientes + " ambientes dolares argenprop",
            "ph " + barrio + " " + provincia + " venta dolares",
          ];
        }
        if (tipo === "local") {
          return [
            "local comercial venta " + calleRef + barrio + " " + provincia + " precio dolares zonaprop",
            "local venta " + barrio + " " + provincia + " " + supRef + "dolares argenprop",
            "local comercial " + barrio + " " + provincia + " venta dolares mercadolibre",
          ];
        }
        return [
          tipo + " venta " + calleRef + barrio + " " + provincia + " precio dolares zonaprop",
          tipo + " venta " + barrio + " " + provincia + " dolares argenprop",
          tipo + " venta " + barrio + " " + provincia + " dolares mercadolibre inmuebles",
        ];
      };

      const queries = buildQueries();
      let comparablesData = "";
      let streetContext = "";

      // Geocodificar UNA SOLA VEZ antes del loop
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=ar`,
          { headers: { "User-Agent": "TasaLibre/1.0" } }
        );
        const geoData = await geoRes.json();
        if (geoData.length) {
          const { lat, lon } = geoData[0];
          // Overpass para calles cercanas
          const ovQuery = `[out:json][timeout:5];way(around:500,${lat},${lon})["highway"]["name"];out tags;`;
          const ovRes = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `data=${encodeURIComponent(ovQuery)}`
          });
          const ovData = await ovRes.json();
          const seen = new Set();
          const streets = [];
          for (const el of ovData.elements || []) {
            const name = el.tags?.name;
            if (name && !seen.has(name)) { seen.add(name); streets.push(name); }
          }
          if (streets.length < 3) {
            // Ampliar a 1000m
            const ovQuery2 = `[out:json][timeout:5];way(around:1000,${lat},${lon})["highway"]["name"];out tags;`;
            const ovRes2 = await fetch("https://overpass-api.de/api/interpreter", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `data=${encodeURIComponent(ovQuery2)}`
            });
            const ovData2 = await ovRes2.json();
            for (const el of ovData2.elements || []) {
              const name = el.tags?.name;
              if (name && !seen.has(name)) { seen.add(name); streets.push(name); }
            }
          }
          if (streets.length > 0) {
            streetContext = `Buscar SOLO en estas calles cercanas: ${streets.slice(0,6).join(", ")}. `;
          }
        }
      } catch(e) { console.warn("Geocoding failed:", e.message); }

      for (let qi = 0; qi < queries.length; qi++) {
        setLoadStep(Math.min(qi + 2, 4));
        const searchPrompt = streetContext + "Busca en zonaprop.com.ar o argenprop.com: " + queries[qi] + ". Devuelve propiedades de la zona. Lista: precio USD, m2, direccion exacta, fuente.";
        try {
          const searchRes = await fetch("/api/tasar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              model: "claude-sonnet-4-6",
              max_tokens: 400,
              tools: [{ type: "web_search_20250305", name: "web_search" }],
              messages: [{ role: "user", content: searchPrompt }],
              _meta: { address, tipo, operacion, barrio, supTotal, conCochera: amenities.includes("Cochera") }
            })
          });
          const searchText = await searchRes.text();
          const searchData = JSON.parse(searchText);
          const textBlocks = (searchData.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
          if (textBlocks.trim()) comparablesData += " | " + textBlocks.slice(0, 400);
        } catch(searchErr) { console.warn("Search failed:", searchErr.message); }
      }

      setLoadStep(4);

      const msgContent = [];
      if (!skipContact) {
        // Max 2 fotos para no exceder el limite de tokens
        const validPhotos = photos.filter(Boolean).slice(0, 2);
        for (const p of validPhotos) {
          try {
            const b64 = p.dataUrl.split(",")[1];
            if (b64) msgContent.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } });
          } catch(e) {}
        }
      }

      // Build compact prompt to stay under token limits
      const propData = [
        "Tipo:" + tipo + (loteSubtipo?"/"+loteSubtipo:"") + (casaSubtipo?"/"+casaSubtipo:"") + (casaNombreBarrio?" "+casaNombreBarrio:"") + (nombreBarrioPrivado?" "+nombreBarrioPrivado:""),
        "Dir:" + address + " Op:" + operacion,
        "Sup:" + (supTotal||"?") + "m2" + (tipo!=="lote"?" cub:"+(supCub||"?")+"m2":"") + " ant:" + (antiguedad||"?") + "a",
        tipo!=="lote" ? "Amb:"+ambientes+" dorm:"+dormitorios+" ban:"+banos+" est:"+estado.replace(/_/g," ") : "",
        tipo==="departamento" ? "piso:"+piso+" asc:"+(ascensor?"si":"no")+" balcon:"+(balcon?"si":"no")+" disp:"+(disposicion||"-")+" orient:"+(orientacion||"-")+" hall:"+(hallEstado||"-")+" expensas:"+(expensas?"$"+expensas:"N/A") : "",
         tipo==="ph" ? "PH acceso:" + (phAlFrente?"frente":([(phPasillo?"pasillo":""), (phEscalera==="piso1"?"escalera-1piso":phEscalera==="piso2plus"?"escalera-2piso+":"")].filter(Boolean).join("+") || "-")) + " ajuste:" + (phAlFrente?"0%":((phPasillo&&phEscalera==="piso2plus")?"-20%":(phPasillo&&phEscalera==="piso1")?"-15%":(phEscalera==="piso2plus")?"-10%":(phEscalera==="piso1")?"-5%":phPasillo?"-10%":"0%")) + (phAccesoEstado==="deteriorado"?" acc-det-5%":"") + " orient:" + (orientacion||"-") : "",
        tipo==="lote" ? "frente:"+loteFrente+"m fondo:"+loteFondo+"m zonif:"+zonificacion+" edif:"+(loteConEdificacion?"si":"no") : "",
        amenities.length ? "extras:"+amenities.join(",") : "",
        loteAdicionales.length ? "adicionales:"+loteAdicionales.join(",") : "",
      ].filter(Boolean).join(" | ");

      const comparablesCtx = comparablesData
        ? "COMPARABLES(usa como base):" + comparablesData.slice(0, 800)
        : "Sin comparables online.";

      const prompt = "Sos tasador inmobiliario Argentina. CONSERVADOR y PRECISO.\n" +
        "PROPIEDAD: " + propData + "\n" +
        comparablesCtx + "\n" +
        "REGLAS: 1)Precio techo zona-nunca CABA para GBA. 2)Barrios abiertos compiten cerrados=techo real. 3)GBA Sur casas max USD 1200/m2. 4)6 comparables MAS CERCANOS a " + address + ". 5)Promedio m2=base valor. 6)Rango+-5%. 7)CONSERVADOR.\n" +
        "MODELO DE VALUACION:\n" +
        "PASO 1 - BASE: usar precio/m2 promedio de los comparables encontrados. Ese promedio YA refleja el mercado real de la zona incluyendo propiedades en distintos estados.\n" +
        "PASO 2 - ANCLA: identificar el comparable mas similar en superficie y tipologia y usarlo como referencia principal.\n" +
        "PASO 3 - AJUSTES: aplicar SOLO diferencias respecto al promedio zonal. Si los comparables ya incluyen propiedades deterioradas, el ajuste por estado es minimo o cero.\n" +
        "PASO 4 - TECHO DURO: ajuste total maximo +15% / minimo -20%. IRROMPIBLE. Recortar si se supera.\n" +
        "\n" +
        "REGLAS CRITICAS:\n" +
        "REGLA 1 - UN SOLO FACTOR DE ESTADO: Estado general, deterioro estructural y antiguedad describen lo mismo. Elegir el mas representativo y aplicar UNO SOLO. NUNCA acumular los tres.\n" +
        "REGLA 2 - COCHERA ES FILTRO NO AJUSTE: comparables ya filtrados por cochera. No aplicar porcentaje por cochera.\n" +
        "REGLA 3 - ORIENTACION INFORMATIVA: mencionar orientacion en el analisis pero aplicar 0% de ajuste. No sube ni baja el precio.\n" +
        "REGLA 4 - DEMOLICION: si hay riesgo de derrumbe, comparar con terrenos de la zona, no con propiedades.\n" +
        "\n" +
        "AJUSTES ESTRUCTURALES (caracteristicas fijas, aplicar siempre):\n" +
        "DISPOSICION: frente 0% / lateral -5% / contrafrente -10% / interno -12%.\n" +
        "ASCENSOR: con 0% / sin hasta 2do piso -5% / sin 3ro+ -10%.\n" +
        "BALCON: con balcon +5%.\n" +
        "HALL: moderno +3% / buen estado 0% / antiguo prolijo -2% / deteriorado -5%.\n" +
        "PH ACCESO: usar ajuste calculado en propData exactamente.\n" +
        "\n" +
        "AJUSTE DE ESTADO (elegir UNO solo, el mas representativo):\n" +
        "Muy por encima del promedio zonal (a estrenar / refaccionado a nuevo): +8%.\n" +
        "Por encima del promedio (muy bueno): +4%.\n" +
        "En linea con el promedio (bueno): 0%.\n" +
        "Por debajo del promedio (a reciclar): -8%.\n" +
        "Muy deteriorado con problemas estructurales: -15%.\n" +
        "\n" +
        "AJUSTES SECUNDARIOS (solo si hay diferencia clara respecto al promedio):\n" +
        "COCINA renovada a nuevo: +5%. A renovar: -5%.\n" +
        "BANOS renovados a nuevo: +5%. A renovar: -5%.\n" +
        "LUMINOSIDAD muy superior al promedio: +3%. Muy inferior: -3%.\n" +
        "EXPENSAS mas de $250k: mencionar negativamente en analisis.\n" +
        "\n" +
        "BLOQUE DE REFACCION: si y solo si cocina + banos + pisos estan todos deteriorados simultaneamente segun las fotos, incluir en el campo 'costo_refaccion_usd' el calculo: superficie_cubierta x 650. Sino, poner 0.\n" +
        (msgContent.length>0 ? (tipo==="lote" ? "FOTOS LOTE: detecta medianeras,nivel suelo,arboles,accesibilidad,construccion.\n" : "FOTOS: analiza terminaciones,humedad,grietas,materiales.\n") : "") +
        "RESPONDE SOLO JSON SIN MARKDOWN:\n" +
        '{"valor_usd":0,"rango_min_usd":0,"rango_max_usd":0,"precio_m2_usd":0,"alerta_estructural":false,"costo_refaccion_usd":0,"scores":[{"nombre":"Terminaciones","valor":7},{"nombre":"Estado general","valor":7},{"nombre":"Luminosidad","valor":6},{"nombre":"Materiales","valor":6},{"nombre":"Distribucion","valor":7}],"comparables":[{"direccion":"Calle A","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":80,"precio_usd":0,"fuente":"ZonaProp"},{"direccion":"Calle B","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":90,"precio_usd":0,"fuente":"Argenprop"},{"direccion":"Calle C","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":75,"precio_usd":0,"fuente":"MercadoLibre"},{"direccion":"Calle D","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":85,"precio_usd":0,"fuente":"ZonaProp"},{"direccion":"Calle E","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":95,"precio_usd":0,"fuente":"Argenprop"},{"direccion":"Calle F","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":70,"precio_usd":0,"fuente":"MercadoLibre"}],"factores":[{"tipo":"pos","titulo":"Factor","descripcion":"Desc.","impacto":"+X%"},{"tipo":"neg","titulo":"Factor","descripcion":"Desc.","impacto":"-X%"},{"tipo":"neu","titulo":"Zona","descripcion":"Desc.","impacto":"Neutro"}],"analisis":"4 oraciones."}';

      msgContent.push({ type: "text", text: prompt });
      setLoadStep(5);

      const bodyStr = JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 2000, messages: [{ role: "user", content: msgContent }] });

      let res, responseText;
      try {
        res = await fetch("/api/tasar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: bodyStr
        });
        clearTimeout(globalTimeout);
        responseText = await res.text();
      } catch(e) {
        clearTimeout(globalTimeout);
        if (e.name === "AbortError") throw new Error("Tiempo agotado. Verifica tu conexion.");
        throw new Error("Error de conexion: " + e.message);
      }

      setRawDebug("HTTP " + res.status + " | " + responseText.slice(0, 200));

      let data;
      try { data = JSON.parse(responseText); } catch(e) { throw new Error("Respuesta invalida: " + responseText.slice(0,200)); }
      if (data.error) throw new Error("API: " + (data.error.message || JSON.stringify(data.error)));

      const raw = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      if (!raw) throw new Error("Sin respuesta. stop_reason=" + data.stop_reason);

      let jsonStr = raw.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
      const first = jsonStr.indexOf("{");
      const last = jsonStr.lastIndexOf("}");
      if (first===-1||last===-1) throw new Error("Sin JSON: " + raw.slice(0,200));
      jsonStr = jsonStr.slice(first, last+1);

      let parsed;
      try { parsed = JSON.parse(jsonStr); } catch(e) {
        const fixed = jsonStr.replace(/,\s*([}\]])/g,"$1").replace(/'/g,'"');
        try { parsed = JSON.parse(fixed); } catch(e2) { throw new Error("JSON invalido: " + e.message + " | " + jsonStr.slice(0,200)); }
      }
      if (!parsed.valor_usd) throw new Error("Sin valor_usd. Keys: " + Object.keys(parsed).join(", "));

      if (!skipContact && nombre.trim()) {
        await saveLead({ id:Date.now(), fecha:new Date().toLocaleString("es-AR"), nombre:nombre.trim(), whatsapp:whatsapp.trim(), tipo, address, operacion, supTotal, ambientes, dormitorios, valorUsd:parsed.valor_usd, precioM2:parsed.precio_m2_usd });
      }

      setResult(Object.assign({}, parsed, { address, operacion }));
      setScreen("result");
      window.scrollTo(0, 0);

    } catch(err) {
      clearTimeout(globalTimeout);
      console.error("TasaLibre error:", err);
      setApiError("SHOW_FRIENDLY");
      setRawDebug(err.message);
      setScreen("contact");
    }
  };

  const submitContact = () => { callApi(false); };

  const adminLogin = () => {
    if (adminPass === ADMIN_PASS) { setAdminErr(""); setScreen("admin"); }
    else setAdminErr("Contraseña incorrecta.");
  };

  const fmt = n => "USD " + Number(n).toLocaleString("es-AR");
  const WA_NUM = "5491140356742";
  const waLink = (res) => {
    const msg = "Hola! Acabo de tasar mi " + tipo + " en " + (res ? res.address : "") + " con TasaLibre y me dio un valor de " + (res ? fmt(res.valor_usd) : "") + ". Me gustaria hablar con un asesor.";
    return "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(msg);
  };
  const lineW = (s,cur) => s < cur ? "100%" : "0%";
  const STEPS_LABELS = ["Ubicación","Características","Fotos"];

  const resetAll = () => {
    setScreen("hero"); setStep(1); setResult(null);
    setPhotos(Array(6).fill(null)); setNombre(""); setWhatsapp("");
    setBarrio(""); setCalle(""); setNumero(""); setSupTotal(""); setSupCub(""); setAntiguedad("");
    setAmenities([]); setEstado("muy_bueno"); setApiError(""); setErrContact(""); setDisposicion("");
    setCasaSubtipo(""); setCasaNombreBarrio(""); setLoteSubtipo(""); setNombreBarrioPrivado("");
    setZonificacion(""); setLoteAdicionales([]); setLoteFondo(""); setLoteFrente(""); setLoteConEdificacion(false);
    setPiso(""); setAscensor(false); setPhUbicacion(""); setPhAlFrente(false); setPhPasillo(false); setPhEscalera(""); setPhAccesoEstado(""); setRawDebug("");
  };

  const WizardProgress = ({ active }) => (
    <div className="prog-wrap">
      <div className="prog-track">
        {[1,2,3].map(s => (
          <div key={s} style={{display:"contents"}}>
            <div className={"dot"+(active===s?" active":active>s?" done":"")}>{active>s?"✓":s}</div>
            {s<3 && <div className="prog-line"><div className="prog-line-fill" style={{width:lineW(s,active)}}/></div>}
          </div>
        ))}
      </div>
      <div className="prog-labels">
        {STEPS_LABELS.map((l,i)=>(
          <span key={l} className={"prog-lbl"+(active===i+1?" active":"")}>{l}</span>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <input ref={fileRef} type="file" accept="image/*,image/heic,image/heif" style={{display:"none",position:"fixed",top:0,left:0}} onChange={onFile}/>
      <div className="tasa-root">

        <nav className="tasa-nav">
          <div className="tasa-logo" onClick={resetAll} style={{display:"flex",alignItems:"center",cursor:"pointer"}}>
            <img src={LOGO_SRC} alt="TasaLibre" style={{height:44,width:"auto",filter:"brightness(0) invert(1)",opacity:0.95}}/>
          </div>
          <div className="nav-right">
            <span className="nav-tag">Gratis</span>
            <button className="nav-admin-btn" onClick={()=>setScreen("admin-login")} title="Admin">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </button>
          </div>
        </nav>

        {screen==="hero" && (
          <div className="hero">
            <div className="hero-bg"/>
            <div className="hero-inner">
              <div className="hero-logo-wrap">
                <img src={LOGO_SRC} alt="TasaLibre" style={{height:140,width:"auto",display:"block",filter:"drop-shadow(0 4px 20px rgba(27,79,216,0.15))"}}/>
              </div>
              <div className="hero-pill">
                <div className="pill-dot"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                100% gratuito · Sin registrarse · Sin compromiso
              </div>
              <h1>Conocé el valor real<br/>de tu <em>propiedad</em></h1>
              <p className="hero-sub">Nuestra IA analiza las fotos, busca comparables reales del mercado y te da una tasación profesional en minutos.</p>
              <div className="hero-actions">
                <button className="btn-primary" style={{fontSize:16,padding:"15px 32px",borderRadius:12}} onClick={()=>{setScreen("wizard");setStep(1);}}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                  Tasar mi propiedad gratis
                </button>
                <div className="hero-trust">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Sin tarjeta · Sin spam · Sin compromiso
                </div>
              </div>
              <div className="hero-stats">
                <div className="hero-stat"><span className="stat-num">3 min</span><span className="stat-label">Tiempo promedio</span></div>
                <div className="hero-stat"><span className="stat-num">100%</span><span className="stat-label">Gratuito</span></div>
                <div className="hero-stat"><span className="stat-num">IA</span><span className="stat-label">+ datos reales</span></div>
              </div>
            </div>
          </div>
        )}

        {screen==="wizard" && (
          <div className="wizard">
            <WizardProgress active={step}/>

            {step===1 && (
              <div>
                <h2 className="step-title">¿Dónde está<br/>tu <em>propiedad?</em></h2>
                <p className="step-desc">Ingresá la dirección lo más completa posible para mejorar la precisión de los comparables.</p>
                <div className="field"><label>Tipo</label>
                  <div className="chips">
                    {[["departamento","Departamento"],["casa","Casa"],["ph","PH"],["local","Local Comercial"],["lote","Lote"]].map(([v,l])=>(
                      <div key={v} className={"chip"+(tipo===v?" on":"")} onClick={()=>{ setTipo(v); if(v!=="lote") setLoteSubtipo(""); if(v!=="casa") setCasaSubtipo(""); }}>{l}</div>
                    ))}
                  </div>
                </div>

                {tipo==="lote" && (
                  <div className="field"><label>¿Qué tipo de lote?</label>
                    <div className="chips">
                      <div className={"chip"+(loteSubtipo==="cerrado"?" on":"")} onClick={()=>{setLoteSubtipo("cerrado");setOperacion("venta");}}>Barrio Cerrado</div>
                      <div className={"chip"+(loteSubtipo==="urbano"?" on":"")} onClick={()=>setLoteSubtipo("urbano")}>Lote Urbano</div>
                    </div>
                  </div>
                )}

                {tipo==="casa" && (
                  <div className="field"><label>Tipo de ubicación</label>
                    <div className="chips">
                      <div className={"chip"+(casaSubtipo==="tradicional"?" on":"")} onClick={()=>setCasaSubtipo("tradicional")}>Barrio Tradicional</div>
                      <div className={"chip"+(casaSubtipo==="cerrado"?" on":"")} onClick={()=>setCasaSubtipo("cerrado")}>Barrio Cerrado</div>
                    </div>
                  </div>
                )}

                {tipo==="lote" && loteSubtipo==="cerrado" && (
                  <>
                    <div className="field"><label>Localidad / Zona *</label>
                      <input value={barrio} onChange={e=>setBarrio(e.target.value)} placeholder="ej. Tigre, Pilar, Ezeiza..."/>
                      {errBarrio && <div className="err">Ingresá la localidad.</div>}
                    </div>
                    <div className="field"><label>Provincia</label>
                      <select value={provincia} onChange={e=>setProvincia(e.target.value)}>
                        {["Buenos Aires","CABA","Córdoba","Santa Fe","Mendoza","Tucumán","Rosario","Otra"].map(p=><option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="field"><label>Operación</label>
                      <div style={{padding:"11px 14px",background:"var(--bg)",border:"1.5px solid var(--border)",borderRadius:"var(--radius-sm)",fontSize:14,color:"var(--ink-3)"}}>Venta</div>
                    </div>
                  </>
                )}

                {tipo==="lote" && loteSubtipo==="urbano" && (
                  <>
                    <div className="field"><label>Barrio / Localidad *</label>
                      <input value={barrio} onChange={e=>setBarrio(e.target.value)} placeholder="ej. Quilmes Centro, Lanús..."/>
                      {errBarrio && <div className="err">Ingresá el barrio.</div>}
                    </div>
                    <div className="row2">
                      <div className="field"><label>Calle</label><input value={calle} onChange={e=>setCalle(e.target.value)} placeholder="ej. Mitre"/></div>
                      <div className="field"><label>Número</label><input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="ej. 1200"/></div>
                    </div>
                    <div className="row2">
                      <div className="field"><label>Provincia</label>
                        <select value={provincia} onChange={e=>setProvincia(e.target.value)}>
                          {["Buenos Aires","CABA","Córdoba","Santa Fe","Mendoza","Tucumán","Rosario","Otra"].map(p=><option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="field"><label>Operación</label>
                        <select value={operacion} onChange={e=>setOperacion(e.target.value)}>
                          <option value="venta">Venta</option><option value="alquiler">Alquiler</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {tipo==="casa" && casaSubtipo==="cerrado" && (
                  <>
                    <div className="field"><label>Localidad *</label>
                      <input value={barrio} onChange={e=>setBarrio(e.target.value)} placeholder="ej. Berazategui, Hudson, Canning..."/>
                      {errBarrio && <div className="err">Ingresá la localidad.</div>}
                    </div>
                    <div className="field"><label>Nombre del barrio cerrado *</label>
                      <input value={casaNombreBarrio} onChange={e=>setCasaNombreBarrio(e.target.value)} placeholder="ej. Los Troncos, Abril, Hudson Park..."/>
                    </div>
                    <div className="row2">
                      <div className="field"><label>Calle <span style={{color:"var(--ink-4)",fontWeight:400}}>(opcional)</span></label><input value={calle} onChange={e=>setCalle(e.target.value)} placeholder="ej. Los Robles"/></div>
                      <div className="field"><label>Número <span style={{color:"var(--ink-4)",fontWeight:400}}>(opcional)</span></label><input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="ej. 234"/></div>
                    </div>
                    <div className="field"><label>Provincia</label>
                      <select value={provincia} onChange={e=>setProvincia(e.target.value)}>
                        {["Buenos Aires","CABA","Córdoba","Santa Fe","Mendoza","Tucumán","Rosario","Otra"].map(p=><option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="field"><label>Operación</label>
                      <select value={operacion} onChange={e=>setOperacion(e.target.value)}>
                        <option value="venta">Venta</option><option value="alquiler">Alquiler</option>
                      </select>
                    </div>
                  </>
                )}

                {tipo==="casa" && casaSubtipo==="tradicional" && (
                  <>
                    <div className="field"><label>Barrio / Localidad *</label>
                      <input value={barrio} onChange={e=>setBarrio(e.target.value)} placeholder="ej. Palermo, Quilmes Centro..."/>
                      {errBarrio && <div className="err">Ingresá el barrio.</div>}
                    </div>
                    <div className="row2">
                      <div className="field"><label>Calle</label><input value={calle} onChange={e=>setCalle(e.target.value)} placeholder="ej. Av. Santa Fe"/></div>
                      <div className="field"><label>Número</label><input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="ej. 3240"/></div>
                    </div>
                    <div className="row2">
                      <div className="field"><label>Provincia</label>
                        <select value={provincia} onChange={e=>setProvincia(e.target.value)}>
                          {["Buenos Aires","CABA","Córdoba","Santa Fe","Mendoza","Tucumán","Rosario","Otra"].map(p=><option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="field"><label>Operación</label>
                        <select value={operacion} onChange={e=>setOperacion(e.target.value)}>
                          <option value="venta">Venta</option><option value="alquiler">Alquiler</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {tipo!=="lote" && tipo!=="casa" && (
                  <>
                    <div className="field"><label>Barrio / Localidad *</label>
                      <input value={barrio} onChange={e=>setBarrio(e.target.value)} placeholder="ej. Palermo, Quilmes Centro..."/>
                      {errBarrio && <div className="err">Ingresá el barrio.</div>}
                    </div>
                    <div className="row2">
                      <div className="field"><label>Calle</label><input value={calle} onChange={e=>setCalle(e.target.value)} placeholder="ej. Av. Santa Fe"/></div>
                      <div className="field"><label>Número</label><input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="ej. 3240"/></div>
                    </div>
                    <div className="row2">
                      <div className="field"><label>Provincia</label>
                        <select value={provincia} onChange={e=>setProvincia(e.target.value)}>
                          {["Buenos Aires","CABA","Córdoba","Santa Fe","Mendoza","Tucumán","Rosario","Otra"].map(p=><option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="field"><label>Operación</label>
                        <select value={operacion} onChange={e=>setOperacion(e.target.value)}>
                          <option value="venta">Venta</option><option value="alquiler">Alquiler</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="step-nav">
                  <div/>
                  <button className="btn-outline" onClick={()=>{
                    if(tipo==="lote"&&!loteSubtipo) return;
                    if(tipo==="casa"&&!casaSubtipo) return;
                    if(!barrio.trim()&&tipo!=="lote") { setErrBarrio(true); return; }
                    if(tipo==="lote"&&loteSubtipo&&!barrio.trim()) { setErrBarrio(true); return; }
                    if(tipo==="casa"&&casaSubtipo&&!barrio.trim()) { setErrBarrio(true); return; }
                    setErrBarrio(false); setStep(2); window.scrollTo(0,0);
                  }}>Siguiente →</button>
                </div>
              </div>
            )}

            {step===2 && (
<div>
                <h2 className="step-title">Contanos sobre<br/>el <em>inmueble</em></h2>
                <p className="step-desc">Estos datos ayudan a calcular el valor base y encontrar propiedades comparables.</p>
                <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--azul-light)",border:"1px solid var(--azul-mid)",borderRadius:8,padding:"10px 14px",marginBottom:8}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{fontSize:12,color:"var(--azul)",lineHeight:1.4}}>Completá todos los campos que puedas — cada detalle mejora la precisión del resultado.</span>
                </div>

                {tipo!=="lote" && (
                  <div className="row3">
                    <div className="field"><label>Sup. total (m²)</label><input type="number" value={supTotal} onChange={e=>setSupTotal(e.target.value)} placeholder="85"/></div>
                    <div className="field"><label>Sup. cubierta (m²)</label><input type="number" value={supCub} onChange={e=>setSupCub(e.target.value)} placeholder="70"/></div>
                    <div className="field"><label>Antigüedad (años)</label><input type="number" value={antiguedad} onChange={e=>setAntiguedad(e.target.value)} placeholder="15"/></div>
                  </div>
                )}

                {tipo==="departamento" && (
                  <>
                    <div className="row3">
                      <div className="field"><label>Ambientes</label>
                        <select value={ambientes} onChange={e=>setAmbientes(e.target.value)}>
                          {["1","2","3","4","5","6+"].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="field"><label>Dormitorios</label>
                        <select value={dormitorios} onChange={e=>setDormitorios(e.target.value)}>
                          {["Monoambiente","1","2","3","4+"].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="field"><label>Baños</label>
                        <select value={banos} onChange={e=>setBanos(e.target.value)}>
                          {["1","2","3","4+"].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="row3">
                      <div className="field"><label>Piso</label><input type="number" value={piso} onChange={e=>setPiso(e.target.value)} placeholder="ej. 3"/></div>
                      <div className="field"><label>¿Tiene ascensor?</label>
                        <div className="chips" style={{marginTop:8}}>
                          <div className={"chip"+(ascensor?" on":"")} onClick={()=>setAscensor(true)}>Sí</div>
                          <div className={"chip"+(!ascensor?" on":"")} onClick={()=>setAscensor(false)}>No</div>
                        </div>
                      </div>
                      <div className="field"><label>¿Tiene balcón?</label>
                        <div className="chips" style={{marginTop:8}}>
                          <div className={"chip"+(balcon?" on":"")} onClick={()=>setBalcon(true)}>Sí</div>
                          <div className={"chip"+(!balcon?" on":"")} onClick={()=>setBalcon(false)}>No</div>
                        </div>
                      </div>
                    </div>
                    <div className="field"><label>Estado general</label>
                      <div className="chips">
                        {[["a_estrenar","A estrenar"],["refaccionado","Refaccionado a nuevo"],["muy_bueno","Muy bueno"],["bueno","Bueno"],["a_reciclar","A reciclar"]].map(([v,l])=>(
                          <div key={v} className={"chip"+(estado===v?" on":"")} onClick={()=>setEstado(v)}>{l}</div>
                        ))}
                      </div>
                    </div>
                    <div className="field">
                      <label>Disposición</label>
                      <div className="chips" style={{marginTop:8}}>
                        <div className={"chip"+(disposicion==="frente"?" on":"")} onClick={()=>setDisposicion("frente")}>Al frente</div>
                        <div className={"chip"+(disposicion==="contrafrente"?" on":"")} onClick={()=>setDisposicion("contrafrente")}>Contrafrente</div>
                        <div className={"chip"+(disposicion==="lateral"?" on":"")} onClick={()=>setDisposicion("lateral")}>Lateral</div>
                        <div className={"chip"+(disposicion==="interno"?" on":"")} onClick={()=>setDisposicion("interno")}>Interno</div>
                      </div>
                    </div>
                    <div className="field"><label>Orientación</label>
                      <div className="chips">
                        <div className={"chip"+(orientacion==="norte"?" on":"")} onClick={()=>setOrientacion("norte")}>Norte</div>
                        <div className={"chip"+(orientacion==="sur"?" on":"")} onClick={()=>setOrientacion("sur")}>Sur</div>
                        <div className={"chip"+(orientacion==="este"?" on":"")} onClick={()=>setOrientacion("este")}>Este</div>
                        <div className={"chip"+(orientacion==="oeste"?" on":"")} onClick={()=>setOrientacion("oeste")}>Oeste</div>
                        <div className={"chip"+(orientacion==="no_se"?" on":"")} onClick={()=>setOrientacion("no_se")}>No sé</div>
                      </div>
                    </div>
                    <div className="field"><label>Estado del hall / palier</label>
                      <div className="chips">
                        <div className={"chip"+(hallEstado==="moderno"?" on":"")} onClick={()=>setHallEstado("moderno")}>Moderno / Renovado</div>
                        <div className={"chip"+(hallEstado==="bueno"?" on":"")} onClick={()=>setHallEstado("bueno")}>Buen estado</div>
                        <div className={"chip"+(hallEstado==="antiguo"?" on":"")} onClick={()=>setHallEstado("antiguo")}>Antiguo pero prolijo</div>
                        <div className={"chip"+(hallEstado==="deteriorado"?" on":"")} onClick={()=>setHallEstado("deteriorado")}>Deteriorado</div>
                      </div>
                    </div>
                    <div className="field"><label>Expensas mensuales <span style={{fontSize:11,color:"var(--ink-4)",fontWeight:400}}>(opcional)</span></label>
                      <input type="number" value={expensas} onChange={e=>setExpensas(e.target.value)} placeholder="ej. 150000"/>
                      <div style={{fontSize:11,color:"var(--ink-4)",marginTop:4}}>En pesos argentinos — incluí administración + servicios comunes</div>
                    </div>
                    <div className="field"><label>Amenities del edificio</label>
                      <div className="chips">
                        {AMENITY_DEPTO.map(a=>(<div key={a} className={"chip"+(amenities.includes(a)?" on":"")} onClick={()=>toggleAmenity(a)}>{a}</div>))}
                      </div>
                    </div>
                  </>
                )}

                {tipo==="casa" && (
                  <>
                    <div className="row3">
                      <div className="field"><label>Ambientes</label>
                        <select value={ambientes} onChange={e=>setAmbientes(e.target.value)}>
                          {["1","2","3","4","5","6+"].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="field"><label>Dormitorios</label>
                        <select value={dormitorios} onChange={e=>setDormitorios(e.target.value)}>
                          {["1","2","3","4","5+"].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="field"><label>Baños</label>
                        <select value={banos} onChange={e=>setBanos(e.target.value)}>
                          {["1","2","3","4+"].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="field"><label>Orientación</label>
                      <div className="chips">
                        <div className={"chip"+(orientacion==="norte"?" on":"")} onClick={()=>setOrientacion("norte")}>Norte</div>
                        <div className={"chip"+(orientacion==="sur"?" on":"")} onClick={()=>setOrientacion("sur")}>Sur</div>
                        <div className={"chip"+(orientacion==="este"?" on":"")} onClick={()=>setOrientacion("este")}>Este</div>
                        <div className={"chip"+(orientacion==="oeste"?" on":"")} onClick={()=>setOrientacion("oeste")}>Oeste</div>
                        <div className={"chip"+(orientacion==="no_se"?" on":"")} onClick={()=>setOrientacion("no_se")}>No sé</div>
                      </div>
                    </div>
                    <div className="field"><label>Características</label>
                      <div className="chips">
                        {AMENITY_CASA.map(a=>(<div key={a} className={"chip"+(amenities.includes(a)?" on":"")} onClick={()=>toggleAmenity(a)}>{a}</div>))}
                      </div>
                    </div>
                  </>
                )}

                {tipo==="ph" && (
                  <>
                    <div className="row3">
                      <div className="field"><label>Ambientes</label>
                        <select value={ambientes} onChange={e=>setAmbientes(e.target.value)}>
                          {["1","2","3","4","5","6+"].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="field"><label>Dormitorios</label>
                        <select value={dormitorios} onChange={e=>setDormitorios(e.target.value)}>
                          {["1","2","3","4+"].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="field"><label>Baños</label>
                        <select value={banos} onChange={e=>setBanos(e.target.value)}>
                          {["1","2","3","4+"].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="field"><label>Tipo de acceso</label>
                      <p style={{fontSize:12,color:"var(--ink-4)",marginBottom:8,marginTop:2}}>Podés seleccionar más de una opción si aplican.</p>
                      <div className="chips" style={{marginBottom:8}}>
                        <div className={"chip"+(phAlFrente?" on":"")} onClick={()=>setPhAlFrente(!phAlFrente)}>Al frente</div>
                        <div className={"chip"+(phPasillo?" on":"")} onClick={()=>setPhPasillo(!phPasillo)}>Por pasillo</div>
                        <div className={"chip"+(phEscalera?" on":"")} onClick={()=>setPhEscalera(phEscalera ? "" : "piso1")}>Por escalera</div>
                      </div>
                      {phEscalera && (
                        <div style={{marginTop:8,paddingLeft:12,borderLeft:"2px solid var(--azul-mid)"}}>
                          <label style={{fontSize:12,color:"var(--ink-3)",marginBottom:6,display:"block"}}>¿En qué piso está el PH?</label>
                          <div className="chips">
                            <div className={"chip"+(phEscalera==="piso1"?" on":"")} onClick={()=>setPhEscalera("piso1")}>1° piso</div>
                            <div className={"chip"+(phEscalera==="piso2plus"?" on":"")} onClick={()=>setPhEscalera("piso2plus")}>2° piso o más</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="field"><label>Estado del acceso compartido</label>
                      <div className="chips">
                        <div className={"chip"+(phAccesoEstado==="bueno"?" on":"")} onClick={()=>setPhAccesoEstado("bueno")}>Buen estado</div>
                        <div className={"chip"+(phAccesoEstado==="deteriorado"?" on":"")} onClick={()=>setPhAccesoEstado("deteriorado")}>Deteriorado</div>
                      </div>
                    </div>
                    <div className="field"><label>Orientación</label>
                      <div className="chips">
                        <div className={"chip"+(orientacion==="norte"?" on":"")} onClick={()=>setOrientacion("norte")}>Norte</div>
                        <div className={"chip"+(orientacion==="sur"?" on":"")} onClick={()=>setOrientacion("sur")}>Sur</div>
                        <div className={"chip"+(orientacion==="este"?" on":"")} onClick={()=>setOrientacion("este")}>Este</div>
                        <div className={"chip"+(orientacion==="oeste"?" on":"")} onClick={()=>setOrientacion("oeste")}>Oeste</div>
                        <div className={"chip"+(orientacion==="no_se"?" on":"")} onClick={()=>setOrientacion("no_se")}>No sé</div>
                      </div>
                    </div>
                    <div className="field"><label>Características</label>
                      <div className="chips">
                        {AMENITY_PH.map(a=>(<div key={a} className={"chip"+(amenities.includes(a)?" on":"")} onClick={()=>toggleAmenity(a)}>{a}</div>))}
                      </div>
                    </div>
                  </>
                )}

                {tipo==="local" && (
                  <>
                    <div className="row2">
                      <div className="field"><label>Baños / Toilettes</label>
                        <select value={banos} onChange={e=>setBanos(e.target.value)}>
                          {["1","2","3","4+"].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="field"><label>Antigüedad (años)</label>
                        <input type="number" value={antiguedad} onChange={e=>setAntiguedad(e.target.value)} placeholder="15"/>
                      </div>
                    </div>
                    <div className="field"><label>Características del local</label>
                      <div className="chips">
                        <div className={"chip"+(alturaVigas?" on":"")} onClick={()=>setAlturaVigas(!alturaVigas)}>Buena altura hasta viga</div>
                        <div className={"chip"+(vidriera?" on":"")} onClick={()=>setVidriera(!vidriera)}>Vidriera</div>
                        <div className={"chip"+(cortinasMetalicas?" on":"")} onClick={()=>setCortinasMetalicas(!cortinasMetalicas)}>Cortinas metálicas</div>
                        <div className={"chip"+(entrepiso?" on":"")} onClick={()=>setEntrepiso(!entrepiso)}>Entrepiso</div>
                        <div className={"chip"+(amenities.includes("Planos aprobados")?" on":"")} onClick={()=>toggleAmenity("Planos aprobados")}>Planos aprobados</div>
                        <div className={"chip"+(amenities.includes("Trifásica")?" on":"")} onClick={()=>toggleAmenity("Trifásica")}>Trifásica</div>
                        <div className={"chip"+(amenities.includes("Gas natural")?" on":"")} onClick={()=>toggleAmenity("Gas natural")}>Gas natural</div>
                      </div>
                    </div>
                    <div className="field"><label>Estado general</label>
                      <div className="chips">
                        {[["a_estrenar","A estrenar"],["refaccionado","Refaccionado a nuevo"],["muy_bueno","Muy bueno"],["bueno","Bueno"],["a_reciclar","A reciclar"]].map(([v,l])=>(
                          <div key={v} className={"chip"+(estado===v?" on":"")} onClick={()=>setEstado(v)}>{l}</div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {tipo==="lote" && loteSubtipo==="cerrado" && (
                  <>
                    <div className="field"><label>Nombre del barrio cerrado</label>
                      <input value={nombreBarrioPrivado} onChange={e=>setNombreBarrioPrivado(e.target.value)} placeholder="ej. Nordelta, La Lomada, San Diego..."/>
                    </div>
                    <div className="row3">
                      <div className="field"><label>Superficie (m²)</label><input type="number" value={supTotal} onChange={e=>setSupTotal(e.target.value)} placeholder="600"/></div>
                      <div className="field"><label>Frente (m)</label><input type="number" value={loteFrente} onChange={e=>setLoteFrente(e.target.value)} placeholder="15"/></div>
                      <div className="field"><label>Fondo (m)</label><input type="number" value={loteFondo} onChange={e=>setLoteFondo(e.target.value)} placeholder="40"/></div>
                    </div>
                    <div className="field"><label>Antigüedad del barrio (años aprox.)</label>
                      <input type="number" value={antiguedad} onChange={e=>setAntiguedad(e.target.value)} placeholder="ej. 15"/>
                    </div>
                    <div className="field"><label>Adicionales (opcionales)</label>
                      <div className="chips">
                        {["Vista al lago","Esquina","Orientación solar favorable","Cerca de la entrada","Árboles / arbolado"].map(op=>(
                          <div key={op} className={"chip"+(loteAdicionales.includes(op)?" on":"")}
                            onClick={()=>setLoteAdicionales(prev=>prev.includes(op)?prev.filter(x=>x!==op):[...prev,op])}>{op}</div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {tipo==="lote" && loteSubtipo==="urbano" && (
                  <>
                    <div className="row3">
                      <div className="field"><label>Superficie (m²)</label><input type="number" value={supTotal} onChange={e=>setSupTotal(e.target.value)} placeholder="300"/></div>
                      <div className="field"><label>Frente (m)</label><input type="number" value={loteFrente} onChange={e=>setLoteFrente(e.target.value)} placeholder="10"/></div>
                      <div className="field"><label>Fondo (m)</label><input type="number" value={loteFondo} onChange={e=>setLoteFondo(e.target.value)} placeholder="30"/></div>
                    </div>
                    <div className="field"><label>Zonificación</label>
                      <select value={zonificacion} onChange={e=>setZonificacion(e.target.value)}>
                        <option value="">Seleccioná la zonificación</option>
                        <option value="R1 - Residencial Unifamiliar">R1 — Residencial Unifamiliar</option>
                        <option value="R2 - Residencial Multifamiliar">R2 — Residencial Multifamiliar</option>
                        <option value="C1 - Comercial Local">C1 — Comercial Local</option>
                        <option value="C2 - Comercial General">C2 — Comercial General</option>
                        <option value="I1 - Industrial Liviana">I1 — Industrial Liviana</option>
                        <option value="I2 - Industrial General">I2 — Industrial General</option>
                        <option value="Mixta - Residencial/Comercial">Mixta — Residencial/Comercial</option>
                        <option value="No sé / A consultar">No sé / A consultar</option>
                      </select>
                    </div>
                    <div className="field"><label>Adicionales (opcionales)</label>
                      <div className="chips">
                        {["Esquina","Orientación solar favorable","Árboles / arbolado"].map(op=>(
                          <div key={op} className={"chip"+(loteAdicionales.includes(op)?" on":"")}
                            onClick={()=>setLoteAdicionales(prev=>prev.includes(op)?prev.filter(x=>x!==op):[...prev,op])}>{op}</div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {(tipo==="casa" || tipo==="ph") && (
                  <div className="field"><label>Estado general</label>
                    <div className="chips">
                      {[["a_estrenar","A estrenar"],["refaccionado","Refaccionado a nuevo"],["muy_bueno","Muy bueno"],["bueno","Bueno"],["a_reciclar","A reciclar"]].map(([v,l])=>(
                        <div key={v} className={"chip"+(estado===v?" on":"")} onClick={()=>setEstado(v)}>{l}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="step-nav">
                  <button className="btn-ghost" onClick={()=>{setStep(1);window.scrollTo(0,0);}}>← Atrás</button>
                  <button className="btn-outline" onClick={()=>{setStep(3);window.scrollTo(0,0);}}>Siguiente →</button>
                </div>
              </div>
            )}

            {step===3 && (
              <div>
                {tipo==="lote" ? (
                  <>
                    <h2 className="step-title">Fotos del <em>terreno</em></h2>
                    <p className="step-desc">La IA analiza las condiciones del lote para detectar factores que impactan en el valor y los costos de construcción.</p>
                    <div className="field">
                      <label style={{marginBottom:4}}>
                        📷 Foto del lote — desde el frente hacia el fondo
                        <span style={{color:"var(--azul)",marginLeft:6,fontWeight:600}}>*</span>
                      </label>
                      <p style={{fontSize:12,color:"var(--ink-4)",marginBottom:10,lineHeight:1.5}}>
                        Parate en la línea municipal y fotografiá hacia el fondo. Debe verse la totalidad del terreno.
                      </p>
                      <div className={"upload-slot"+(photos[0]?" filled":"")} style={{aspectRatio:"16/9",borderRadius:"var(--radius-sm)"}} onClick={()=>openFile(0)}>
                        {photos[0]
                          ? <><img src={photos[0].dataUrl} alt=""/><div className="upload-overlay"><span style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"white"}}>Cambiar</span></div></>
                          : <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8896A5" strokeWidth="1.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              <span style={{fontSize:11,color:"var(--ink-4)",textAlign:"center"}}>Vista panorámica del lote</span>
                            </div>
                        }
                      </div>
                    </div>
                    <div className="field"><label>¿Hay alguna edificación en el lote?</label>
                      <div className="chips" style={{marginTop:8}}>
                        <div className={"chip"+(loteConEdificacion?" on":"")} onClick={()=>setLoteConEdificacion(true)}>Sí, hay una construcción</div>
                        <div className={"chip"+(!loteConEdificacion?" on":"")} onClick={()=>setLoteConEdificacion(false)}>No, está vacío</div>
                      </div>
                    </div>
                    {loteConEdificacion && (
                      <div className="field">
                        <label>📷 Foto de la construcción existente</label>
                        <div className={"upload-slot"+(photos[1]?" filled":"")} style={{aspectRatio:"16/9",borderRadius:"var(--radius-sm)",marginTop:8}} onClick={()=>openFile(1)}>
                          {photos[1]
                            ? <><img src={photos[1].dataUrl} alt=""/><div className="upload-overlay"><span style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"white"}}>Cambiar</span></div></>
                            : <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8896A5" strokeWidth="1.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                <span style={{fontSize:11,color:"var(--ink-4)",textAlign:"center"}}>Foto de la construcción</span>
                              </div>
                          }
                        </div>
                      </div>
                    )}
                    {errPhoto && <div className="err">Por favor subí al menos la foto del frente del lote.</div>}
                  </>
                ) : (
                  <>
                    <h2 className="step-title">Subí <em>fotos</em><br/>del inmueble</h2>
                    <p className="step-desc">La IA analiza materiales, terminaciones, humedad y roturas. Mínimo 2 fotos.</p>
                    <div className="upload-grid">
                      {photos.map((p,i)=>(
                        <div key={i} className={"upload-slot"+(p?" filled":"")} onClick={()=>openFile(i)}>
                          {p
                            ? <><img src={p.dataUrl} alt=""/><div className="upload-overlay"><span style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"white"}}>Cambiar</span></div></>
                            : <><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A4840" strokeWidth="1.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><span className="upload-lbl">{SLOT_LABELS[i]}</span></>
                          }
                        </div>
                      ))}
                    </div>
                    <p className="upload-hint">📸 Sala, cocina, baño, dormitorio, fachada. JPG/PNG/WEBP.</p>
                    {errPhoto && <div className="err">Subí al menos 2 fotos para continuar.</div>}
                  </>
                )}

                <div style={{display:"flex",alignItems:"flex-start",gap:10,background:"#EEF3FF",border:"1px solid #C7D7FA",borderRadius:8,padding:"12px 14px",marginTop:12}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B4FD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:1}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <span style={{fontSize:12,color:"#2C4A8A",lineHeight:1.5}}><strong>Tus fotos son privadas.</strong> Se usan únicamente para el análisis y no quedan guardadas en ningún servidor.</span>
                </div>

                <div className="step-nav">
                  <button className="btn-ghost" onClick={()=>{setStep(2);window.scrollTo(0,0);}}>← Atrás</button>
                  <button className="btn-outline" onClick={()=>{
                    const valid = photos.filter(Boolean);
                    const min = tipo==="lote" ? 1 : 2;
                    if(valid.length < min) { setErrPhoto(true); return; }
                    setErrPhoto(false); setScreen("contact"); window.scrollTo(0,0);
                  }}>Ver mi tasación →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {screen==="contact" && (
          <div className="contact-screen">
            <div className="contact-eyebrow">Último paso</div>
            <h2 className="contact-title">¿Cómo te <em>llamás?</em></h2>
            <p className="contact-sub">
              Tu tasación está lista. Solo necesitamos tu nombre y un número de WhatsApp para mostrártela al instante.
              <br/>No te vamos a llamar ni a mandar spam — prometido.
            </p>
            <div className="contact-card">
              <div className="contact-field" style={{marginBottom:20}}>
                <label>Tu nombre</label>
                <input ref={nombreRef} className="contact-input" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="María"
                  onKeyDown={e=>e.key==="Enter"&&document.getElementById("wa-input")&&document.getElementById("wa-input").focus()}/>
              </div>
              <div className="contact-field">
                <label>WhatsApp</label>
                <input id="wa-input" className="contact-input" type="tel" value={whatsapp} onChange={e=>setWhatsapp(e.target.value)}
                  placeholder="11 5555 1234" onKeyDown={e=>e.key==="Enter"&&submitContact()}/>
                <div className="contact-wa-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.69A2 2 0 012 .9h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  Solo te enviamos un mensaje con tu tasación.
                </div>
              </div>
            </div>
            {apiError && (
              <div style={{marginTop:16,background:"#FFF8ED",border:"1.5px solid #F59E0B",borderRadius:"var(--radius)",padding:"24px 20px",textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:12}}>🔧</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:600,color:"#92400E",marginBottom:8}}>¡Ups! Algo salió mal</div>
                <p style={{fontSize:13,color:"#78350F",lineHeight:1.6,marginBottom:16}}>
                  Estamos teniendo un inconveniente técnico. Tu propiedad merece una tasación precisa.<br/><br/>
                  <strong>¿Podés intentarlo nuevamente en unos minutos?</strong>
                </p>
                <button onClick={()=>{setApiError("");setRawDebug("");}}
                  style={{background:"#F59E0B",color:"white",border:"none",borderRadius:8,padding:"10px 24px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                  Volver a intentar
                </button>
                {rawDebug && (
                  <div style={{marginTop:12,fontSize:10,color:"#92400E",fontFamily:"monospace",textAlign:"left",background:"rgba(0,0,0,0.05)",padding:8,borderRadius:4,wordBreak:"break-all"}}>
                    {rawDebug}
                  </div>
                )}
              </div>
            )}
            <button className="contact-submit" onClick={submitContact} disabled={!nombre.trim()||!whatsapp.trim()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              Ver mi tasación
            </button>
            <button className="contact-skip" onClick={()=>callApi(true)}>Prefiero no dejar mis datos</button>
          </div>
        )}

        {screen==="loading" && (
          <div className="loading-screen">
            <div className="ring"/>
            <div className="loading-title">Analizando tu propiedad…</div>
            <div className="loading-sub">Buscando comparables reales en el mercado</div>
            <div style={{marginTop:20,background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"12px 16px",maxWidth:280,textAlign:"center"}}>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",lineHeight:1.6}}>
                Podés minimizar la pantalla tranquilamente — estamos trabajando en tu tasación. Volvé en unos segundos.
              </div>
            </div>
            <div className="loading-steps">
              {LOAD_STEPS.map((l,i)=>(
                <div key={i} className={"ls"+(loadStep===i+1?" active":loadStep>i+1?" done":"")}>
                  <div className="ls-dot"/>{l}
                </div>
              ))}
            </div>
          </div>
        )}

        {screen==="result" && result && (
          <div className="result">
            <div className="result-header">
              <div className="res-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Tasación completada</div>
              <div className="res-price">{fmt(result.valor_usd)}</div>
              <div className="res-range">Rango: {fmt(result.rango_min_usd)} – {fmt(result.rango_max_usd)} · {fmt(result.precio_m2_usd)}/m²</div>
              <div className="res-addr">{result.address}</div>
            </div>

            {/* Botón WhatsApp prominente */}
            <a href={waLink(result)}
              target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:"#25D366",color:"white",padding:"16px 24px",borderRadius:"var(--radius)",marginBottom:16,textDecoration:"none",fontSize:16,fontWeight:700,boxShadow:"0 4px 16px rgba(37,211,102,0.4)"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              📲 Hablar con un asesor
            </a>

            {/* Botón flotante */}
            <a href={waLink(result)}
              target="_blank" rel="noopener noreferrer"
              style={{position:"fixed",bottom:24,right:20,background:"#25D366",color:"white",borderRadius:"50%",width:56,height:56,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(37,211,102,0.5)",zIndex:999,textDecoration:"none"}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>

            {nombre && (
              <div style={{background:"var(--azul-light)",border:"1px solid var(--azul-mid)",borderRadius:"var(--radius)",padding:"16px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:22,flexShrink:0}}>👋</div>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--azul)",marginBottom:2}}>¡Gracias, {nombre.split(" ")[0]}!</div>
                  <div style={{fontSize:12,color:"var(--ink-3)",lineHeight:1.5}}>Nos comunicamos con vos por WhatsApp a la brevedad para hablar sobre tu propiedad. Sin compromiso.</div>
                </div>
              </div>
            )}

            {result.costo_refaccion_usd > 0 && (
                <div style={{background:"#FFF8E7",border:"1.5px solid #F59E0B",borderRadius:12,padding:"16px 20px",marginBottom:16}}>
                  <div style={{fontWeight:700,color:"#92400E",fontSize:14,marginBottom:6}}>Refacción integral recomendada</div>
                  <div style={{fontSize:13,color:"#78350F",lineHeight:1.6}}>
                    Inversión estimada: <strong>USD {result.costo_refaccion_usd.toLocaleString("es-AR")}</strong> ({supCub||supTotal} m² × USD 650/m²)
                  </div>
                  <div style={{fontSize:12,color:"#92400E",marginTop:8}}>
                    Valor estimado post-refacción: <strong>USD {(result.valor_usd + result.costo_refaccion_usd).toLocaleString("es-AR")}</strong>
                  </div>
                </div>
              )}
            {result.alerta_estructural && (
              <div style={{background:"#FFF8ED",border:"1.5px solid #F59E0B",borderRadius:"var(--radius)",padding:"20px",marginBottom:16,display:"flex",alignItems:"flex-start",gap:14}}>
                <div style={{fontSize:28,flexShrink:0,lineHeight:1}}>⚠️</div>
                <div>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:17,fontWeight:600,color:"#92400E",marginBottom:6}}>Atención</div>
                  <p style={{fontSize:13,color:"#78350F",lineHeight:1.65}}>
                    Notamos indicios de deterioro estructural en las fotos. Por tu seguridad y la de tu familia, te recomendamos consultar con un <strong>arquitecto o maestro mayor de obras</strong> antes de tomar cualquier decisión.
                  </p>
                </div>
              </div>
            )}

            <div className="res-grid">
              <div className="res-card">
                <div className="card-title">Estado detectado por IA</div>
                {(result.scores||[]).map(s=>(
                  <div key={s.nombre} className="score-row">
                    <span className="score-name">{s.nombre}</span>
                    <div className="score-bg"><div className="score-fill" style={{width:s.valor*10+"%"}}/></div>
                    <span className="score-val">{s.valor}/10</span>
                  </div>
                ))}
              </div>
              <div className="res-card">
                <div className="card-title">Precio promedio/m² · {(result.comparables||[]).filter(c=>c.precio_usd>0).length} comparables</div>
                {(() => {
                  const comps = (result.comparables||[]).filter(c=>c.precio_usd>0&&c.m2>0);
                  const avgM2 = comps.length ? Math.round(comps.reduce((s,c)=>s+c.precio_usd/c.m2,0)/comps.length) : 0;
                  return avgM2 > 0 ? (
                    <div style={{textAlign:"center",padding:"12px 0 16px"}}>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:32,fontWeight:600,color:"var(--azul)"}}>USD {avgM2.toLocaleString("es-AR")}</div>
                      <div style={{fontSize:11,color:"var(--ink-4)",marginTop:4}}>precio promedio por m² en la zona</div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>

            <div className="res-card-full" style={{marginBottom:16}}>
              <div className="card-title">Comparables de mercado</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                {(result.comparables||[]).map((c,i)=>(
                  <div key={i} className="comp-item" style={{paddingLeft:i%2===1?12:0,borderLeft:i%2===1?"1px solid var(--border)":"none"}}>
                    <div><div className="comp-addr">{c.direccion}</div><div className="comp-detail">{c.barrio} · {c.m2} m² · {c.fuente}</div></div>
                    <div><div className="comp-price">{fmt(c.precio_usd)}</div><div className="comp-sqm">USD {Math.round(c.precio_usd/c.m2)}/m²</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="res-card-full">
              <div className="card-title">Factores que influyen en el precio</div>
              {(result.factores||[]).map((f,i)=>(
                <div key={i} className="factor">
                  <div className={"ficon "+f.tipo}>{f.tipo==="pos"?"↑":f.tipo==="neg"?"↓":"→"}</div>
                  <div><div className="factor-body"><strong style={{fontWeight:500}}>{f.titulo}</strong> — {f.descripcion}</div><div className="factor-impact">{f.impacto}</div></div>
                </div>
              ))}
            </div>

            <div className="res-card-full">
              <div className="card-title">Análisis detallado</div>
              <div className="analysis-text">{result.analisis}</div>
            </div>

            <div className="disclaimer">
              Tasación orientativa generada por IA con datos de mercado públicos.<br/>
              Para una valuación oficial consultá con un martillero matriculado.
              <br/><br/>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                <button className="btn-ghost" onClick={resetAll}>← Nueva tasación</button>
                <button className="btn-outline" onClick={()=>generatePDF(result, result.address, photos)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                  Descargar informe PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {screen==="admin-login" && (
          <div className="login-screen">
            <div className="login-box">
              <div className="login-title">Bienvenido</div>
              <div className="login-sub">Acceso para asesores.</div>
              <div className="field">
                <label>Contraseña</label>
                <input type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&adminLogin()} placeholder="••••••••"/>
                {adminErr && <div className="login-err">{adminErr}</div>}
              </div>
              <button className="btn-outline" style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={adminLogin}>Ingresar →</button>
              <div style={{marginTop:12,textAlign:"center"}}>
                <button className="btn-ghost" style={{fontSize:11,padding:"8px 16px"}} onClick={()=>setScreen("hero")}>← Volver</button>
              </div>
            </div>
          </div>
        )}

        {screen==="admin" && (
          <div className="admin-screen">
            <div className="admin-header">
              <div className="admin-title">Panel de leads</div>
              <button className="btn-ghost" onClick={()=>{setScreen("hero");setAdminPass("");}}>Salir →</button>
            </div>
            <div className="admin-stats">
              <div className="admin-stat"><span className="admin-stat-n">{leads.length}</span><span className="admin-stat-l">Leads totales</span></div>
              <div className="admin-stat"><span className="admin-stat-n">{leads.filter(l=>l.whatsapp).length}</span><span className="admin-stat-l">Con WhatsApp</span></div>
              <div className="admin-stat"><span className="admin-stat-n">{leads.filter(l=>l.operacion==="venta").length}</span><span className="admin-stat-l">Para venta</span></div>
              <div className="admin-stat"><span className="admin-stat-n">{leads.filter(l=>l.operacion==="alquiler").length}</span><span className="admin-stat-l">Para alquiler</span></div>
              <div className="admin-stat"><span className="admin-stat-n">{Object.values(leadStatuses).filter(s=>s==="en_proceso").length}</span><span className="admin-stat-l">En proceso</span></div>
              <div className="admin-stat"><span className="admin-stat-n">{Object.values(leadStatuses).filter(s=>s==="cerrado").length}</span><span className="admin-stat-l">Cerrados</span></div>
            </div>
            {leads.length===0 ? (
              <div className="empty-leads">
                <div style={{fontSize:32,marginBottom:12}}>📭</div>
                Todavía no hay leads.<br/>
                <span style={{fontSize:12}}>Aparecerán aquí cuando alguien complete una tasación.</span>
              </div>
            ) : (
              <table className="leads-table">
                <thead><tr><th>Contacto</th><th>Propiedad</th><th>Tasación</th><th>Fecha</th><th>Estado</th></tr></thead>
                <tbody>
                  {leads.map(l=>(
                    <tr key={l.id}>
                      <td>
                        <div className="lead-name">{l.nombre||<span style={{color:"var(--ink-4)",fontStyle:"italic"}}>Anónimo</span>}</div>
                        {l.whatsapp&&<div className="lead-contact">📱 {l.whatsapp}</div>}
                        {l.whatsapp ? (
                          <a href={"https://wa.me/54"+l.whatsapp.replace(/\D/g,"")+"?text="+encodeURIComponent("Hola "+(l.nombre?l.nombre.split(" ")[0]:"")+"! Te contacto desde TasaLibre. Vi que tasaste tu "+l.tipo+" en "+l.address+". Tuviste oportunidad de ver el informe? Tenes alguna consulta sobre el valor?")}
                            target="_blank" rel="noopener noreferrer"
                            style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:8,background:"#25D366",color:"white",padding:"6px 14px",borderRadius:100,fontSize:12,fontWeight:600,textDecoration:"none"}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Contactar
                          </a>
                        ) : <div className="badge-cold">Sin contacto</div>}
                      </td>
                      <td>
                        <div className="lead-prop" style={{textTransform:"capitalize"}}>{l.tipo} · {l.operacion}</div>
                        <div className="lead-prop">{l.address}</div>
                        <div className="lead-prop">{l.ambientes} amb · {l.dormitorios} dorm{l.supTotal?" · "+l.supTotal+" m²":""}</div>
                      </td>
                      <td>
                        <div className="lead-price">{fmt(l.valorUsd)}</div>
                        <div style={{fontSize:11,color:"var(--ink-4)",marginTop:2}}>{fmt(l.precioM2)}/m²</div>
                      </td>
                      <td><div className="lead-date">{l.fecha}</div></td>
                      <td>
                        <select className={"status-select status-"+(leadStatuses[l.id]||"pendiente")}
                          value={leadStatuses[l.id]||"pendiente"}
                          onChange={e=>updateLeadStatus(l.id,e.target.value)}>
                          <option value="pendiente">🟡 Pendiente</option>
                          <option value="contactado">🔵 Contactado</option>
                          <option value="en_proceso">🟢 En proceso</option>
                          <option value="cerrado">⚫ Cerrado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </>
  );
}
