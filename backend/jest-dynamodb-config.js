module.exports = {
  tables: [
    {
      TableName: `Users-test`,
      KeySchema: [{AttributeName: 'userId', KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: 'userId', AttributeType: 'S'}],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
    },
    // etc
  ],
};