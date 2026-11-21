const wat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Lagos',
  dateStyle: 'medium',
  timeStyle: 'medium',
  hourCycle: 'h23',
});

export function formatSubmissionTime(timestamp: string) {
  return `${wat.format(new Date(timestamp))} WAT`;
}
