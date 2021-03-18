const regUsername = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,30}$/;
const regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const regPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
const regPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,30}$/;

const c = document.getElementById('city');
const d = document.getElementById('district');
const w = document.getElementById('ward');

$(document).ready(function () {
    onChangeInput();
    initClearSpan();
    onSignUp();
    initCity();
    getAllDistrictByCityId();
    getAllWardByDistrictId();

});

function initClearSpan() {

    $('#city').on('change', function (e) {
        if (c.selectedIndex != 0) {
            $("#sAddressSelete").text("")
        }
    });

    $('#district').on('change', function (e) {
        if (c.selectedIndex != 0) {
            $("#sAddressSelete").text("")
        }
    });

    $('#ward').on('change', function (e) {
        if (c.selectedIndex != 0) {
            $("#sAddressSelete").text("")
        }
    });

    $('#fullname').on('input', function (e) {
        var value = $('#fullname').val();
        if (value != "") {
            $("#sFullname").text("");
        }
    });

    $('#phone-number').on('input', function (e) {
        var value = $('#phone-number').val();
        if (value != "" && onChangeInput()) {
            $("#sPhoneNumber").text("")
        }
    });
    $('#address').on('input', function (e) {
        var value = $('#address').val();
        if (value != "") {
            $("#sAddress").text("")
        }
    });
    $('#username').on('input', function (e) {
        var value = $('#username').val();
        if (value != "") {
            $("#sUsername").text("")
        }
    });
    $('#email').on('input', function (e) {
        var value = $('#email').val();
        if (value != "" && onChangeInput()) {
            $("#sEmail").text("")
        }
    });
    $('#password').on('input', function (e) {
        var value = $('#password').val();
        if (value != "" && onChangeInput()) {
            $("#sPassword").text("")
        }
    });
    $('#confirm-password').on('input', function (e) {
        var value = $('#confirm-password').val();
        if (value != "" && onChangeInput()) {
            $("#sConfirmPassword").text("")
        }
    });
}

function initCity() {
    $.ajax({
        cache: false,
        url: '/Address/GetAllCity',
        type: 'GET',
        success: function (data) {
            $.each(data, function (key, value) {
                $('#city').append('<option value="' + value.id + '">' + value.title + '</option>')
            });
        },
        error: function (xhr, stt, err) {
            console.error(err);
        }
    });
}

function getAllDistrictByCityId() {
    $('#city').change(function () {
        $('#district').find('option').remove();
        $('#district').append('<option>Quận/Huyện</option>');
        $('#ward').find('option').remove();

        var cityId = $('#city').val();
        var data = {
            id: cityId
        };

        $.ajax({
            cache: false,
            url: "/Address/GetAllDistrictByCityId",
            method: "GET",
            data: data,
            success: function (data) {
                $.each(data, function (key, value) {
                    if (value.id != 895) {
                        $('#district').append('<option value="' + value.id + '">' + value.title + '</option>')
                    }
                });
            },
            error: function (xhr, stt, err) {
                console.error(err);
            }
        });
    });
}

function getAllWardByDistrictId() {
    $('#district').change(function () {
        $('#ward').find('option').remove();
        $('#ward').append('<option>Xã/Phường</option>');

        var districtId = $('#district').val();
        var data = {
            id: districtId
        };

        $.ajax({
            cache: false,
            url: "/Address/GetAllWardByDistrictId",
            method: "GET",
            data: data,
            success: function (data) {
                $.each(data, function (key, value) {
                    if (value.id != 23617) {
                        $('#ward').append('<option value="' + value.id + '">' + value.title + '</option>')
                    }
                });
            },
            error: function (xhr, stt, err) {
                console.error(err);
            }
        });
    });
}

function getParamData(){
    var fullname = $("#fullname").val();
    var phoneNumber = $("#phone-number").val();
    var city = $("#city option:selected").text();
    var district = $("#district option:selected").text();
    var ward = $("#ward option:selected").text();
    var addressDetail = $("#address").val();
    var address = addressDetail + ", " + ward + ", " + district + ", " + city;
    var username = $("#username").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var confirm = $("#confirm-password").val();
    
    var data = {
        FullName: fullname,
        PhoneNumber: phoneNumber,
        City: city,
        District: district,
        Ward: ward,
        AddressDetail: address,
        UserName: username,
        Email: email,
        Password: password,
        ConfirmPassword: confirm
    }
    
    return data;
}

function onSignUp() {
    $("#btn-sign-up").click(function (e) {
        e.preventDefault();

        if (valid() && onChangeInput()) {
            var dataModel = getParamData();
            $.ajax({
                cache: false,
                url: '/Account/AddUser',
                type: 'POST',
                data: dataModel,
                success: function (res) {
                    console.log(res);
                    alertMessage(res);
                },
                error: function (xhr, stt, err) {
                    console.log(err);
                }
            });
        }
    });
}

