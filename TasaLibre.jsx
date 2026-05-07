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
    padding: 60px 24px 80px;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 70% 50% at 50% -10%, rgba(27,79,216,.08) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 80% 80%, rgba(14,166,107,.05) 0%, transparent 60%);
  }
  .hero-inner { position: relative; z-index: 1; max-width: 580px; }
  .hero-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--white); border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    border-radius: 100px; padding: 6px 14px 6px 8px;
    font-size: 12px; font-weight: 500; color: var(--ink-2);
    margin-bottom: 28px;
  }
  .pill-dot {
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--verde); display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .hero h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(36px, 7vw, 60px);
    font-weight: 600; line-height: 1.1; letter-spacing: -.02em;
    color: var(--ink); margin-bottom: 20px;
  }
  .hero h1 em { font-style: italic; color: var(--azul); font-weight: 300; }
  .hero-sub {
    font-size: 16px; color: var(--ink-3); line-height: 1.65;
    margin-bottom: 36px; max-width: 440px; margin-left: auto; margin-right: auto;
  }
  .hero-actions { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .hero-trust {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--ink-4);
  }
  .hero-trust svg { color: var(--verde); }
  .hero-stats {
    display: flex; gap: 0; margin-top: 56px;
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .hero-stat {
    flex: 1; padding: 20px 24px; text-align: center;
    border-right: 1px solid var(--border);
  }
  .hero-stat:last-child { border-right: none; }
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
const AMENITY_DEPTO = ["Cochera","Pileta","Gimnasio","SUM","Seguridad 24h","Terraza/Balcón","Parrilla"];
const AMENITY_CASA = ["Cochera","Pileta","Patio","Jardín","Terraza","Parrilla","Galería/Quincho","Playroom","Dormitorio principal en suite","Techos altos","Aberturas DVH","Lavadero"];
const AMENITY_PH = ["Cochera","Pileta","Patio","Parrilla","Aberturas DVH"];
const LOAD_STEPS = ["Analizando fotos con IA","Buscando comparables en ZonaProp","Buscando en Argenprop y MercadoLibre","Calculando valor de mercado","Generando informe de tasación"];

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
  const [disposicion, setDisposicion] = useState(""); // "frente" | "contrafrente"

  // PH extras
  const [phUbicacion, setPhUbicacion] = useState("");

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
      const r = await window.storage.get("tasalibre-leads");
      if (r && r.value) setLeads(JSON.parse(r.value));
      const rs = await window.storage.get("tasalibre-statuses");
      if (rs && rs.value) setLeadStatuses(JSON.parse(rs.value));
    } catch { setLeads([]); }
  };

  const updateLeadStatus = async (id, status) => {
    const updated = { ...leadStatuses, [id]: status };
    setLeadStatuses(updated);
    try { await window.storage.set("tasalibre-statuses", JSON.stringify(updated)); } catch(e) {}
  };

  const saveLead = async (lead) => {
    try {
      let existing = [];
      try { const r = await window.storage.get("tasalibre-leads"); if (r&&r.value) existing = JSON.parse(r.value); } catch {}
      await window.storage.set("tasalibre-leads", JSON.stringify([lead, ...existing]));
    } catch (e) { console.error("storage error:", e); }
  };

  const toggleAmenity = v => setAmenities(a => a.includes(v) ? a.filter(x=>x!==v) : [...a,v]);
  const openFile = idx => { slotRef.current = idx; fileRef.current.value = ""; fileRef.current.click(); };
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
  const generatePDF = (result, address) => {
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
          return [
            "departamento venta " + calleRef + barrio + " " + provincia + " " + dormRef + "precio dolares zonaprop",
            "departamento venta " + barrio + " " + provincia + " " + ambientes + " ambientes dolares argenprop",
            "depto venta " + barrio + " " + provincia + " " + supRef + dormRef + "dolares",
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

      for (let qi = 0; qi < queries.length; qi++) {
        setLoadStep(Math.min(qi + 2, 4));
        const searchPrompt = "Busca en zonaprop.com.ar o argenprop.com propiedades similares: " + queries[qi] + ". IMPORTANTE: devuelve SOLO propiedades de la misma zona o calle. Ignora resultados de otras zonas. Lista precio USD, metros cuadrados, direccion exacta y fuente. Necesito al menos 6-8 resultados si los hay.";
        try {
          const searchRes = await fetch("/api/tasar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              model: "claude-sonnet-4-6",
              max_tokens: 800,
              tools: [{ type: "web_search_20250305", name: "web_search" }],
              messages: [{ role: "user", content: searchPrompt }]
            })
          });
          const searchText = await searchRes.text();
          const searchData = JSON.parse(searchText);
          const textBlocks = (searchData.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
          if (textBlocks.trim()) comparablesData += "\nBusqueda " + (qi+1) + " (" + queries[qi] + "):\n" + textBlocks.slice(0, 800);
        } catch(searchErr) { console.warn("Search failed:", searchErr.message); }
      }

      setLoadStep(4);

      const msgContent = [];
      if (!skipContact) {
        for (const p of photos.filter(Boolean)) {
          try {
            const b64 = p.dataUrl.split(",")[1];
            if (b64) msgContent.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } });
          } catch(e) {}
        }
      }

      const prompt = [
        "Sos un tasador inmobiliario matriculado con 20 anos de experiencia en Argentina.",
        "Das valuaciones PRECISAS y CONSERVADORAS. Nunca infladas.",
        "",
        "PROPIEDAD A TASAR:",
        "Tipo: " + tipo + (loteSubtipo ? " (" + loteSubtipo + ")" : "") + (casaSubtipo ? " " + casaSubtipo : ""),
        "Direccion: " + address,
        "Operacion: " + operacion,
        "Sup. total: " + (supTotal||"?") + "m2" + (tipo !== "lote" ? " | Sup. cubierta: " + (supCub||"?") + "m2" : ""),
        "Ambientes: " + ambientes + " | Dorm: " + dormitorios + " | Banos: " + banos,
        "Antiguedad: " + (antiguedad||"?") + " anos | Estado: " + estado.replace(/_/g," "),
        "Piso: " + (piso||"N/A") + " | Ascensor: " + (tipo==="departamento" ? (ascensor?"Si":"No") : "N/A") + " | Disposicion: " + (tipo==="departamento" ? (disposicion||"no especificada") : "N/A"),
        "PH ubicacion: " + (phUbicacion||"N/A"),
        "Casa subtipo: " + (tipo==="casa" ? (casaSubtipo||"N/A") + (casaSubtipo==="cerrado" ? " - " + casaNombreBarrio : "") : "N/A"),
        "Local: altura=" + (alturaVigas?"Si":"No") + " vidriera=" + (vidriera?"Si":"No") + " cortinas=" + (cortinasMetalicas?"Si":"No") + " entrepiso=" + (entrepiso?"Si":"No"),
        "Barrio cerrado: " + (nombreBarrioPrivado||"N/A"),
        "Lote medidas: " + (tipo==="lote" ? (loteFrente||"?") + "m frente x " + (loteFondo||"?") + "m fondo" : "N/A"),
        "Zonificacion: " + (zonificacion||"N/A"),
        "Lote adicionales: " + (loteAdicionales.join(", ")||"ninguno"),
        "Lote con edificacion: " + (tipo==="lote" ? (loteConEdificacion?"Si":"No") : "N/A"),
        "Caracteristicas: " + (amenities.join(", ")||"ninguno"),
        "",
        comparablesData ? "COMPARABLES REALES: " + comparablesData + " USA estos precios como base. Son datos de ZonaProp/Argenprop." : "Sin comparables online. Usa tu conocimiento del mercado argentino.",
        "",
        "REGLAS CRITICAS:",
        "1. PRECIO TECHO: cada zona tiene un maximo que el mercado no supera.",
        "2. NUNCA uses precios de CABA para GBA o interior.",
        "3. Barrios abiertos compiten con barrios cerrados — ese es su techo real.",
        "4. GBA Sur/Oeste centros: casas USD 800-1200/m2 cubierto MAX.",
        "5. Casas en barrios cerrados zona sur: USD 150.000-500.000 segun categoria.",
        "6. Barrios cerrados zona norte premium: lotes USD 300-900/m2.",
        "7. COMPARABLES PROXIMOS: incluir EXACTAMENTE 6 comparables, todos lo mas cercanos posible al inmueble.",
        "   Direccion de referencia: " + address + ".",
        "   Primero busca en la misma calle, luego calles perpendiculares cercanas.",
        "   NUNCA uses comparables de otra zona, barrio o ciudad aunque sean del mismo tipo.",
        "   Si los comparables encontrados son de zonas alejadas, indicalos como referencia y ajusta con criterio local.",
        "8. Con los 6 comparables, calcula el precio promedio por m2, descarta outliers extremos, y usa ese promedio como base del valor final.",
        "8b. Rango: maximo +-5% del valor central.",
        "9. Se CONSERVADOR. Ante la duda, valor hacia abajo.",
        "DISPOSICION EN DEPARTAMENTOS: Al frente = maximo valor. Lateral = -0% a -5%. Contrafrente = -5% a -15%. Interno = -15% a -25%.",
        "ESCALA DE DETERIORO: leve -5/-10%. moderado -10/-20%. importante -20/-35%. severo -35/-50%. riesgo derrumbe = valor terreno.",
        "Si hay riesgo estructural: alerta_estructural=true.",
        "",
        msgContent.length > 0 ? (tipo==="lote" ? "ANALISIS FOTOS DEL LOTE: 1.MEDIANERAS construidas? Si faltan implica costo. 2.NIVEL SUELO requiere relleno? 3.ARBOLES cantidad y costo extraccion. 4.ACCESIBILIDAD para camiones/maquinaria. 5.CONSTRUCCION EXISTENTE viable refaccionar o demoler?" : "Analiza fotos: materiales piso, terminaciones, humedad, grietas, roturas, pintura.") : "Sin fotos.",
        "",
        "CRITICO: Responde UNICAMENTE con el JSON. PROHIBIDO usar ```json o ``` o cualquier markdown. SOLO el JSON puro. Incluye EXACTAMENTE 6 comparables. Incluye siempre alerta_estructural:",
        '{"valor_usd":0,"rango_min_usd":0,"rango_max_usd":0,"precio_m2_usd":0,"alerta_estructural":false,"scores":[{"nombre":"Terminaciones","valor":7},{"nombre":"Estado general","valor":7},{"nombre":"Luminosidad","valor":6},{"nombre":"Materiales","valor":6},{"nombre":"Distribucion","valor":7}],"comparables":[{"direccion":"Calle A 123","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":80,"precio_usd":0,"fuente":"ZonaProp"},{"direccion":"Calle B 456","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":90,"precio_usd":0,"fuente":"Argenprop"},{"direccion":"Calle C 789","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":75,"precio_usd":0,"fuente":"MercadoLibre"},{"direccion":"Calle D 321","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":85,"precio_usd":0,"fuente":"ZonaProp"},{"direccion":"Calle E 654","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":95,"precio_usd":0,"fuente":"Argenprop"},{"direccion":"Calle F 987","barrio":"' + (nombreBarrioPrivado||barrio) + '","m2":70,"precio_usd":0,"fuente":"MercadoLibre"}],"factores":[{"tipo":"pos","titulo":"Factor","descripcion":"Descripcion.","impacto":"+X%"},{"tipo":"neg","titulo":"Factor","descripcion":"Descripcion.","impacto":"-X%"},{"tipo":"neu","titulo":"Zona","descripcion":"Descripcion.","impacto":"Neutro"}],"analisis":"4 oraciones sobre el inmueble."}'
      ].join("\n");

      msgContent.push({ type: "text", text: prompt });
      setLoadStep(5);

      const bodyStr = JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 3000, messages: [{ role: "user", content: msgContent }] });

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
  const lineW = (s,cur) => s < cur ? "100%" : "0%";
  const STEPS_LABELS = ["Ubicación","Características","Fotos"];

  const resetAll = () => {
    setScreen("hero"); setStep(1); setResult(null);
    setPhotos(Array(6).fill(null)); setNombre(""); setWhatsapp("");
    setBarrio(""); setCalle(""); setNumero(""); setSupTotal(""); setSupCub(""); setAntiguedad("");
    setAmenities([]); setEstado("muy_bueno"); setApiError(""); setErrContact(""); setDisposicion("");
    setCasaSubtipo(""); setCasaNombreBarrio(""); setLoteSubtipo(""); setNombreBarrioPrivado("");
    setZonificacion(""); setLoteAdicionales([]); setLoteFondo(""); setLoteFrente(""); setLoteConEdificacion(false);
    setPiso(""); setAscensor(false); setPhUbicacion(""); setRawDebug("");
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
      <input ref={fileRef} type="file" accept="image/*,image/heic,image/heif" style={{display:"none"}} onChange={onFile}/>
      <div className="tasa-root">

        <nav className="tasa-nav">
          <div className="tasa-logo" onClick={resetAll}>
            <div className="logo-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span className="logo-text">Tasa<span>Libre</span></span>
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
              <div className="hero-pill">
                <div className="pill-dot"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                100% gratuito · Sin registrarse · Sin compromiso
              </div>
              <h1>Conocé el valor real<br/>de tu <em>propiedad</em></h1>
              <p className="hero-sub">Subí fotos, completá algunos datos y nuestra IA analiza el estado del inmueble, busca comparables reales y te da una tasación profesional al instante.</p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={()=>{setScreen("wizard");setStep(1);}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                  Tasar mi propiedad
                </button>
                <div className="hero-trust">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Sin datos de tarjeta · Sin spam
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
                      <div className={"chip"+(loteSubtipo==="cerrado"?" on":"")} onClick={()=>{setLoteSubtipo("cerrado");setOperacion("venta");}}>🏘️ Barrio Cerrado</div>
                      <div className={"chip"+(loteSubtipo==="urbano"?" on":"")} onClick={()=>setLoteSubtipo("urbano")}>🏙️ Lote Urbano</div>
                    </div>
                  </div>
                )}

                {tipo==="casa" && (
                  <div className="field"><label>Tipo de ubicación</label>
                    <div className="chips">
                      <div className={"chip"+(casaSubtipo==="tradicional"?" on":"")} onClick={()=>setCasaSubtipo("tradicional")}>🏡 Barrio Tradicional</div>
                      <div className={"chip"+(casaSubtipo==="cerrado"?" on":"")} onClick={()=>setCasaSubtipo("cerrado")}>🏘️ Barrio Cerrado</div>
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
                    <div className="row2">
                      <div className="field"><label>Piso</label><input type="number" value={piso} onChange={e=>setPiso(e.target.value)} placeholder="ej. 3"/></div>
                      <div className="field"><label>¿Tiene ascensor?</label>
                        <div className="chips" style={{marginTop:8}}>
                          <div className={"chip"+(ascensor?" on":"")} onClick={()=>setAscensor(true)}>Sí</div>
                          <div className={"chip"+(!ascensor?" on":"")} onClick={()=>setAscensor(false)}>No</div>
                        </div>
                      </div>
                    </div>
                    <div className="field"><label>Disposición</label>
                      <div className="chips">
                        <div className={"chip"+(disposicion==="frente"?" on":"")} onClick={()=>setDisposicion("frente")}>🌅 Al frente</div>
                        <div className={"chip"+(disposicion==="contrafrente"?" on":"")} onClick={()=>setDisposicion("contrafrente")}>🔇 Contrafrente</div>
                        <div className={"chip"+(disposicion==="lateral"?" on":"")} onClick={()=>setDisposicion("lateral")}>↔️ Lateral</div>
                        <div className={"chip"+(disposicion==="interno"?" on":"")} onClick={()=>setDisposicion("interno")}>🏠 Interno</div>
                      </div>
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
                    <div className="field"><label>Ubicación</label>
                      <div className="chips">
                        {["Al frente","Ingreso por pasillo","Ingreso por escalera"].map(op=>(
                          <div key={op} className={"chip"+(phUbicacion===op?" on":"")} onClick={()=>setPhUbicacion(op)}>{op}</div>
                        ))}
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

                {tipo!=="lote" && tipo!=="local" && (
                  <div className="field"><label>Estado general</label>
                    <div className="chips">
                      {[["a_estrenar","A estrenar"],["muy_bueno","Muy bueno"],["bueno","Bueno"],["a_reciclar","A reciclar"]].map(([v,l])=>(
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

            {nombre && (
              <div style={{background:"var(--azul-light)",border:"1px solid var(--azul-mid)",borderRadius:"var(--radius)",padding:"16px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:22,flexShrink:0}}>👋</div>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--azul)",marginBottom:2}}>¡Gracias, {nombre.split(" ")[0]}!</div>
                  <div style={{fontSize:12,color:"var(--ink-3)",lineHeight:1.5}}>Nos comunicamos con vos por WhatsApp a la brevedad para hablar sobre tu propiedad. Sin compromiso.</div>
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
                <button className="btn-outline" onClick={()=>generatePDF(result, result.address)}>
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
