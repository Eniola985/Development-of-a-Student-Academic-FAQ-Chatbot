import { FAQItem, CalendarEvent, BookLocation } from '../types';

export const INSTITUTION_INFO = {
  name: "The Polytechnic, Ibadan",
  shortName: "Poly Ibadan / TPI",
  founded: 1970,
  motto: "Ise loogun ise (Work is the antidote to poverty)",
  location: "Sango-Eleyele Road, Ibadan, Oyo State, Nigeria",
  portalUrl: "https://portal.polyibadan.edu.ng",
  mainWebsite: "https://polyibadan.edu.ng",
  semesters: ["Harmattan Semester (1st)", "Rain Semester (2nd)"],
  campuses: [
    { name: "North Campus", location: "Sango-Eleyele axis", housing: "Science, Engineering, Environmental Studies, ICT Centre, Rector's Office" },
    { name: "South Campus", location: "Near Apete / Polytechnic gate", housing: "Business & Communication Studies (FBCS), Financial Management (FFMS)" },
    { name: "Middle Campus", location: "Central Campus", housing: "Central Administrative Block, Bursary, Directorate of Student Affairs (DSA), Poly Clinic" }
  ]
};

export const FACULTIES = [
  {
    name: "Faculty of Science",
    code: "FSC",
    campus: "North Campus",
    departments: [
      "Computer Science",
      "Science Laboratory Technology (SLT)",
      "Mathematics & Statistics",
      "Geology",
      "Applied Chemistry",
      "Physics with Electronics"
    ]
  },
  {
    name: "Faculty of Engineering",
    code: "FENG",
    campus: "North Campus",
    departments: [
      "Electrical & Electronics Engineering",
      "Computer Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Mechatronics Engineering"
    ]
  },
  {
    name: "Faculty of Business & Communication Studies",
    code: "FBCS",
    campus: "South Campus",
    departments: [
      "Mass Communication",
      "Business Administration",
      "Marketing",
      "Office Technology and Management (OTM)",
      "Public Administration",
      "Purchasing & Supply"
    ]
  },
  {
    name: "Faculty of Financial Management Studies",
    code: "FFMS",
    campus: "South Campus",
    departments: [
      "Accountancy",
      "Banking & Finance",
      "Insurance"
    ]
  },
  {
    name: "Faculty of Environmental Studies",
    code: "FES",
    campus: "North Campus",
    departments: [
      "Architecture",
      "Urban & Regional Planning",
      "Estate Management & Valuation",
      "Quantity Surveying",
      "Building Technology",
      "Surveying & Geoinformatics",
      "Art and Design"
    ]
  }
];

export const NBTE_GRADING_SCALE = [
  { grade: "A", range: "75% - 100%", points: 4.00, remark: "Distinction", color: "emerald" },
  { grade: "AB", range: "70% - 74%", points: 3.50, remark: "Distinction", color: "emerald" },
  { grade: "B", range: "65% - 69%", points: 3.25, remark: "Upper Credit", color: "blue" },
  { grade: "BC", range: "60% - 64%", points: 3.00, remark: "Upper Credit", color: "blue" },
  { grade: "C", range: "55% - 59%", points: 2.75, remark: "Lower Credit", color: "amber" },
  { grade: "CD", range: "50% - 54%", points: 2.50, remark: "Lower Credit", color: "amber" },
  { grade: "D", range: "45% - 49%", points: 2.25, remark: "Pass", color: "orange" },
  { grade: "E", range: "40% - 44%", points: 2.00, remark: "Pass", color: "orange" },
  { grade: "F", range: "0% - 39%", points: 0.00, remark: "Fail", color: "red" }
];