function valid() {

    if ($("#fullname").val() == "") {
        $("#sFullname").text("Vui lòng nhập Họ Tên.")
        $("#fullname").focus();
        return false;
    }
    else if ($("#phone-number").val() == "") {
        $("#sPhoneNumber").text("Vui lòng nhập SĐT.")
        $("#phone-number").focus();
        return false;
    }
    else if (c.selectedIndex == 0) {
        $("#sAddressSelete").text("Vui lòng chọn Tỉnh/Thành Phố.")
        $('html, body').animate({ scrollTop: $('#dia-chi').offset().top }, 'slow');
    }
    else if (d.selectedIndex == 0) {
        $("#sAddressSelete").text("Vui lòng chọn Quận/Huyện.")
        $('html, body').animate({ scrollTop: $('#dia-chi').offset().top }, 'slow');
    }
    else if (w.selectedIndex == 0) {
        $("#sAddressSelete").text("Vui lòng chọn Xã/Phường.")
        $('html, body').animate({ scrollTop: $('#dia-chi').offset().top }, 'slow');
    }
    else if ($("#address").val() == "") {
        $("#sAddress").text("Vui lòng nhập Địa Đhỉ.")
        $("#address").focus();
        return false;
    }
    else if ($("#username").val() == "") {
        $("#sUsername").text("Vui lòng nhập Tên Đăng Nhập.")
        $("#username").focus();
        return false;
    }
    else if ($("#email").val() == "") {
        $("#sEmail").text("Vui lòng nhập Email.")
        $("#email").focus();
        return false;
    }
    else if ($("#password").val() == "") {
        $("#sEmail").text("Vui lòng nhập Mật Khẩu.")
        $("#password").focus();
        return false;
    }
    else if ($("#confirm-password").val() == "") {
        $("#sConfirmPassword").text("Vui lòng xác nhận Mật Khẩu.")
        $("#confirm-password").focus();
        return false;
    }
    else return true;
}

function onChangeInput() {
    $('#username').on('input', function (e) {
        var value = $("#username").val();

        if (!regUsername.test(value)) {
            $("#sUsername").text("Tên đăng nhập phải có ít nhất 4 ký tự, nhiều nhất 50 ký tự và không chứ ký tự đặc biệt \"!, @, #, á...\".");
            return false;
        } else {
            $("#sUsername").text("");
        }
        if (value != "") {
            $("#sUsername").text("");
        }
    });

    $('#phone-number').on('input', function (e) {
        var value = $("#phone-number").val();
        if (!regPhoneNumber.test(value)) {
            $("#sPhoneNumber").text("Số điện thoại không hợp lệ.");
            return false;
        } else {
            $("#sPhoneNumber").text("");
        }
        if (value != "") {
            $("#sPhoneNumber").text("");
        }
    });

    $('#email').on('input', function (e) {
        var value = $("#email").val();
        if (!regEmail.test(value)) {
            $("#sEmail").text("Địa chỉ E-mail không hợp lệ.");
            return false;
        } else {
            $("#sEmail").text("");
        }
        if (value != "") {
            $("#sEmail").text("");
        }
    });

    $('#password').on('input', function (e) {
        var value = $("#password").val();
        if (!regPassword.test(value)) {
            $("#sPassword").text("Mật khẩu phải có ít nhất 6 ký tự, nhiều nhất 50 ký tự và bao gồm ít nhất 1 ký tự chữ, 1 số, 1 ký tự đặc biệt.");
            return false;
        } else {
            $("#sPassword").text("");
        }
        if (value != "") {
            $("#sPassword").text("");
        }
    });

    $('#confirm-password').on('input', function (e) {
        var password = $("#password").val();
        var confirm = $("#confirm-password").val();
        if (confirm != password) {
            $("#sConfirmPassword").text("Mật khẩu không khớp");
        } else {
            $("#sConfirmPassword").text("");
        }
    });

    return true;
}

function showPassword() {
    var password = document.getElementById("password");
    var confirm = document.getElementById("confirm-password");
    
    if (password.type === "password" && confirm.type === "password") {
        password.type = "text";
        confirm.type = "text";
    } else {
        password.type = "password";
        confirm.type = "password";
    }
}

function alertMessage(res){
    if(res.success){
        $("#alert-message")
        .html(`<div class="alert alert-success" role="alert">
               <span class="fa fa-exclamation" aria-hidden="true"></span>
                ${res.message}
               </div>`);
               alertOut();
        window.location.href = "/dang-nhap";          
    }else{
        $("#alert-message")
        .html(`<div class="alert alert-danger" role="alert">
               <span class="fa fa-exclamation" aria-hidden="true"></span>
                ${res.message}
               </div>`);
               alertOut();
    }
}

function alertOut(){
    window.setTimeout(function() {
        $("#alert-message").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 4000);
}