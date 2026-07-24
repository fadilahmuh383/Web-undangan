<?php
header('Content-Type: application/json');
require 'koneksi.php';

// Get the raw POST data
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

if ($data) {
    $nama = $conn->real_escape_string($data['nama']);
    $kehadiran = $conn->real_escape_string($data['kehadiran']);
    $pax = isset($data['pax']) ? (int)$data['pax'] : 0;
    $ucapan = isset($data['ucapan']) ? $conn->real_escape_string($data['ucapan']) : '';

    $sql = "INSERT INTO rsvp (nama, kehadiran, jumlah_orang, ucapan) VALUES ('$nama', '$kehadiran', $pax, '$ucapan')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Data berhasil disimpan"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No data received"]);
}

$conn->close();
?>
