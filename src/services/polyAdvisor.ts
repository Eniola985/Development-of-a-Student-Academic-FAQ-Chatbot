import { GoogleGenAI } from '@google/genai';
import {
  INSTITUTION_INFO,
  FACULTIES,
  VERIFIED_FAQS,
  ACADEMIC_CALENDAR_EVENTS,
  CAMPUS_OFFICES,
  NBTE_GRADING_SCALE
} from '../data/polyIbadanData';

// Initialize Gemini SDK with telemetry header if key is available
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (e) {
    console.error('Failed to initialize GoogleGenAI client:', e);
    return null;
  }
}

export function buildSystemInstruction(studentProfile?: {
  name?: string;
  matricNo?: string;
  faculty?: string;
  department?: string;
  level?: string;
  program?: string;
}) {
  const studentContext = studentProfile
    ? `Current Student Context:
- Level: ${studentProfile.level || 'Not specified'}
- Program: ${studentProfile.program || 'Full-Time'}
- Faculty: ${studentProfile.faculty || 'General'}
- Department: ${studentProfile.department || 'General'}
- Matric/App No: ${studentProfile.matricNo || 'N/A'}`
    : 'General student inquiry (no specific profile selected).';

  return `You are the official, highly knowledgeable AI Academic Advisory Assistant and Student Guide for The Polytechnic, Ibadan (Poly Ibadan / TPI), established in 1970 in Ibadan, Oyo State, Nigeria. Motto: "Ise loogun ise" (Work is the antidote to poverty).

${studentContext}

Institutional Knowledge & Campus Guide:
1. Campus Geography & Locations:
   - North Campus (Sango-Eleyele axis): Houses the Faculty of Science (Computer Science, SLT, Statistics, Geology, Chemistry, Physics), Faculty of Engineering (Electrical, Mechanical, Civil, Computer Engineering), Faculty of Environmental Studies (Architecture, Urban & Regional Planning, Estate Management, Quantity Surveying, Building Technology), the ICT/MIS Directorate (portal issues & biometric capture), and the Sports Complex.
   - South Campus (Near Apete gate): Houses the Faculty of Business and Communication Studies (FBCS - Mass Communication, Business Administration, Marketing, OTM, Public Administration) and Faculty of Financial Management Studies (FFMS - Accountancy, Banking & Finance, Insurance).
   - Middle Campus (Central Axis): Houses the Central Administrative Block (Rector's & Registrar's offices), Directorate of Student Affairs (DSA), Poly Clinic / Medical Centre (24/7 health services), Central Library, and Bursary Department.
2. Academic System:
   - Poly Ibadan runs two semesters per academic session: Harmattan Semester (1st) and Rain Semester (2nd).
   - Programs: National Diploma (ND I & ND II) and Higher National Diploma (HND I & HND II) in Full-Time, Daily Part-Time (DPP), and Part-Time (CEC).
3. NBTE 4.0 Grading System:
   - A: 75-100% (4.00) Distinction
   - AB: 70-74% (3.50) Distinction
   - B: 65-69% (3.25) Upper Credit
   - BC: 60-64% (3.00) Upper Credit
   - C: 55-59% (2.75) Lower Credit
   - CD: 50-54% (2.50) Lower Credit
   - D: 45-49% (2.25) Pass
   - E: 40-44% (2.00) Pass
   - F: 0-39% (0.00) Fail
   - Graduation CGPA: 3.50-4.00 Distinction, 3.00-3.49 Upper Credit, 2.50-2.99 Lower Credit, 2.00-2.49 Pass. CGPA below 2.00 results in Academic Warning / Probation.
4. Key Academic Policies:
   - Course Registration: Done on portal.polyibadan.edu.ng. Print 4 copies, signed by Course Advisor, HOD, and Faculty Officer. Normal units: 18 min to 24 max (up to 30 with written HOD approval for carryovers).
   - Carryovers: Failing a core course requires registering it when next offered. Cannot take a course if you failed its prerequisite.
   - 4-Month SIWES vs 1-Year IT:
     * 4-Month SIWES: Completed at end of ND 1 for Science, Engineering, and Environmental students.
     * 1-Year Cognate IT: Mandatory post-ND II work experience before HND admission. Minimum grade: Lower Credit (CGPA >= 2.50). Pass grade (2.00-2.49) requires 2 years IT.
   - Examination Eligibility: Requires printed Exam Docket stamped by Faculty Officer, official school fees receipt, and valid student ID card. Minimum 75% lecture attendance.
   - Fees: Validated through Remita on portal.polyibadan.edu.ng. Warn students NEVER to pay cash to unauthorized third parties or POS vendors.
   - Hostels: Unity Hall, Ramat Hall, and Olori Hall applied via portal balloting.
5. Response Instructions:
   - You can answer ANY question about The Polytechnic, Ibadan (campus locations, faculties, departments, courses, lecturers/HOD offices, hostel accommodations, school fees, student portal, clinic services, SUG, library, transportation, security, academic calendars, or exam preparation).
   - Be helpful, conversational, respectful, authoritative, and clear.
   - Use bullet points, bold key terms, and step-by-step guidance.
   - Conclude with 2-3 relevant follow-up questions the student might want to ask next.`;
}

