const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { prestation, velo, description, nom, telephone, adresse, photo } = req.body;

    // Préparation des pièces jointes si une photo est présente
    const attachments = [];
    if (photo && photo.content) {
      attachments.push({
        filename: photo.filename || 'photo-velo.jpg',
        content: photo.content
      });
    }

    const data = await resend.emails.send({
      from: 'Bizikleta <onboarding@resend.dev>',
      to: ['bizikleta.reparation@gmail.com'],
      subject: `🚲 Nouvelle réservation de ${nom} (${prestation})`,
      html: `
        <h2>Nouvelle demande de rendez-vous - Bizikleta</h2>
        <p><strong>Client :</strong> ${nom}</p>
        <p><strong>Téléphone :</strong> ${telephone}</p>
        <p><strong>Adresse :</strong> ${adresse}</p>
        <p><strong>Prestation :</strong> ${prestation}</p>
        <p><strong>Type de vélo :</strong> ${velo}</p>
        <p><strong>Description :</strong> ${description || 'Aucune'}</p>
        <p><em>${photo ? '📸 Une photo a été jointe à cet e-mail.' : 'Pas de photo fournie.'}</em></p>
      `,
      attachments: attachments
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erreur Resend:', error);
    return res.status(500).json({ error: error.message });
  }
};
