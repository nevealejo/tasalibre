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
  .footer-fade { height: 28px; background: var(--bg); }
  .site-footer { background: #1B4FD8; color: rgba(255,255,255,0.85); padding: 24px 32px 16px; box-shadow: 0 -8px 28px rgba(15,25,35,.14), 0 -2px 8px rgba(15,25,35,.08); position: relative; }
  .footer-main { display: flex; justify-content: space-between; align-items: flex-start; gap: 32px; max-width: 680px; margin: 0 auto; flex-wrap: wrap; }
  .footer-brand { display: flex; flex-direction: column; gap: 10px; }
  .footer-tagline { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.4; }
  .footer-location { font-size: 12px; color: rgba(255,255,255,0.45); display: flex; align-items: center; gap: 5px; }
  .footer-social { display: flex; align-items: center; gap: 20px; }
  .footer-social a { color: rgba(255,255,255,0.75); text-decoration: none; display: flex; align-items: center; gap: 7px; font-size: 13px; transition: color 0.2s; }
  .footer-social a:hover { color: white; }
  .footer-divider { border: none; border-top: 1px solid rgba(255,255,255,0.1); max-width: 680px; margin: 18px auto 12px; }
  .footer-legal { text-align: center; font-size: 11px; color: rgba(255,255,255,0.35); max-width: 680px; margin: 0 auto; }
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
  .comp-item { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); }
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
const AMENITY_DEPTO = ["Cochera","Cochera doble","Pileta","Gimnasio","SUM","Seguridad 24h","Parrilla"];
const AMENITY_CASA = ["Cochera","Cochera doble","Pileta","Patio","Jardín","Terraza","Parrilla","Galería/Quincho","Playroom","Dormitorio principal en suite","Techos altos","Aberturas DVH","Lavadero","Lote a laguna"];
const AMENITY_PH = ["Cochera","Cochera doble","Pileta","Patio","Parrilla","Aberturas DVH"];
const LOAD_STEPS = ["Analizando fotos con IA","Buscando comparables en el mercado","Validando precios de la zona","Calculando valor de mercado","Generando informe de tasación"];

const LOGO_NAV_SRC = "data:image/png;base64,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";

const LOGO_SRC = "data:image/png;base64,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";

// ── Validación de celular argentino ─────────────────────────────────────────
// Normaliza el número a "característica + número" (10 dígitos, ej: 1155551234).
// Acepta formatos con +54, 549, 0 inicial, espacios, guiones y paréntesis.
// Devuelve el número normalizado o null si es inválido.
// Característica válida: 11 (AMBA) o 2xx/3xx (interior del país).
function normalizarCelularAR(raw) {
  let d = (raw || "").replace(/\D/g, "");
  if (d.startsWith("549")) d = d.slice(3);
  else if (d.startsWith("54") && d.length >= 12) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length !== 10) return null;
  if (!/^(11|2\d|3\d)/.test(d)) return null;
  return d;
}
// Mensaje de error específico según el problema detectado
function errorCelularAR(raw) {
  let d = (raw || "").replace(/\D/g, "");
  if (d.startsWith("549")) d = d.slice(3);
  else if (d.startsWith("54") && d.length >= 12) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.startsWith("15")) return "Ingresá el número con código de área y sin el 15 (ej: 11 5555 1234).";
  if (d.length < 10) return "El número está incompleto. Ingresalo con código de área (ej: 11 5555 1234).";
  if (d.length > 10) return "El número tiene dígitos de más. Ingresalo sin 0 y sin 15 (ej: 11 5555 1234).";
  if (!/^(11|2\d|3\d)/.test(d)) return "El código de área no parece válido. Revisá el número (ej: 11 5555 1234).";
  return "";
}

// ── BLOQUE 1: normalización de moneda — la hace el código, no la IA ────────
// Todo precio pasa por acá ANTES de sumarse a cualquier promedio, mediana o
// ancla. Sin esto, un alquiler de USD 600 y uno de ARS 1.500.000 se
// promediarían como si fueran la misma unidad.
function normalizarAUsd(precio, moneda, dolarBlueRate) {
  if (!precio) return null;
  const m = (moneda || "").toLowerCase();
  if (m === "usd" || m === "dolares" || m === "u$s") return precio;
  if (!dolarBlueRate) return null; // sin cotización, no normalizamos a ciegas
  return Math.round(precio / dolarBlueRate);
}

// ── BLOQUE 2: motor determinístico de ajustes estructurales ────────────────
// disposición, ascensor, balcón, hall, estado y acceso de PH ya son datos
// conocidos del formulario (los eligió el usuario en el wizard) — no hace
// falta que la IA los adivine ni que sume los porcentajes. Cocina/baños/
// luminosidad sí requieren fotos, pero la IA solo clasifica (categoría),
// nunca calcula el %.
const AJUSTES = {
  disposicion: { frente: 0, lateral: -0.05, contrafrente: -0.10, interno: -0.12 },
  ascensor: { con: 0, sin_bajo: -0.05, sin_alto: -0.10 }, // sin_bajo = hasta 2do piso
  balcon: { si: 0.05, no: 0 },
  hall: { moderno: 0.03, bueno: 0, antiguo: -0.02, deteriorado: -0.05 },
  estado: {
    a_estrenar: 0.08, refaccionado: 0.08, muy_bueno: 0.04,
    bueno: 0, a_reciclar: -0.08, muy_deteriorado: -0.15,
  },
  cocina: { renovada: 0.05, normal: 0, a_renovar: -0.05 },
  banos: { renovados: 0.05, normal: 0, a_renovar: -0.05 },
  luminosidad: { superior: 0.03, normal: 0, inferior: -0.03 },
};
const TECHO_AJUSTE = { max: 0.15, min: -0.20 };
const BONUS_LOTE_A_LAGUNA = 0.10; // se aplica DESPUÉS del techo, a propósito

function ajustePhAcceso({ alFrente, pasillo, escalera, accesoDeteriorado }) {
  let pct = 0;
  if (alFrente) pct = 0;
  else if (pasillo && escalera === "piso2plus") pct = -0.20;
  else if (pasillo && escalera === "piso1") pct = -0.15;
  else if (escalera === "piso2plus") pct = -0.10;
  else if (escalera === "piso1") pct = -0.05;
  else if (pasillo) pct = -0.10;
  if (accesoDeteriorado) pct -= 0.05;
  return pct;
}

function calcularAjusteEstructural(input) {
  const detalle = [];
  const add = (factor, pct) => { if (pct) detalle.push({ factor, pct }); return pct; };
  let total = 0;
  if (input.disposicion) total += add("disposicion", AJUSTES.disposicion[input.disposicion] ?? 0);
  if (input.ascensor !== undefined) {
    const pct = input.ascensor ? AJUSTES.ascensor.con
      : input.pisoBajo ? AJUSTES.ascensor.sin_bajo : AJUSTES.ascensor.sin_alto;
    total += add("ascensor", pct);
  }
  if (input.balcon !== undefined) total += add("balcon", input.balcon ? AJUSTES.balcon.si : AJUSTES.balcon.no);
  if (input.hall) total += add("hall", AJUSTES.hall[input.hall] ?? 0);
  if (input.estado) total += add("estado", AJUSTES.estado[input.estado] ?? 0);
  if (input.phAcceso) total += add("ph_acceso", ajustePhAcceso(input.phAcceso));
  return { pctEstructural: total, detalle };
}

function calcularAjusteSecundario(clasificacion) {
  const { cocina, banos, luminosidad } = clasificacion || {};
  const detalle = [];
  const add = (factor, pct) => { if (pct) detalle.push({ factor, pct }); return pct; };
  let total = 0;
  if (cocina) total += add("cocina", AJUSTES.cocina[cocina] ?? 0);
  if (banos) total += add("banos", AJUSTES.banos[banos] ?? 0);
  if (luminosidad) total += add("luminosidad", AJUSTES.luminosidad[luminosidad] ?? 0);
  return { pctSecundario: total, detalle };
}

function combinarAjustes({ pctEstructural = 0, pctSecundario = 0, loteALaguna = false }) {
  const pctCrudo = pctEstructural + pctSecundario;
  const pctFinal = Math.min(TECHO_AJUSTE.max, Math.max(TECHO_AJUSTE.min, pctCrudo));
  let factorFinal = 1 + pctFinal;
  if (loteALaguna) factorFinal *= 1 + BONUS_LOTE_A_LAGUNA;
  return { pctFinal, factorFinal, techoAplicado: pctCrudo !== pctFinal };
}

// ── BLOQUE 3: blindaje del precio final contra el ancla calculada por
// código. Antes esto solo se le PEDÍA a la IA por texto ("no te alejes más
// de ±20%"); acá se VERIFICA y se corrige si hace falta. ──────────────────
function clampearContraAncla(precioM2IA, anclaCalculada, tolerancia = 0.20) {
  if (!anclaCalculada || !precioM2IA) {
    return { precioM2Final: precioM2IA, corregido: false, anclaCalculada: anclaCalculada || null };
  }
  const min = anclaCalculada * (1 - tolerancia);
  const max = anclaCalculada * (1 + tolerancia);
  if (precioM2IA < min || precioM2IA > max) {
    return { precioM2Final: Math.min(max, Math.max(min, precioM2IA)), corregido: true, anclaCalculada };
  }
  return { precioM2Final: precioM2IA, corregido: false, anclaCalculada };
}

