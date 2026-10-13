import { INSTITUTION_INFO, CAMPUS_OFFICES, NBTE_GRADING_SCALE } from '../src/data/polyIbadanData';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    institution: INSTITUTION_INFO,
    campuses: INSTITUTION_INFO.campuses,
    offices: CAMPUS_OFFICES,
    gradingScale: NBTE_GRADING_SCALE,
  });
}
