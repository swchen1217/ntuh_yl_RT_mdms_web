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
            var data = msg;
            if (data != "" && data != "user_error") {
                if(data != "no_data"){
                    for (var i=0;i<data.length;i++){
                        
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
