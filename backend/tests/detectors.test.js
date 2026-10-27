import test from 'node:test';
import assert from 'node:assert/strict';
import { runDetectors, analyzeUrl } from '../src/utils/detectors.js';
import { severityFor } from '../src/utils/scoring.js';

const ids = (r) => r.indicators.map((i) => i.id);
const run = (text, inputType = 'message') => runDetectors({ inputType, text });

test('suspicious scholarship message is flagged', () => {
  const r = run('Congratulations! You have been selected for the National Scholarship 2026. Pay a refundable registration fee of Rs 500 within 2 hours and share your OTP at http://nsp-scholarship-verify.xyz/claim to receive Rs 50,000.');
  for (const id of ['payment_request', 'credential_request', 'urgency', 'risky_tld']) assert.ok(ids(r).includes(id), `missing ${id}`);
  assert.ok(r.ruleScore >= 50);
  assert.deepEqual(r.hosts, ['nsp-scholarship-verify.xyz']);
});

test('legitimate announcement has no indicators', () => {
  const r = run('The university has published the revised semester exam timetable on the official portal. Students should check the notice board for details.');
  assert.equal(r.indicators.length, 0);
  assert.equal(r.ruleScore, 0);
});

test('suspicious internship offer is flagged', () => {
  const r = run('Offer letter: Work from home internship at TCS. Pay Rs 1,999 as security deposit to confirm. Contact HR on WhatsApp +91 98765 43210 or hr.tcs.careers@gmail.com. 100% placement guaranteed.');
  for (const id of ['payment_request', 'messaging_redirect', 'free_email', 'guaranteed_outcome']) assert.ok(ids(r).includes(id), `missing ${id}`);
});

test('harmless message scores zero', () => {
  assert.equal(run('Hey, are we still meeting for lunch at 1pm tomorrow?').ruleScore, 0);
});

test('genuine bank warnings are not treated as credential requests', () => {
  assert.ok(!ids(run('Your OTP is 482913. Do not share it with anyone.')).includes('credential_request'));
  assert.ok(!ids(run('Never share your OTP with anyone. We will never ask for your password.')).includes('credential_request'));
});

test('URL checks', () => {
  assert.ok(analyzeUrl('http://192.168.1.10/login').indicators.some((i) => i.id === 'ip_url'));
  assert.ok(analyzeUrl('https://sbi.co.in@evil.example.com/').indicators.some((i) => i.id === 'userinfo_url'));
  const ids2 = analyzeUrl('https://sbi-kyc-update.top/').indicators.map((i) => i.id);
  assert.ok(ids2.includes('brand_lookalike') && ids2.includes('risky_tld'));
  assert.equal(analyzeUrl('https://www.sbi.co.in/').indicators.length, 0);
});

test('shortened URLs are informational, not malicious', () => {
  const r = run('https://bit.ly/abc123', 'url');
  assert.ok(ids(r).includes('url_shortener'));
  assert.ok(r.ruleScore < 15);
});

test('severity thresholds', () => {
  assert.equal(severityFor(10), 'low');
  assert.equal(severityFor(30), 'moderate');
  assert.equal(severityFor(60), 'high');
  assert.equal(severityFor(90), 'critical');
});
