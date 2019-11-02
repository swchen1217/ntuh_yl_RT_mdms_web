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
            var sql=new WebSql();
            if (msg != "" && msg != "user_error") {
                if(msg != "no_data"){
                    var data = eval(msg);
                    console.log(data);
                    for (var i=0;i<data.length;i++){
                        sql.select("device_tb","8","where DID='"+data[i].DID+"'",function (result) {
                            
                        });
                        //console.log(data[i].DID)
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
