import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import {
  INSTITUTION_INFO,
  FACULTIES,
  VERIFIED_FAQS,
  ACADEMIC_CALENDAR_EVENTS,
  CAMPUS_OFFICES,
  NBTE_GRADING_SCALE
} from './src/data/polyIbadanData';
import { handlePolyAdvisorQuery } from './src/services/polyAdvisor';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory ticket storage for student escalations
const escalationTickets: any[] = [];

// API: Poly Ibadan Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, studentProfile, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const result = await handlePolyAdvisorQuery({ message, studentProfile, history });
    return res.json(result);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// API: Get verified FAQs
app.get('/api/faqs', (req, res) => {
  res.json({
    institution: INSTITUTION_INFO,
    faculties: FACULTIES,
    faqs: VERIFIED_FAQS,
  });
});

// API: Get Academic Calendar
app.get('/api/calendar', (req, res) => {
  res.json({
    session: '2025/2026 Academic Session',
    institution: INSTITUTION_INFO.name,
    events: ACADEMIC_CALENDAR_EVENTS,
  });
});

// API: Get Campus Offices & Directory
app.get('/api/directory', (req, res) => {
  res.json({
    institution: INSTITUTION_INFO,
    campuses: INSTITUTION_INFO.campuses,
    offices: CAMPUS_OFFICES,
    gradingScale: NBTE_GRADING_SCALE,
  });
});

// API: Create Advisor Escalation Ticket
app.post('/api/escalate', (req, res) => {
  try {
    const {
      studentName,
      matricOrAppNo,
      faculty,
      department,
      level,
      category,
      subject,
      description,
    } = req.body;

    if (!studentName || !subject || !description) {
      return res.status(400).json({ error: 'Student name, subject, and description are required.' });
    }

    const ticketId = `TPI-ADV-${Math.floor(10000 + Math.random() * 90000)}`;

    let assignedOffice = 'Directorate of Student Affairs (DSA)';
    if (category === 'Result / Grade Issue' || category === 'Carryover / Transcript') {
      assignedOffice = 'Departmental Examination Officer & Sub-Dean';
    } else if (category === 'Portal / Registration Bug') {
      assignedOffice = 'MIS / ICT Directorate (North Campus)';
    } else if (category === 'Fees / Payment Verification') {
      assignedOffice = 'Bursary Department (Student Accounts)';
    }

    const newTicket = {
      ticketId,
      studentName,
      matricOrAppNo: matricOrAppNo || 'Pending Clearance',
      faculty: faculty || 'General',
      department: department || 'General',
      level: level || 'ND I',
      category: category || 'Academic Advising',
      subject,
      description,
      createdAt: new Date().toISOString(),
      status: 'Pending Review',
      assignedOffice,
    };

    escalationTickets.unshift(newTicket);

    res.json({
      success: true,
      ticket: newTicket,
      message: `Your advising ticket ${ticketId} has been submitted to the ${assignedOffice}. An academic advisor will review your request.`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to submit escalation ticket.' });
  }
});

// Serve frontend with Vite in dev, or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Polytechnic, Ibadan Academic Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

// Export app for serverless platforms like Vercel
export default app;

if (!process.env.VERCEL) {
  startServer().catch(err => {
    console.error('Failed to start server:', err);
  });
}