// ── BLOQUE 6: los "factores" que ve el usuario se arman a partir de los
// mismos ajustes que se usaron para calcular el precio — no de una
// redacción aparte de la IA que podría no coincidir con el número real. ───
const TEXTOS_FACTOR = {
  disposicion: {
    "-0.05": { titulo: "Disposición lateral", desc: "impacta algo la luminosidad respecto al frente" },
    "-0.1": { titulo: "Disposición contrafrente", desc: "menor luminosidad y más ruido interno que el frente" },
    "-0.12": { titulo: "Disposición interna", desc: "sin vista directa a la calle, reduce el valor respecto al frente" },
  },
  ascensor: {
    "-0.05": { titulo: "Sin ascensor (piso bajo)", desc: "hasta 2do piso, impacto moderado" },
    "-0.1": { titulo: "Sin ascensor (piso alto)", desc: "3er piso o más sin ascensor" },
  },
  balcon: { "0.05": { titulo: "Con balcón", desc: "suma valor respecto a unidades sin balcón" } },
  hall: {
    "0.03": { titulo: "Hall moderno", desc: "palier renovado, suma valor" },
    "-0.02": { titulo: "Hall antiguo", desc: "prolijo pero sin renovar" },
    "-0.05": { titulo: "Hall deteriorado", desc: "impacta la primera impresión del edificio" },
  },
  estado: {
    "0.08": { titulo: "Estado muy por encima del promedio", desc: "a estrenar o refaccionado a nuevo" },
    "0.04": { titulo: "Estado muy bueno", desc: "por encima del promedio de la zona" },
    "-0.08": { titulo: "Requiere refacción", desc: "por debajo del promedio de la zona" },
    "-0.15": { titulo: "Muy deteriorado", desc: "con problemas estructurales" },
  },
  cocina: {
    "0.05": { titulo: "Cocina renovada", desc: "a nuevo, suma valor" },
    "-0.05": { titulo: "Cocina a renovar", desc: "resta valor respecto al promedio" },
  },
  banos: {
    "0.05": { titulo: "Baños renovados", desc: "a nuevo, suman valor" },
    "-0.05": { titulo: "Baños a renovar", desc: "restan valor respecto al promedio" },
  },
  luminosidad: {
    "0.03": { titulo: "Luminosidad superior", desc: "muy por encima del promedio de la zona" },
    "-0.03": { titulo: "Luminosidad inferior", desc: "muy por debajo del promedio de la zona" },
  },
};

function generarFactores(detalleCompleto) {
  const factores = (detalleCompleto || []).map(({ factor, pct }) => {
    if (factor === "ph_acceso") {
      return {
        tipo: pct > 0 ? "pos" : pct < 0 ? "neg" : "neu",
        titulo: "Acceso del PH",
        descripcion: "ajuste por tipo de acceso (frente, pasillo o escalera)",
        impacto: (pct > 0 ? "+" : "") + Math.round(pct * 100) + "%",
      };
    }
    const info = (TEXTOS_FACTOR[factor] || {})[String(pct)];
    return {
      tipo: pct > 0 ? "pos" : pct < 0 ? "neg" : "neu",
      titulo: (info && info.titulo) || factor,
      descripcion: (info && info.desc) || "",
      impacto: (pct > 0 ? "+" : "") + Math.round(pct * 100) + "%",
    };
  });
  if (factores.length === 0) {
    factores.push({ tipo: "neu", titulo: "Zona", descripcion: "precio en línea con el promedio de la zona", impacto: "Neutro" });
  }
  return factores;
}

// ── BLOQUE 4: índice de confianza — 100% determinístico, nunca se le
// pregunta a la IA. ────────────────────────────────────────────────────────
function calcularConfianza({
  comparablesEncontrados = 0,
  hayAncla = false,
  seAlejoDelAncla = false,
  camposFaltantes = 0,
  busquedasFallidas = 0,
  esFallbackSinComparables = false,
}) {
  let score = 100;
  if (esFallbackSinComparables) score -= 35;
  if (!hayAncla) score -= 25;
  if (comparablesEncontrados < 3) score -= 15;
  if (seAlejoDelAncla) score -= 20;
  score -= Math.min(15, camposFaltantes * 3);
  score -= Math.min(15, busquedasFallidas * 8);
  score = Math.max(0, Math.min(100, score));
  const nivel = score >= 75 ? "alta" : score >= 50 ? "media" : "baja";
  return { score, nivel };
}

