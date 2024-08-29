export function isValidDateTime(datetime: string): boolean {
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  return dateTimeRegex.test(datetime);
}
