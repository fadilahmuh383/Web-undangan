<?php
$servername = "localhost";
$username = "root";
$password = "";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS undangan_db";
if ($conn->query($sql) === TRUE) {
  echo "Database created successfully\n";
} else {
  echo "Error creating database: " . $conn->error . "\n";
}

$conn->select_db("undangan_db");

// Create table
$sql = "CREATE TABLE IF NOT EXISTS rsvp (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
nama VARCHAR(255) NOT NULL,
kehadiran VARCHAR(50) NOT NULL,
jumlah_orang INT(2),
ucapan TEXT,
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
  echo "Table rsvp created successfully\n";
} else {
  echo "Error creating table: " . $conn->error . "\n";
}

$conn->close();
?>
