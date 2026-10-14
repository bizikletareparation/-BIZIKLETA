import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { prestation, velo, description, nom, telephone, adresse } = req.body;

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
        <p><strong>Description de la panne :</strong> ${description || 'Aucune description'}</p>
      `,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
