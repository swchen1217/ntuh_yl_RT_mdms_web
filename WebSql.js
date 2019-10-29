var device_tb =
    "CREATE TABLE device_tb (" +
    "  `DID` TEXT," +
    "  `category` TEXT," +
    "  `model` TEXT," +
    "  `number` TEXT," +
    "  `user` TEXT," +
    "  `position` TEXT," +
    "  `status` TEXT," +
    "  `LastModified` TEXT" +
    ")";

var position_item_tb =
    "CREATE TABLE position_item_tb (" +
    "  `type` TEXT," +
    "  `item` TEXT" +
    ")";

db = openDatabase('mdms', '1.0', 'MDMS DB', 2 * 1024 * 1024);