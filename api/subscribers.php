<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM subscribers ORDER BY subscribedAt DESC");
        $subscribers = $stmt->fetchAll();
        sendResponse(200, $subscribers);
        break;

    case 'POST':
        // Not used explicitly in the subscribers.ts frontend hook, but good for completeness if they add one
        $data = getJsonInput();
        if (isset($data['email'])) {
            $stmt = $pdo->prepare("INSERT OR IGNORE INTO subscribers (email, status) VALUES (?, ?)");
            $stmt->execute([$data['email'], $data['status'] ?? 'active']);
            sendResponse(201, ["email" => $data['email']]);
        } else {
            sendResponse(400, ["error" => "Email is required"]);
        }
        break;

    case 'DELETE':
        if (isset($_GET['email'])) {
            $stmt = $pdo->prepare("DELETE FROM subscribers WHERE email = ?");
            $stmt->execute([$_GET['email']]);
            sendResponse(200, ["success" => true]);
        } else {
            sendResponse(400, ["error" => "Email is required"]);
        }
        break;

    default:
        sendResponse(405, ["error" => "Method not allowed"]);
        break;
}
?>
