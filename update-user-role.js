use('campusconnect');

db.users.updateOne(
  { email: 'thecolumbus526@gmail.com' },
  { $set: { role: 'prospective' } }
);

const user = db.users.findOne({ email: 'thecolumbus526@gmail.com' });
printjson(user);
