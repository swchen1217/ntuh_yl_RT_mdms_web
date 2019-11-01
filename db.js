function SyncDeviceTable(needBar) {
    if (needBar == true)
        $("#dialog_ProgressBar_Sync").modal("show")
    var LastSync;
    if (localStorage.hasOwnProperty("device_tb_LastSync"))
        LastSync = localStorage.getItem("device_tb_LastSync");
    else
        LastSync = "2019-01-01 00:00:00";
    


}
