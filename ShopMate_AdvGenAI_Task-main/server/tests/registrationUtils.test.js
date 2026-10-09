const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveVerificationOutcome } = require('../utils/registrationUtils');

test('returns a pending-verification outcome when the email was sent', () => {
  const outcome = resolveVerificationOutcome({ mailConfigured: true, emailSent: true });

  assert.equal(outcome.isVerified, false);
  assert.match(outcome.message, /check your email/i);
});

test('auto-verifies the account when mail is not configured', () => {
  const outcome = resolveVerificationOutcome({ mailConfigured: false, emailSent: false });

  assert.equal(outcome.isVerified, true);
  assert.match(outcome.message, /ready to use/i);
});
