import sendgrid from "@sendgrid/mail";
require('dotenv').config();

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export function sendMail(email: string, template: string, dynamic: object) {
  const message = {
    to: email,
    from: "SailsHost <no-reply@sails.host>",
    templateId: template,
    dynamic_template_data: dynamic
  }

  sendgrid.send(message).then(() => console.log("<--> Backend: Email sent successfully."))
  .catch(console.error);
}
