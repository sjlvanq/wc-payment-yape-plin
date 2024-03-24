<?php

// IMPROVE THIS FILE

require_once('../../../../wp-load.php');

// Verifica si el usuario está autenticado
if ( ! is_user_logged_in() ) {
    $response = array(
        'success' => false,
        'message' => 'Has perdido las credenciales de autenticación. Accede para continuar.',
    );
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Verifica si se ha enviado un archivo
if (isset($_FILES['file'])) {
    $upload_dir = wp_upload_dir(); 
    $target_dir = $upload_dir['basedir'] . '/comprobantes/';
    $target_url = $upload_dir['baseurl'] . '/comprobantes/';
    $target_file = $target_dir . time() . '_' . basename($_FILES['file']['name']); 
    
    if (!file_exists($target_dir)) {
        if (!mkdir($target_dir, 0755, true)) {
            $response = array(
                'success' => false,
                'message' => 'No se pudo crear el directorio de destino.',
            );
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        }
    }

    if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
        $response = array(
            'success' => true,
            'imageUrl' => $target_url . basename($target_file), // URL de la imagen subida
        );
    } else {
        $response = array(
            'success' => false,
            'message' => 'Error al subir el archivo. Por favor, inténtalo de nuevo.',
        );
    }
} else {
    $response = array(
        'success' => false,
        'message' => 'No se ha recibido ningún archivo para subir.',
    );
}

header('Content-Type: application/json');
echo json_encode($response);
