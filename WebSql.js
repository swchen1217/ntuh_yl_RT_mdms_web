class WebSql {
    DATABASE_NAME = "ntuh.yl_mdms.db";
    DATABASE_VERSION = 5;

    /*static device_tb =
        "CREATE TABLE IF NOT EXISTS device_tb (" +
        "  `DID` TEXT," +
        "  `category` TEXT," +
        "  `model` TEXT," +
        "  `number` TEXT," +
        "  `user` TEXT," +
        "  `position` TEXT," +
        "  `status` TEXT," +
        "  `LastModified` TEXT" +
        ")";

    static position_item_tb =
        "CREATE TABLE IF NOT EXISTS position_item_tb (" +
        "  `type` TEXT," +
        "  `item` TEXT" +
        ")";*/

    db = openDatabase(this.DATABASE_NAME, this.DATABASE_VERSION, 'MDMS DB', 2 * 1024 * 1024);

    constructor(){
		var device_tb =
        "CREATE TABLE IF NOT EXISTS device_tb (" +
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
        "CREATE TABLE IF NOT EXISTS position_item_tb (" +
        "  `type` TEXT," +
        "  `item` TEXT" +
        ")";
        this.db.transaction(function (tx) {
            tx.executeSql(device_tb);
            tx.executeSql(position_item_tb);
        });
    }

    inster(tb_name,data_array){
        var sql="";
        sql+="INSERT INTO `";
        sql+=tb_name+"` (";
        for(var i=0;i<data_array.length;i++){
            sql+="`"+data_array[i][0]+"`";
            if(i!=data_array.length-1)
                sql+=",";
        }
        sql+=") VALUES (";
        for(var i=0;i<data_array.length;i++){
            sql+="'";
            sql+=data_array[i][1];
            sql+="'";
            if(i!=data_array.length-1)
                sql+=",";
        }
        sql+=")";

        //sql="INSERT INTO `device_tb` (`status`,`DID`) VALUES ('test','MDMS.D0001')";

        console.log(sql);

        this.db.transaction(function (tx) {
            tx.executeSql(sql);
        });
    }

}