export const fmtDate = (d) => new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
export const TYPE_LABEL = { message: 'Message', email: 'Email', url: 'URL', screenshot: 'Screenshot' };
export const ACTIONS = [
  ['clicked', 'I clicked a link'],
  ['downloaded', 'I downloaded or opened a file'],
  ['sharedPassword', 'I shared a password'],
  ['sharedOtp', 'I shared an OTP or UPI PIN'],
  ['sharedCardBank', 'I shared card or bank details'],
  ['sharedPersonal', 'I shared ID or personal details'],
  ['lostMoney', 'I lost money'],
];
