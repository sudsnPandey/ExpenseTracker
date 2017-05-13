$(document).ready(function () {
    getSpendings();
});

//get the current expense details from the database
var getSpendings = function () {
    $.ajax({
        url: '/Home/GetSpendings',
        method: "POST",
        dataType: 'json',
        data: { },
        cache: false,
        async: true,
        success: function (data) {
            var expense = JSON.parse(data);
            $("#current_expense_info").text("AE = $ "+expense.AE+"  DSCVR = $ "+expense.DSCVR+"  VISA = $ "+expense.CHASEVISA);
        }, error: function (xhr, status, error) {
            console.log(error);
        }
    });
}


var getReceiptPic = function (e) {
    var file = document.getElementById('file_upload').files[0];
    //alert("here");
    setReceiptPic(file);
}

var setReceiptPic = function (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    var content = "";
    reader.onload = function () {
        $("#Receipt_PIC").val(reader.result);
        global_var = reader.result;
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

var submit_insert_expense = function () {
    //check that amount is not empty
    var amt = $("#Amount").val();
    var entry_date = $("#EntryDate").val();
    if (amt.length == 0 || entry_date.length == 0) {
        alert("Some Fields Cannot be Empty");
    }
    else {
        var form_data = $("#insert_expense_form").serialize();
        $.post("/Home/InsertExpense", form_data, function (data) {
            getSpendings();
        });
    }
}