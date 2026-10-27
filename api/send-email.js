const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { 
      nom, 
      telephone, 
      email, 
      adresse, 
      postalCode, 
      typeVelo, 
      conciergerie, 
      prestation, 
      description, 
      photo 
    } = req.body;

    // Préparation de la pièce jointe avec conversion en Buffer
    const attachments = [];
    if (photo && photo.content) {
      attachments.push({
        filename: photo.filename || 'photo-velo.jpg',
        content: Buffer.from(photo.content, 'base64') // Conversion indispensable pour Resend
      });
    }

    const data = await resend.emails.send({
      from: 'Bizikleta <onboarding@resend.dev>',
      to: ['bizikleta.reparation@gmail.com'],
      replyTo: email,
      subject: `🚲 Nouvelle réservation : ${nom} (${prestation})`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
          <h2 style="color: #D32F2F; border-bottom: 2px solid #D32F2F; padding-bottom: 8px;">Nouvelle demande de rendez-vous</h2>
          
          <h3 style="color: #111; margin-top: 20px;">👤 Informations Client</h3>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Téléphone :</strong> ${telephone}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Adresse :</strong> ${adresse}, ${postalCode}</p>

          <h3 style="color: #111; margin-top: 20px;">🚲 Détails de l'intervention</h3>
          <p><strong>Prestation :</strong> ${prestation}</p>
          <p><strong>Type de vélo :</strong> ${typeVelo}</p>
          <p><strong>Option Conciergerie :</strong> ${conciergerie}</p>
          <p><strong>Description du problème :</strong><br>${description ? description.replace(/\n/g, '<br>') : 'Aucune description'}</p>

          <p style="margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
            ${photo ? '📸 Une photo a été jointe à cet e-mail.' : 'Aucune photo fournie.'}
          </p>
        </div>
      `,
      attachments: attachments
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erreur Resend:', error);
    return res.status(500).json({ error: error.message });
  }
};
