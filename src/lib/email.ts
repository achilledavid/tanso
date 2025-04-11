import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER || 'tanso.noreply@gmail.com',
    pass: process.env.EMAIL_SERVER_PASSWORD || '',
  },
  tls: {
    rejectUnauthorized: true,
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
});

/**
 * Charge et remplace les variables dans le template HTML
 */
function loadHtmlTemplate(
  templateName: string,
  variables: Record<string, string>
): string {
  try {
    // Chemin du template HTML
    const templatePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.html`);
    
    let htmlContent = fs.readFileSync(templatePath, 'utf8');
    
    // Remplacer les variables dans le template
    Object.entries(variables).forEach(([key, value]) => {
      htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return htmlContent;
  } catch (error) {
    console.error('Error loading HTML template:', error);
    throw error;
  }
}

export async function sendProjectSharedEmail({
  toEmail,
  projectName,
  projectUrl,
  fromUserName,
}: {
  toEmail: string;
  projectName: string;
  projectUrl: string;
  fromUserName: string;
}) {
  try {
    const messageId = `<project-${Date.now()}-${Math.random().toString(36).substring(2, 15)}@tanso.deezer.com>`;
    
    const html = loadHtmlTemplate('project-shared', {
      fromUserName,
      projectName,
      projectUrl
    });

    const mailOptions = {
      from: `"Tanso" <${process.env.EMAIL_FROM }>`,
      to: toEmail,
      subject: `Invitation à collaborer sur "${projectName}" de ${fromUserName}`,
      html,
      headers: {
        'X-Priority': '3',
        'Message-ID': messageId,
        'X-Mailer': 'Tanso App Mailer',
        'List-Unsubscribe': `<mailto:unsubscribe@tanso.deezer.com?subject=unsubscribe:${toEmail}>`,
      },
      priority: "normal" as const,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
