import { supabaseAdmin } from '../services/supabase.js';

export async function onboard(req, res) {
  try {
    const { whatsapp_number, gemini_api_key, plan } = req.body;

    if (!whatsapp_number || !gemini_api_key || !plan) {
      return res.status(400).json({ 
        error: 'Missing required fields: whatsapp_number, gemini_api_key, plan' 
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
          plan,
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
          plan,
          bot_status: 'not_created'
        })
        .select()
        .single();

      if (error) throw error;
      user = data;
    }

    res.status(200).json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.error('Onboard error:', error);
    res.status(500).json({ error: error.message });
  }
}
