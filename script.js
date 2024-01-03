$(document).ready(function () {
    $("#transferForm").submit(function (event) {
        event.preventDefault();
        $("#loading").show();

        var source = $("#source").val();
        var destination = $("#destination").val();
        var rawFilenames = $("#filename").val();

        // Add .mxf extension to all filenames
        var filenames = rawFilenames.split(",").map(function (filename) {
            return filename.trim() + ".mxf";
        });

        // AJAX request to handle file transfer
        $.ajax({
            type: "POST",
            url: "transfer.php",
            data: {
                source: source,
                destination: destination,
                filenames: filenames.join(',')
            },
            dataType: "json",
            success: function (response) {
                // Handle the response from the server
                $("#loading").hide();

                // Update the table with file copy progress
                updateTable(response);

                // Redirect to the homepage after successful transfer (you may customize this part)
                // window.location.href = "/homepage";
            },
            error: function () {
                $("#loading").hide();
                alert("Error occurred during file transfer.");
            },
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (e) {
                    if (e.lengthComputable) {
                        var percent = Math.round((e.loaded / e.total) * 100);
                        $("#copy-progress").text(percent + "%");
                    }
                }, false);

                // Add an event listener to handle progress updates
                xhr.addEventListener("load", function () {
                    var progressData = JSON.parse(xhr.responseText);

                    // Update current file and transfer rate
                    $("#current-file").text(progressData.file);
                    $("#transfer-rate").text(progressData.transferRate + " KB/second");

                    // Update the table with file copy progress
                    updateTable([{
                        file: progressData.file,
                        status: "Copying"
                    }]);
                });

                return xhr;
            }
        });
    });

    function updateTable(progressArray) {
        var copyTableBody = $("#copy-table tbody");

        $.each(progressArray, function (index, progressData) {
            var row = "<tr><td>" + progressData.file + "</td><td>" + progressData.status + "</td></tr>";
            copyTableBody.append(row);
        });
    }
});
