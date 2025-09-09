const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (to, { nome, data, hora, exame, profissional, instituicao }) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; background-color:#f4f7fb; padding:20px;">
        
        <!-- Card principal -->
        <div style="background:#fff; border-radius:10px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.1); max-width:600px; margin:0 auto;">
          <h2 style="color:#1E90FF; text-align:center; margin-bottom:20px;">
            Agendamento de Exame Ocupacional
          </h2>
          <p style="font-size:16px; color:#333;">Olá <strong>${nome}</strong>,</p>
          <p style="font-size:15px; color:#555;">Você foi agendado para o seguinte exame:</p>

          <table style="width:100%; border-collapse:collapse; margin:15px 0;">
            <tr>
              <td style="padding:8px; font-weight:bold; color:#333;">Exame:</td>
              <td style="padding:8px; color:#555;">${exame}</td>
            </tr>
            <tr style="background-color:#f9f9f9;">
              <td style="padding:8px; font-weight:bold; color:#333;">Data:</td>
              <td style="padding:8px; color:#555;">${data}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold; color:#333;">Hora:</td>
              <td style="padding:8px; color:#555;">${hora}</td>
            </tr>
            <tr style="background-color:#f9f9f9;">
              <td style="padding:8px; font-weight:bold; color:#333;">Agendendado Por:</td>
              <td style="padding:8px; color:#555;">${profissional}</td>
            </tr>
          </table>

          <div style="text-align:center; margin:25px 0;">
            <a href="#" style="background-color:#1E90FF; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:15px;">
              Confirmar Presença
            </a>
          </div>

          <p style="font-size:14px; color:#555; line-height:1.6;">
            Este agendamento foi realizado pelo Posto Médico da <strong>ISPTEC</strong>.<br/>
            Por favor, compareça pontualmente e leve seus documentos necessários.
          </p>

          <p style="font-size:14px; margin-top:20px; color:#333;">
            Atenciosamente,<br/>
            Equipe de Saúde ocupacional do Posto Médico - <strong>ISPTEC</strong>
          </p>

          <!-- Assinatura digital -->
          <div style="margin-top:10px; text-align:left;">
            <img src="cid:assinaturaDigital" alt="Assinatura Digital" style="max-height:120px;" />
          </div>
        </div>

        <!-- Rodapé com logos -->
        <div style="text-align:center; margin-top:30px;">
          <img src="cid:logoApp" alt="Logo SAGSO" style="max-height:100px; margin-right:20px;" />
          <img src="cid:logoIsptec" alt="Logo ${instituicao}" style="max-height:100px;" />
        </div>

        <div style="text-align:center; margin-top:15px; font-size:12px; color:#999;">
          © ${new Date().getFullYear()} ${instituicao} - Sistema SAGSO<br/>
          Este é um e-mail automático. Não responda.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${instituicao} - SAGSO" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Agendamento de Exame Ocupacional',
      html,
      attachments: [
        {
          filename: 'logo.png',
          path: 'C:/Users/GPL/sagso/Front/public/imagens/logo.png',
          cid: 'logoApp'
        },
        {
          filename: 'logoIsptec.jpg',
          path: 'C:/Users/GPL/sagso/Front/public/imagens/logoIsptec.jpg',
          cid: 'logoIsptec'
        },
       
      ]
    });

    console.log(`📧 Email enviado para: ${to}`);
  } catch (err) {
    console.error('Erro ao enviar email:', err);
  }
};
