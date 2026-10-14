export type StudentLevel = 'ND I' | 'ND II' | 'HND I' | 'HND II';
export type StudentProgram = 'Full-Time' | 'Daily Part-Time (DPP)' | 'Part-Time (CEC)';

export interface StudentProfile {
  name: string;
  matricNo: string;
  faculty: string;
  department: string;
  level: StudentLevel;
  program: StudentProgram;
}

export type FAQCategory = 
  | 'Admissions & Clearance'
  | 'Portal & Registration'
  | 'Exams & Grading'
  | 'SIWES & 1-Year IT'
  | 'Fees & Payments'
  | 'Campus Life & Hostels'
  | 'Books & Academic Materials'
  | 'Campus Locations & Facilities';

export interface BookLocation {
  name: string;
  category: 'Official Bookshop' | 'Departmental Secretariat' | 'Campus Commercial Center' | 'Off-Campus Bookstore';
  campus: 'North Campus' | 'South Campus' | 'Middle Campus' | 'Off-Campus (Gates)';
  location: string;
  itemsAvailable: string[];
  tips: string;
}


export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  policyReference?: string;
  tags: string[];
  departmentRelevance?: string[];
  frequentlyAsked?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  category?: FAQCategory;
  citations?: string[];
  suggestedFollowUps?: string[];
  requiresAdvisingEscalation?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  dateStr: string;
  dateTimestamp: number;
  category: 'Registration' | 'Exams' | 'Lectures' | 'Ceremony' | 'Break';
  semester: 'Harmattan (1st)' | 'Rain (2nd)';
  status: 'upcoming' | 'ongoing' | 'completed';
  notes?: string;
}

export interface CourseEntry {
  id: string;
  code: string;
  title: string;
  units: number;
  grade: 'A' | 'AB' | 'B' | 'BC' | 'C' | 'CD' | 'D' | 'E' | 'F';
}

export interface EscalationTicket {
  ticketId: string;
  studentName: string;
  matricOrAppNo: string;
  faculty: string;
  department: string;
  level: StudentLevel;
  category: string;
  subject: string;
  description: string;
  createdAt: string;
  status: 'Pending Review' | 'Assigned to Advisor';
  assignedOffice: string;
}