// ── BLOQUE 5: calibración empírica — ajusta la confianza según el error
// histórico real de correcciones para ese mismo bucket. Sin historial
// todavía => no toca nada (neutral). ───────────────────────────────────────
function calibrarConfianzaConHistorico(confianzaBase, errorPromedioHistoricoBucket) {
  if (errorPromedioHistoricoBucket == null) return confianzaBase;
  const penalizacion = Math.round(errorPromedioHistoricoBucket * 100);
  const score = Math.max(0, Math.min(100, confianzaBase.score - penalizacion));
  const nivel = score >= 75 ? "alta" : score >= 50 ? "media" : "baja";
  return { score, nivel };
}

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
  const [estado, setEstado] = useState("bueno");
  const [photos, setPhotos] = useState(Array(6).fill(null));

  // Contact — solo nombre y whatsapp
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errWhatsapp, setErrWhatsapp] = useState("");

  // Casa extras
  const [casaSubtipo, setCasaSubtipo] = useState(""); // "tradicional" | "cerrado"
  const [deptoSubtipo, setDeptoSubtipo] = useState(""); // "tradicional" | "cerrado"
  const [sectorBarrio, setSectorBarrio] = useState(""); // sub-barrio / sector
  const [addrWarning, setAddrWarning] = useState(false); // dirección no verificada
  const [adminSearch, setAdminSearch] = useState(""); // búsqueda en admin
  const [adminFilter, setAdminFilter] = useState("todos"); // filtro estado admin
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
  const [loteEntorno, setLoteEntorno] = useState("residencial"); // "residencial" | "centrico" — solo lote urbano
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

  // ── BLOQUE 5: loop de calibración — loguea la corrección manual de un
  // asesor (valor real de venta cerrada, o ajuste tras revisión) para poder
  // medir con el tiempo qué tan bien tasa el sistema por zona/tipo.
  const [correctionDrafts, setCorrectionDrafts] = useState({});
  const [correctionSaved, setCorrectionSaved] = useState({});
  const submitCorrection = async (id) => {
    const valorCorregido = Number(correctionDrafts[id]);
    if (!valorCorregido || valorCorregido <= 0) return;
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, valorCorregido })
      });
      setCorrectionSaved(prev => ({ ...prev, [id]: true }));
    } catch(e) {}
  };

  const saveLead = async (lead) => {
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          html_informe: lead.htmlInforme || null,
          resultado_json: lead.resultadoJson || null,
        })
      });
      const resp = await r.json().catch(() => null);
      console.log("Lead guardado — diagnóstico:", r.status, resp);
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
  const generatePDF = (result, address, photos = [], returnHtml = false) => {
    const fmt = n => n ? 'USD ' + Number(n).toLocaleString('es-AR') : '—';
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
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;align-items:start;">
          ${validPhotos.map(p => `<div style="page-break-inside:avoid;break-inside:avoid;"><img src="${p.dataUrl}" style="display:block;width:100%;height:auto;border-radius:8px;border:1px solid #E2E8F0;"/></div>`).join('')}
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

    if (returnHtml) return html;
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
    const globalTimeout = setTimeout(() => controller.abort(), 280000);

    const esBarrioCerrado = (tipo==="casa" && casaSubtipo==="cerrado") || ((tipo==="departamento"||tipo==="ph") && deptoSubtipo==="cerrado");
    const address = esBarrioCerrado
      ? [calle, casaNombreBarrio, sectorBarrio, barrio, provincia].filter(Boolean).join(", ")
      : [calle, numero, barrio, provincia].filter(Boolean).join(", ");

    try {
      const calleRef = calle ? calle + " " : "";
      const zonaRef = barrio + " " + provincia;
      const supRef = supTotal ? supTotal + "m2 " : "";
      const dormRef = (tipo === "departamento" || tipo === "casa" || tipo === "ph") ? dormitorios + " dormitorios " : "";

      const buildQueries = () => {
        const op = operacion === "alquiler" ? "alquiler" : "venta";
        const moneda = operacion === "alquiler" ? "pesos mensuales" : "dolares";
        const monedaShort = operacion === "alquiler" ? "pesos" : "dolares";

        // Para barrio cerrado: el nombre del barrio ES el filtro principal
        const esCerrado = casaSubtipo === "cerrado" || deptoSubtipo === "cerrado" || loteSubtipo === "cerrado";
        const nombreBarrio = casaNombreBarrio || nombreBarrioPrivado || "";
        const sectorRef = sectorBarrio ? " " + sectorBarrio : "";
        const nombreCompleto = nombreBarrio + sectorRef;

        if (tipo === "lote" && loteSubtipo === "cerrado") {
          return [
            `lote terreno ${op} "${nombreCompleto}" site:inmuebles.mercadolibre.com.ar`,
            `terreno en ${op} ${nombreCompleto} ${barrio} mercadolibre ${monedaShort}`,
            `lotes ${op} "${nombreCompleto}" precios zonaprop`,
          ];
        }
        if (tipo === "lote" && loteSubtipo === "urbano") {
          if (loteEntorno === "centrico") {
            return [
              "lote apto edificio " + barrio + " " + provincia + " " + op + " precio " + monedaShort,
              "terreno apto desarrollo emprendimiento " + barrio + " centro " + provincia + " " + monedaShort,
              "lote " + op + " " + calleRef + barrio + " zonificacion FOT " + monedaShort + " mercadolibre inmuebles",
            ];
          }
          return [
            "lote " + op + " " + calleRef + barrio + " " + provincia + " precio " + monedaShort + " zonaprop",
            "terreno " + op + " " + barrio + " " + provincia + " " + supRef + "precio " + monedaShort + " argenprop",
            "lote urbano " + barrio + " " + provincia + " " + op + " " + monedaShort + " mercadolibre inmuebles",
          ];
        }
        if (tipo === "departamento" && deptoSubtipo === "cerrado") {
          const cocheraFilter = (amenities.includes("Cochera") || amenities.includes("Cochera doble")) ? "con cochera " : "";
          return [
            `departamento ${op} "${nombreCompleto}" site:inmuebles.mercadolibre.com.ar`,
            `departamento en ${op} ${nombreCompleto} ${barrio} ${ambientes} ambientes ${cocheraFilter}mercadolibre ${monedaShort}`,
            `departamentos ${op} "${nombreCompleto}" precios zonaprop`,
          ];
        }
        if (tipo === "departamento") {
          const cocheraFilter = (amenities.includes("Cochera") || amenities.includes("Cochera doble")) ? "con cochera " : "sin cochera ";
          return [
            "departamento " + op + " " + calleRef + barrio + " " + provincia + " " + dormRef + cocheraFilter + "precio " + monedaShort + " zonaprop",
            "departamento " + op + " " + barrio + " " + provincia + " " + ambientes + " ambientes " + cocheraFilter + monedaShort + " argenprop",
            "depto " + op + " " + barrio + " " + provincia + " " + supRef + dormRef + cocheraFilter + monedaShort,
          ];
        }
        if (tipo === "casa" && casaSubtipo === "cerrado") {
          return [
            `casa ${op} "${nombreCompleto}" site:inmuebles.mercadolibre.com.ar`,
            `casa en ${op} ${nombreCompleto} ${barrio} ${dormRef}mercadolibre ${monedaShort}`,
            `casas ${op} "${nombreCompleto}" precios zonaprop`,
          ];
        }
        if (tipo === "casa") {
          return [
            "casa " + op + " " + calleRef + barrio + " " + provincia + " " + dormRef + "precio " + monedaShort + " zonaprop",
            "casa " + op + " " + barrio + " " + provincia + " " + supRef + monedaShort + " argenprop",
            "casa " + barrio + " " + provincia + " " + dormRef + supRef + op + " " + monedaShort,
          ];
        }
        if (tipo === "ph" && deptoSubtipo === "cerrado") {
          return [
            `ph ${op} "${nombreCompleto}" site:inmuebles.mercadolibre.com.ar`,
            `ph en ${op} ${nombreCompleto} ${barrio} mercadolibre ${monedaShort}`,
            `ph ${op} "${nombreCompleto}" precios zonaprop`,
          ];
        }
        if (tipo === "ph") {
          return [
            "PH " + op + " " + calleRef + barrio + " " + provincia + " precio " + monedaShort + " zonaprop",
            "PH " + op + " " + barrio + " " + provincia + " " + ambientes + " ambientes " + monedaShort + " argenprop",
            "ph " + barrio + " " + provincia + " " + op + " " + monedaShort,
          ];
        }
        if (tipo === "local") {
          return [
            "local comercial " + op + " " + calleRef + barrio + " " + provincia + " precio " + monedaShort + " zonaprop",
            "local " + op + " " + barrio + " " + provincia + " " + supRef + monedaShort + " argenprop",
            "local comercial " + barrio + " " + provincia + " " + op + " " + monedaShort + " mercadolibre",
          ];
        }
        return [
          tipo + " " + op + " " + calleRef + barrio + " " + provincia + " precio " + monedaShort + " zonaprop",
          tipo + " " + op + " " + barrio + " " + provincia + " " + monedaShort + " argenprop",
          tipo + " " + op + " " + barrio + " " + provincia + " " + monedaShort + " mercadolibre inmuebles",
        ];
      };

      const queries = buildQueries();
      let comparablesData = "";
      let dolarBlue = 0;

      // Cotización dólar blue en tiempo real
      try {
        const dolarRes = await fetch("https://dolarapi.com/v1/dolares/blue");
        const dolarData = await dolarRes.json();
        dolarBlue = dolarData.venta || dolarData.compra || 0;
      } catch(e) { console.warn("No se pudo obtener cotización dólar:", e.message); }

      const esCerradoSearch = casaSubtipo === "cerrado" || deptoSubtipo === "cerrado" || loteSubtipo === "cerrado";
      const nombreBarrioCerradoEnrich = (casaNombreBarrio || nombreBarrioPrivado || "") + (sectorBarrio ? " " + sectorBarrio : "");
      const esLoteCentricoEnrich = tipo === "lote" && loteSubtipo === "urbano" && loteEntorno === "centrico";

      // ── BLOQUE 8: UNA sola llamada de enriquecimiento (geocode+Overpass+
      // estación+Tokko) antes de las 3 búsquedas en paralelo — antes esto se
      // repetía 3 veces (una por cada búsqueda) con el mismo resultado. No
      // manda coordenadas en barrio cerrado (address:"" — las calles
      // cercanas inducirían comparables externos al perímetro), pero Tokko
      // sí corre siempre: identifica por nombre de barrio, no por coordenadas.
      let streetContext = "";
      let tokkoContext = "";
      let tokkoComps = [];
      try {
        const enrichRes = await fetch("/api/tasar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            _enrichOnly: true,
            _meta: {
              address: esCerradoSearch ? "" : address, tipo, operacion,
              barrio: esCerradoSearch ? nombreBarrioCerradoEnrich : barrio,
              esCerrado: esCerradoSearch, loteCentrico: esLoteCentricoEnrich,
              supTotal, conCochera: amenities.includes("Cochera"),
            },
          }),
        });
        const enrichData = await enrichRes.json();
        streetContext = enrichData.streetContext || "";
        tokkoContext = enrichData.tokkoContext || "";
        tokkoComps = enrichData.tokkoComps || [];
      } catch(e) { console.warn("Enriquecimiento falló:", e.message); }

      setLoadStep(2);
      const precioLabel = operacion === "alquiler" ? "precio alquiler mensual (en dolares o pesos)" : "precio venta en dolares";
      const dolarContext = operacion === "alquiler" && dolarBlue > 0 ? " Tipo de cambio dolar blue hoy: $" + dolarBlue.toLocaleString("es-AR") + ". Si el precio está en pesos convertirlo a dolares usando ese tipo de cambio." : "";

      // Las 3 búsquedas EN PARALELO — ahorra 60-90 segundos
      const searchPromises = queries.map(q => {
        const nombreBarrioCerrado = (casaNombreBarrio || nombreBarrioPrivado || "") + (sectorBarrio ? " " + sectorBarrio : "");
        const esLoteCentrico = tipo === "lote" && loteSubtipo === "urbano" && loteEntorno === "centrico";
        const loteCentricoContext = esLoteCentrico
          ? "CRITICO LOTE CENTRICO: el lote a tasar esta en zona centrica/sobre avenida, donde el valor lo define la EDIFICABILIDAD (potencial de construccion), no el m2 residencial. Prioriza publicaciones de lotes 'apto edificio', 'apto desarrollo', 'ideal emprendimiento' de la misma localidad. IMPORTANTE: si el aviso menciona zonificacion (R2, R3, C1...), FOT, FOS o m2 construibles, COPIA ese dato textual en la misma linea del comparable — es el dato mas valioso. Si encontras lotes residenciales comunes ademas de los aptos desarrollo, incluí ambos pero marca cada linea con [DESARROLLO] o [RESIDENCIAL] al inicio. "
          : "";
        const bcContext = esCerradoSearch && nombreBarrioCerrado
          ? "CRITICO BARRIO CERRADO: buscar publicaciones (prioridad: MercadoLibre inmuebles) de propiedades DENTRO de \"" + nombreBarrioCerrado + "\"" + (sectorBarrio ? " (el barrio privado es \"" + (casaNombreBarrio||nombreBarrioPrivado) + "\" y DENTRO de este barrio hay varios complejos/sectores distintos con precios MUY diferentes entre si — el que importa aca es especificamente el sector \"" + sectorBarrio + "\", NO otros sectores del mismo barrio)" : "") + ". REGLA DE ORO: incluir una publicacion SOLO si su TITULO menciona explicitamente \"" + (casaNombreBarrio||nombreBarrioPrivado) + "\"" + (sectorBarrio ? " Y TAMBIEN \"" + sectorBarrio + "\"" : "") + " (ej: 'Casa en venta en " + nombreBarrioCerrado + "...'). Si el titulo NO nombra " + (sectorBarrio ? "AMBOS terminos" : "el barrio") + ", DESCARTARLA aunque la ubicacion o descripcion parezcan coincidir o este geograficamente cerca. NO uses paginas de estadisticas ni promedios zonales: solo publicaciones individuales con titulo verificado. CRITICO PRECIO: copia el precio EXACTAMENTE como aparece en el resultado de busqueda junto al titulo/superficie de ESA publicacion especifica (ej si dice 'US$269.000' escribi exactamente USD 269000, no redondees ni calcules). NUNCA uses precios de cocheras sueltas, expensas, cuotas de financiacion, ni precios de OTRA publicacion que aparezca cerca en el mismo resultado de busqueda — cada precio debe corresponder inequivocamente a la publicacion cuyo titulo estas citando. Si no podes identificar con certeza qué precio corresponde a qué publicacion, DESCARTA esa linea entera. "
          : "";
        const m2Label = tipo === "casa" ? "m2 CUBIERTOS/construidos (NO el lote/terreno total)" : "m2";
        const formatoEstricto = esCerradoSearch && nombreBarrioCerrado
          ? ` FORMATO OBLIGATORIO: respondé UNA propiedad por línea, cada línea así (todo en la misma línea, sin párrafos, separando cada campo con el caracter " | "): ${nombreBarrioCerrado} | "[título textual de la publicación]" | [dirección] | [${precioLabel} EXACTO tal cual aparece en la fuente] | [${m2Label}]. No agregues texto introductorio ni explicativo. Si una publicación no tiene el nombre del barrio en su título, NO la incluyas como línea. Si tenés dudas de qué precio corresponde a esa publicación puntual, NO la incluyas.` + (tipo === "casa" ? " CRITICO: si la publicacion menciona superficie de LOTE/TERRENO y superficie CUBIERTA/construida por separado, usa SIEMPRE la cubierta, nunca el lote." : "")
          : " FORMATO OBLIGATORIO: respondé UNA propiedad por línea, cada línea con TODOS los datos juntos, separando cada campo con el caracter \" | \" así: [direccion] | [" + precioLabel + "] | [" + m2Label + "]. No agregues texto introductorio ni explicativo, no agrupes propiedades en un mismo párrafo." + (tipo === "casa" ? " CRITICO: si la publicacion menciona superficie de LOTE/TERRENO y superficie CUBIERTA/construida por separado, usa SIEMPRE la cubierta, nunca el lote." : "");
        // BLOQUE 8: streetContext y tokkoContext ya se resolvieron UNA vez en
        // la llamada de enriquecimiento de arriba — antes tasar.js los volvía
        // a calcular por cada una de estas 3 búsquedas.
        const searchPrompt = tokkoContext + streetContext + bcContext + loteCentricoContext + "Busca propiedades en " + (operacion === "alquiler" ? "ALQUILER" : "VENTA") + " en portales inmobiliarios argentinos: " + q + ". Devuelve SOLO propiedades en " + operacion + ". Lista: " + precioLabel + ", m2, direccion exacta." + dolarContext + formatoEstricto + " Para el campo fuente usa siempre: Relevamiento de mercado.";
        return fetch("/api/tasar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: esCerradoSearch ? 700 : 400,
            tools: [{ type: "web_search_20250305", name: "web_search" }],
            messages: [{ role: "user", content: searchPrompt }],
          })
        })
        .then(r => r.text())
        .then(t => {
          const data = JSON.parse(t);
          if (data.error) return { error: data.error.message || "Error en búsqueda" };
          return { text: (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n") };
        })
        .catch(e => { console.warn("Search failed:", e.message); return { error: e.message }; });
      });

      setLoadStep(3);
      const searchResults = await Promise.all(searchPromises);
      const searchErrors = [];
      const nombreBarrioFiltro = (casaNombreBarrio || nombreBarrioPrivado || "").toLowerCase().trim();
      const sectorFiltro = (sectorBarrio || "").toLowerCase().trim();
      // Extracción numérica programática: no confiamos en que la 2da llamada a la IA
      // calcule bien el precio/m2 a partir del texto — lo calculamos nosotros mismos
      // de cada línea ya filtrada, así hay un ancla numérica verificable por código.
      const preciosM2Calculados = [];
      // BLOQUE 1: detecta USD **o** ARS en la línea y normaliza SIEMPRE a
      // dólares con normalizarAUsd() antes de calcular precio/m² — así un
      // alquiler en pesos y uno en dólares nunca se mezclan en la misma
      // cuenta. Antes, esto solo detectaba USD y descartaba silenciosamente
      // cualquier comparable en pesos (perdiendo datos reales de alquileres).
      const extraerPrecioM2 = (linea) => {
        const mUsd = linea.match(/USD\s*\$?\s*([\d][\d.,]{2,})/i) || linea.match(/US\$\s*([\d][\d.,]{2,})/i);
        const mArs = !mUsd && linea.match(/(?:ARS|AR\$)\s*([\d][\d.,]{2,})/i);
        const mPesoSuelto = !mUsd && !mArs && linea.match(/\$\s*([\d]{1,3}(?:[.,]\d{3}){2,})/); // $ seguido de un número grande (miles de pesos)
        const mM2 = linea.match(/(\d+(?:[.,]\d+)?)\s*m2/i);
        if ((!mUsd && !mArs && !mPesoSuelto) || !mM2) return;

        const moneda = mUsd ? "usd" : "ars";
        const precioRaw = parseInt((mUsd ? mUsd[1] : mArs ? mArs[1] : mPesoSuelto[1]).replace(/[^\d]/g, ""), 10);
        const precio = normalizarAUsd(precioRaw, moneda, dolarBlue);
        const m2 = parseFloat(mM2[1].replace(",", "."));
        if (precio && precio > 5000 && m2 > 10 && m2 < 2000) {
          const pm2 = Math.round(precio / m2);
          if (pm2 > 200 && pm2 < 20000) preciosM2Calculados.push(pm2);
        }
      };

      // ── BLOQUE 7: los comparables de Tokko ya vienen estructurados (de una
      // API real, no de texto scrapeado) — se suman directo al ancla acá,
      // sin depender de que la IA los relea y los retranscriba bien.
      for (const c of tokkoComps) {
        const precioUsd = normalizarAUsd(c.precio_usd, c.moneda, dolarBlue);
        if (precioUsd && c.m2 > 0) {
          const pm2 = Math.round(precioUsd / c.m2);
          if (pm2 > 200 && pm2 < 20000) preciosM2Calculados.push(pm2);
        }
      }

      for (const res of searchResults) {
        if (res.error) { searchErrors.push(res.error); continue; }
        if (!res.text || !res.text.trim()) continue;

        if (esCerradoSearch && nombreBarrioFiltro) {
          // FILTRO PROGRAMÁTICO: descartar líneas/fragmentos que NO mencionen el barrio
          // (Y el sector/complejo específico, si se cargó uno — un mismo barrio privado
          // grande puede tener sub-complejos con precios muy distintos entre sí,
          // ej "Nuevo Quilmes" tiene "Aquaterra" (premium) y "Residencias" (más económico):
          // exigir solo el nombre del barrio dejaría mezclar ambos y arruinar el promedio).
          // No confiamos solo en la instrucción a la IA — el web_search interno puede
          // ampliar la búsqueda por su cuenta e ignorar el site:/comillas.
          // Split robusto: saltos de línea, numeración (1. 2.), viñetas (•)
          // IMPORTANTE: NO se splitea por "-" — nuestro propio formato usa " | " como
          // separador de campos dentro de una misma línea (barrio | título | dirección | precio | m2),
          // así que un split por guión destrozaría cada comparable en pedazos.
          const partes = res.text
            .split(/\n+|(?=\d+[\.\)]\s)|(?=•\s)/)
            .map(s => s.trim())
            .filter(s => s.length > 10)
            .filter(linea => {
              const l = linea.toLowerCase();
              return l.includes(nombreBarrioFiltro) && (!sectorFiltro || l.includes(sectorFiltro));
            });
          partes.forEach(extraerPrecioM2);
          if (partes.length > 0) {
            comparablesData += " | " + partes.join(" | ").slice(0, 1500);
          }
          // Si NINGUNA línea menciona el barrio (y el sector si corresponde), se descarta todo el bloque

        } else {
          // BLOQUE 3: antes esta rama (mercado abierto) nunca alimentaba
          // preciosM2Calculados — el ancla solo existía para barrio cerrado.
          // Ahora se extraen los mismos precio/m2 verificados por código acá.
          res.text
            .split(/\n+|(?=\d+[\.\)]\s)|(?=•\s)/)
            .map(s => s.trim())
            .filter(s => s.length > 10)
            .forEach(extraerPrecioM2);
          comparablesData += " | " + res.text.slice(0, 1200);
        }

      }
      // Si las 3 búsquedas fallaron, es un error técnico real — no seguir
      if (searchErrors.length === queries.length && !comparablesData.trim()) {
        throw new Error("Error en búsqueda de comparables: " + searchErrors[0]);
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
        "Tipo:" + tipo + (loteSubtipo?"/"+loteSubtipo:"") + (casaSubtipo?"/"+casaSubtipo:"") + (casaNombreBarrio?" "+casaNombreBarrio:"") + (sectorBarrio?" ("+sectorBarrio+")":"") + (nombreBarrioPrivado?" "+nombreBarrioPrivado:""),
        "Dir:" + address + " Op:" + operacion,
        "Sup:" + (supTotal||"?") + "m2" + (tipo!=="lote"?" cub:"+(supCub||"?")+"m2":"") + " ant:" + (antiguedad||"?") + "a",
        tipo!=="lote" ? "Amb:"+ambientes+" dorm:"+dormitorios+" ban:"+banos+" est:"+estado.replace(/_/g," ") : "",
        tipo==="departamento" ? "piso:"+piso+" asc:"+(ascensor?"si":"no")+" balcon:"+(balcon?"si":"no")+" disp:"+(disposicion||"-")+" orient:"+(orientacion||"-")+" hall:"+(hallEstado||"-")+" expensas:"+(expensas?"$"+expensas:"N/A") : "",
         tipo==="ph" ? "PH acceso:" + (phAlFrente?"frente":([(phPasillo?"pasillo":""), (phEscalera==="piso1"?"escalera-1piso":phEscalera==="piso2plus"?"escalera-2piso+":"")].filter(Boolean).join("+") || "-")) + " ajuste:" + (phAlFrente?"0%":((phPasillo&&phEscalera==="piso2plus")?"-20%":(phPasillo&&phEscalera==="piso1")?"-15%":(phEscalera==="piso2plus")?"-10%":(phEscalera==="piso1")?"-5%":phPasillo?"-10%":"0%")) + (phAccesoEstado==="deteriorado"?" acc-det-5%":"") + " orient:" + (orientacion||"-") : "",
        tipo==="lote" ? "frente:"+loteFrente+"m fondo:"+loteFondo+"m zonif:"+zonificacion+" edif:"+(loteConEdificacion?"si":"no") : "",
        amenities.length ? "extras:"+amenities.join(",") : "",
        loteAdicionales.length ? "adicionales:"+loteAdicionales.join(",") : "",
      ].filter(Boolean).join(" | ");

      const sinComparablesBarrioCerrado = esCerradoSearch && nombreBarrioFiltro && !comparablesData.trim();
      const nombreBarrioCompletoWarn = nombreBarrioFiltro + (sectorFiltro ? " (sector " + sectorFiltro + ")" : "");

      // Ancla numérica verificada por código: mediana de precio/m2 calculado por
      // NOSOTROS (no por la IA). BLOQUE 3: ya no se limita a barrio cerrado —
      // corre para cualquier tipo de propiedad que tenga comparables válidos, y
      // se guarda en `anclaNumerica` para clampear el resultado final más abajo.
      let anclaCalculadaTxt = "";
      let anclaNumerica = null;
      if (preciosM2Calculados.length > 0) {
        const ordenados = [...preciosM2Calculados].sort((a, b) => a - b);
        const mediana = ordenados.length % 2 === 0
          ? Math.round((ordenados[ordenados.length/2 - 1] + ordenados[ordenados.length/2]) / 2)
          : ordenados[Math.floor(ordenados.length/2)];
        anclaNumerica = mediana;
        const zonaTxt = nombreBarrioCompletoWarn || barrio;
        anclaCalculadaTxt = " ANCLA CALCULADA POR CODIGO (verificada, no confies en tu propia aritmetica sobre el texto): mediana de precio/m2 de " + ordenados.length + " comparable(s) validos de " + zonaTxt + " = USD " + mediana.toLocaleString("es-AR") + "/m2 (valores individuales: " + ordenados.map(v=>"USD "+v.toLocaleString("es-AR")).join(", ") + "). Tu precio_base_m2_usd deberia estar cerca de esta ancla salvo que justifiques explicitamente por que (ej: muy pocos comparables, o el inmueble tasado difiere mucho en categoria) — el sistema va a verificarlo en codigo despues.";
      }

      const comparablesCtx = comparablesData
        ? "COMPARABLES(usa como base):" + comparablesData.slice(0, 3000) + anclaCalculadaTxt
        : (sinComparablesBarrioCerrado
            ? "ADVERTENCIA: no se encontraron comparables VERIFICADOS dentro de " + nombreBarrioCompletoWarn + " en esta busqueda. NO inventes precios de memoria. Usa tu conocimiento real del segmento (mismo barrio si tenes datos de otros sectores/complejos, o barrios cerrados de categoria similar en la misma zona) solo como referencia aproximada, ampliando el rango +-15%, y aclaralo en el analisis."
            : "Sin comparables online.");

      const prompt = "Sos tasador inmobiliario Argentina. CONSERVADOR y PRECISO.\n" +
        "PROPIEDAD: " + propData + "\n" +
        comparablesCtx + "\n" +
        (esCerradoSearch && (casaNombreBarrio||nombreBarrioPrivado)
          ? "REGLAS BARRIO CERRADO: 1)REGLA DE ORO: usar SOLO comparables cuyo TITULO de publicacion original mencione explicitamente \"" + (casaNombreBarrio||nombreBarrioPrivado) + "\"" + (sectorBarrio ? " Y TAMBIEN el sector/complejo \"" + sectorBarrio + "\"" : "") + " (los vendedores SIEMPRE ponen el nombre del barrio cerrado en el titulo porque es el argumento de venta; si el titulo no lo nombra, la propiedad NO es del barrio)." + (sectorBarrio ? " 1b)CRITICO SECTOR: el barrio \"" + (casaNombreBarrio||nombreBarrioPrivado) + "\" tiene VARIOS complejos/sectores internos con precios MUY diferentes entre si (a veces 30-50% de diferencia). NUNCA promediar comparables de otro sector distinto a \"" + sectorBarrio + "\" aunque esten dentro del mismo barrio cerrado — son productos distintos." : "") + " 2)PROHIBIDO usar propiedades fuera del perimetro aunque esten geograficamente cerca o en la misma localidad/partido: el m2 dentro del barrio cerrado vale 2-4 veces mas que afuera. 3)Antes de incluir un comparable en el JSON final, releelo: si su titulo NO tiene el nombre del barrio" + (sectorBarrio ? " Y el sector" : "") + ", NO LO INCLUYAS. 4)BASE DE CALCULO: el promedio de precio/m2 (sobre m2 CUBIERTOS) de los comparables con titulo verificado del MISMO TIPO es SIEMPRE la base principal. Un 'precio medio zonal' estadistico que aparezca en el contexto NUNCA es base: solo sirve como verificacion de coherencia (si tu promedio difiere mucho, revisa los comparables, pero decide con las publicaciones reales). 5)TIPO IMPORTA: dentro del mismo barrio cerrado, los DEPARTAMENTOS (especialmente a estrenar o recientes) valen 20-40% MAS por m2 que las casas. Si tasas un departamento y solo hay comparables de casas, ajusta hacia arriba. Si tasas una casa y solo hay deptos, ajusta hacia abajo. 6)SANITY CHECK FINAL: el precio/m2 resultante en un barrio cerrado consolidado NUNCA puede quedar por debajo de 1.5 veces el m2 de la localidad abierta circundante. Si tu calculo da menos, esta MAL: revisalo usando los comparables del barrio. 7)Si hay pocos comparables validos del barrio" + (sectorBarrio ? "/sector" : "") + ", usar barrios cerrados de categoria EQUIVALENTE en la misma zona, NUNCA barrio abierto. 8)Rango+-5%. 9)Si el contexto incluye una 'ANCLA CALCULADA POR CODIGO', esa cifra fue calculada matematicamente por el sistema (no por vos) a partir de los mismos comparables, y es mas confiable que tu propia lectura del texto: tu precio_m2_usd final debe estar dentro de +-20% de esa ancla, salvo justificacion explicita en el analisis.\n"
          : "REGLAS: 1)BASE DE CALCULO: precio_base_m2_usd es el promedio de precio/m2 (sobre m2 CUBIERTOS) de los comparables reales encontrados en la busqueda para " + address + " y su zona inmediata — NUNCA un valor de memoria, tope regional fijo, ni comparacion con otras zonas (CABA u otras). 2)Priorizar los 6 comparables MAS CERCANOS a " + address + " por sobre cualquier otro. 3)Si el contexto incluye una 'ANCLA CALCULADA POR CODIGO', tu precio_base_m2_usd debe estar dentro de +-20% de esa cifra, salvo justificacion explicita en el analisis. 4)Rango+-5%. 5)CONSERVADOR: ante pocos comparables, preferir un valor mas bajo antes que sobreestimar.\n") +
        (tipo === "lote" && loteSubtipo === "urbano" && loteEntorno === "centrico"
          ? "REGLAS LOTE CENTRICO (edificabilidad): 1)Este lote esta en zona centrica/sobre avenida: su valor lo define el POTENCIAL CONSTRUCTIVO, no el m2 residencial. 2)BASE: usar comparables marcados [DESARROLLO] o que mencionen 'apto edificio/desarrollo/emprendimiento' o zonificacion (R2, R3, C, FOT); los [RESIDENCIAL] solo sirven como PISO minimo. 3)Si los comparables traen zonificacion/FOT, mencionalos en el analisis. 4)SANITY CHECK: un lote centrico NUNCA vale menos por m2 que el promedio de lotes residenciales de la misma localidad; si tu calculo da menos, esta MAL. 5)Si no hay comparables apto desarrollo en el contexto, usa los residenciales como piso y aplica un premium de zona centrica de +30-60% segun cuan comercial sea la ubicacion, aclarandolo en el analisis. 6)En el campo analisis, aclarar SIEMPRE que el valor definitivo de un lote centrico depende de la zonificacion municipal (FOS/FOT) y recomendar verificarla en el municipio antes de decidir.\n"
          : "") +
        "OPERACION: " + (operacion === "alquiler" ? "ALQUILER - calcular valor de alquiler mensual en DOLARES AMERICANOS." + (dolarBlue > 0 ? " Tipo de cambio dolar blue: $" + dolarBlue.toLocaleString("es-AR") + ". Si encontras comparables en pesos, convertirlos a dolares con ese tipo de cambio antes de calcular el promedio." : "") + " Los comparables son precios de alquiler, NO de venta." : "VENTA - calcular valor de venta en DOLARES AMERICANOS.") + "\n" +
        "MODELO DE VALUACION (BLOQUE 2 — la IA ya NO aplica ajustes, solo da el precio base de mercado):\n" +
        "PASO 1 - BASE: usar precio/m2 promedio de los comparables encontrados, calculado SIEMPRE sobre m2 CUBIERTOS/construidos, NUNCA sobre m2 de lote/terreno total (especialmente en casas, donde el lote suele ser 2-3 veces mas grande que lo cubierto). Ese promedio YA refleja el mercado real de la zona incluyendo propiedades en distintos estados.\n" +
        "PASO 2 - ANCLA: identificar el comparable mas similar en superficie y tipologia y usarlo como referencia principal. Tu campo 'precio_base_m2_usd' es SOLO este promedio/ancla de mercado, SIN aplicar todavia ningun ajuste por estado, disposicion, ascensor, balcon, hall, cocina, banos ni luminosidad — esos ajustes los aplica el sistema en codigo, siempre con el mismo criterio, no vos.\n" +
        "\n" +
        "REGLAS CRITICAS:\n" +
        "REGLA - DEMOLICION: si hay riesgo de derrumbe, comparar con terrenos de la zona, no con propiedades.\n" +
        "REGLA - ORIENTACION Y COCHERA: son solo informativas para el campo 'analisis' (mencionalas si son relevantes), no cambian 'precio_base_m2_usd' — los comparables ya vienen filtrados por cochera y la orientacion no tiene ajuste numerico.\n" +
        "REGLA - NO REVELAR MECANISMOS INTERNOS: el campo 'analisis' lo lee directamente el propietario de la propiedad. Nunca menciones ahi palabras como 'ancla', 'sistema', 'codigo', 'clamp', 'techo', 'tope maximo/minimo', ni el hecho de que un valor fue verificado, limitado o corregido automaticamente. Redacta el analisis en lenguaje natural, como si vos hubieras hecho todo el razonamiento de mercado de punta a punta.\n" +
        "\n" +
        "CLASIFICACION (categorias para el sistema — a partir de las fotos; NO calcules ningun porcentaje, solo elegi la categoria):\n" +
        "cocina: \"renovada\" (a nuevo) / \"normal\" / \"a_renovar\".\n" +
        "banos: \"renovados\" (a nuevo) / \"normal\" / \"a_renovar\".\n" +
        "luminosidad: \"superior\" (muy por encima del promedio) / \"normal\" / \"inferior\" (muy por debajo).\n" +
        "EXPENSAS mas de $250k: mencionar negativamente en el analisis.\n" +
        "\n" +
        "BLOQUE DE REFACCION: si y solo si cocina + banos + pisos estan todos deteriorados simultaneamente segun las fotos, marcar 'necesita_refaccion_integral': true. Sino, false. NO calcules el costo en dolares — eso lo hace el sistema con superficie_cubierta x 650.\n" +
        (msgContent.length>0 ? (tipo==="lote" ? "FOTOS LOTE: detecta medianeras,nivel suelo,arboles,accesibilidad,construccion.\n" : "FOTOS: analiza terminaciones,humedad,grietas,materiales.\n") : "") +
        "RESPONDE SOLO JSON SIN MARKDOWN (precio_base_m2_usd es SOLO el promedio/ancla de mercado, sin ningun ajuste aplicado):\n" +
        '{"precio_base_m2_usd":0,"alerta_estructural":false,"necesita_refaccion_integral":false,"clasificacion":{"cocina":"normal","banos":"normal","luminosidad":"normal"},"scores":[{"nombre":"Terminaciones","valor":7},{"nombre":"Estado general","valor":7},{"nombre":"Luminosidad","valor":6},{"nombre":"Materiales","valor":6},{"nombre":"Distribucion","valor":7}],"comparables":[{"direccion":"Calle A","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":80,"precio_usd":0,"fuente":"Relevamiento de mercado"},{"direccion":"Calle B","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":90,"precio_usd":0,"fuente":"Relevamiento de mercado"},{"direccion":"Calle C","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":75,"precio_usd":0,"fuente":"Relevamiento de mercado"},{"direccion":"Calle D","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":85,"precio_usd":0,"fuente":"Relevamiento de mercado"},{"direccion":"Calle E","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":95,"precio_usd":0,"fuente":"Relevamiento de mercado"},{"direccion":"Calle F","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":70,"precio_usd":0,"fuente":"Relevamiento de mercado"}],"analisis":"4 oraciones."}';

      msgContent.push({ type: "text", text: prompt });
      setLoadStep(5);

      const bodyStr = JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 3500, messages: [{ role: "user", content: msgContent }] });

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
        try { parsed = JSON.parse(fixed); } catch(e2) {
          try {
            let repaired = jsonStr;
            const lastComma = repaired.lastIndexOf(",");
            const lastCloseBrace = repaired.lastIndexOf("}");
            if (lastComma > lastCloseBrace) repaired = repaired.slice(0, lastComma);
            const opens = (repaired.match(/\{/g)||[]).length;
            const closes = (repaired.match(/\}/g)||[]).length;
            const opensArr = (repaired.match(/\[/g)||[]).length;
            const closesArr = (repaired.match(/\]/g)||[]).length;
            repaired += "]".repeat(Math.max(0, opensArr-closesArr)) + "}".repeat(Math.max(0, opens-closes));
            parsed = JSON.parse(repaired);
          } catch(e3) { throw new Error("JSON invalido: " + e.message + " | " + jsonStr.slice(0,200)); }
        }
      }
      if (parsed.precio_base_m2_usd === undefined || parsed.precio_base_m2_usd === null) throw new Error("Respuesta invalida de la IA. Keys: " + Object.keys(parsed).join(", "));
      // precio_base_m2_usd === 0 es válido: significa "sin datos suficientes para esta zona"

      // ── BLOQUE 2: motor determinístico de ajustes estructurales ──────────
      // disposición, ascensor, balcón, hall, estado y acceso de PH ya son
      // datos conocidos del formulario — el código los aplica siempre igual,
      // la IA ya no hace esa suma.
      const estructural = calcularAjusteEstructural({
        disposicion: tipo === "departamento" ? disposicion : undefined,
        ascensor: tipo === "departamento" ? ascensor : undefined,
        pisoBajo: Number(piso) <= 2,
        balcon: tipo === "departamento" ? balcon : undefined,
        hall: tipo === "departamento" ? hallEstado : undefined,
        estado: tipo !== "lote" ? estado : undefined,
        phAcceso: tipo === "ph"
          ? { alFrente: phAlFrente, pasillo: phPasillo, escalera: phEscalera, accesoDeteriorado: phAccesoEstado === "deteriorado" }
          : null,
      });
      const secundario = calcularAjusteSecundario(parsed.clasificacion);
      const { factorFinal } = combinarAjustes({
        pctEstructural: estructural.pctEstructural,
        pctSecundario: secundario.pctSecundario,
        loteALaguna: amenities.includes("Lote a laguna"),
      });

      // ── BLOQUE 3: clamp del precio base contra el ancla verificada por
      // código (antes esto solo se le PEDÍA a la IA por texto, nunca se
      // verificaba). ────────────────────────────────────────────────────────
      const anclaClamp = clampearContraAncla(parsed.precio_base_m2_usd, anclaNumerica);
      const precioBaseClampeado = anclaClamp.precioM2Final;

      // ── BLOQUE 1: rango, precio/m2 y costo de refacción — aritmética
      // simple, siempre en código. precio_m2_usd y valor_usd se derivan del
      // precio base ya clampeado x el factor de ajuste del Bloque 2. ───────
      const supBase = tipo === "lote" ? (Number(supTotal) || 0) : (Number(supCub || supTotal) || 0);
      parsed.precio_m2_usd = Math.round((precioBaseClampeado || 0) * factorFinal);
      parsed.valor_usd = Math.round(parsed.precio_m2_usd * supBase);
      parsed.rango_min_usd = Math.round(parsed.valor_usd * 0.95);
      parsed.rango_max_usd = Math.round(parsed.valor_usd * 1.05);
      parsed.costo_refaccion_usd = parsed.necesita_refaccion_integral ? Math.round(supBase * 650) : 0;

      // ── BLOQUE 6: los "factores" que ve el usuario salen de los mismos
      // ajustes que calcularon el precio — no de una redacción aparte de la
      // IA que podría no coincidir con el número real. ─────────────────────
      parsed.factores = generarFactores([...estructural.detalle, ...secundario.detalle]);

      // ── BLOQUE 4: índice de confianza — determinístico, no se le pregunta
      // a la IA. ────────────────────────────────────────────────────────────
      const camposFaltantes = (propData.match(/\?/g) || []).length;
      parsed.confianza = calcularConfianza({
        comparablesEncontrados: preciosM2Calculados.length,
        hayAncla: anclaNumerica != null,
        seAlejoDelAncla: anclaClamp.corregido,
        camposFaltantes,
        busquedasFallidas: searchErrors.length,
        esFallbackSinComparables: sinComparablesBarrioCerrado,
      });

      // ── Ajuste de pileta (casas, venta) ─────────────────────────────────
      // No se lo pedimos a la IA porque terminaría narrándolo en el "análisis"
      // ("le sumé un 5% por la pileta..."). Se aplica acá, en código, después
      // de la tasación, así el informe nunca lo menciona pero el número sí lo refleja.
      // Solo casas: en depto/PH "Pileta" suele ser de uso común del edificio y
      // ya está reflejada en el precio de los comparables — sumarla de nuevo duplicaría el efecto.
      if (tipo === "casa" && operacion === "venta" && amenities.includes("Pileta") && parsed.valor_usd > 0) {
        const PILETA_TOPE_USD = 15000;
        const incremento = Math.min(Math.round(parsed.valor_usd * 0.05), PILETA_TOPE_USD);
        if (incremento > 0) {
          const factor = (parsed.valor_usd + incremento) / parsed.valor_usd;
          parsed.valor_usd = parsed.valor_usd + incremento;
          if (parsed.rango_min_usd) parsed.rango_min_usd = Math.round(parsed.rango_min_usd + incremento);
          if (parsed.rango_max_usd) parsed.rango_max_usd = Math.round(parsed.rango_max_usd + incremento);
          if (parsed.precio_m2_usd) parsed.precio_m2_usd = Math.round(parsed.precio_m2_usd * factor);
        }
      }

      if (!skipContact && nombre.trim()) {
        const htmlInforme = generatePDF(parsed, address, photos, true);
        await saveLead({ id:Date.now(), fecha:new Date().toLocaleString("es-AR"), nombre:nombre.trim(), whatsapp:(normalizarCelularAR(whatsapp)||whatsapp.trim()), tipo, address, operacion, supTotal, ambientes, dormitorios, valorUsd:parsed.valor_usd, precioM2:parsed.precio_m2_usd, htmlInforme, resultadoJson:parsed });
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

  const submitContact = () => {
    if (!normalizarCelularAR(whatsapp)) {
      setErrWhatsapp(errorCelularAR(whatsapp) || "Número de teléfono inválido.");
      const el = document.getElementById("wa-input");
      if (el) el.focus();
      return;
    }
    setErrWhatsapp("");
    callApi(false);
  };

  const adminLogin = () => {
    if (adminPass === ADMIN_PASS) { setAdminErr(""); setScreen("admin"); }
    else setAdminErr("Contraseña incorrecta.");
  };

  const esAlquiler = operacion === "alquiler";
  const fmt = n => n ? (esAlquiler ? "$ " : "USD ") + Number(n).toLocaleString("es-AR") : "—";
  const fmtM2 = n => n ? (esAlquiler ? "$ " : "USD ") + Number(n).toLocaleString("es-AR") + "/m²" : "—";
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
    setAmenities([]); setEstado("bueno"); setApiError(""); setDisposicion("");
    setCasaSubtipo(""); setCasaNombreBarrio(""); setDeptoSubtipo(""); setSectorBarrio(""); setLoteSubtipo(""); setNombreBarrioPrivado("");
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
            <img src={LOGO_SRC} alt="TasaLibre" style={{height:52,width:"auto",display:"block"}}/>
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
            <div className="hero-bg"></div>
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

        {screen==="hero" && (
          <>
          <div className="footer-fade"></div>
          <footer className="site-footer">
            <div className="footer-main">
              <div className="footer-brand" style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{display:"flex",flexDirection:"row",alignItems:"center",gap:16}}>
                  <img src={LOGO_SRC} alt="TasaLibre" style={{height:72,width:"auto",display:"block",filter:"brightness(0) invert(1)",flexShrink:0}}/>
                  <div className="footer-tagline" style={{margin:0}}>Tasaciones inmobiliarias inteligentes</div>
                </div>
                <div className="footer-location">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Buenos Aires, Argentina
                </div>
              </div>
              <div className="footer-social" style={{flexDirection:"column",alignItems:"flex-end",gap:14}}>
                <a href="https://wa.me/5491140356742" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,color:"rgba(255,255,255,0.8)",textDecoration:"none",fontSize:13,fontWeight:500}}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span style={{minWidth:80}}>WhatsApp</span>
                </a>
                <a href="https://instagram.com/tasalibre.ar" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,color:"rgba(255,255,255,0.8)",textDecoration:"none",fontSize:13,fontWeight:500}}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.8" fill="rgba(255,255,255,0.8)" stroke="none"/>
                  </svg>
                  <span style={{minWidth:80}}>@tasalibre.ar</span>
                </a>
              </div>
            </div>
            <hr className="footer-divider"/>
            <div className="footer-legal">
              © 2025 TasaLibre · Tasación orientativa, no reemplaza una valuación oficial por martillero matriculado
            </div>
          </footer>
          </>
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
                      <div key={v} className={"chip"+(tipo===v?" on":"")} onClick={()=>{ setTipo(v); setLoteSubtipo(""); setCasaSubtipo(""); setDeptoSubtipo(""); setSectorBarrio(""); }}>{l}</div>
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

                {(tipo==="casa" || tipo==="departamento") && (
                  <div className="field"><label>Tipo de ubicación</label>
                    <div className="chips">
                      <div className={"chip"+((tipo==="casa"?casaSubtipo:deptoSubtipo)==="tradicional"?" on":"")}
                        onClick={()=>{ if(tipo==="casa") setCasaSubtipo("tradicional"); else setDeptoSubtipo("tradicional"); }}>
                        Barrio Tradicional
                      </div>
                      <div className={"chip"+((tipo==="casa"?casaSubtipo:deptoSubtipo)==="cerrado"?" on":"")}
                        onClick={()=>{ if(tipo==="casa") setCasaSubtipo("cerrado"); else setDeptoSubtipo("cerrado"); }}>
                        Barrio Cerrado
                      </div>
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
                    <div className="field"><label>Entorno del lote</label>
                      <div className="chips">
                        <div className={"chip"+(loteEntorno==="residencial"?" on":"")} onClick={()=>setLoteEntorno("residencial")}>Calle residencial</div>
                        <div className={"chip"+(loteEntorno==="centrico"?" on":"")} onClick={()=>setLoteEntorno("centrico")}>Zona céntrica / sobre avenida</div>
                      </div>
                    </div>
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
                    <div className="field"><label>Localidad / Zona *</label>
                      <input value={barrio} onChange={e=>setBarrio(e.target.value)} placeholder="ej. Tigre, Pilar, Nordelta..."/>
                      {errBarrio && <div className="err">Ingresá la localidad.</div>}
                    </div>
                    <div className="field"><label>Nombre del barrio *</label>
                      <input value={casaNombreBarrio} onChange={e=>setCasaNombreBarrio(e.target.value)} placeholder="ej. Nordelta, Los Troncos, Abril..."/>
                    </div>
                    <div className="field"><label>Sector o sub-barrio <span style={{color:"var(--ink-4)",fontWeight:400}}>(opcional)</span></label>
                      <input value={sectorBarrio} onChange={e=>setSectorBarrio(e.target.value)} placeholder="ej. La Ribera, Las Glicinas, El Portezuelo..."/>
                    </div>
                    <div className="field"><label>Dirección interna <span style={{color:"var(--ink-4)",fontWeight:400}}>(opcional)</span></label>
                      <input value={calle} onChange={e=>setCalle(e.target.value)} placeholder="ej. Lote 42 / Manzana B Casa 15 / Los Robles 234"/>
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

                {(tipo==="departamento" || tipo==="ph") && deptoSubtipo==="cerrado" && (
                  <>
                    <div className="field"><label>Localidad / Zona *</label>
                      <input value={barrio} onChange={e=>setBarrio(e.target.value)} placeholder="ej. Tigre, Pilar, Nordelta..."/>
                      {errBarrio && <div className="err">Ingresá la localidad.</div>}
                    </div>
                    <div className="field"><label>Nombre del barrio *</label>
                      <input value={casaNombreBarrio} onChange={e=>setCasaNombreBarrio(e.target.value)} placeholder="ej. Nordelta, Los Troncos, Abril..."/>
                    </div>
                    <div className="field"><label>Sector o sub-barrio <span style={{color:"var(--ink-4)",fontWeight:400}}>(opcional)</span></label>
                      <input value={sectorBarrio} onChange={e=>setSectorBarrio(e.target.value)} placeholder="ej. La Ribera, Las Glicinas, El Portezuelo..."/>
                    </div>
                    <div className="field"><label>Dirección interna <span style={{color:"var(--ink-4)",fontWeight:400}}>(opcional)</span></label>
                      <input value={calle} onChange={e=>setCalle(e.target.value)} placeholder="ej. Lote 42 / Manzana B Casa 15 / Los Robles 234"/>
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

                {(tipo==="ph" || tipo==="local" || (tipo==="departamento" && deptoSubtipo==="tradicional")) && (
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
                  <div></div>
                  <button className="btn-outline" onClick={()=>{
                    if(tipo==="lote"&&!loteSubtipo) return;
                    if(tipo==="casa"&&!casaSubtipo) return;
                    if(!tipo) return;
                    if((tipo==="casa"||tipo==="departamento")&&!casaSubtipo&&!deptoSubtipo) return;
                    if(tipo==="lote"&&!loteSubtipo) return;
                    if(!barrio.trim()&&tipo!=="lote") { setErrBarrio(true); return; }
                    if(tipo==="lote"&&loteSubtipo&&!barrio.trim()) { setErrBarrio(true); return; }
                    setErrBarrio(false); setStep(2); window.scrollTo(0,0);
                    // Verificar dirección en background (no bloquea)
                    setAddrWarning(false);
                    if (calle && numero && barrio) {
                      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(calle+" "+numero+", "+barrio+", Argentina")}&format=json&limit=1`, {headers:{"User-Agent":"TasaLibre/1.0"}})
                        .then(r=>r.json())
                        .then(d=>{ if(!d.length) setAddrWarning(true); })
                        .catch(()=>{});
                    }
                  }}>Siguiente →</button>
                </div>
              </div>
            )}

            {step===2 && (
<div>
                <h2 className="step-title">Contanos sobre<br/>el <em>inmueble</em></h2>
                {addrWarning && (
                  <div style={{background:"#FFF8E7",border:"1px solid #F59E0B",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#92400E"}}>
                    ⚠️ No pudimos verificar la dirección ingresada. Revisá que esté bien escrita — podés <span style={{textDecoration:"underline",cursor:"pointer",fontWeight:600}} onClick={()=>{setStep(1);window.scrollTo(0,0);}}>volver y corregirla</span> o continuar igual.
                  </div>
                )}
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
                <input id="wa-input" className="contact-input" type="tel" value={whatsapp}
                  onChange={e=>{setWhatsapp(e.target.value); if(errWhatsapp) setErrWhatsapp("");}}
                  placeholder="11 5555 1234" onKeyDown={e=>e.key==="Enter"&&submitContact()}
                  style={errWhatsapp ? {borderColor:"#DC2626", boxShadow:"0 0 0 3px rgba(220,38,38,0.12)"} : undefined}/>
                {errWhatsapp && (
                  <div style={{marginTop:6, fontSize:12.5, color:"#DC2626", display:"flex", alignItems:"flex-start", gap:6, lineHeight:1.45}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0, marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span><strong>Número de teléfono inválido.</strong> {errWhatsapp}</span>
                  </div>
                )}
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
            <div className="ring"></div>
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
                  <div className="ls-dot"></div>{l}
                </div>
              ))}
            </div>
          </div>
        )}

        {screen==="result" && result && (
          <div className="result">
            <div className="result-header">
              <div className="res-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Tasación completada</div>
              {result.valor_usd > 0 ? (
                <div className="res-price">{fmt(result.valor_usd)}{esAlquiler ? <span style={{fontSize:"0.45em",fontWeight:400,opacity:0.7}}>/mes</span> : ""}</div>
              ) : (
                <div style={{fontSize:20,fontWeight:600,color:"white",padding:"12px 0",lineHeight:1.4}}>No encontramos suficientes datos de mercado para esta zona.<br/><span style={{fontSize:14,fontWeight:400,opacity:0.85}}>Hablá con un asesor para una tasación personalizada.</span></div>
              )}
              <div className="res-range">Rango: {fmt(result.rango_min_usd)} – {fmt(result.rango_max_usd)}{esAlquiler ? " /mes" : ""} · {fmtM2(result.precio_m2_usd)}</div>
              <div className="res-addr">{result.address}</div>
              {/* BLOQUE 4: índice de confianza — calculado 100% en código */}
              {result.confianza && (
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:6, marginTop:10,
                  background: result.confianza.nivel==="alta" ? "rgba(220,252,231,.9)" : result.confianza.nivel==="media" ? "rgba(255,248,231,.9)" : "rgba(254,226,226,.9)",
                  color: result.confianza.nivel==="alta" ? "#16A34A" : result.confianza.nivel==="media" ? "#92400E" : "#DC2626",
                  borderRadius:100, padding:"4px 12px", fontSize:11, fontWeight:700,
                }}>
                  Confianza {result.confianza.nivel==="alta"?"alta":result.confianza.nivel==="media"?"media":"baja"} ({result.confianza.score}/100)
                </div>
              )}
            </div>
            {result.confianza && result.confianza.nivel === "baja" && (
              <div style={{background:"#FFF8ED",border:"1.5px solid #F59E0B",borderRadius:"var(--radius)",padding:"14px 18px",marginBottom:16,fontSize:13,color:"#78350F",lineHeight:1.6}}>
                Esta tasación tiene <strong>confianza baja</strong>: encontramos pocos comparables verificados para esta zona. Te recomendamos hablar con un asesor antes de tomar una decisión.
              </div>
            )}

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
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {(result.comparables||[]).map((c,i)=>(
                  <div key={i} className="comp-item">
                    <div style={{minWidth:0}}>
                      <div className="comp-addr">{c.direccion}</div>
                      <div className="comp-detail">{c.barrio} · {c.m2} m² · {c.fuente}</div>
                    </div>
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
                <button onClick={()=>{setScreen("wizard");setStep(1);window.scrollTo(0,0);}} style={{background:"transparent",border:"1.5px solid var(--border-2)",color:"var(--ink-3)",borderRadius:12,padding:"12px 24px",fontSize:14,fontWeight:600,cursor:"pointer",marginTop:8,width:"100%"}}>
                  ✏️ Corregir datos y volver a tasar
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

            <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
              <input
                value={adminSearch}
                onChange={e=>setAdminSearch(e.target.value)}
                placeholder="Buscar por nombre, dirección o WhatsApp..."
                style={{flex:1,minWidth:200,padding:"10px 14px",borderRadius:10,border:"1px solid var(--border-2)",fontSize:13,background:"var(--white)"}}
              />
              <select value={adminFilter} onChange={e=>setAdminFilter(e.target.value)} style={{padding:"10px 14px",borderRadius:10,border:"1px solid var(--border-2)",fontSize:13,background:"var(--white)"}}>
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="contactado">Contactado</option>
                <option value="en proceso">En proceso</option>
                <option value="cerrado">Cerrado</option>
                <option value="descartado">Descartado</option>
              </select>
              <button onClick={()=>{
                const rows = leads.map(l=>[l.nombre,l.whatsapp,l.tipo,l.operacion,(l.direccion||l.address||""),l.superficie||"",l.valor_usd||l.valorUsd||"",l.status||"",l.fecha||l.created_at||""].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(","));
                const csv = "Nombre,WhatsApp,Tipo,Operacion,Direccion,Superficie,Valor USD,Estado,Fecha\n" + rows.join("\n");
                const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "leads_tasalibre.csv"; a.click();
                setTimeout(()=>URL.revokeObjectURL(url),5000);
              }} style={{padding:"10px 18px",borderRadius:10,border:"none",background:"var(--azul)",color:"white",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                ⬇ Exportar CSV
              </button>
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
                  {leads.filter(l=>{
                    if(adminFilter!=="todos" && (l.status||"pendiente")!==adminFilter) return false;
                    if(adminSearch.trim()){
                      const q = adminSearch.toLowerCase();
                      const searchable = [(l.nombre||""),(l.whatsapp||""),(l.direccion||l.address||""),(l.tipo||"")].join(" ").toLowerCase();
                      if(!searchable.includes(q)) return false;
                    }
                    return true;
                  }).map(l=>(
                    <tr key={l.id}>
                      <td>
                        <div className="lead-name">{l.nombre||<span style={{color:"var(--ink-4)",fontStyle:"italic"}}>Anónimo</span>}</div>
                        {l.whatsapp&&<div className="lead-contact">📱 {l.whatsapp}</div>}
                        {l.whatsapp ? (
                          <a href={"https://wa.me/549"+(normalizarCelularAR(l.whatsapp)||l.whatsapp.replace(/\D/g,"").replace(/^549/,"").replace(/^54/,"").replace(/^0/,""))+"?text="+encodeURIComponent("Hola "+(l.nombre?l.nombre.split(" ")[0]:"")+"! Te contacto desde TasaLibre. Vi que tasaste tu "+l.tipo+" en "+l.address+". Tuviste oportunidad de ver el informe? Tenes alguna consulta sobre el valor?")}
                            target="_blank" rel="noopener noreferrer"
                            style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:8,background:"#25D366",color:"white",padding:"6px 14px",borderRadius:100,fontSize:12,fontWeight:600,textDecoration:"none"}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Contactar
                          </a>
                        ) : <div className="badge-cold">Sin contacto</div>}
                        {l.html_informe && (
                          <button onClick={()=>{
                            const blob = new Blob([l.html_informe],{type:'text/html'});
                            const url = URL.createObjectURL(blob);
                            window.open(url,'_blank');
                            setTimeout(()=>URL.revokeObjectURL(url),10000);
                          }} style={{display:"block",width:"100%",marginTop:6,background:"var(--azul)",color:"white",border:"none",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                            Ver informe
                          </button>
                        )}
                      </td>
                      <td>
                        <div className="lead-prop" style={{textTransform:"capitalize"}}>{l.tipo} · {l.operacion}</div>
                        <div className="lead-prop">{l.direccion || l.address || "—"}</div>
                        <div className="lead-prop">{l.ambientes ? l.ambientes+" amb · "+l.dormitorios+" dorm" : (l.superficie ? l.superficie+"m²" : "")}{l.supTotal?" · "+l.supTotal+" m²":""}</div>
                      </td>
                      <td>
                        <div className="lead-price">{fmt(l.valor_usd || l.valorUsd)}</div>
                        <div style={{fontSize:11,color:"var(--ink-4)",marginTop:2}}>{fmt(l.precio_m2 || l.precioM2)}/m²</div>
                        {/* BLOQUE 5: corrección manual → loop de calibración */}
                        {correctionSaved[l.id] ? (
                          <div style={{fontSize:11,color:"#16A34A",marginTop:6,fontWeight:600}}>✓ Corrección guardada</div>
                        ) : (
                          <div style={{display:"flex",gap:4,marginTop:6}}>
                            <input
                              type="number"
                              placeholder="Valor real"
                              value={correctionDrafts[l.id] || ""}
                              onChange={e=>setCorrectionDrafts(prev=>({...prev,[l.id]:e.target.value}))}
                              style={{width:80,fontSize:11,padding:"3px 6px",border:"1px solid var(--border)",borderRadius:6}}
                            />
                            <button onClick={()=>submitCorrection(l.id)}
                              style={{fontSize:11,padding:"3px 8px",border:"none",borderRadius:6,background:"var(--azul)",color:"white",cursor:"pointer"}}>
                              Guardar
                            </button>
                          </div>
                        )}
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
