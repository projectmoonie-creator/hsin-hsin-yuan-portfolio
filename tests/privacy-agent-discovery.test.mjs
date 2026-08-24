import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function readDist(relativePath) {
  return readFileSync(join(root, "dist", relativePath), "utf8");
}

test("build publishes bilingual privacy and concise agent discovery surfaces", () => {
  execFileSync("node", ["scripts/build-site.mjs"], { cwd: root, stdio: "pipe" });

  const required = [
    "en/privacy/index.html",
    "zh/privacy/index.html",
    "llms.txt",
  ];
  for (const relativePath of required) {
    assert.equal(existsSync(join(root, "dist", relativePath)), true, `${relativePath} should exist`);
  }

  const enHome = readDist("en/index.html");
  const zhHome = readDist("zh/index.html");
  const enPrivacy = readDist("en/privacy/index.html");
  const zhPrivacy = readDist("zh/privacy/index.html");
  const sitemap = readDist("sitemap.xml");
  const llms = readDist("llms.txt");

  assert.match(enHome, /href="\/en\/privacy\/">Privacy<\/a>/);
  assert.match(zhHome, /href="\/zh\/privacy\/">隱私權<\/a>/);

  assert.match(enPrivacy, /<link rel="canonical" href="https:\/\/hsinhsinyuan\.com\/en\/privacy\/">/);
  assert.match(zhPrivacy, /<link rel="canonical" href="https:\/\/hsinhsinyuan\.com\/zh\/privacy\/">/);
  for (const html of [enPrivacy, zhPrivacy]) {
    assert.match(html, /hreflang="en" href="https:\/\/hsinhsinyuan\.com\/en\/privacy\/"/);
    assert.match(html, /hreflang="zh-Hant" href="https:\/\/hsinhsinyuan\.com\/zh\/privacy\/"/);
    assert.match(html, /href="https:\/\/vercel\.com\/legal\/privacy-notice"/);
    assert.match(html, /href="https:\/\/resend\.com\/legal\/privacy-policy"/);
    assert.doesNotMatch(html, /<script\b/i);
  }

  for (const url of [
    "https://hsinhsinyuan.com/en/",
    "https://hsinhsinyuan.com/zh/",
    "https://hsinhsinyuan.com/en/privacy/",
    "https://hsinhsinyuan.com/zh/privacy/",
  ]) {
    assert.match(sitemap, new RegExp(`<loc>${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>`));
  }

  assert.match(enPrivacy, /Name, email address, project type, optional link, and message/);
  assert.match(enPrivacy, /operated by Hsin-Hsin Yuan in Taiwan/);
  assert.match(enPrivacy, /respond to your inquiry, assess or discuss possible work/);
  assert.match(enPrivacy, /as long as reasonably needed/);
  assert.match(enPrivacy, /Vercel[\s\S]*Resend[\s\S]*outside Taiwan/);
  assert.match(enPrivacy, /access or review personal information connected to your inquiry, obtain a copy, supplement or correct it, stop its collection, processing, or use, or delete it/i);
  assert.match(enPrivacy, /required fields are not provided, the form cannot send the inquiry/i);
  assert.match(zhPrivacy, /姓名、電子信箱、合作類型、選填連結與訊息/);
  assert.match(zhPrivacy, /由袁欣欣於台灣營運/);
  assert.match(zhPrivacy, /回覆洽詢、評估或討論可能的合作/);
  assert.match(zhPrivacy, /合理需要的期間內保留/);
  assert.match(zhPrivacy, /Vercel[\s\S]*Resend[\s\S]*台灣以外/);
  assert.match(zhPrivacy, /查詢或閱覽與洽詢相關的個人資料、取得複製本、補充或更正資料、停止資料的蒐集、處理或利用，以及刪除資料/);
  assert.match(zhPrivacy, /不提供必填欄位，表單便無法送出洽詢/);

  assert.match(llms, /^# Hsin-Hsin Yuan$/m);
  assert.match(llms, /^## When to use this portfolio$/m);
  assert.match(llms, /bilingual field production in Taiwan/i);
  assert.match(llms, /https:\/\/hsinhsinyuan\.com\/en\/privacy\//);
  assert.match(llms, /Do not infer unlisted credits, rights, or private contact information\./);

  for (const artifact of [enPrivacy, zhPrivacy, llms, sitemap]) {
    assert.doesNotMatch(artifact, /RESEND_API_KEY|CONTACT_TO_EMAIL|CONTACT_FROM_EMAIL/);
    assert.doesNotMatch(artifact, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    assert.doesNotMatch(artifact, /\/Users\/|screening-strip-media-contract-v1/);
  }
});