export const GRADUATION_CLASSIFICATIONS = [
  { classification: "Distinction", cgpaRange: "3.50 - 4.00", badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { classification: "Upper Credit", cgpaRange: "3.00 - 3.49", badgeColor: "bg-blue-100 text-blue-800 border-blue-300" },
  { classification: "Lower Credit", cgpaRange: "2.50 - 2.99", badgeColor: "bg-amber-100 text-amber-800 border-amber-300" },
  { classification: "Pass", cgpaRange: "2.00 - 2.49", badgeColor: "bg-orange-100 text-orange-800 border-orange-300" },
  { classification: "Fail / Academic Warning", cgpaRange: "Below 2.00", badgeColor: "bg-red-100 text-red-800 border-red-300" }
];

export const VERIFIED_FAQS: FAQItem[] = [
  {
    id: "faq-portal-reg",
    category: "Portal & Registration",
    question: "How do I complete my semester course registration on the student portal?",
    shortAnswer: "Pay your school fees via Remita, log in to portal.polyibadan.edu.ng, select your department/level, pick prescribed courses, submit and print 4 copies for course advisor and HOD endorsement.",
    detailedAnswer: "To register courses at The Polytechnic, Ibadan:\n1. Ensure your school fees or approved first installment payment has been validated with an official receipt.\n2. Log in to the student portal (portal.polyibadan.edu.ng) using your Matriculation Number or Application Number and password.\n3. Navigate to 'Course Registration' and select the current academic session and semester (Harmattan or Rain).\n4. Select your department's core and elective courses. Ensure your total registered credit units fall within the approved limit (minimum 18, maximum 24 units; maximum 30 with written HOD approval for spillover/carryovers).\n5. Click 'Submit Registration' and print four (4) colored copies of the Course Form.\n6. Take the copies to your Course Advisor, Head of Department (HOD), and Faculty Officer for official signatures and stamp.",
    policyReference: "Student Handbook Sec 3.1 & Academic Board Bulletin on Course Registration",
    tags: ["course registration", "portal", "hod signature", "credit units"],
    frequentlyAsked: true
  },
  {
    id: "faq-hnd-admission-req",
    category: "Admissions & Clearance",
    question: "What are the requirements for Higher National Diploma (HND) admission at Poly Ibadan?",
    shortAnswer: "National Diploma (ND) with at least Lower Credit (CGPA >= 2.50) + 1 year cognate Industrial Training (IT), or Pass grade (CGPA 2.00-2.49) with 2 years IT, plus 5 O'Level credits.",
    detailedAnswer: "Requirements for HND admission into The Polytechnic, Ibadan:\n1. National Diploma (ND) certificate or Statement of Result in the relevant course from an NBTE-accredited institution.\n2. Minimum of Lower Credit (CGPA 2.50 and above) requires one (1) year of cognate post-ND Industrial Work Experience.\n3. Applicants with a Pass grade (CGPA 2.00 - 2.49) must provide proof of two (2) years post-ND Industrial Work Experience.\n4. Five (5) O'Level credit passes in GCE/SSCE/NECO/NABTEB including English Language and Mathematics at not more than two (2) sittings.\n5. Official academic transcript sent directly from your ND institution to the Registrar, The Polytechnic, Ibadan (exempted for Poly Ibadan ND graduates).",
    policyReference: "Poly Ibadan Directorate of Academic Planning & HND Admissions Guide",
    tags: ["hnd admission", "industrial training", "lower credit", "transcript"],
    frequentlyAsked: true
  },
  {
    id: "faq-carryover-rules",
    category: "Exams & Grading",
    question: "What is the policy regarding carryover courses and prerequisites?",
    shortAnswer: "A course with grade 'F' must be repeated in the next session during the semester it is offered. You cannot register advanced courses if you fail their prerequisite.",
    detailedAnswer: "Key rules for carryover courses at Poly Ibadan:\n1. Any core or required departmental course in which you scored an 'F' (below 40%) must be registered as a carryover when next offered.\n2. Carryover courses must take priority in credit unit allocation over new elective courses.\n3. Prerequisite rule: If Course A is a prerequisite for Course B (e.g., COM 111 is prerequisite for COM 121), you cannot register Course B until Course A is passed or approved for simultaneous registration by the Academic Board.\n4. Total registered units including carryovers must not exceed the maximum allowed ceiling (24-30 units).",
    policyReference: "NBTE Polytechnic Regulations Sec 4.4",
    tags: ["carryover", "failing grade", "prerequisite", "credit units"],
    frequentlyAsked: true
  },
  {
    id: "faq-academic-probation",
    category: "Exams & Grading",
    question: "What happens if a student's CGPA drops below 2.00 (Academic Probation)?",
    shortAnswer: "A student whose CGPA is below 2.00 at the end of a session is placed on Academic Probation/Warning. Failing to raise it above 2.00 after the warning leads to withdrawal.",
    detailedAnswer: "Academic Probation Policy:\n1. If your Cumulative Grade Point Average (CGPA) falls below 2.00 (the minimum Pass mark on the 4.00 scale) at the end of the academic session, you receive a formal Academic Warning/Probation letter from the Registrar.\n2. On probation, you are advised to reduce elective load and focus heavily on clearing carryover courses.\n3. If your CGPA remains below 2.00 for two consecutive academic sessions, you may be advised to withdraw from the program or transfer to another department with lower cutoffs.",
    policyReference: "Poly Ibadan Examination Regulations & NBTE Standard 2024",
    tags: ["academic probation", "cgpa", "withdrawal", "warning"],
    frequentlyAsked: true
  },
  {
    id: "faq-siwes-training",
    category: "SIWES & 1-Year IT",
    question: "What is the difference between 4-Month SIWES and the 1-Year Post-ND Industrial Training?",
    shortAnswer: "4-month SIWES is conducted at the end of ND 1 for science and engineering students, while 1-year IT is mandatory after completing ND 2 before enrolling for HND.",
    detailedAnswer: "Poly Ibadan distinguishes between two industrial training schemes:\n1. **4-Month SIWES (Students Industrial Work Experience Scheme):**\n   - Completed at the end of ND 1 (during the long vacation) by students in Engineering, Science Laboratory Technology, Computer Science, and Environmental Studies.\n   - Graded as a credit-bearing course in the subsequent Rain/Harmattan semester (SIWES logbook and oral defense).\n2. **1-Year Post-ND Cognate IT:**\n   - Done after graduating from ND II.\n   - Required by NBTE for entry into HND programs.\n   - Must be supported by an official Employer's Letter of Completion and an Industrial Logbook.",
    policyReference: "Directorate of SIWES & ITF Ibadan Area Office Guidelines",
    tags: ["siwes", "industrial training", "itf", "logbook", "hnd entry"],
    frequentlyAsked: true
  },
  {
    id: "faq-exam-clearance",
    category: "Exams & Grading",
    question: "What documents are required to enter the examination hall (Exam Clearance Docket)?",
    shortAnswer: "Signed Course Registration Form, Official School Fees Receipt, Exam Docket/Card, and Student Identity Card (or temporary ID).",
    detailedAnswer: "To enter examination venues at North or South Campus:\n1. **Examination Docket/Pass:** Printed from the portal and stamped by your Faculty Officer.\n2. **School Fees Receipt:** Validated proof of full tuition payment or approved instalment.\n3. **Signed Course Form:** Bearing signatures of Course Advisor and HOD.\n4. **Student ID Card:** Issued by the ICT/MIS Directorate. If lost, obtain a temporary clearance slip from the Directorate of Student Affairs (DSA).\n*Note:* Mobile phones, smartwatches, and programmable calculators are strictly prohibited in the exam hall.",
    policyReference: "Chief Examination Officer Guidelines for Semester Exams",
    tags: ["exam docket", "id card", "fees receipt", "exam rules"],
    frequentlyAsked: true
  },
  {
    id: "faq-hostel-accommodation",
    category: "Campus Life & Hostels",
    question: "How can I secure hostel accommodation on campus?",
    shortAnswer: "Hostel spaces are allocated through portal balloting after school fees payment. Fresh students (ND I & HND I) are given priority.",
    detailedAnswer: "Accommodation guidelines at Poly Ibadan:\n1. Only students who have completed payment of their school fees are eligible to apply on the student portal.\n2. Available halls include Unity Hall, Ramat Hall, and Olori Hall.\n3. Log in to portal.polyibadan.edu.ng and click 'Hostel Application'. Select your hall preference and participate in the balloting process.\n4. If successful, generate the Hostel Allocation Slip, pay the hostel maintenance fee, and proceed to the Hall Warden for room clearance and bed allocation.",
    policyReference: "Directorate of Student Affairs (DSA) Housing Unit",
    tags: ["hostels", "accommodation", "unity hall", "ramat hall", "dsa"],
    frequentlyAsked: false
  },
  {
    id: "faq-clinic-medical",
    category: "Campus Life & Hostels",
    question: "How do I access healthcare at the Poly Clinic / Medical Centre?",
    shortAnswer: "Register at the Poly Clinic (Middle Campus) during fresh student clearance with your medical test results and clinic card under the TISHIP scheme.",
    detailedAnswer: "Healthcare Services at Poly Ibadan:\n1. The Medical Centre is located at Middle Campus and provides 24/7 emergency care, out-patient consultations, and pharmacy services.\n2. All students are covered under the Tertiary Institution Social Health Insurance Programme (TISHIP).\n3. Newly admitted students must complete medical screening (Chest X-ray, genotype, blood group, urine test) at the Poly Clinic to obtain medical clearance.\n4. In case of sudden illness during examination periods, report immediately to the clinic for medical certification to validate your absence.",
    policyReference: "Poly Ibadan Health Services Directorate / NHIA TISHIP",
    tags: ["poly clinic", "medical centre", "tiship", "health clearance"],
    frequentlyAsked: false
  },
  {
    id: "faq-fees-installment",
    category: "Fees & Payments",
    question: "Can school fees be paid in installments at The Polytechnic, Ibadan?",
    shortAnswer: "Yes, when approved by the Institution's Management, fees can be paid in two installments (60% Harmattan semester, 40% Rain semester).",
    detailedAnswer: "Payment policy:\n1. Management frequently provides an installment payment window for ND and HND students.\n2. When active, 60% of the total tuition fee is paid in the 1st (Harmattan) semester to permit course registration and exam eligibility.\n3. The balance of 40% must be completed before registration for the 2nd (Rain) semester.\n4. Payments must strictly be generated via the official student portal Remita RRR. Never make direct cash transfers to any individual or POS agent claiming to represent the Bursary.",
    policyReference: "Bursary Department Financial Directives 2024/2025",
    tags: ["school fees", "installment", "remita", "bursary"],
    frequentlyAsked: true
  },
  {
    id: "faq-change-course",
    category: "Admissions & Clearance",
    question: "Is it possible to apply for a Change of Course after ND I?",
    shortAnswer: "Internal transfer is strictly subject to vacancy, meeting the receiving department's cut-off mark, and approval by both HODs and the Academic Board.",
    detailedAnswer: "Transfer Procedure:\n1. A student seeking transfer from one department to another must have spent at least one full academic session.\n2. Must possess a minimum CGPA of 2.50 (Lower Credit) with zero carryovers.\n3. Must meet the O'Level subject combination requirements of the target department.\n4. Complete the Change of Course Form obtainable at the Academic Planning Directorate, pay the transfer processing fee, and obtain signatures from both releasing and receiving HODs before Academic Board ratification.",
    policyReference: "Academic Board Guidelines on Inter-Departmental Transfer",
    tags: ["change of course", "transfer", "academic board", "cut-off"],
    frequentlyAsked: false
  },
  {
    id: "faq-buy-books-materials",
    category: "Books & Academic Materials",
    question: "Where can I buy textbooks, GNS manuals, and course handouts at Poly Ibadan?",
    shortAnswer: "Buy official GNS books and university texts at the Poly Ibadan Bookshop (Middle Campus near Central Library), departmental association secretariats, and Faculty commercial printing hubs.",
    detailedAnswer: "Authorized locations to purchase academic books and materials:\n1. **The Polytechnic, Ibadan Bookshop:** Located at Middle Campus, adjacent to the Central Library and Bursary. Sells authorized General Studies (GNS 101, GNS 102, GNS 201) manuals, statutory matriculation gowns, notebooks, and standard textbooks.\n2. **Departmental Association Secretariats:** Inside your faculty building (e.g. NACOS for Computer Science at Faculty of Science, NESA for Engineering, NAMCOS for Mass Comm at FBCS, NABAMS for Business Admin). Course executives distribute departmental course compendiums, practical workbooks, and lab guides approved by course lecturers.\n3. **Campus Commercial Print & Photocopy Centers:**\n   - *North Campus Commercial Hub:* Behind Faculty of Science and adjacent to Engineering workshops. Offers past questions (PQs), printed lecture slides, spiral binding, and project hardcovers.\n   - *South Campus Shopping Arcade:* Between FBCS and FFMS blocks. Offers management case studies, past examination questions, and stationery.\n   - *Middle Campus Post Office / Unity Hall Alley:* Photocopiers, document lamination, and project printing.\n4. **Off-Campus Academic Bookstores:** Major book vendors along the Sango Gate main road and Apete Gate market stock comprehensive polytechnic reference textbooks.",
    policyReference: "Directorate of Academic Affairs & Student Union Book Commission",
    tags: ["buy books", "textbooks", "gns manuals", "poly bookshop", "course materials", "past questions", "where to buy"],
    frequentlyAsked: true
  },
  {
    id: "faq-buy-engineering-lab-supplies",
    category: "Books & Academic Materials",
    question: "Where do I buy engineering drawing instruments, white lab coats, and workshop gear?",
    shortAnswer: "Purchase drawing boards and T-squares at Sango Gate bookstores or the North Campus Engineering commercial kiosk; lab coats are available at Faculty of Science kiosks and Poly Clinic pharmacy.",
    detailedAnswer: "Locations for technical and laboratory equipment:\n1. **Technical Drawing Equipment (T-Squares, Drawing Boards, Set Squares, Metric Scales):** Available at the Engineering Association (NESA) secretariat, the North Campus commercial pavilion near Faculty of Environmental Studies, or registered stationery stores outside the Sango main gate.\n2. **White Laboratory Coats & Dissection Kits:** Required for Science Laboratory Technology (SLT), Chemistry, and Biology practicals. Available at the Faculty of Science commercial store, Poly Clinic Pharmacy, and Sango pharmacy stores.\n3. **Scientific Calculators:** Non-programmable models (e.g. Casio fx-991ES Plus / fx-991EX ClassWiz) permitted in exam halls can be obtained from the Poly Bookshop or certified stores at Sango Gate.\n4. **Safety Boots & Workshop Overalls:** Available at North Campus Mechanical/Civil workshops and vendor stores near the Sango bus stop.",
    policyReference: "Faculties of Engineering & Science Laboratory Safety Guidelines",
    tags: ["engineering drawing", "lab coat", "t-square", "calculator", "workshop", "equipment"],
    frequentlyAsked: true
  },
  {
    id: "faq-campus-food-dining",
    category: "Campus Life & Hostels",
    question: "Where can I buy food or eat good meals on North and South Campus?",
    shortAnswer: "Eat at the SUB Cafeteria (Middle Campus), North Campus Bukateria (near Science/Engineering), FFMS Buka (South Campus), or Unity Hall Food Village.",
    detailedAnswer: "Key dining and cafeteria spots across the campus:\n1. **Student Union Building (SUB) Cafeteria:** Located at Middle Campus. Offers affordable student meals (jollof rice, beans, amala, semo, snacks, and cold beverages).\n2. **North Campus Bukateria Complex:** Situated behind the Faculty of Science lecture theatres. Popular for affordable local delicacies, swallow, and refreshments.\n3. **FFMS & FBCS Food Village:** Located at South Campus. Multiple food vendors serving breakfast, lunch, pastries, and smoothies.\n4. **Unity Hall Food Kiosks:** Located near Unity Hall (North Campus). Open late into the evening for residents and night-class students.\n5. **Off-Campus Food Hubs:** Numerous eateries and fast food outlets operate just outside the Sango Gate and Apete Gate axis.",
    policyReference: "Directorate of Student Affairs (DSA) Food & Hygiene Committee",
    tags: ["food", "cafeteria", "buka", "sub cafeteria", "where to eat", "canteen"],
    frequentlyAsked: true
  },
  {
    id: "faq-banks-atms-campus",
    category: "Campus Locations & Facilities",
    question: "Where are the banks and ATMs located on the Poly Ibadan campus?",
    shortAnswer: "Wema Bank is located on campus beside the Administrative Block; Poly Ibadan Microfinance Bank is at Middle Campus; ATM galleries are near Central Admin and Sango Gate.",
    detailedAnswer: "Banking services on campus:\n1. **Wema Bank (Poly Ibadan Branch):** Located on Middle Campus, directly adjacent to the Central Administrative complex. Handles Remita fee validations, teller deposits, and ATM cash withdrawals.\n2. **The Polytechnic, Ibadan Microfinance Bank:** Located at Middle Campus. Provides account services, staff/student salary transactions, and departmental dues payments.\n3. **ATM Galleries:** 24/7 automated teller machines are stationed at Wema Bank premises and near the Sango Main Gate.\n4. **POS Agents:** Certified POS vendors operate at the SUB complex, North Campus commercial hub, and South Campus shopping arcade. *Note: Always pay tuition via the official Remita portal, not third-party cash handlers!*",
    policyReference: "Bursary Directorate & Campus Security Advisory",
    tags: ["bank", "atm", "wema bank", "microfinance", "cash", "pos", "remita payment"],
    frequentlyAsked: true
  },
  {
    id: "faq-lecture-theatres-venues",
    category: "Campus Locations & Facilities",
    question: "Where are the major lecture theatres and examination halls located?",
    shortAnswer: "Major halls include the 1000-Seater Lecture Theatre (Middle Campus), Assembly Hall (North Campus), Science LT 1-3, and FBCS/FFMS Auditoriums (South Campus).",
    detailedAnswer: "Key academic lecture halls and examination centers:\n1. **1000-Seater Lecture Theatre:** Located at Middle Campus. Used for General Studies (GNS) combined lectures, large matriculation rehearsals, and unified examination sittings.\n2. **Assembly Hall:** Located on North Campus near the Rector's complex. Venue for official academic ceremonies, public lectures, and major exams.\n3. **Faculty of Science Lecture Theatres (LT 1, 2, 3):** Located on North Campus, ground and first floors of the Science Complex.\n4. **Engineering Large Lecture Complex & Mechanical Workshops:** Located on North Campus adjacent to Civil Engineering department.\n5. **FBCS & FFMS Auditoriums:** Located on South Campus. Host Mass Comm, Business Admin, Accountancy, and Banking & Finance lectures.\n6. **Sports Pavilion:** North Campus, utilized for outdoor orientations and physical fitness assessments.",
    policyReference: "Directorate of Academic Planning Physical Infrastructure Catalog",
    tags: ["lecture theatre", "1000 seater", "assembly hall", "exam hall", "venues", "locations"],
    frequentlyAsked: true
  }
];


export const ACADEMIC_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "cal-1",
    title: "Resumption & Portal Re-opening for Harmattan Semester",
    dateStr: "November 10, 2025",
    dateTimestamp: new Date("2025-11-10").getTime(),
    category: "Registration",
    semester: "Harmattan (1st)",
    status: "completed",
    notes: "Commencement of payment of acceptance fees and school fees."
  },
  {
    id: "cal-2",
    title: "Commencement of Lectures for ND & HND Students",
    dateStr: "November 24, 2025",
    dateTimestamp: new Date("2025-11-24").getTime(),
    category: "Lectures",
    semester: "Harmattan (1st)",
    status: "completed",
    notes: "Departments begin formal lectures across North and South campuses."
  },
  {
    id: "cal-3",
    title: "Orientation & Matriculation Ceremony for ND I & HND I",
    dateStr: "January 14, 2026",
    dateTimestamp: new Date("2026-01-14").getTime(),
    category: "Ceremony",
    semester: "Harmattan (1st)",
    status: "completed",
    notes: "Formal induction of fresh students at the North Campus Sports Complex."
  },
  {
    id: "cal-4",
    title: "Close of Normal Course Registration & Late Registration Window",
    dateStr: "February 27, 2026",
    dateTimestamp: new Date("2026-02-27").getTime(),
    category: "Registration",
    semester: "Harmattan (1st)",
    status: "upcoming",
    notes: "Late registration incurs a mandatory penalty fee of N5,000."
  },
  {
    id: "cal-5",
    title: "Continuous Assessment / Mid-Semester Tests",
    dateStr: "March 9 - March 13, 2026",
    dateTimestamp: new Date("2026-03-09").getTime(),
    category: "Exams",
    semester: "Harmattan (1st)",
    status: "upcoming",
    notes: "Departmental tests contributing 30% to final semester grade."
  },
  {
    id: "cal-6",
    title: "Revision Week (Lecture End)",
    dateStr: "April 6 - April 10, 2026",
    dateTimestamp: new Date("2026-04-06").getTime(),
    category: "Lectures",
    semester: "Harmattan (1st)",
    status: "upcoming",
    notes: "No formal lectures; student revision and exam docket stamping."
  },
  {
    id: "cal-7",
    title: "Harmattan Semester Examinations (All Faculties)",
    dateStr: "April 13 - May 8, 2026",
    dateTimestamp: new Date("2026-04-13").getTime(),
    category: "Exams",
    semester: "Harmattan (1st)",
    status: "upcoming",
    notes: "Staggered examination across North & South Campus centres."
  },
  {
    id: "cal-8",
    title: "Resumption for Rain (2nd) Semester 2025/2026",
    dateStr: "June 1, 2026",
    dateTimestamp: new Date("2026-06-01").getTime(),
    category: "Registration",
    semester: "Rain (2nd)",
    status: "upcoming",
    notes: "Course registration for second semester opens on the portal."
  }
];

