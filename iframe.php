<?php
$phone = isset($_GET['phone']) ? htmlspecialchars($_GET['phone']) : 'Número não recebido';
echo "Recebi como parâmetro o telefone: " . $phone;
?>
