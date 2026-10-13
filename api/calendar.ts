import { ACADEMIC_CALENDAR_EVENTS, INSTITUTION_INFO } from '../src/data/polyIbadanData';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    session: '2025/2026 Academic Session',
    institution: INSTITUTION_INFO.name,
    events: ACADEMIC_CALENDAR_EVENTS,
  });
}
