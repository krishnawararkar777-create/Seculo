import { supabaseAdmin } from '../services/supabase.js';

export async function onboard(req, res) {
  try {
    const { whatsapp_number, gemini_api_key, plan, user_id, email } = req.body;

    if (!whatsapp_number || !gemini_api_key) {
      return res.status(400).json({
        error: 'Missing required fields: whatsapp_number, gemini_api_key'
      });
    }

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('whatsapp_number', whatsapp_number)
      .single();

    let user;
    if (existingUser) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          gemini_api_key,
          plan: plan || 'trial',
          updated_at: new Date().toISOString()
        })
        .eq('whatsapp_number', whatsapp_number)
        .select()
        .single();
      if (error) throw error;
      user = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert({
          whatsapp_number,
          gemini_api_key,
          plan: plan || 'trial',
          bot_status: 'not_created'
        })
        .select()
        .single();
      if (error) throw error;
      user = data;
    }

    if (user_id) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: user_id,
          email: email || '',
          ai_api_key: gemini_api_key,
          ai_provider: 'gemini',
          subscription_status: 'trial',
          subscription_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Profile upsert error:', profileError);
      }
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Onboard error:', error);
    res.status(500).json({ error: error.message });
  }
}
