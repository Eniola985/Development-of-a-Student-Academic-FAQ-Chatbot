import { GoogleGenAI } from '@google/genai';
import {
  INSTITUTION_INFO,
  FACULTIES,
  VERIFIED_FAQS,
  ACADEMIC_CALENDAR_EVENTS,
  CAMPUS_OFFICES,
  NBTE_GRADING_SCALE,
  BOOK_LOCATIONS,
  CAMPUS_FACILITIES
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
   - North Campus (Sango-Eleyele axis): Houses the Faculty of Science (Computer Science, SLT, Statistics, Geology, Chemistry, Physics), Faculty of Engineering (Electrical, Mechanical, Civil, Computer Engineering), Faculty of Environmental Studies (Architecture, Urban & Regional Planning, Estate Management, Quantity Surveying, Building Technology), the ICT/MIS Directorate (portal issues & biometric capture), Assembly Hall, Works & Maintenance, and the Sports Complex.
   - South Campus (Near Apete gate): Houses the Faculty of Business and Communication Studies (FBCS - Mass Communication, Business Administration, Marketing, OTM, Public Administration) and Faculty of Financial Management Studies (FFMS - Accountancy, Banking & Finance, Insurance), plus Ramat Hall.
   - Middle Campus (Central Axis): Houses the Central Administrative Block (Rector's & Registrar's offices), Directorate of Student Affairs (DSA), Poly Clinic / Medical Centre (24/7 health services), Central Library, 1000-Seater Lecture Theatre, Wema Bank, Poly Microfinance Bank, and Bursary Department.
2. Where to Purchase Books, Manuals & Academic Supplies:
   - Poly Ibadan Official Bookshop: Middle Campus adjacent to Central Library & Bursary. Supplies official GNS manuals (GNS 101 Use of English, GNS 102 Citizenship, GNS 201 Entrepreneurship), statutory matriculation gowns/hoods, official examination answer booklets, and institution-authorized textbooks.
   - Departmental Associations Secretariats & Course Reps: Located inside each faculty (e.g. NACOS for Computer Science at Faculty of Science ground floor; NESA for Engineering near workshops; NAMCOS for Mass Comm at FBCS; NABAMS for Business Admin; NSA for SLT). They distribute lecturer-approved practical manuals, lab workbooks, and departmental handbooks.
   - North Campus Commercial Hub & Printing Arcade: Behind Faculty of Science and near Engineering workshops/North Gate. Sells engineering drawing sheets (A3/A2), grid pads, past questions (PQs), slide printouts, spiral binding, and hardcover project binding.
   - South Campus Commercial Shopping Alley: Between FBCS and FFMS blocks. Stocks business/finance study packs, seminar binding, past questions, and stationery.
   - Middle Campus Post Office & Unity Hall Alley: Document photocopying, lamination, red markers, stamps, express passport photos for clearance.
   - Off-Campus Bookstores at Sango Main Gate: Extensive selection of university/polytechnic textbooks, engineering drawing instruments (T-squares, drawing boards, metric scale rules, set squares), Casio scientific calculators (fx-991ES Plus / fx-991EX), and white laboratory coats.
   - Apete Gate Market: General stationery, second-hand books, past questions for students staying in Apete/Awotan.
3. Food, Banking & Student Facilities:
   - Dining / Cafeterias: Student Union Building (SUB) Cafeteria at Middle Campus (budget-friendly student meals), North Campus Bukateria (behind Faculty of Science), FFMS Buka at South Campus, and Unity Hall Food Village.
   - Banking & ATMs: Wema Bank on-campus branch (Middle Campus near Admin), Poly Ibadan Microfinance Bank (Middle Campus), 24/7 ATM galleries at Wema Bank and Sango Gate.
   - Healthcare: Poly Clinic / Medical Centre at Middle Campus (open 24/7, emergency ambulance, covered by TISHIP health insurance).
4. Academic System & NBTE 4.0 Grading:
   - Poly Ibadan runs two semesters per academic session: Harmattan Semester (1st) and Rain Semester (2nd).
   - Programs: National Diploma (ND I & ND II) and Higher National Diploma (HND I & HND II) in Full-Time, Daily Part-Time (DPP), and Part-Time (CEC).
   - Grading Scale: A (75-100%, 4.00 Distinction), AB (70-74%, 3.50 Distinction), B (65-69%, 3.25 Upper Credit), BC (60-64%, 3.00 Upper Credit), C (55-59%, 2.75 Lower Credit), CD (50-54%, 2.50 Lower Credit), D (45-49%, 2.25 Pass), E (40-44%, 2.00 Pass), F (0-39%, 0.00 Fail).
   - Graduation CGPA: 3.50-4.00 Distinction, 3.00-3.49 Upper Credit, 2.50-2.99 Lower Credit, 2.00-2.49 Pass. CGPA below 2.00 results in Academic Warning / Probation.
5. Key Academic Policies:
   - Course Registration: Done on portal.polyibadan.edu.ng. Print 4 copies, signed by Course Advisor, HOD, and Faculty Officer. Normal units: 18 min to 24 max (up to 30 with written HOD approval for carryovers).
   - Carryovers: Failing a core course requires registering it when next offered. Cannot take a course if you failed its prerequisite.
   - 4-Month SIWES vs 1-Year IT: 4-month SIWES is completed at end of ND 1 for Science, Engineering, and Environmental students. 1-Year Cognate IT is mandatory post-ND II work experience before HND admission (minimum Lower Credit CGPA >= 2.50; Pass grade requires 2 years IT).
   - Examination Eligibility: Requires printed Exam Docket stamped by Faculty Officer, official school fees receipt, and valid student ID card. Minimum 75% lecture attendance.
   - Fees: Validated through Remita on portal.polyibadan.edu.ng. Warn students NEVER to pay cash to unauthorized third parties or POS vendors.
   - Hostels: Unity Hall (Male), Ramat Hall (Female), and Olori Hall applied via portal balloting.
6. Response Instructions:
   - You can answer ANY question about The Polytechnic, Ibadan (book purchasing locations, campus facilities, faculties, departments, courses, lecturers/HOD offices, hostel accommodations, school fees, student portal, clinic services, SUG, library, transportation, security, academic calendars, or exam preparation).
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

  // Candidate models: start with gemini-3.1-flash-lite (fast & distinct quota pool), then gemini-3.8-flash
  const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

  if (ai) {
    const systemInstruction = buildSystemInstruction(studentProfile);
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: any) => `${h.sender === 'user' ? 'Student' : 'Assistant'}: ${h.text}`).join('\n')
      : '';

    const prompt = `${formattedHistory ? `Recent conversation context:\n${formattedHistory}\n\n` : ''}Student Inquiry: "${message}"

Please provide a helpful, structured, and accurate response tailored to The Polytechnic, Ibadan regulations. Conclude with 2-3 relevant follow-up questions the student might want to ask next.`;

    for (const model of CANDIDATE_MODELS) {
      let timeoutTimer: NodeJS.Timeout | null = null;
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutTimer = setTimeout(() => reject(new Error('AI generation timed out')), 8000);
        });

        const apiCallPromise = ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const response: any = await Promise.race([apiCallPromise, timeoutPromise]);
        if (timeoutTimer) clearTimeout(timeoutTimer);

        if (response?.text && response.text.trim()) {
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
        if (timeoutTimer) clearTimeout(timeoutTimer);
        // If quota limit (429 RESOURCE_EXHAUSTED) or timeout is encountered,
        // break immediately so the app delivers the verified offline institutional knowledge base
        const errMsg = err?.message || '';
        const isQuota = err?.status === 429 || errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED');
        if (isQuota) {
          break;
        }
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

  // Check transit between North and South Campus
  if (lower.includes('transit') || lower.includes('shuttle') || (lower.includes('north') && lower.includes('south')) || lower.includes('bus') || lower.includes('keke') || lower.includes('move between')) {
    return {
      reply: `**Transiting Between North Campus and South Campus**\n\nThe Polytechnic, Ibadan operates across two main campus zones situated along the Sango-Eleyele corridor:\n\n1. **Campus Shuttle Buses:** Board licensed internal campus shuttles at the North Campus Central Park (near Faculty of Engineering) or South Campus Park (near FBCS). Fare is nominal (₦100 - ₦150).\n2. **Keke Napep (Tricycles):** Constant intra-campus tricycles operate between the Main Sango Gate, Middle Campus (Library/DSA/Clinic), and South Campus (Apete Gate axis).\n3. **Walking Route:** Approximately 10–12 minutes brisk walk along designated pedestrian walkways past the Central Administrative Complex and Poly Clinic.\n\n*Important:* Always carry your Student ID card when crossing between campus sectors during examinations.`,
      citations: ['Poly Ibadan Directorate of Student Affairs Transit Guidelines'],
      suggestedFollowUps: [
        'Where is the Faculty of Science located?',
        'Where is the Poly Clinic located?',
        'How do I register courses on the student portal?'
      ],
      requiresAdvisingEscalation,
    };
  }

  // Check book and academic materials purchase queries
  if (
    lower.includes('book') ||
    lower.includes('textbook') ||
    lower.includes('manual') ||
    lower.includes('handout') ||
    lower.includes('purchase') ||
    lower.includes('buy') ||
    lower.includes('gns') ||
    lower.includes('t-square') ||
    lower.includes('drawing board') ||
    lower.includes('lab coat') ||
    lower.includes('calculator') ||
    lower.includes('past question') ||
    lower.includes('pq') ||
    lower.includes('stationery')
  ) {
    return {
      reply: `**Where to Purchase Books, Course Manuals & Academic Supplies at Poly Ibadan**\n\nHere are the designated, authorized locations to purchase books, manuals, and study supplies:\n\n1. **The Polytechnic, Ibadan Official Bookshop (Middle Campus):**\n   - **Location:** Central Administration area, adjacent to the Central Library and Bursary.\n   - **Available:** Official General Studies (GNS 101, GNS 102, GNS 201) manuals, statutory matriculation gowns & hoods, examination answer booklets, and institution-authorized reference books.\n\n2. **Departmental Association Secretariats (Inside Respective Faculties):**\n   - **North Campus:** NACOS (Computer Science) at Faculty of Science ground floor; NESA (Engineering) near the workshop complex; FES (Environmental Studies).\n   - **South Campus:** NAMCOS (Mass Communication) and NABAMS (Business Admin) at FBCS; Accountancy and Banking secretariats at FFMS.\n   - **Available:** Lecturer-approved course compendiums, practical manuals, and departmental handbooks.\n\n3. **Campus Commercial Print & Photocopy Centers:**\n   - **North Campus Print Hub (Behind Faculty of Science / North Gate):** Past examination questions (PQs), A3/A2 drawing sheets, spiral binding, and project hardcovers.\n   - **South Campus Commercial Alley (Between FBCS & FFMS):** Business case study handouts, past questions, and office stationeries.\n   - **Middle Campus Post Office / Unity Hall Alley:** Photocopying, course clearance envelopes, red markers, and passport photographs.\n\n4. **Off-Campus Academic Bookstores (Sango Main Gate Axis):**\n   - Located opposite the Main Gate along Sango-Eleyele road. Best for standard textbooks, engineering drawing instruments (T-squares, set squares, metric scale rulers), Casio scientific calculators (fx-991ES Plus / fx-991EX), and white laboratory coats.`,
      citations: [
        'The Polytechnic, Ibadan Bookshop & Academic Planning Guidelines',
        'Directorate of Student Affairs (DSA) Supplies Advisory'
      ],
      suggestedFollowUps: [
        'Where do I buy engineering drawing tools and white lab coats?',
        'Where is the Faculty of Science located?',
        'How do I register courses on the student portal?'
      ],
      requiresAdvisingEscalation,
    };
  }

  // Check food / cafeteria / dining queries
  if (
    lower.includes('food') ||
    lower.includes('eat') ||
    lower.includes('cafeteria') ||
    lower.includes('buka') ||
    lower.includes('canteen') ||
    lower.includes('hungry') ||
    lower.includes('lunch') ||
    lower.includes('dining')
  ) {
    return {
      reply: `**Where to Eat & Buy Food on Campus**\n\nThe Polytechnic, Ibadan has several certified cafeterias and food centers:\n\n1. **Student Union Building (SUB) Cafeteria (Middle Campus):**\n   - Affordable student meals including jollof rice, fried rice, beans, snacks, pastries, and chilled drinks.\n\n2. **North Campus Bukateria Complex:**\n   - Located directly behind the Faculty of Science lecture theatres. Known for authentic local delicacies, hot amala with ewedu/gbegiri, semo, and assorted meats.\n\n3. **FFMS & FBCS Food Village (South Campus):**\n   - Multiple food kiosks serving hot breakfast, lunch dishes, pastries, and smoothies convenient for business & finance students.\n\n4. **Unity Hall Food Village (North Campus):**\n   - Operates near the Unity Hall male hostel; remains open late in the evening for residential and night-reading students.\n\n5. **Off-Campus Dining (Sango Gate & Apete Gate):**\n   - Wide range of restaurants and quick-service spots outside both major campus gates.`,
      citations: ['Directorate of Student Affairs (DSA) Food Safety & Hygiene Guidelines'],
      suggestedFollowUps: [
        'Where can I buy textbooks and course handouts?',
        'Where is the Poly Clinic located?',
        'Where are the banks and ATMs on campus?'
      ],
      requiresAdvisingEscalation,
    };
  }

  // Check banking / ATM queries
  if (
    lower.includes('bank') ||
    lower.includes('atm') ||
    lower.includes('cash') ||
    lower.includes('wema') ||
    lower.includes('microfinance') ||
    lower.includes('withdraw') ||
    (lower.includes('pos') && !lower.includes('post'))
  ) {
    return {
      reply: `**Banking Services & ATM Locations on Campus**\n\n1. **Wema Bank (Poly Ibadan Campus Branch):**\n   - **Location:** Middle Campus, beside the Central Administrative Building.\n   - **Services:** Full commercial banking, Remita fee verification, account opening, teller deposits, and ATM gallery.\n\n2. **The Polytechnic, Ibadan Microfinance Bank:**\n   - **Location:** Middle Campus, adjacent to the Bursary Department.\n   - **Services:** Student account opening, departmental dues clearance, and institution-related payments.\n\n3. **24/7 ATM Galleries:**\n   - Located inside the Wema Bank compound and outside near the Sango Main Gate.\n\n*Important Safety Warning:* Always pay your school fees and acceptance fees directly on the official portal (\`portal.polyibadan.edu.ng\`) via Remita RRR. Do not pay tuition cash to roadside POS agents!`,
      citations: ['Poly Ibadan Bursary Department & Campus Security Advisory'],
      suggestedFollowUps: [
        'Can I pay my school fees in installments?',
        'How do I complete my course registration on the portal?',
        'Where is the Directorate of Student Affairs (DSA)?'
      ],
      requiresAdvisingEscalation,
    };
  }

  // Check lecture halls & examination venues
  if (
    lower.includes('1000') ||
    lower.includes('assembly hall') ||
    lower.includes('lecture theatre') ||
    lower.includes('exam hall') ||
    lower.includes('venue') ||
    lower.includes('auditorium')
  ) {
    return {
      reply: `**Major Lecture Theatres & Examination Halls at Poly Ibadan**\n\n1. **1000-Seater Lecture Theatre (Middle Campus):**\n   - Large multi-purpose facility used for combined General Studies (GNS) lectures, matriculation orientations, and unified semester examinations.\n\n2. **Assembly Hall (North Campus):**\n   - Situated near the Rector's complex; primary hall for official academic ceremonies, public debates, and faculty examinations.\n\n3. **Faculty of Science Lecture Theatres (LT 1, 2, 3 - North Campus):**\n   - Ground and first floor wings of the Science Complex for Computer Science, SLT, and Maths lectures.\n\n4. **Engineering Large Lecture Block & Workshops (North Campus):**\n   - Located adjacent to Mechanical and Civil engineering departments.\n\n5. **FBCS & FFMS Large Auditoriums (South Campus):**\n   - Host Mass Communication, Business Admin, Accountancy, and Banking & Finance lectures and exam sittings.`,
      citations: ['Directorate of Academic Planning & Infrastructure Directory'],
      suggestedFollowUps: [
        'What documents are needed to enter the exam hall?',
        'Where can I buy textbooks and drawing tools?',
        'Where is the Faculty of Science located?'
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
