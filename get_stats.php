<?php
header('Content-Type: application/json');
require 'koneksi.php';

$hadir = 0;
$tidak_hadir = 0;
$ucapan_list = [];

// Get counts
$result_hadir = $conn->query("SELECT SUM(jumlah_orang) as total_hadir FROM rsvp WHERE kehadiran = 'Hadir'");
if ($row = $result_hadir->fetch_assoc()) {
    $hadir = $row['total_hadir'] ? (int)$row['total_hadir'] : 0;
}

$result_tidak = $conn->query("SELECT COUNT(*) as total_tidak FROM rsvp WHERE kehadiran = 'Tidak Hadir'");
if ($row = $result_tidak->fetch_assoc()) {
    $tidak_hadir = (int)$row['total_tidak'];
}

// Get list of ucapan
$result_ucapan = $conn->query("SELECT nama, kehadiran, jumlah_orang, ucapan, reg_date FROM rsvp ORDER BY id DESC");
if ($result_ucapan && $result_ucapan->num_rows > 0) {
    while($row = $result_ucapan->fetch_assoc()) {
        $ucapan_list[] = $row;
    }
}

echo json_encode([
    "hadir" => $hadir,
    "tidak_hadir" => $tidak_hadir,
    "ucapan" => $ucapan_list
]);

$conn->close();
?>
