import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { prestation, velo, description, nom, telephone, adresse } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'Atelier Bizikleta <onboarding@resend.dev>', // Par la suite, tu pourras mettre ton propre domaine si tu en as un
      to: ['bizikleta.reparation@gmail.com'],
      subject: `🚲 Nouvelle réservation de ${nom} - ${prestation}`,
      html: `
        <h2>Nouvelle demande de réservation</h2>
        <p><strong>Prestation :</strong> ${prestation}</p>
        <p><strong>Vélo :</strong> ${velo}</p>
        <p><strong>Description du problème :</strong> ${description || 'Aucune description'}</p>
        <hr />
        <h3>Coordonnées du client :</h3>
        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Téléphone :</strong> ${telephone}</p>
        <p><strong>Adresse :</strong> ${adresse}</p>
      `,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
