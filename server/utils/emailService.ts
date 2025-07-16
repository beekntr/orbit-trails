import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // Production configuration (using actual SMTP)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development configuration (using Gmail or test account)
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS // Use App Password for Gmail
        }
      });
    } else {
      // Use Ethereal for testing if no Gmail credentials
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal.pass'
        }
      });
    }
  }
};

export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@orbittrails.com',
      to,
      subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    // In development, log the preview URL for Ethereal
    if (process.env.NODE_ENV !== 'production' && !process.env.GMAIL_USER) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (to: string, name: string): Promise<void> => {
  const subject = 'Welcome to Orbit Trails!';
  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h1 style="color: #2c5530;">Welcome to Orbit Trails, ${name}!</h1>
      <p>Thank you for your interest in exploring India with us.</p>
      <p>We've received your inquiry and our travel experts will get back to you within 24 hours with a personalized itinerary.</p>
      <p>In the meantime, feel free to explore our website for more tour options and travel inspiration.</p>
      <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <h3>What's Next?</h3>
        <ul>
          <li>Our team will review your requirements</li>
          <li>We'll create a customized itinerary just for you</li>
          <li>You'll receive a detailed quote within 24 hours</li>
          <li>We'll be available to make any adjustments</li>
        </ul>
      </div>
      <p style="margin-top: 30px;">
        Best regards,<br>
        The Orbit Trails Team<br>
        <a href="mailto:info@orbittrails.com">info@orbittrails.com</a><br>
        +91 86199 74762
      </p>
    </div>
  `;
  
  await sendEmail(to, subject, htmlContent);
};

export const sendContactConfirmation = async (to: string, name: string): Promise<void> => {
  const subject = 'Message Received - Orbit Trails';
  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h1 style="color: #2c5530;">Thank You, ${name}!</h1>
      <p>We've received your message and appreciate you reaching out to Orbit Trails.</p>
      <p>Our team will review your inquiry and respond within 24 hours during business hours.</p>
      <p>If you have any urgent questions, please don't hesitate to call us at +91 86199 74762.</p>
      <p style="margin-top: 30px;">
        Best regards,<br>
        The Orbit Trails Team<br>
        <a href="mailto:info@orbittrails.com">info@orbittrails.com</a>
      </p>
    </div>
  `;
  
  await sendEmail(to, subject, htmlContent);
};
