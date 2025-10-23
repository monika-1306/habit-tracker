const Boss = require('../models/Boss');
const DealDamage = require('../models/DealDamage');

const getBossStatus = async (req, res) => {
  const boss = await Boss.findOne();
  const damageEntries = await DealDamage.find();
  const totalDamage = damageEntries.reduce((sum, entry) => sum + entry.damage, 0);
  res.json({ boss, damage: totalDamage });
};

const dealDamage = async (req, res) => {
  const { damage } = req.body;
  const boss = await Boss.findOne();
  boss.damage += damage;
  await boss.save();

  const entry = new DealDamage({ user: req.user._id, damage });
  await entry.save();

  res.json({ message: 'Damage dealt', boss });
};

module.exports = { getBossStatus, dealDamage };