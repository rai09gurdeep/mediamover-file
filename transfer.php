<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form data
    $sourcePath = $_POST["source"];
    $destinationPath = $_POST["destination"];
    $filenames = $_POST["filenames"];

    // Split filenames into an array
    $filenamesArray = explode(',', $filenames);

    // Initialize response array
    $response = array();

    // Loop through each filename and perform the file transfer
    foreach ($filenamesArray as $filename) {
        // Construct full paths
        $sourceFile = $sourcePath . '/' . $filename;
        $destinationFile = $destinationPath . '/' . $filename;

        // Perform the file transfer
        if (file_exists($sourceFile)) {
            if (copy($sourceFile, $destinationFile))
		  {
                $response[] = array('file' => $filename, 'status' => 'Copy Successful');
            } else {
                $response[] = array('file' => $filename, 'status' => 'Copy Failed');
            }
        } else {
            $response[] = array('file' => $filename, 'status' => 'Source File Not Found');
        }
    }

    // Send JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
