
var dataTable;

$(document).ready(function () {
    loadDataTable();
})

function loadDataTable() {
    dataTable = $('#UsersTable').DataTable({
        //colReorder: true,
        'sDom': 'Rlfrtip',
        select: {
            style: 'multi'
        },
        "scrollY": 200,
        "scrollX": true,
        "ajax": {
            "url": "/Users/getall",
            "type": "GET",
            "datatype": "json",
        },
        "columns": [
            { "data": "name", "width":"20%" },
            { "data": "email", "width":"20%" },
            { "data": "password", "width": "20%" },
            {
                "data": "id",
                "render": function (data) {
                    return `<div class="text-center">
                            <a onclick=Delete('/Users/Delete?id=${data}') class="btn btn-danger text-white" style="width:30%">Delete</a>
                            <a href="/Users/Upsert?id=${data}" class="btn btn-success text-white" style="width:30%">Edit</a>
                        </div>`
                },
                "width":"40%"
            }
        ],
        "language": {
            "emptyTable": "No data found"
        },
        "width": "100%",

    })

    //$('#toggleCol').multipleSelect('select_all');
    //new $.fn.dataTable.ColReorder(dataTable);
    $('#toggleCol').multipleSelect({
        selectAll: true,
        onClick: function (view) {
            var items = $('#toggleCol').val();
            //hideAllColumns();
            alert(items)
            for (var i = 0; i < items.legth; i++) {
                //var s = items[i];
                //alert(s);
                dataTable.column(item[i]).visible(1);
            }
        },
        onCheckAll: function () {
            showAllColumns()
        },
        onUncheckAll: function () {
            hideAllColumns()
        }
    })
}

function hideAllColumns() {
    for (var i = 0; i < 3; i++) {
        columns = dataTable.column(i).visible(0);
    }
}
function showAllColumns() {
    for (var i = 0; i < 3; i++) {
        columns = dataTable.column(i).visible(1);
    }
}


function Delete(url) {
    swal({
        "title": "Are you sure?",
        "text": "Once delete, you will not be able to recover",
        "icon": "warning",
        buttons: true,
        dangermode: true
    }).then((willdelete) => {
        if (willdelete) {
            $.ajax({
                "type": "DELETE",
                url: url,
                success: function (data) {
                    if (data.success) {
                        swal(data.message, {
                            icon: "success",
                        });
                        dataTable.ajax.reload();
                    }
                    else {
                        swal(data.message);
                    }
                }
            })
            
            //$.ajax({
            //    "type": "DELETE",
            //    url: url,
            //    success: function (data) {
            //        if (data.success) {
            //            toastr.success(data.message);
            //            dataTable.ajax.reload();
            //        }
            //        else {
            //            toastr.error(data.message);
            //        }
            //    }
            //})
        }
    })
}