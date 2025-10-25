const Boss = require('../models/Boss');
const DealDamage = require('../models/DealDamage');

const getBossStatus = async (req, res) => {
  try {
    const boss = await Boss.findOne();
    if (!boss) return res.status(404).json({ error: 'Boss not found' });

    const damageEntries = await DealDamage.find();
    const totalDamage = damageEntries.reduce((sum, entry) => sum + entry.damage, 0);

    res.json({ boss, damage: totalDamage });
  } catch (err) {
    console.error('Error fetching boss status:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const dealDamage = async (req, res) => {
  try {
    const { damage } = req.body;
    if (!damage || typeof damage !== 'number' || damage <= 0) {
      return res.status(400).json({ error: 'Invalid damage value' });
    }

    const boss = await Boss.findOne();
    if (!boss) return res.status(404).json({ error: 'Boss not found' });

    boss.damage += damage;
    await boss.save();

    const entry = new DealDamage({ user: req.user._id, damage });
    await entry.save();

    res.json({ message: 'Damage dealt', boss });
  } catch (err) {
    console.error('Error dealing damage:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getBossStatus, dealDamage };