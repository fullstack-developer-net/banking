export function getGreeting(): string {
  const hours = new Date().getHours();
  if (hours < 12) {
    return 'Good morning';
  } else if (hours < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}