export const CAMPUS_OFFICES = [
  {
    name: "Directorate of Student Affairs (DSA)",
    location: "Middle Campus, Near Central Library",
    role: "Student welfare, identity cards, hostel management, clubs & societies registration",
    hours: "Monday - Friday: 8:00 AM - 4:00 PM"
  },
  {
    name: "Management Information System (MIS / ICT)",
    location: "North Campus, Adjacent Faculty of Science",
    role: "Student portal troubleshooting, password resets, biometric capture, course registration errors",
    hours: "Monday - Friday: 8:30 AM - 3:30 PM"
  },
  {
    name: "Medical Centre / Poly Clinic",
    location: "Middle Campus (Accessible from North & South gates)",
    role: "24/7 Outpatient consultations, emergency care, medical clearance & TISHIP registration",
    hours: "Open 24 Hours Daily"
  },
  {
    name: "Academic Affairs Directorate (Records & Transcripts)",
    location: "Administrative Building, Middle Campus",
    role: "Statement of results, academic transcripts, certificate collection, HND clearance",
    hours: "Monday - Friday: 9:00 AM - 3:00 PM"
  },
  {
    name: "Industrial Training & SIWES Unit",
    location: "North Campus, Engineering Block Complex",
    role: "IT logbook issuance, ITF letters of introduction, SIWES defense coordination",
    hours: "Monday - Friday: 8:30 AM - 3:30 PM"
  },
  {
    name: "Central Library",
    location: "Middle Campus (Branches at North & South Campus)",
    role: "Reference texts, digital e-library, quiet study halls, journal archives",
    hours: "Monday - Friday: 8:00 AM - 6:00 PM; Saturday: 9:00 AM - 1:00 PM"
  }
];

