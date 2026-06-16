import express from 'express'
import cors from 'cors'
import supabase from './database/supabase.js'

const app = express()
app.use(cors())
app.use(express.json())

// Secret key untuk autentikasi request dari dashboard
// GANTI dengan string random yang panjang dan simpan di .env
const SECRET_KEY = process.env.API_SECRET || 'umb-esport-secret-key'

// Middleware autentikasi
function authMiddleware(req, res, next) {
  const key = req.headers['x-api-key']
  if (key !== SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// ============================================================
// ENDPOINT: Health check
// ============================================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'UMB Esport Bot API is running!' })
})

// ============================================================
// ENDPOINT: Get all channels
// Dipanggil dashboard untuk dropdown pilih channel
// ============================================================
app.get('/channels', authMiddleware, async (req, res) => {
  try {
    const guild = req.app.get('guild')
    const channels = guild.channels.cache
      .filter(c => c.type === 0) // type 0 = text channel
      .map(c => ({ id: c.id, name: c.name }))
    res.json(channels)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// ENDPOINT: Get all members
// Dipanggil dashboard untuk dropdown pilih member
// ============================================================
app.get('/members', authMiddleware, async (req, res) => {
  try {
    const { data } = await supabase
      .from('levels')
      .select('user_id, username, level, coins, bank')
      .order('level', { ascending: false })
    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// ENDPOINT: Send announcement
// ============================================================
app.post('/announce', authMiddleware, async (req, res) => {
  try {
    const { channelId, message, mention } = req.body
    const guild = req.app.get('guild')
    const channel = guild.channels.cache.get(channelId)

    if (!channel) return res.status(404).json({ error: 'Channel tidak ditemukan!' })

    let mentionText = ''
    if (mention === 'everyone') mentionText = '@everyone\n'
    if (mention === 'here') mentionText = '@here\n'

    await channel.send(`${mentionText}📢 **PENGUMUMAN**\n\n${message}\n\n— *Admin UMB Esport*`)

    res.json({ success: true, message: 'Announcement berhasil dikirim!' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// ENDPOINT: Give loot box ke member
// ============================================================
app.post('/givebox', authMiddleware, async (req, res) => {
  try {
    const { userId, boxType } = req.body

    await supabase
      .from('lootboxes')
      .insert({ user_id: userId, box_type: boxType })

    // Kirim DM ke user
    const guild = req.app.get('guild')
    const member = await guild.members.fetch(userId)
    await member.send(`🎁 Kamu mendapat **${boxType} box** dari Admin UMB Esport! Buka dengan \`/lootbox open ${boxType}\``)

    res.json({ success: true, message: `${boxType} box berhasil dikirim!` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// ENDPOINT: Reset member
// ============================================================
app.post('/resetuser', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body

    // Reset data levels
    await supabase
      .from('levels')
      .update({
        xp: 0,
        level: 0,
        total_messages: 0,
        coins: 0,
        bank: 0,
        last_daily: null,
      })
      .eq('user_id', userId)

    // Hapus badges
    await supabase.from('badges').delete().eq('user_id', userId)

    // Hapus lootboxes
    await supabase.from('lootboxes').delete().eq('user_id', userId)

    // Hapus fish inventory
    await supabase.from('fish_inventory').delete().eq('user_id', userId)

    // Hapus shop inventory
    await supabase.from('shop_inventory').delete().eq('user_id', userId)

    // Hapus game stats
    await supabase.from('game_stats').delete().eq('user_id', userId)

    res.json({ success: true, message: 'Member berhasil direset!' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// Start server
// ============================================================
export function startServer(client, port = 3000) {
  // Pass guild ke app supaya bisa diakses di endpoint
  client.once('clientReady', () => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID)
    app.set('guild', guild)
  })

  app.listen(port, () => {
    console.log(`✅ API Server jalan di port ${port}`)
  })
}