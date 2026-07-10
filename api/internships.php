<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM internships WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $internship = $stmt->fetch();
            if ($internship) {
                $internship['skills'] = json_decode($internship['skills'], true) ?: [];
                sendResponse(200, $internship);
            } else {
                sendResponse(404, ["error" => "Internship not found"]);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM internships ORDER BY createdAt DESC");
            $internships = $stmt->fetchAll();
            foreach ($internships as &$internship) {
                $internship['skills'] = json_decode($internship['skills'], true) ?: [];
            }
            sendResponse(200, $internships);
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $id = uniqid('internship_');
        $stmt = $pdo->prepare("INSERT INTO internships (id, role, company, logo, logoColor, location, mode, duration, stipend, skills, openings, postedDays, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $data['role'] ?? '',
            $data['company'] ?? '',
            $data['logo'] ?? null,
            $data['logoColor'] ?? '#6366f1',
            $data['location'] ?? 'Remote',
            $data['mode'] ?? 'Remote',
            $data['duration'] ?? '3 months',
            $data['stipend'] ?? 'TBD',
            json_encode($data['skills'] ?? []),
            $data['openings'] ?? 1,
            $data['postedDays'] ?? 0,
            $data['status'] ?? 'Pending'
        ]);
        sendResponse(201, ["id" => $id]);
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $data = getJsonInput();
            $id = $_GET['id'];
            
            $updates = [];
            $params = [];
            
            $allowedFields = ['role', 'company', 'logo', 'logoColor', 'location', 'mode', 'duration', 'stipend', 'skills', 'openings', 'postedDays', 'status'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updates[] = "$field = ?";
                    $params[] = $field === 'skills' ? json_encode($data[$field]) : $data[$field];
                }
            }
            
            if (empty($updates)) {
                sendResponse(400, ["error" => "No fields to update"]);
            }
            
            $params[] = $id;
            $sql = "UPDATE internships SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            sendResponse(200, ["success" => true]);
        } else {
            sendResponse(400, ["error" => "ID is required"]);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            // Also delete associated applications as done in internships.ts
            $stmt = $pdo->prepare("DELETE FROM applications WHERE internshipId = ?");
            $stmt->execute([$id]);

            $stmt = $pdo->prepare("DELETE FROM internships WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(200, ["success" => true]);
        } else {
            sendResponse(400, ["error" => "ID is required"]);
        }
        break;

    default:
        sendResponse(405, ["error" => "Method not allowed"]);
        break;
}
?>
