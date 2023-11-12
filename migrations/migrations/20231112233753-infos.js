module.exports = {
  async up(db, client) {
    // Update the schema of the 'info' collection
    await db.collection('info').updateMany({}, { $unset: { group_id: 1 } });
    await db.collection('info').updateMany({}, { $set: { group_id: null } });
    await db.collection('info').updateMany({}, { $set: { group_id: { type: Number, required: true, ref: 'Group' } } });
  },

  async down(db, client) {
    // Rollback the changes made in the 'up' method
    await db.collection('info').updateMany({}, { $unset: { group_id: 1 } });
    await db.collection('info').updateMany({}, { $set: { group_id: null } });
    await db.collection('info').updateMany({}, { $set: { group_id: { type: Number, ref: 'Group' } } });
  },
};