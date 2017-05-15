$(document).ready(function () {
    getSpendings();
});

//get the current expense details from the database
var getSpendings = function () {
    $.ajax({
        url: '/Home/GetSpendings',
        method: "POST",
        dataType: 'json',
        data: {},
        cache: false,
        async: true,
        success: function (data) {
            var expense = JSON.parse(data);
            //$("#current_expense_info").html("<strong>AE</strong>  <p style=\"color:blue;\">$"+expense.AE+"</p>  <strong>DSCVR</strong> $"+expense.DSCVR+"  <strong>VISA</strong>  $"+expense.CHASEVISA);
            $("#current_expense_info").html(
                "<table style=\"width:100%;font-size:.7em;color:#a0a0a0\">" +
                "<thead>" +
                "<tr><th onclick=\"expense_details(\'AE\');\">AE</th><th onclick=\"expense_details(\'DSCVR\');\">DSCVR</th><th onclick=\"expense_details(\'CHASEVISA\');\">VISA</th></tr>" +
                "</thead>" +
                "<tbody style=\"text-align:center;\">" +
                "<tr><td onclick=\"expense_details(\'AE\');\">$" + expense.AE + "</td><td onclick=\"expense_details(\'DSCVR\');\">$" + expense.DSCVR + "</td><td onclick=\"expense_details(\'CHASEVISA\');\">$" + expense.CHASEVISA + "</td></tr>" +
                "</tbody>" +
                "</table>"
            );
        }, error: function (xhr, status, error) {
            console.log(error);
        }
    });
};
var expense_details = function (payment_type) {
    //$.ajax({
    //    url: '/Home/Details',
    //    method: "POST",
    //    dataType: 'html',
    //    data: { payment_type: payment_type },
    //    cache: false,
    //    async: true,
    //    success: function (data) {
            
    //    }, error: function (xhr, status, error) {
    //        console.log(error);
    //    }
    //});
    //$.post("/Home/Details", "payment_type="+payment_type, function (data) {

    //})
    //var form = document.createElement("form");
    //form.method = 'post';
    //form.action = '/Home/Details';
    //var input = document.createElement('input');
    //input.type = "text";
    //input.name = "payment_type";
    //input.id = "payment_type";
    //input.value = payment_type;
    //form.appendChild(input);
    //form.submit();
    $(location).attr('href', '/Home/Details?payment_type='+payment_type)
};

var getReceiptPic = function (e) {
    var file = document.getElementById('file_upload').files[0];
    //alert("here");
    setReceiptPic(file);
};

var setReceiptPic = function (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    var content = "";
    reader.onload = function () {
        $("#Receipt_PIC").val(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
};

var submit_insert_expense = function () {
    //check that amount is not empty
    var amt = $("#Amount").val();
    var entry_date = $("#EntryDate").val();
    if (amt.length === 0 || entry_date.length === 0) {
        alert("Some Fields Cannot be Empty");
    }
    else {
        var form_data = $("#insert_expense_form").serialize();
        $.post("/Home/InsertExpense", form_data, function (data) {
            if (data) {
                clearForm();
                getSpendings();
            }
            else {
                alert("Something wrong in the server;")
            }
        });
    }
};

var clearForm = function () {
    //clear the amount field
    $("#Amount").val("");
    //clear the Notes field
    $("#Notes").val("");
    //clear the Receipt_PIC value
    $("#Receipt_PIC").val("");
    //clear the file upload
    $("#file_upload").val("");
}