import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGuidance, determineMode } from '../src/services/guidance.js';

test('mode selection from reported actions', () => {
  assert.equal(determineMode({}), 'prevention');
  assert.equal(determineMode({ clicked: true }), 'exposure');
  assert.equal(determineMode({ sharedPassword: true }), 'exposure');
  assert.equal(determineMode({ sharedOtp: true }), 'incident');
  assert.equal(determineMode({ lostMoney: true }), 'incident');
});

test('incident guidance prioritises bank contact and includes 1930', () => {
  const g = buildGuidance({ mode: 'incident', severity: 'high', actions: { lostMoney: true }, language: 'en' });
  assert.match(g.steps[0].title, /bank/i);
  assert.ok(g.contacts.some((c) => c.value === '1930'));
});

test('exposure guidance for a shared password mentions changing it', () => {
  const g = buildGuidance({ mode: 'exposure', severity: 'moderate', actions: { sharedPassword: true }, language: 'en' });
  assert.match(g.steps[0].title, /password/i);
});

test('prevention guidance has no contacts and Hinglish differs from English', () => {
  const en = buildGuidance({ mode: 'prevention', severity: 'high', actions: {}, language: 'en' });
  const hi = buildGuidance({ mode: 'prevention', severity: 'high', actions: {}, language: 'hinglish' });
  assert.equal(en.contacts.length, 0);
  assert.notEqual(en.steps[0].title, hi.steps[0].title);
});