export async function handlePolyAdvisorQuery({
  message,
  studentProfile,
  history = []
}: {
  message: string;
  studentProfile?: any;
  history?: any[];
}) {
  if (!message || typeof message !== 'string') {
    throw new Error('Message is required');
  }

  const lower = message.toLowerCase().trim();

  // Check if the query triggers advising escalation
  const requiresAdvisingEscalation =
    lower.includes('missing script') ||
    lower.includes('grade dispute') ||
    lower.includes('result withheld') ||
    lower.includes('disciplinary') ||
    lower.includes('transcript delayed') ||
    lower.includes('medical excuse') ||
    lower.includes('expulsion') ||
    lower.includes('carryover dispute');

  const ai = getGeminiClient();

  // Multi-model list: gemini-3.1-flash-lite is high throughput and fast, with fallbacks
  const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

  if (ai) {
    const systemInstruction = buildSystemInstruction(studentProfile);
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: any) => `${h.sender === 'user' ? 'Student' : 'Assistant'}: ${h.text}`).join('\n')
      : '';

    const prompt = `${formattedHistory ? `Recent conversation context:\n${formattedHistory}\n\n` : ''}Student Inquiry: "${message}"

Please provide a helpful, structured, and accurate response tailored to The Polytechnic, Ibadan regulations. Conclude with 2-3 relevant follow-up questions the student might want to ask next.`;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response.text && response.text.trim()) {
          const replyText = response.text.trim();

          // Determine citations
          const citations: string[] = [];
          if (lower.includes('portal') || lower.includes('register') || lower.includes('course')) {
            citations.push('Poly Ibadan Student Handbook - Sec 3.1 Course Registration');
          }
          if (lower.includes('grade') || lower.includes('cgpa') || lower.includes('probation') || lower.includes('carryover')) {
            citations.push('NBTE Polytechnic Harmonized Grading Regulations & Poly Ibadan Exam Bylaws');
          }
          if (lower.includes('it') || lower.includes('siwes') || lower.includes('hnd')) {
            citations.push('Directorate of SIWES & Post-ND Industrial Training Guidelines (ITF)');
          }
          if (lower.includes('faculty') || lower.includes('science') || lower.includes('engineering') || lower.includes('campus') || lower.includes('locate') || lower.includes('where is')) {
            citations.push('The Polytechnic, Ibadan Campus Directorate & Physical Planning Map');
          }
          if (citations.length === 0) {
            citations.push('The Polytechnic, Ibadan Academic Regulations & Directorate of Student Affairs');
          }

          let suggestedFollowUps = [
            'What are the requirements for HND admission?',
            'Where is the Directorate of Student Affairs located?',
            'How is CGPA computed on the NBTE 4.0 scale?',
          ];

          if (lower.includes('science') || lower.includes('faculty') || lower.includes('where')) {
            suggestedFollowUps = [
              'What departments are under the Faculty of Science?',
              'Where is the ICT / MIS Centre located on North Campus?',
              'How do I locate my departmental HOD office?',
            ];
          } else if (lower.includes('registration') || lower.includes('portal')) {
            suggestedFollowUps = [
              'What is the maximum credit unit allowed per semester?',
              'What happens if I miss the course registration deadline?',
              'How do I get my course form signed by my HOD?',
            ];
          }

          return {
            reply: replyText,
            citations,
            suggestedFollowUps,
            requiresAdvisingEscalation,
          };
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed:`, err?.message || err);
        // Continue to next model in loop
      }
    }
  }

  // Smart Offline Institutional Matcher (handles campus locations, faculties, and verified policies)
  // Check location queries (e.g. "where is the faculty of science", "where is engineering", "where is clinic")
  const facultyMatch = FACULTIES.find(f => 
    lower.includes(f.name.toLowerCase()) || 
    lower.includes(f.code.toLowerCase()) ||
    f.departments.some(d => lower.includes(d.toLowerCase()))
  );

  if (facultyMatch && (lower.includes('where') || lower.includes('locate') || lower.includes('campus') || lower.includes('address') || lower.includes('find'))) {
    return {
      reply: `**Location of ${facultyMatch.name} (${facultyMatch.code})**\n\nThe **${facultyMatch.name}** is located at the **${facultyMatch.campus}** of The Polytechnic, Ibadan.\n\n- **Campus Zone:** ${facultyMatch.campus} (along Sango-Eleyele axis)\n- **Departments in this Faculty:**\n${facultyMatch.departments.map(d => `  * ${d}`).join('\n')}\n\n*Directions:* Enter through the main gate. The Faculty Complex is easily accessible from the central walkway near the departmental lecture halls.`,
      citations: ['The Polytechnic, Ibadan Campus Directory & Physical Planning'],
      suggestedFollowUps: [
        'Where is the Directorate of Student Affairs located?',
        'How do I find the ICT / MIS Directorate?',
        'How do I register courses on the student portal?'
      ],
      requiresAdvisingEscalation,
    };
  }

  // Check campus offices (e.g. Clinic, DSA, MIS/ICT, Bursary, Library)
  const officeMatch = CAMPUS_OFFICES.find(o =>
    lower.includes(o.name.toLowerCase()) ||
    (lower.includes('clinic') && o.name.toLowerCase().includes('clinic')) ||
    (lower.includes('hospital') && o.name.toLowerCase().includes('clinic')) ||
    (lower.includes('library') && o.name.toLowerCase().includes('library')) ||
    (lower.includes('dsa') && o.name.toLowerCase().includes('student affairs')) ||
    (lower.includes('ict') && o.name.toLowerCase().includes('mis')) ||
    (lower.includes('portal') && o.name.toLowerCase().includes('mis')) ||
    (lower.includes('bursary') && o.name.toLowerCase().includes('bursary'))
  );

  if (officeMatch && (lower.includes('where') || lower.includes('locate') || lower.includes('hours') || lower.includes('address') || lower.includes('find'))) {
    return {
      reply: `**${officeMatch.name}**\n\n- **Location:** ${officeMatch.location}\n- **Services:** ${officeMatch.role}\n- **Operational Hours:** ${officeMatch.hours}\n\n*Note:* If you need immediate administrative clearance or assistance, visit this office during working hours.`,
      citations: ['The Polytechnic, Ibadan Administrative Offices Directory'],
      suggestedFollowUps: [
        'Where is the Faculty of Science located?',
        'What documents are needed for course clearance?',
        'How do I secure hostel accommodation?'
      ],
      requiresAdvisingEscalation,
    };
  }

  // Fallback: Check Verified FAQs
  const matchedFaq = VERIFIED_FAQS.find(faq =>
    faq.tags.some(tag => lower.includes(tag.toLowerCase())) ||
    lower.includes(faq.category.toLowerCase()) ||
    faq.question.toLowerCase().split(' ').some(word => word.length > 4 && lower.includes(word))
  );

  if (matchedFaq) {
    return {
      reply: `**${matchedFaq.question}**\n\n${matchedFaq.detailedAnswer}\n\n*Official Source:* ${matchedFaq.policyReference}`,
      citations: [matchedFaq.policyReference || 'The Polytechnic, Ibadan Student Handbook'],
      suggestedFollowUps: [
        'Where is the Faculty of Science located?',
        'What are the requirements for HND admission?',
        'How do I calculate my CGPA on the 4.0 scale?'
      ],
      requiresAdvisingEscalation,
    };
  }

  // Polite comprehensive response for general school inquiries
  return {
    reply: `Welcome to **The Polytechnic, Ibadan** Student Academic & Campus Guide!\n\nYou can ask me about:\n- **Campus & Faculty Locations:** (e.g. *"Where is the Faculty of Science located?"*, *"Where is the Poly Clinic?"*, *"How do I find the ICT Centre?"*)\n- **Course Registration & Student Portal:** (\`portal.polyibadan.edu.ng\`, course forms, HOD signatures)\n- **NBTE 4.0 Grading & CGPA:** (Distinction, Upper Credit, Lower Credit, Pass, Probation)\n- **SIWES & 1-Year IT:** (4-month SIWES for ND 1, 1-year cognate IT for HND)\n- **Hostels & Campus Life:** (Unity Hall, Ramat Hall, Olori Hall, SUG, Poly Clinic)\n- **School Fees & Remita Receipts**\n\nPlease ask any specific question about your department or campus!`,
    citations: ['The Polytechnic, Ibadan Academic Regulations & Student Handbook'],
    suggestedFollowUps: [
      'Where is the Faculty of Science located?',
      'How do I register courses on the student portal?',
      'What is the required CGPA for HND admission?'
    ],
    requiresAdvisingEscalation,
  };
}
