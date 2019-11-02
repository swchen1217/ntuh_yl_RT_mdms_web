function SyncDeviceTable(AlertDialog) {
    $("#dialog_ProgressBar_Sync").modal("show");
    var LastSync;
    if (localStorage.hasOwnProperty("device_tb_LastSync"))
        LastSync = localStorage.getItem("device_tb_LastSync");
    else
        LastSync = "2019-01-01 00:00:00";
    // TODO
    $.ajax({
        url: "../ntuh_yl_RT_mdms_api/db.php",
        data: "mode=sync_device_tb_download&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw") + "&LastModified=" + LastSync,
        type: "POST",
        success: function (msg) {
            console.log(msg);
            var sql = new WebSql();
            if (msg != "" && msg != "user_error") {
                if (msg != "no_data") {
                    var data = JSON.parse(msg);
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        sql.select("device_tb", "*", "where DID='" + data[i].DID + "'", function (result) {
                            console.log(result);
                            if (result.length == 0) {
                                console.log(data[i]);
                                if (data[i].status != "-1") {
                                    var tmp = JsonToArray(data[i]);
                                    console.log(tmp);
                                    sql.inster("device_tb", tmp);
                                }
                            } else {
                                if (data[i].status != "-1") {
                                    var t1 = data[i].LastModified;
                                    var t2 = result[0].LastModified;
                                    console.log(t1);
                                    console.log(t2);
                                    if (Date.parse(t1).valueOf() > Date.parse(t2).valueOf()) {
                                        console.log("YES");
                                        var tmp = JsonToArray(data[i]);
                                        console.log(tmp);
                                        sql.update("device_tb",tmp,"where `DID`='"+data[i].DID+"'")
                                    }
                                } else {
                                    sql.delete("device_tb","where `DID`='"+data[i].DID+"'");
                                }
                            }
                        });
                    }
                }
            }
        },
        error: function (xhr) {
            console.log('ajax er');
            $.alert({
                title: '錯誤',
                content: 'Ajax 發生錯誤',
                type: 'red',
                typeAnimated: true
            });
        }
    });
}

function JsonToArray(json) {
    key = ["DID", "category", "model", "number", "user", "position", "status", "LastModified"];
    var tmp = new Array();
    for (let i = 0; i < key.length; i++) {
        var tmp2 = new Array();
        tmp2.push(key[i]);
        tmp2.push(json[key[i]]);
        tmp.push(tmp2);
    }
    return tmp;
}
