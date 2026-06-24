export function formatTypeLabel(type: string): string {
  switch (type.toLowerCase()) {
    case 'knowledge search':
      return 'Knowledge Search';
    case 'reports':
      return 'Reports';
    case 'predictive analytics':
      return 'Predictive Analytics';
    case 'transcription':
      return 'Transcription';
    case 'patient&clinic portals':
      return 'Patient & Clinic Portals';
    default:
      return type
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
}
