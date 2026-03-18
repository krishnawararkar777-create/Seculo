import { supabaseAdmin } from '../services/supabase.js';
import { getBotStatus } from '../services/botManager.js';

export async function getDashboard(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id parameter' });
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('bot_status, plan, whatsapp_number, created_at, updated_at')
      .eq('id', user_id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentBotStatus = await getBotStatus(user_id);

    res.status(200).json({
      bot_status: currentBotStatus,
      plan: user.plan,
      whatsapp_number: user.whatsapp_number,
      created_at: user.created_at,
      updated_at: user.updated_at
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
}
