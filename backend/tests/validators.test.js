import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSchema } from '../src/validators/schemas.js';

test('rejects too-short text', () => {
  assert.equal(analyzeSchema.safeParse({ inputType: 'message', text: 'ab' }).success, false);
});
test('applies defaults', () => {
  const r = analyzeSchema.safeParse({ inputType: 'message', text: 'hello there friend' });
  assert.ok(r.success);
  assert.equal(r.data.language, 'en');
  assert.equal(r.data.actions.lostMoney, false);
});
test('rejects unknown input type and invalid URL input', () => {
  assert.equal(analyzeSchema.safeParse({ inputType: 'voice', text: 'hello there' }).success, false);
  assert.equal(analyzeSchema.safeParse({ inputType: 'url', text: 'not a url with spaces' }).success, false);
  assert.equal(analyzeSchema.safeParse({ inputType: 'url', text: 'javascript:alert(1)' }).success, false);
  assert.ok(analyzeSchema.safeParse({ inputType: 'url', text: 'example.com/path' }).success);
});