export const BOOK_LOCATIONS: BookLocation[] = [
  {
    name: "The Polytechnic, Ibadan Official Bookshop",
    category: "Official Bookshop",
    campus: "Middle Campus",
    location: "Central Administration Area, Adjacent to Central Library & Bursary",
    itemsAvailable: [
      "Official GNS Textbooks (GNS 101 Use of English, GNS 102 Citizenship, GNS 201 Entrepreneurship)",
      "Statutory Matriculation Gowns & Hoods",
      "Official Examination Answer Booklets & Logbooks",
      "Polytechnic Notebooks, Pens & Institutional Souvenirs"
    ],
    tips: "Arrive with your validated Remita payment receipt for statutory textbooks and matriculation materials."
  },
  {
    name: "Departmental Associations Secretariats (Course Reps & HOD Desks)",
    category: "Departmental Secretariat",
    campus: "North Campus",
    location: "Inside Respective Faculty Buildings (NACOS at Science, NESA at Engineering, FES at Environmental)",
    itemsAvailable: [
      "Departmental Practical Manuals & Laboratory Workbooks",
      "Lecturer-Approved Course Compendiums & Handouts",
      "Departmental Handbooks, By-laws & Student Constitutions",
      "Past Examination Question Compilations (PQs)"
    ],
    tips: "Contact your class course representative or departmental secretary during working hours (9 AM - 3 PM)."
  },
  {
    name: "FBCS & FFMS Association Bookstands",
    category: "Departmental Secretariat",
    campus: "South Campus",
    location: "South Campus Ground Floor (NAMCOS Mass Comm, NABAMS Business Admin, Accountancy Secretariats)",
    itemsAvailable: [
      "Mass Communication Studio Guides & Media Manuals",
      "Financial Accounting & Taxation Practice Workbooks",
      "Business Management Case Study Handouts",
      "Departmental Seminar & Project Formatting Guides"
    ],
    tips: "Dues receipts are checked when collecting departmental customized course manuals."
  },
  {
    name: "North Campus Commercial Hub & Printing Arcade",
    category: "Campus Commercial Center",
    campus: "North Campus",
    location: "Behind Faculty of Science, Near Mechanical Engineering Workshops & North Gate",
    itemsAvailable: [
      "Past Questions (PQs) for all ND & HND Engineering & Science Courses",
      "Technical Drawing Sheets (A3/A2), Grid Pads, Graph Sheets",
      "Spiral Binding, Hardcover Project Binding & Digital Color Printing",
      "Slide Prints, Lecture Note Duplications & Stationeries"
    ],
    tips: "Ideal for urgent printing, past question packs, and technical drawing paper."
  },
  {
    name: "South Campus Commercial Shopping Alley",
    category: "Campus Commercial Center",
    campus: "South Campus",
    location: "Directly Between FBCS and FFMS Faculty Blocks",
    itemsAvailable: [
      "Management & Communication Past Examination Questions",
      "Project Typing, Proofreading, Lamination & Binding Services",
      "Staplers, Files, Envelopes & Presentation Folders",
      "Calculator Batteries, USB Flash Drives & Stationery Supplies"
    ],
    tips: "Closest spot for business and finance students between lectures."
  },
  {
    name: "Middle Campus Post Office & Unity Hall Alley",
    category: "Campus Commercial Center",
    campus: "Middle Campus",
    location: "Beside Directorate of Student Affairs (DSA), near Unity Hall",
    itemsAvailable: [
      "Official Stamp Duties, Red Markers & Clearance Envelopes",
      "Express Passport Photographs for Portal Clearance & ID Cards",
      "Photocopying and Portal Slip Printing",
      "Scratch Cards, Biometric Registration Printouts"
    ],
    tips: "Essential stop during fresh student verification and exam docket stamping."
  },
  {
    name: "Sango Main Gate Academic Bookstores Axis",
    category: "Off-Campus Bookstore",
    campus: "Off-Campus (Gates)",
    location: "Along Sango-Eleyele Highway directly opposite Poly Ibadan Main Gate",
    itemsAvailable: [
      "Standard Polytechnic & University Recommended Textbooks",
      "Engineering Drawing Instruments (T-Squares, Drawing Boards, Set Squares, Compasses)",
      "Approved Casio Scientific Calculators (fx-991ES Plus / fx-991EX)",
      "White Laboratory Coats & Dissection Kits for Science Students"
    ],
    tips: "Offers wide selection of published textbooks and engineering drafting sets."
  },
  {
    name: "Apete Gate Market & Educational Vendors",
    category: "Off-Campus Bookstore",
    campus: "Off-Campus (Gates)",
    location: "Directly outside South Campus Exit (Apete Gate)",
    itemsAvailable: [
      "Past Questions Packs, Exercise Books & General Stationery",
      "Second-hand Reference Textbooks",
      "Project Material Duplication Services"
    ],
    tips: "Convenient for students residing in Apete, Awotan, and Ajibode axes."
  }
];

