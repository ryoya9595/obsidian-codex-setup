// ===== コピー用テキスト =====
const PAGE_URL = "https://ryoya9595.github.io/obsidian-codex-setup/";
const GUIDE_URL = PAGE_URL + "setup.md";

// URLだけでうまく始まらないときの予備メッセージ
const INSTALL_PROMPT = `このフォルダに「AI秘書＋Obsidian連携（AIの記憶フォルダ）」をセットアップしてください。

【手順書】
${GUIDE_URL}

【進め方】
1. 手順書を curl（Windows は curl.exe）で取得して、全文を読んでください。
   ※ ネットへのアクセスの許可が必要なら、私に許可を求めてください。
   ※ 要約して読むツールではなく、原文をそのまま読んでください。
   ※ 手順書のファイルは、このフォルダには保存しないでください（画面に出すか、一時フォルダへ）。
   ※ どうしても取得できないときは、ダウンロードフォルダの obsidian-codex-setup.md を読んでください。
2. 手順書のとおり、フェーズ1（確認）→ 2（作成）→ 3（Obsidianで開く）→ 4（動作確認）の順に進めてください。
3. 私はパソコンに詳しくないので、やさしい言葉で、1〜3手順ずつ短く説明してください。`;

const TEST_PROMPT = `今の状況を教えて`;
const MEMO_PROMPT = `todoに「Obsidianを眺めてみる」を追加して（優先度は中でOK）`;
const MORNING_PROMPT = `おはよう`;

const TEXTS = {
  pageUrl: PAGE_URL,
  pageUrl2: PAGE_URL,
  installPrompt: INSTALL_PROMPT,
  testPrompt: TEST_PROMPT,
  memoPrompt: MEMO_PROMPT,
  morningPrompt: MORNING_PROMPT,
};

// 各 <pre>／<code> に本文を流し込む
Object.entries(TEXTS).forEach(([id, text]) => {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
});

// ===== コピー処理 =====
async function copyText(text, target) {
  let ok = false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      ok = true;
    }
  } catch { ok = false; }
  if (!ok && target) {
    const range = document.createRange();
    range.selectNodeContents(target);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    sel.removeAllRanges();
  }
  return ok;
}

function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const targetId = button.dataset.target;
    const target = document.getElementById(targetId);
    const text = TEXTS[targetId] || (target ? target.textContent : "");
    const ok = await copyText(text, target);
    const original = button.textContent;
    button.textContent = ok ? "コピーしました" : "手動でコピー";
    button.classList.toggle("done", ok);
    showToast(ok ? "📋 コピーしました" : "コピーできませんでした");
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove("done");
    }, 2000);
  });
});

// ===== ナビ現在地ハイライト =====
const navLinks = Array.from(document.querySelectorAll(".topnav a[href^='#']"));
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
if ("IntersectionObserver" in window && sections.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = "#" + e.target.id;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => obs.observe(s));
}
