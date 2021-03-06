function init() {
    StatusStr = ["無狀態", "使用中", "倉庫", "維修中", "保養中"];
    PermissionStr = ["未啟用", "狀態查詢", "狀態登錄", "紀錄查看", "裝置管理", "使用者管理", "*", "*", "*", "管理員"];
    $('#table_device_mng').bootstrapTable({
        dataType: "json",
        classes: "table table-bordered table-striped table-sm",
        striped: true,
        pagination: true,
        uniqueId: 'DID',
        sortName: 'DID',
        pageNumber: 1,
        pageSize: 5,
        search: true,
        showPaginationSwitch: true,
        pageList: [5, 10, 15, 20],
        columns: [{
            field: 'DID',
            title: '設備ID',
            formatter: LinkFormatterDM
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
            field: 'mkqr',
            title: 'QR Code',
            width: 75,
            formatter: '<button id="device_table_mkqr" class="btn btn-info">產生</button>',
            events: operateEvents
        }]
    });
    $('#table_device').bootstrapTable({
        dataType: "json",
        classes: "table table-bordered table-striped table-sm",
        striped: true,
        pagination: true,
        uniqueId: 'DID',
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
            width: 135,
            formatter: '<button id="device_table_update" class="btn btn-info">登錄</button>' +
                '&nbsp;<button id="device_table_manage" class="btn btn-success">管理</button>',
            events: operateEvents
        }]
    });
}

