const express = require('express');
const app = express();

app.use(express.json());

const issues = [
    {
      id: 1, 
      status: 'Open', 
      owner: 'Ravan',
      created: new Date('2016-08-15'), 
      effort: 5, 
      completionDate: undefined,
      title: 'Error in console when clicking Add',
    },
    {
      id: 2, 
      status: 'Assigned', 
      owner: 'Eddie',
      created: new Date('2016-08-16'), 
      effort: 14, 
      completionDate: new Date('2016-08-30'),
      title: 'Missing bottom border on panel',
    },
];

app.get('/api/issues', (req, res) => {
    console.log('New request');
    const metaData = {totalCount: issues.length};
    res.json({
        "metaData": metaData,
        "records": issues
    });
});

app.listen(5002, () => {
    console.log('Server started on port 5002');
});