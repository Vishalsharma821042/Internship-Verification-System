const PDFDocument = require('pdfkit');
const Intern = require('../models/Intern');

const generatePDF = async (req, res) => {
  try {
    const { code } = req.params;
    const intern = await Intern.findOne({ verificationCode: code });

    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate_${code}.pdf`);

    doc.pipe(res);

    // Design Certificate
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
    doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke();

    doc.fontSize(40).font('Helvetica-Bold').text('Internship Certificate', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(20).font('Helvetica').text('This is to certify that', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(30).font('Helvetica-Bold').text(intern.name, { align: 'center', underline: true });
    doc.moveDown();
    
    doc.fontSize(20).font('Helvetica').text(`has successfully completed their internship as a`, { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(25).font('Helvetica-Bold').text(intern.designation, { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(18).font('Helvetica').text(`Duration: ${intern.duration}`, { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(14).font('Helvetica').text(`Verification Code: ${intern.verificationCode}`, { align: 'left' });
    doc.fontSize(14).text(`Date: ${new Date(intern.createdAt).toLocaleDateString()}`, { align: 'left' });

    doc.end();

  } catch (error) {
    console.error('PDF Error:', error);
    res.status(500).json({ success: false, message: 'Server error generating PDF' });
  }
};

module.exports = { generatePDF };
