function OnHashchangeListener() {
    var hash = location.hash;
    console.log(hash);
    if (hash != '') {
        $(".nav").find(".active").removeClass("active");
        $("a[href='" + hash + "']").parent().addClass('active');
    }
    change_pages(hash);
    HideAlert();
    if (hash == '' && login_check()) {
        if (PermissionCheck(1, true)) {

        }
    }
    if (hash == '#UpdateStatus' && login_check()) {
        if (PermissionCheck(2, true)) {

        }
    }
    if (hash == '#InquireStatus' && login_check()) {
        if (PermissionCheck(1, true)) {
            //TODO
            var sql = new WebSql();
            sql.select("device_tb", "*", "where 1", function (result) {
                var jsonA = [];
                for (let i = 0; i < result.length; i++) {
                    jsonA.push(result[i]);
                }
                console.log(jsonA);
                $('#table_device').bootstrapTable({
                    data: jsonA,
                    dataType: "json",
                    classes: "table table-bordered table-striped table-sm",
                    striped: true,
                    pagination: true,
                    uniqueId:'DID',
                    pageNumber: 1,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100],
                    search: true,
                    sortName: 'DID',
                    showColumns: true,
                    showToggle: true,
                    showPaginationSwitch: true,
                    showFullscreen: true,
                    columns: [{
                        field: 'DID',
                        title: '設備ID'
                    }, {
                        field: 'category',
                        title: '分類'
                    }, {
                        field: 'model',
                        title: '型號'
                    }, {
                        field: 'number',
                        title: '編號'
                    }, {
                        field: 'user',
                        title: '使用者',
                        //align:'center'
                    }, {
                        field: 'position',
                        title: '位置'
                    }, {
                        field: 'status',
                        title: '狀態'
                    }, {
                        field: 'LastModified',
                        title: '最後修改時間'
                    }, {
                        field: 'operating',
                        title: '操作',
                        width:135,
                        formatter: '<button id="device_table_update" class="btn btn-info">登錄</button>' +
                            '&nbsp;<button id="device_table_manage" class="btn btn-success">管理</button>',
                        events:operateEvents
                    }]
                });
            });

        }
    }
    if (hash == '#Log' && login_check()) {
        if (PermissionCheck(3, true)) {

        }
    }
    if (hash == '#Repair' && login_check()) {
        if (PermissionCheck(2, true)) {

        }
    }
    if (hash == '#MaintenanceCheck' && login_check()) {
        if (PermissionCheck(2, true)) {

        }
    }
    if (hash == '#DeviceManage' && login_check()) {
        if (PermissionCheck(4, true)) {

        }
    }
    if (hash == '#UserManage' && login_check()) {
        if (PermissionCheck(5, true)) {

        }
    }
    if (hash == '#ChangePw') {
        console.log(location.href);
        var getURl = new URL(location.href);
        token = getURl.searchParams.get('token');
        if (getURl.searchParams.has('token')) {
            $('#row-fgtpw').show();
            $('#row-chgpw').hide();
            $.ajax({
                url: "../ntuh_yl_RT_mdms_api/user.php",
                data: "mode=rstpw_check&token=" + token,
                type: "POST",
                success: function (msg) {
                    smsg = msg.split(',');
                    if (smsg[0] == "token_ok") {
                        $('#ShowAcc').val(smsg[1]);
                    }
                    if (smsg[0] == "token_timeout") {
                        ShowAlart('alert-danger', "連結已過期,請重新<a href='index.html#ChangePw' class='alert-link'>申請</a>!!", true, false);
                    }
                    if (smsg[0] == "hasnot_token") {
                        ShowAlart('alert-danger', "此連結無效,請重新<a href='index.html#ChangePw' class='alert-link'>申請</a>!!", true, false);
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
        } else {
            $('#row-fgtpw').hide();
            $('#row-chgpw').show();
        }

        /*$('#alert-primary').show();
        $('#alert-success').show();
        $('#alert-danger').show();
        $('#alert-warning').show();
        $('#alert-info').show();*/
    }
}

function login_check() {
    if ($.cookie('LoginInfoAcc')) {
        return true;
    } else if (location.hash == '') {
        ShowAlart('alert-warning', "請先<a href='login.html' class='alert-link'>登入</a>", true, false);
        /*$('#alert-warning-in').html("請先<a href='login.html' class='alert-link'>登入</a>");
        $('#alert-warning').show();*/
    } else {
        ShowAlart('alert-danger', '尚未登入!!', false, false);
        /*$('#alert-danger-in').text('尚未登入!!');
        $('#alert-danger').show();*/
        return false;
    }
}

function change_pages(hash) {
    $("div[id^='Content_']").hide();

    if (hash == '')
        $('#Content_Dashboard').show();
    if (hash == '#UpdateStatus')
        $('#Content_Enter_status').show();
    if (hash == '#InquireStatus')
        $('#Content_Inquire_status').show();
    if (hash == '#Log')
        $('#Content_Log').show();
    if (hash == '#Repair')
        $('#Content_Fix').show();
    if (hash == '#MaintenanceCheck')
        $('#Content_Maintenance_check').show();
    if (hash == '#DeviceManage')
        $('#Content_Device_manage').show();
    if (hash == '#UserManage')
        $('#Content_User_manage').show();
    if (hash == '#ChangePw')
        $('#Content_Change_pw').show();
}

function FormSubmitListener() {
    $('#form-HasToken').submit(function () {
        HideAlert();
        var npw = $('#InputNewPw_f').val();
        var npwr = $('#InputNewPwRe_f').val();
        if (npw == "" || npwr == "") {
            $.alert({
                title: '錯誤',
                content: '新密碼或確認新密碼未輸入!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else if (npw != npwr) {
            $('#InputNewPw_f').val('');
            $('#InputNewPwRe_f').val('');
            $.alert({
                title: '錯誤',
                content: '確認新密碼不符合!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $('#InputNewPw_f').val('');
            $('#InputNewPwRe_f').val('');
            var mMd5 = md5(smsg[2] + npw);
            console.log(smsg[2] + npw);
            console.log(mMd5);
            console.log(token);
            $.ajax({
                url: "../ntuh_yl_RT_mdms_api/user.php",
                data: "mode=rstpw_submit&token=" + token + "&new_pw=" + mMd5,
                type: "POST",
                success: function (msg) {
                    if (msg == "rstpw_ok") {
                        console.log('ok');
                        ShowAlart('alert-success', '設定成功!!!', false, true);
                        setTimeout(function () {
                            location.replace("./index.html#ChangePw")
                        }, 1500);
                    }
                    if (msg == "token_timeout") {
                        ShowAlart('alert-danger', "連結已過期,請重新<a href='index.html#ChangePw' class='alert-link'>申請</a>!!", true, false);
                    }
                    if (msg == "hasnot_token") {
                        ShowAlart('alert-danger', "此連結無效,請重新<a href='index.html#ChangePw' class='alert-link'>申請</a>!!", true, false);
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
        return false;
    });
    $('#form-Chgpw').submit(function () {
        HideAlert();
        var acc = $('#InputAcc').val();
        var oldpw = $('#InputOldPw').val();
        var npw = $('#InputNewPw').val();
        var npwr = $('#InputNewPwRe').val();
        if (npw == "" || npwr == "" || acc == "" || oldpw == "") {
            $.alert({
                title: '錯誤',
                content: '未輸入完整!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else if (npw != npwr) {
            $('#InputNewPw').val('');
            $('#InputNewPwRe').val('');
            $.alert({
                title: '錯誤',
                content: '確認新密碼不符合!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $.ajax({
                url: "../ntuh_yl_RT_mdms_api/user.php",
                data: "mode=get_create_time&acc=" + acc,
                type: "POST",
                success: function (msg_st) {
                    console.log(msg_st);
                    if (msg_st == 'no_acc') {
                        console.log('no_acc');
                        $('#InputAcc').val('');
                        $('#InputOldPw').val('');
                        $('#InputNewPw').val('');
                        $('#InputNewPwRe').val('');
                        ShowAlart('alert-danger', '員工編號錯誤!!,此員工編號尚未註冊', false, true);
                    } else {
                        var oldpwMd5 = md5(msg_st + oldpw);
                        var newpwMd5 = md5(msg_st + npw);
                        /*console.log(msg_st+oldpw);
                        console.log(msg_st+npw);
                        console.log(oldpwMd5);
                        console.log(newpwMd5);*/
                        $.ajax({
                            url: "../ntuh_yl_RT_mdms_api/user.php",
                            data: "mode=chgpw&old_pw=" + oldpwMd5 + "&new_pw=" + newpwMd5 + "&acc=" + acc,
                            type: "POST",
                            success: function (msg_nd) {
                                console.log(msg_nd);
                                if (msg_nd == "old_pw_error") {
                                    ShowAlart('alert-danger', '舊密碼錯誤', false, false);
                                }
                                if (msg_nd == "ok") {
                                    $('#InputAcc').val('');
                                    $('#InputOldPw').val('');
                                    $('#InputNewPw').val('');
                                    $('#InputNewPwRe').val('');
                                    ShowAlart('alert-success', '更改成功!!!', false, true);
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

        return false;
    });
    $('#form-GetToken').submit(function () {
        HideAlert();
        var email = $('#InputEmail').val();
        if (email == "") {
            $.alert({
                title: '錯誤',
                content: 'E-mail未輸入!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $('#InputEmail').val('');
            $.ajax({
                url: "../ntuh_yl_RT_mdms_api/user.php",
                data: "mode=forget_pw&email=" + email,
                type: "POST",
                success: function (msg) {
                    if (msg == "寄信成功") {
                        console.log('ok');
                        ShowAlart('alert-success', '密碼重設資料已寄出!!!', false, true);
                    } else if (msg == "email_not_exist") {
                        ShowAlart('alert-danger', "無此E-mail!!", false, false);
                    } else {
                        ShowAlart('alert-warning', "寄信系統錯誤,請聯絡系統管理員")
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
        return false;
    });

}

function PermissionCheck(NeedPermission, isAlert) {
    HideAlert();
    var LIP = $.cookie("LoginInfoPermission");
    console.log("LPT:" + LIP);
    console.log("NeedPermission:" + NeedPermission);
    if (LIP >= NeedPermission) {
        console.log("Pass");
        return true;
    } else {
        console.log("NoPass");
        if (isAlert) {
            ShowAlart('alert-warning', "您的權限不足!!<br>您的權限：" + LIP + "<br>所需權限：" + NeedPermission, true, false);
        }
        return false;
    }
}

window.operateEvents = {
    'click #device_table_update': function (e, value, row, index) {
        // e      Event
        // value  undefined
        // row    rowdata
        // index  row
        console.log("update");
        var DID=row['DID'];
        console.log(DID);
        //TODO update
    },
    'click #device_table_manage': function (e, value, row, index) {
        console.log("update");
        var DID=row['DID'];
        console.log(DID);
        //TODO manage
    }
};