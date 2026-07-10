<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM courses WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $course = $stmt->fetch();
            if ($course) {
                $course['outcomes'] = json_decode($course['outcomes'], true) ?: [];
                $course['instructor'] = json_decode($course['instructor'], true) ?: [];
                sendResponse(200, $course);
            } else {
                sendResponse(404, ["error" => "Course not found"]);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM courses ORDER BY createdAt DESC");
            $courses = $stmt->fetchAll();
            foreach ($courses as &$course) {
                $course['outcomes'] = json_decode($course['outcomes'], true) ?: [];
                $course['instructor'] = json_decode($course['instructor'], true) ?: [];
                // Format certificate back to boolean since db stores tinyint usually
                $course['certificate'] = (bool)$course['certificate'];
            }
            sendResponse(200, $courses);
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $id = uniqid('course_');
        $stmt = $pdo->prepare("INSERT INTO courses (id, slug, title, category, level, duration, lessons, rating, students, price, originalPrice, certificate, emoji, shortDescription, longDescription, outcomes, status, image, instructor, tone, youtubePlaylistUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $data['slug'] ?? $id,
            $data['title'] ?? '',
            $data['category'] ?? '',
            $data['level'] ?? 'Beginner',
            $data['duration'] ?? '',
            $data['lessons'] ?? 0,
            $data['rating'] ?? 5,
            $data['students'] ?? 0,
            $data['price'] ?? 0,
            $data['originalPrice'] ?? 0,
            (isset($data['certificate']) && $data['certificate']) ? 1 : 0,
            $data['emoji'] ?? '📚',
            $data['short'] ?? '',
            $data['long'] ?? '',
            json_encode($data['outcomes'] ?? []),
            $data['status'] ?? 'active',
            $data['image'] ?? '',
            json_encode($data['instructor'] ?? ["name" => "BharatSkillz Expert", "role" => "Instructor", "company" => "BharatSkillz"]),
            $data['tone'] ?? 'mint',
            $data['youtubePlaylistUrl'] ?? ''
        ]);
        sendResponse(201, ["id" => $id]);
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $data = getJsonInput();
            $id = $_GET['id'];
            
            $updates = [];
            $params = [];
            
            $allowedFields = ['slug', 'title', 'category', 'level', 'duration', 'lessons', 'rating', 'students', 'price', 'originalPrice', 'certificate', 'emoji', 'short' => 'shortDescription', 'long' => 'longDescription', 'outcomes', 'status', 'image', 'instructor', 'tone', 'youtubePlaylistUrl'];
            foreach ($allowedFields as $key => $field) {
                $reqField = is_string($key) ? $key : $field;
                $dbField = is_string($key) ? $field : $reqField;
                
                if (isset($data[$reqField])) {
                    $updates[] = "$dbField = ?";
                    if (in_array($reqField, ['outcomes', 'instructor'])) {
                        $params[] = json_encode($data[$reqField]);
                    } elseif ($reqField === 'certificate') {
                        $params[] = $data[$reqField] ? 1 : 0;
                    } else {
                        $params[] = $data[$reqField];
                    }
                }
            }
            
            if (empty($updates)) {
                sendResponse(400, ["error" => "No fields to update"]);
            }
            
            $params[] = $id;
            $sql = "UPDATE courses SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            sendResponse(200, ["success" => true]);
        } else {
            sendResponse(400, ["error" => "ID is required"]);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("DELETE FROM courses WHERE id = ?");
            $stmt->execute([$_GET['id']]);
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
