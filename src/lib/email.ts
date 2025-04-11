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
    
    // Lire le contenu du fichier
    let htmlContent = fs.readFileSync(templatePath, 'utf8');
    
    // Remplacer les variables dans le template
    Object.entries(variables).forEach(([key, value]) => {
      htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return htmlContent;
  } catch (error) {
    console.error('Error loading HTML template:', error);
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Un projet a été partagé avec vous!</h2>
        <p>${variables.fromUserName} vous a invité à collaborer sur le projet "${variables.projectName}".</p>
        <p><a href="${variables.projectUrl}">Accéder au projet</a></p>
      </div>
    `;
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
  const html = loadHtmlTemplate('project-shared', {
    fromUserName,
    projectName,
    projectUrl
  });

  try {
    const mailOptions = {
      from: `"Tanso" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER || 'tanso.noreply@gmail.com'}>`,
      to: toEmail,
      subject: `${fromUserName} vous a invité sur un projet Tanso : ${projectName}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
