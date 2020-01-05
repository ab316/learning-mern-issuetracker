db.issues.remove({});

const issueDb = [
    { id: 1, status: 'New', owner: 'Abdullah', effort: 5, created: new Date('2020-01-04'), due: undefined, title: 'Error in console when clicking Add' },
    { id: 2, status: 'Assigned', owner: 'Asad', effort: 14, created: new Date('2019-11-12'), due: new Date('2020-01-01'), title: 'Missing bottom border on panel' }
];

db.issues.insertMany(issueDb);
const count = db.issues.count();
print('Inserted', count, 'issues');

db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ status: 1 });
db.issues.createIndex({ owner: 1 });
db.issues.createIndex({ created: 1 });

db.counters.remove({ _id: 'issues' });
db.counters.insert({ _id: 'issues', current: count });
