module.exports = {
  tables: [
    {
      TableName: `Users-test`,
      KeySchema: [{AttributeName: 'userId', KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: 'userId', AttributeType: 'S'}],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
    },
    {
      TableName: `Groups-test`,
      KeySchema: [{AttributeName: 'groupId', KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: 'groupId', AttributeType: 'S'}],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
    }
  ],
};