export const CAMPUS_FACILITIES = [
  {
    category: "Dining & Cafeterias",
    facilities: [
      { name: "Student Union Building (SUB) Cafeteria", location: "Middle Campus, SUB Complex", notes: "Subsidized hot student meals, snacks, pastries, cold drinks" },
      { name: "North Campus Bukateria Complex", location: "North Campus, behind Faculty of Science", notes: "Local delicacies, Amala, Rice, Beans, Plantain" },
      { name: "FFMS & FBCS Food Village", location: "South Campus", notes: "Breakfast dishes, pastries, drinks, quick eats between lectures" },
      { name: "Unity Hall Food Village", location: "North Campus, Unity Hall perimeter", notes: "Open into the evening for residential & night-reading students" }
    ]
  },
  {
    category: "Banking & Financial Services",
    facilities: [
      { name: "Wema Bank (Poly Ibadan Branch)", location: "Middle Campus, adjacent Administrative Block", notes: "Full commercial banking, Remita tuition payments, ATM gallery" },
      { name: "The Polytechnic, Ibadan Microfinance Bank", location: "Middle Campus", notes: "Institutional dues, staff/student account services" },
      { name: "24/7 ATM Galleries", location: "Wema Bank compound & Sango Gate", notes: "Cash withdrawals for all bank ATM cards" }
    ]
  },
  {
    category: "Lecture Halls & Exam Venues",
    facilities: [
      { name: "1000-Seater Lecture Theatre", location: "Middle Campus", notes: "Large combined lectures, GNS exams, major matriculation sittings" },
      { name: "Assembly Hall", location: "North Campus", notes: "Official ceremonies, large examinations, convocation proceedings" },
      { name: "Faculty of Science Lecture Theatres (LT 1, 2, 3)", location: "North Campus Science Complex", notes: "Science lectures, practical orientations" },
      { name: "FBCS / FFMS Large Auditoriums", location: "South Campus", notes: "Business, Communication and Accountancy departmental classes" }
    ]
  },
  {
    category: "Health, Safety & Worship",
    facilities: [
      { name: "Poly Clinic / Medical Centre", location: "Middle Campus", notes: "24/7 Outpatient consultations, emergencies, TISHIP registrations" },
      { name: "Main Campus Security Base", location: "Middle Campus near Central Admin", notes: "Emergency response, lost-and-found, student safety" },
      { name: "Poly Central Mosque", location: "Middle Campus / Unity Hall axis", notes: "Daily prayers and Friday Jummah service" },
      { name: "Chapel of Peace & Joy / CAC Student Fellowship", location: "Middle/North Campus", notes: "Christian fellowships and Sunday services" }
    ]
  }
];

export const SUGGESTED_QUESTIONS = [
  "Where can I buy textbooks, GNS manuals, and course handouts?",
  "Where do I buy engineering drawing tools and white lab coats?",
  "How do I register courses on the student portal?",
  "Where is the Faculty of Science located?",
  "What is the required CGPA for HND admission?",
  "Where can I buy good food or eat on campus?",
  "Where are the banks and ATMs on campus?",
  "How is CGPA calculated using the NBTE 4.0 scale?",
  "How long is SIWES and when is 1-year IT done?",
  "What documents do I need to enter the exam hall?",
  "Can I pay my school fees in installments?",
  "How do I apply for hostel accommodation?"
];