function OnHashchangeListener() {
    var hash = location.hash;
    console.log(hash);
    if (hash != '') {
        $(".nav").find(".active").removeClass("active");
        $("a[href='" + hash + "']").parent().addClass('active');
    }

    $("div[id^='Content_']").hide();
    $("#title_bar").show();
    HideAlert();

    if (hash == '' && login_check() && PermissionCheck(1, true)) {
        $('#Content_Dashboard').show();
    }
    if (hash == '#UpdateStatus' && login_check() && PermissionCheck(2, true)) {
        $('#Content_Enter_status').show();
        $("#title_bar").hide();
    }
    if (hash == '#InquireStatus' && login_check() && PermissionCheck(1, true)) {
        $('#Content_Inquire_status').show();
        $("#title_bar").hide();

        //SyncDeviceTable(false);

        $('#table_device').bootstrapTable('load', getDeviceData(true));

        /*var sql = new WebSql();
        sql.select("device_tb", "*", "where 1", function (result) {
            var jsonA = [];
            for (let i = 0; i < result.length; i++) {
                var tmp = result[i];
                tmp['status'] = StatusStr[tmp['status']];
                jsonA.push(tmp);
            }
            console.log(jsonA);

        });*/
    }
    if (hash == '#Log' && login_check() && PermissionCheck(3, true)) {
        $('#Content_Log').show();
        $("#title_bar").hide();
    }
    if (hash == '#Repair' && login_check() && PermissionCheck(2, true)) {
        $('#Content_Fix').show();
        $("#title_bar").hide();
    }
    if (hash == '#MaintenanceCheck' && login_check() && PermissionCheck(2, true)) {
        $('#Content_Maintenance_check').show();
        $("#title_bar").hide();
    }
    if (hash == '#DeviceManage' && login_check() && PermissionCheck(4, true)) {
        $('#Content_Device_manage').show();
        $("#title_bar").hide();

        DM_Switch();
    }
    if (hash == '#UserManage' && login_check() && PermissionCheck(5, true)) {
        $('#Content_User_manage').show();
        $("#title_bar").hide();

        $.ajax({
            url: "../ntuh_yl_RT_mdms_api/user.php",
            data: "mode=get_user_list&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw"),
            type: "POST",
            success: function (msg) {
                $.cookie("AllUserData", msg);
                var jsonA = JSON.parse(msg);
                for (let i = 0; i < jsonA.length; i++) {
                    jsonA[i]['permission'] += "(" + PermissionStr[jsonA[i]['permission']] + ")";
                }
                console.log(jsonA);
                $('#table_user').bootstrapTable({
                    data: jsonA,
                    dataType: "json",
                    classes: "table table-bordered table-striped table-sm",
                    striped: true,
                    pagination: true,
                    uniqueId: 'account',
                    sortName: 'account',
                    pageNumber: 1,
                    pageSize: 5,
                    search: true,
                    showPaginationSwitch: true,
                    columns: [{
                        field: 'account',
                        title: '帳號(員工編號)',
                        formatter: LinkFormatterUM
                    }, {
                        field: 'name',
                        title: '名稱'
                    }, {
                        field: 'permission',
                        title: '權限<i class="fas fa-info-circle" data-toggle="tooltip" data-placement="right" data-html="true" ' +
                            'title="<h6>權限說明：</h6>' +
                            '0 未啟用<br>' +
                            '1 狀態查詢<br>' +
                            '2 狀態登錄<br>' +
                            '3 紀錄查看<br>' +
                            '4 裝置管理<br>' +
                            '5 使用者管理<br>' +
                            '6-8 狀態登錄<br>' +
                            '9 管理員<br>' +
                            '若擁有權限>=所需權限<br>' +
                            '皆可使用" style="margin-left: 3px"></i>'
                    }, {
                        field: 'email',
                        title: 'E-mail',
                    }, {
                        field: 'created',
                        title: '建立時間',
                    }]
                });
                $('[data-toggle="tooltip"]').tooltip();
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

        var getURl = new URL(location.href);
        if (getURl.searchParams.has('acc')) {
            var acc = getURl.searchParams.get('acc');
            var users = JSON.parse($.cookie("AllUserData"));
            console.log(users);
            var userinfo;
            for (let i = 0; i < users.length; i++) {
                if (users[i]['account'] == acc) {
                    userinfo = users[i];
                    break;
                }
            }
            if (userinfo != undefined) {
                $('#chguser-ShowAcc').val(userinfo['account']);
                $('#chguser-ShowName').val(userinfo['name']);
                $('#chguser-ShowPermission').val(userinfo['permission']);
                $('#chguser-ShowEmail').val(userinfo['email']);
            }
        }
    }
    if (hash == '#ChangePw') {
        $('#Content_Change_pw').show();
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
    } else {
        ShowAlart('alert-danger', '尚未登入!!', false, false);
        return false;
    }
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
    $('#form-chguser').submit(function () {
        var getURl = new URL(location.href);
        var acc = getURl.searchParams.get('acc');
        var n_name = $('#chguser-InputName').val();
        var n_permission = $('#chguser-InputPermission').val();
        var n_email = $('#chguser-InputEmail').val();
        var n_pw = $('#chguser-InputPw').val();
        var n_pw_re = $('#chguser-InputPwRe').val();

        if (acc == null) {
            $.alert({
                title: '錯誤',
                content: '尚未選擇欲更改之帳號',
                type: 'red',
                typeAnimated: true
            });
        } else {
            var users = JSON.parse($.cookie("AllUserData"));
            var userinfo;
            for (let i = 0; i < users.length; i++) {
                if (users[i]['account'] == acc) {
                    userinfo = users[i];
                    break;
                }
            }
            var old_name = userinfo['name'];
            var old_permission = userinfo['permission'];
            var old_email = userinfo['email'];
            if (n_name == '' && n_permission == '-1' && n_email == '' && n_pw == '') {
                $.alert({
                    title: '錯誤',
                    content: '無任何欲修改之資料',
                    type: 'red',
                    typeAnimated: true
                });
            } else {
                var ConfrimContent = "";
                var chguserParams = "";
                ConfrimContent += "欲修改資訊如下 請確認:<br>帳號: " + acc + "<br>";
                chguserParams += "&operate_acc=" + acc;
                if (n_name != "") {
                    chguserParams += "&new_name=" + n_name;
                    ConfrimContent += "名稱: <var>" + old_name + "</var> 更改為 <var>" + n_name + "</var><br>";
                }
                if (n_permission != '-1') {
                    chguserParams += "&new_permission=" + n_permission;
                    ConfrimContent += "權限: <var>" + old_permission + "(" + PermissionStr[old_permission] + ")</var> 更改為 <var>" + n_permission + "(" + PermissionStr[n_permission] + ")</var><br>";
                }
                if (n_email != "") {
                    chguserParams += "&new_email=" + n_email;
                    ConfrimContent += "E-mail: <var>" + old_email + "</var><br>更改為 <var>" + n_email + "</var><br>";
                }
                if (n_pw != "") {
                    if (n_pw != '' && n_pw_re != '') {
                        if (n_pw == n_pw_re) {
                            var create_time = moment(userinfo['created']).format('YYYYMMDDHHmmss');
                            var mMD5 = md5(create_time + n_pw);
                            chguserParams += "&new_pw=" + mMD5;
                            ConfrimContent += "<b>密碼更改</b><br>";
                        } else {
                            $.alert({
                                title: '錯誤',
                                content: '確認新密碼不符合!!請重新輸入',
                                type: 'red',
                                typeAnimated: true
                            });
                            return false;
                        }
                    } else {
                        $.alert({
                            title: '錯誤',
                            content: '密碼未輸入完整!!請重新輸入',
                            type: 'red',
                            typeAnimated: true
                        });
                        return false;
                    }
                }
                $.confirm({
                    title: '更改確認!',
                    content: ConfrimContent,
                    buttons: {
                        confirm: {
                            text: '確認',
                            btnClass: 'btn-blue',
                            action: function () {
                                HideAlert();
                                $.ajax({
                                    url: "../ntuh_yl_RT_mdms_api/user.php",
                                    data: "mode=chguser&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw") + chguserParams,
                                    type: "POST",
                                    success: function (msg) {
                                        $('#chguser-InputName').val('');
                                        $('#chguser-InputPermission').val(-1);
                                        $('#chguser-InputEmail').val('');
                                        $('#chguser-InputPw').val('');
                                        $('#chguser-InputPwRe').val('');
                                        if (msg == "ok") {
                                            ShowAlart('alert-success', '修改成功', false, true);
                                            if (acc == $.cookie("LoginInfoAcc")) {
                                                location.replace("./login.html")
                                            } else {
                                                setTimeout(function () {
                                                    location.replace("./index.html#UserManage")
                                                }, 1500);
                                            }
                                        } else {
                                            ShowAlart('alert-danger', '權限錯誤!!', false, false);
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
                        cancel: {
                            text: '取消'
                        }
                    }
                });
            }
        }
        return false;
    });
    $('#form-newuser').submit(function () {
        var n_acc = $('#newuser-InputAcc').val();
        var n_name = $('#newuser-InputName').val();
        var n_permission = $('#newuser-InputPermission').val();
        var n_email = $('#newuser-InputEmail').val();
        var n_pw = $('#newuser-InputPw').val();
        var n_pw_re = $('#newuser-InputPwRe').val();
        if (n_acc != '' && n_name != '' && n_email != '' && n_permission != '-1' && n_pw != '' && n_pw_re != '') {
            if (n_pw == n_pw_re) {
                //todo ajax
                var create_time = moment().format('YYYYMMDDHHmmss');
                var create_time2 = moment().format('YYYY-MM-DD HH:mm:ss');
                var mMD5 = md5(create_time + n_pw);
                $.confirm({
                    title: '新增帳號!!',
                    content: '確認新增此帳號??',
                    buttons: {
                        confirm: {
                            text: '確認',
                            btnClass: 'btn-blue',
                            action: function () {
                                HideAlert();
                                $.ajax({
                                    url: "../ntuh_yl_RT_mdms_api/user.php",
                                    data: "mode=newuser" +
                                        "&acc=" + $.cookie("LoginInfoAcc") +
                                        "&pw=" + $.cookie("LoginInfoPw") +
                                        "&operate_acc=" + n_acc +
                                        "&new_name=" + n_name +
                                        "&new_permission=" + n_permission +
                                        "&new_email=" + n_email +
                                        "&new_pw=" + mMD5 +
                                        "&new_create_time=" + create_time2
                                    ,
                                    type: "POST",
                                    success: function (msg) {
                                        $('#newuser-InputAcc').val('');
                                        $('#newuser-InputPermission').val(-1);
                                        $('#newuser-InputName').val('');
                                        $('#newuser-InputEmail').val('');
                                        $('#newuser-InputPw').val('');
                                        $('#newuser-InputPwRe').val('');
                                        if (msg == "ok")
                                            ShowAlart('alert-success', '新增成功', false, true);
                                        else
                                            ShowAlart('alert-danger', '錯誤!!', false, false);
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
                        cancel: {
                            text: '取消'
                        }
                    }
                });
            } else {
                $.alert({
                    title: '錯誤',
                    content: '確認新密碼不符合!!請重新輸入',
                    type: 'red',
                    typeAnimated: true
                });
            }
        } else {
            $.alert({
                title: '錯誤',
                content: '輸入未完整!!',
                type: 'red',
                typeAnimated: true
            });
        }
        return false;
    });
    $('#form-newdevice').submit(function () {
        var n_category = $('#newdevice-InputCategory').val();
        var n_model = $('#newdevice-InputModel').val();
        var n_number = $('#newdevice-InputNumber').val();

        if (n_category != '' && n_model != '' && n_number != '') {
            $.confirm({
                title: '新增裝置!!',
                content: '確認新增此裝置??',
                buttons: {
                    confirm: {
                        text: '確認',
                        btnClass: 'btn-blue',
                        action: function () {
                            HideAlert();
                            $.ajax({
                                url: "../ntuh_yl_RT_mdms_api/db.php",
                                data: "mode=newdevice" +
                                    "&acc=" + $.cookie("LoginInfoAcc") +
                                    "&pw=" + $.cookie("LoginInfoPw") +
                                    "&new_category=" + n_category +
                                    "&new_model=" + n_model +
                                    "&new_number=" + n_number
                                ,
                                type: "POST",
                                success: function (msg) {
                                    $('#newdevice-InputCategory').val('');
                                    $('#newdevice-InputModel').val('');
                                    $('#newdevice-InputNumber').val('');
                                    if (msg == "ok")
                                        ShowAlart('alert-success', '新增成功', false, true);
                                    else
                                        ShowAlart('alert-danger', '錯誤!!', false, false);
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
                    cancel: {
                        text: '取消'
                    }
                }
            });
        } else {
            $.alert({
                title: '錯誤',
                content: '輸入未完整!!',
                type: 'red',
                typeAnimated: true
            });
        }
        return false;
    });
    $('#form-chgdevice').submit(function () {
        var getURl = new URL(location.href);
        var DID = getURl.searchParams.get('DID');
        var n_category = $('#chgdevice-InputCategory').val();
        var n_model = $('#chgdevice-InputModel').val();
        var n_number = $('#chgdevice-InputNumber').val();
        var n_user = $('#chgdevice-InputUser').val();
        var n_position = $('#chgdevice-InputPosition').val();
        var n_status = $('#chgdevice-InputStatus').val();

        if (DID == null) {
            $.alert({
                title: '錯誤',
                content: '尚未選擇欲更改之帳號',
                type: 'red',
                typeAnimated: true
            });
        } else {
            var devices = getDeviceData(false);
            var deviceinfo;
            for (let i = 0; i < devices.length; i++) {
                if (devices[i]['DID'] == DID) {
                    deviceinfo = devices[i];
                    break;
                }
            }

            var old_category = deviceinfo['category'];
            var old_model = deviceinfo['model'];
            var old_number = deviceinfo['number'];
            var old_user = deviceinfo['user'];
            var old_position = deviceinfo['position'];

            var old_status = deviceinfo['status'];
            if (n_status == old_status)
                n_status = '-1';
            if (n_category == '' && n_model == '' && n_number == '' && n_user == '' && n_position == '' && n_status == '-1') {
                $.alert({
                    title: '錯誤',
                    content: '無任何欲修改之資料',
                    type: 'red',
                    typeAnimated: true
                });
            } else {
                var noUser = false;
                var noPosition = false;
                if (n_status != '-1') {
                    if (old_status != '0') {
                        if (n_position == '')
                            noPosition = true;
                    }
                    if (n_status == '1') {
                        if (n_user == '')
                            noUser = true;
                    }
                    if (noUser || noPosition) {
                        var content = '';
                        if (noUser)
                            content += '新使用者欄位為必填<br>';
                        if (noPosition)
                            content += '新位置欄位為必填<br>';
                        $.alert({
                            title: '錯誤',
                            content: content,
                            type: 'red',
                            typeAnimated: true
                        });
                        return false;
                    }
                }

                var ConfrimContent = "";
                var chgdeviceParams = "";
                ConfrimContent += "欲修改資訊如下 請確認:<br>裝置ID: " + DID + "<br>";
                chgdeviceParams += "&operate_DID=" + DID;
                if (n_category != "") {
                    chgdeviceParams += "&new_category=" + n_category;
                    ConfrimContent += "分類: <var>" + old_category + "</var> 更改為 <var>" + n_category + "</var><br>";
                }
                if (n_model != "") {
                    chgdeviceParams += "&new_model=" + n_model;
                    ConfrimContent += "型號: <var>" + old_model + "</var> 更改為 <var>" + n_model + "</var><br>";
                }
                if (n_number != "") {
                    chgdeviceParams += "&new_number=" + n_number;
                    ConfrimContent += "編號: <var>" + old_number + "</var> 更改為 <var>" + n_number + "</var><br>";
                }
                if (n_user != "") {
                    chgdeviceParams += "&new_user=" + n_user;
                    ConfrimContent += "使用者: <var>" + old_user + "</var> 更改為 <var>" + n_user + "</var><br>";
                }
                if (n_position != "") {
                    chgdeviceParams += "&new_position=" + n_position;
                    ConfrimContent += "位置: <var>" + old_position + "</var> 更改為 <var>" + n_position + "</var><br>";
                }
                if (n_status != '-1') {
                    chgdeviceParams += "&new_status=" + n_status;
                    ConfrimContent += "狀態: <var>" + old_status + "(" + StatusStr[old_status] + ")</var> 更改為 <var>" + n_status + "(" + StatusStr[n_status] + ")</var><br>";
                }
                console.log(chgdeviceParams);
                $.confirm({
                    title: '更改確認!',
                    content: ConfrimContent,
                    buttons: {
                        confirm: {
                            text: '確認',
                            btnClass: 'btn-blue',
                            action: function () {
                                HideAlert();
                                $.ajax({
                                    url: "../ntuh_yl_RT_mdms_api/db.php",
                                    data: "mode=chgdevice&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw") + chgdeviceParams,
                                    type: "POST",
                                    success: function (msg) {
                                        if (msg == "ok") {
                                            ShowAlart('alert-success', '修改成功', false, true);
                                            setTimeout(function () {
                                                location.replace("./index.html#DeviceManage")
                                            }, 1500);
                                        } else if(msg=='number_error'){
                                            $.alert({
                                                title: '錯誤',
                                                content: '裝置編號重複',
                                                type: 'red',
                                                typeAnimated: true
                                            });
                                        } else {
                                            ShowAlart('alert-danger', '權限錯誤!!', false, false);
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
                        cancel: {
                            text: '取消'
                        }
                    }
                });
            }
        }
        return false;
    });
}

function ButtonOnClickListener() {
    $('#btn_chguser-del').click(function () {
        var getURl = new URL(location.href);
        var acc = getURl.searchParams.get('acc');
        if (acc == null) {
            $.alert({
                title: '錯誤',
                content: '尚未選擇欲刪除之帳號',
                type: 'red',
                typeAnimated: true
            });
        } else {
            var users = JSON.parse($.cookie("AllUserData"));
            var userinfo;
            for (let i = 0; i < users.length; i++) {
                if (users[i]['account'] == acc) {
                    userinfo = users[i];
                    break;
                }
            }
            var name = userinfo['name'];
            $.confirm({
                title: '確認刪除!!',
                content:
                    '即將刪除:' + acc + '(' + name + ')' +
                    '<label>請再次輸入你的密碼確認刪除此帳號</label>' +
                    '<input type="password" placeholder="輸入密碼" class="pw form-control" required/>'
                ,
                type: 'red',
                autoClose: 'cancel|10000',
                buttons: {
                    confirm: {
                        text: '刪除',
                        btnClass: 'btn-blue',
                        action: function () {
                            var pw = this.$content.find('.pw').val();
                            if (pw != '') {
                                $.ajax({
                                    url: "../ntuh_yl_RT_mdms_api/user.php",
                                    data: "mode=get_create_time" +
                                        "&acc=" + $.cookie("LoginInfoAcc"),
                                    type: "POST",
                                    success: function (msg) {
                                        if (msg != 'no_acc') {
                                            mMd5 = md5(msg + pw);
                                            if (mMd5 == $.cookie("LoginInfoPw")) {
                                                $.ajax({
                                                    url: "../ntuh_yl_RT_mdms_api/user.php",
                                                    data: "mode=deluser" +
                                                        "&acc=" + $.cookie("LoginInfoAcc") +
                                                        "&pw=" + $.cookie("LoginInfoPw") +
                                                        "&operate_acc=" + acc
                                                    ,
                                                    type: "POST",
                                                    success: function (msg) {
                                                        if (msg == "ok") {
                                                            ShowAlart('alert-success', '刪除成功', false, true);
                                                            if (acc == $.cookie("LoginInfoAcc")) {
                                                                location.replace("./login.html")
                                                            } else {
                                                                setTimeout(function () {
                                                                    location.replace("./index.html#UserManage")
                                                                }, 1500);
                                                            }
                                                        } else {
                                                            ShowAlart('alert-danger', '錯誤!!', false, false);
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
                                                $.alert('密碼錯誤');
                                            }
                                        } else {
                                            $.alert('錯誤');
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
                                $.alert('未輸入密碼');
                                return false;
                            }
                        }
                    },
                    cancel: {
                        text: '取消'
                    },
                }
            });
        }
    });

    $('#btn_del_position').click(function () {
        console.log("del");
        HideAlert();
        $.confirm({
            title: '確認刪除!!',
            content: '確認刪除??',
            type: 'red',
            buttons: {
                confirm: {
                    text: '刪除',
                    btnClass: 'btn-red',
                    action: function () {
                        console.log($('#table_position').bootstrapTable('getAllSelections'));
                        var del_data = $('#table_position').bootstrapTable('getAllSelections');
                        for (var i = 0; i < del_data.length; i++) {
                            $.ajax({
                                url: "../ntuh_yl_RT_mdms_api/db.php",
                                data: "mode=del_position" +
                                    "&acc=" + $.cookie("LoginInfoAcc") +
                                    "&pw=" + $.cookie("LoginInfoPw") +
                                    "&position=" + del_data[i]['type'] + "-" + del_data[i]['item'],
                                type: "POST",
                                success: function (msg) {
                                    if (msg == 'ok') {
                                        //$('#table_position').bootstrapTable(' refresh',{data:getPositionData(),silent: true});
                                        console.log("del_ok")
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
                        ShowAlart('alert-success', '刪除成功', false, true);
                        setTimeout(function () {
                            location.reload();
                        }, 1000);
                    }
                },
                cancel: {
                    text: '取消'
                },
            }
        });
    });

    $('#btn_new_position').click(function () {
        console.log(maxNewPositionRow);
        for (var i = 0; i <= maxNewPositionRow; i++) {
            var type = $('#inputType_' + i).val();
            var item = $('#inputItem_' + i).val();
            if (type != "" && item != "") {
                var tmp = type + "-" + item;
                console.log(tmp);
                $.ajax({
                    url: "../ntuh_yl_RT_mdms_api/db.php",
                    data: "mode=new_position" +
                        "&acc=" + $.cookie("LoginInfoAcc") +
                        "&pw=" + $.cookie("LoginInfoPw") +
                        "&position=" + tmp,
                    type: "POST",
                    success: function (msg) {
                        if (msg == 'ok') {
                            ShowAlart('alert-success', '新增成功', false, true);
                        } else {
                            ShowAlart('alert-danger', '新增失敗', false, false);
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
        }
        setTimeout(function () {
            location.reload();
        }, 1000);
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
        var DID = row['DID'];
        console.log(DID);
        location.href = '?DID=' + DID + '#UpdateStatus';
    },
    'click #device_table_manage': function (e, value, row, index) {
        var DID = row['DID'];
        console.log(DID);
        location.href = '?DID=' + DID + '#DeviceManage';
    },
    'click #device_table_mkqr': function (e, value, row, index) {
        var DID = row['DID'];
        console.log(DID);
        document.getElementById("QRModalTitle").innerText = DID;
        document.getElementById("QRModalContext1").innerHTML = "<img src='../ntuh_yl_RT_mdms_api/make_qrcode.php?DID=" + DID + "'/>";
        document.getElementById("QRModalContext2").innerHTML = "<a href='../ntuh_yl_RT_mdms_api/make_qrcode.php?DID=" + DID + "' download>下載QRCode<br>(87x87)</a>";

        $('#QRModal').modal('show');
    },
};

function LinkFormatterUM(value, row, index) {
    return "<a href='?acc=" + value + "#UserManage'>" + value + "</a>";
}

function LinkFormatterDM(value, row, index) {
    return "<a href='?DID=" + value + "#DeviceManage'>" + value + "</a>";
}

function DM_Switch() {
    setTimeout(function () {
        console.log('DSok');
        $('#DM_DM').hide();
        $('#DM_PM').hide();

        if ($('#lb_DM_DM').is('.active')) {
            $('#DM_DM').show();

            $('#table_device_mng').bootstrapTable('load', getDeviceData(true));

            //SyncDeviceTable(false);

            /*var sql = new WebSql();
            sql.select("device_tb", "*", "where 1", function (result) {
                var jsonA = [];
                for (let i = 0; i < result.length; i++) {
                    var tmp = result[i];
                    tmp['status'] = StatusStr[tmp['status']];
                    jsonA.push(tmp);
                }
                console.log(jsonA);

            });*/

            var getURl = new URL(location.href);
            if (getURl.searchParams.has('DID')) {
                var DID = getURl.searchParams.get('DID');
                var devices = getDeviceData(false);
                var deviceinfo;
                for (let i = 0; i < devices.length; i++) {
                    if (devices[i]['DID'] == DID) {
                        deviceinfo = devices[i];
                        break;
                    }
                }
                if (deviceinfo != undefined) {
                    $('#chgdevice-ShowId').val(deviceinfo['DID']);
                    $('#chgdevice-ShowCategory').val(deviceinfo['category']);
                    $('#chgdevice-ShowModel').val(deviceinfo['model']);
                    $('#chgdevice-ShowNumber').val(deviceinfo['number']);
                    $('#chgdevice-ShowUser').val(deviceinfo['user']);
                    $('#chgdevice-ShowPosition').val(deviceinfo['position']);
                    $('#chgdevice-ShowStatus').val(deviceinfo['status']);
                }
                chgDeviceInputAbleSwitch();
            }
        } else {
            $('#DM_PM').show();

            $('#table_position').bootstrapTable({
                data: getPositionData(),
                dataType: "json",
                classes: "table table-bordered table-striped table-sm",
                striped: true,
                pagination: true,
                uniqueId: 'type',
                pageNumber: 1,
                pageSize: 10,
                pageList: [10, 25, 50, 100],
                search: true,
                sortName: 'type',
                showPaginationSwitch: true,
                columns: [{
                    field: 'checkbox',
                    checkbox: true,
                    //formatter: '<input type="checkbox" style="width:25px;height:25px">'
                }, {
                    field: 'type',
                    title: '分類'
                }, {
                    field: 'item',
                    title: '編號'
                }/*, {
                    field: 'operating',
                    title: '操作',
                    formatter: '<button id="position_table_del" class="btn btn-danger">刪除</button>',
                    events: operateEvents
                }*/]
            });
        }
    }, 0);
}

function getPositionData() {
    var data = 0;
    $.ajax({
        url: "../ntuh_yl_RT_mdms_api/db.php",
        data: "mode=sync_position_item_tb_download" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw"),
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            var jsonA = JSON.parse(msg);
            console.log(jsonA);
            data = jsonA;
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
    console.log(data);
    return data;
}

var maxNewPositionRow = 0;

function addNewPositionRow() {
    maxNewPositionRow++;
    var new_row = document.createElement("div");
    new_row.className = "form-row";
    new_row.style.marginTop = "5px";
    var new_col_1 = document.createElement("div");
    new_col_1.className = "col";
    var new_col_2 = document.createElement("div");
    new_col_2.className = "col";
    var new_input_type = document.createElement("input");
    new_input_type.type = "text";
    new_input_type.className = "form-control";
    new_input_type.id = "inputType_" + maxNewPositionRow;
    new_input_type.placeholder = "type";
    var new_input_item = document.createElement("input");
    new_input_item.type = "text";
    new_input_item.className = "form-control";
    new_input_item.id = "inputItem_" + maxNewPositionRow;
    new_input_item.placeholder = "item";
    new_col_1.appendChild(new_input_type);
    new_col_2.appendChild(new_input_item);
    new_row.appendChild(new_col_1);
    new_row.appendChild(new_col_2);
    var div = document.getElementById("NewPositionRow");
    div.appendChild(new_row);
}

function getDeviceData(format) {
    var data = '';
    $.ajax({
        url: "../ntuh_yl_RT_mdms_api/db.php",
        data: "mode=getDeviceData&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw"),
        type: "POST",
        async: false,
        success: function (msg) {
            if (msg != 'no_data') {
                var jsonA = JSON.parse(msg);
                if(format){
                    for (let i = 0; i < jsonA.length; i++) {
                        jsonA[i]['status'] = StatusStr[jsonA[i]['status']];
                    }
                }
                data = jsonA;
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
    return data;
}

function chgDeviceInputAbleSwitch() {
    var user = true;
    var position = true;
    var old_ = $('#chgdevice-ShowStatus').val();
    var new_ = $('#chgdevice-InputStatus').val();

    if ((old_ == '0' && new_ == '-1') || (new_ == '2' && (old_ == '0' || old_ == '1')) || (old_ == '2' && new_ == '-1'))
        user = false;
    if (old_ == '0' && new_ == '-1')
        position = false;

    if (user)
        $('#chgdevice-InputUser').prop("disabled", false);
    else
        $('#chgdevice-InputUser').prop("disabled", true);
    if (position)
        $('#chgdevice-InputPosition').prop("disabled", false);
    else
        $('#chgdevice-InputPosition').prop("disabled", true);
}
