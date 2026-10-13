import { INSTITUTION_INFO, FACULTIES, VERIFIED_FAQS } from '../src/data/polyIbadanData';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    institution: INSTITUTION_INFO,
    faculties: FACULTIES,
    faqs: VERIFIED_FAQS,
  });
}
