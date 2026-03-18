import { supabaseAdmin } from '../services/supabase.js';
import { createBotFolder, installBotDependencies, startBot, stopBot, deleteBotFolder } from '../services/botManager.js';

export async function createBot(req, res) {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id' });
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.gemini_api_key) {
      return res.status(400).json({ error: 'User has no Gemini API key' });
    }

    await createBotFolder(user_id, user.gemini_api_key);
    await installBotDependencies(user_id);
    await startBot(user_id);

    await supabaseAdmin
      .from('users')
      .update({ 
        bot_status: 'running',
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    res.status(200).json({ 
      success: true, 
      message: 'Bot created and started successfully' 
    });
  } catch (error) {
    console.error('Create bot error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function stopBotRoute(req, res) {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id' });
    }

    await stopBot(user_id);

    await supabaseAdmin
      .from('users')
      .update({ 
        bot_status: 'stopped',
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    res.status(200).json({ 
      success: true, 
      message: 'Bot stopped successfully' 
    });
  } catch (error) {
    console.error('Stop bot error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function startBotRoute(req, res) {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id' });
    }

    await startBot(user_id);

    await supabaseAdmin
      .from('users')
      .update({ 
        bot_status: 'running',
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    res.status(200).json({ 
      success: true, 
      message: 'Bot started successfully' 
    });
  } catch (error) {
    console.error('Start bot error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function deleteBotRoute(req, res) {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id' });
    }

    await deleteBotFolder(user_id);

    await supabaseAdmin
      .from('users')
      .update({ 
        bot_status: 'not_created',
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    res.status(200).json({ 
      success: true, 
      message: 'Bot deleted successfully' 
    });
  } catch (error) {
    console.error('Delete bot error:', error);
    res.status(500).json({ error: error.message });
  }
}
