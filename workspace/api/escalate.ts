export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    let body = req.body;
    if (!body || typeof body !== 'object') {
      body = await new Promise((resolve) => {
        let data = '';
        req.on('data', (chunk: any) => { data += chunk; });
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({});
          }
        });
        setTimeout(() => resolve({}), 2000);
      });
    }

    const {
      studentName,
      matricOrAppNo,
      faculty,
      department,
      level,
      category,
      subject,
      description,
    } = body;

    if (!studentName || !subject || !description) {
      res.status(400).json({ error: 'Student name, subject, and description are required.' });
      return;
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

    res.status(200).json({
      success: true,
      ticket: newTicket,
      message: `Your advising ticket ${ticketId} has been submitted to the ${assignedOffice}. An academic advisor will review your request.`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to submit escalation ticket.' });
  }
}
