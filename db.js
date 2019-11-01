function SyncDeviceTable(needBar) {
    if (needBar == true)
        $("#dialog_ProgressBar_Sync").modal("show")
    var LastSync;
    if (localStorage.hasOwnProperty("device_tb_LastSync"))
        LastSync = localStorage.getItem("device_tb_LastSync");
    else
        LastSync = "2019-01-01 00:00:00";
    // TODO
    /*$.ajax({
        url: "../ntuh_yl_RT_mdms_api/db.php",
        data: "mode=sync_device_tb_download",
        type: "POST",
        success: function (msg) {

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
    });*/


}
