<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'users'; // 'users', 'enrollments', 'applications'

switch ($method) {
    case 'GET':
        if ($action === 'users') {
            if (isset($_GET['uid'])) {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE uid = ?");
                $stmt->execute([$_GET['uid']]);
                $user = $stmt->fetch();
                if ($user) {
                    $user['skills'] = json_decode($user['skills'], true) ?: [];
                    $user['social'] = json_decode($user['social'], true) ?: [];
                    sendResponse(200, $user);
                } else {
                    // Auto-create default user if not found in database but exists in Firebase Auth
                    $stmt = $pdo->prepare("INSERT INTO users (uid, name, email, phone, bio, skills, education, social, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([
                        $_GET['uid'],
                        'User', // Default name
                        '',     // Default email
                        '',
                        '',
                        json_encode([]),
                        '',
                        json_encode(['linkedin' => '', 'github' => '', 'twitter' => '']),
                        'student',
                        'Active'
                    ]);
                    
                    // Fetch and return the newly created user
                    $stmt = $pdo->prepare("SELECT * FROM users WHERE uid = ?");
                    $stmt->execute([$_GET['uid']]);
                    $newUser = $stmt->fetch();
                    $newUser['skills'] = [];
                    $newUser['social'] = ['linkedin' => '', 'github' => '', 'twitter' => ''];
                    sendResponse(200, $newUser);
                }
            } else {
                $stmt = $pdo->query("SELECT * FROM users ORDER BY createdAt DESC");
                $users = $stmt->fetchAll();
                foreach ($users as &$user) {
                    $user['skills'] = json_decode($user['skills'], true) ?: [];
                    $user['social'] = json_decode($user['social'], true) ?: [];
                }
                sendResponse(200, $users);
            }
        } elseif ($action === 'enrollments') {
            if (isset($_GET['uid'])) {
                $stmt = $pdo->prepare("SELECT * FROM enrollments WHERE userId = ? ORDER BY enrolledAt DESC");
                $stmt->execute([$_GET['uid']]);
                $enrollments = $stmt->fetchAll();
                foreach ($enrollments as &$enrollment) {
                    $enrollment['completedLessonIndices'] = json_decode($enrollment['completedLessonIndices'], true) ?: [];
                }
                sendResponse(200, $enrollments);
            } else {
                sendResponse(400, ["error" => "uid is required for enrollments"]);
            }
        } elseif ($action === 'applications') {
            if (isset($_GET['uid'])) {
                $stmt = $pdo->prepare("SELECT * FROM applications WHERE userId = ? ORDER BY appliedAt DESC");
                $stmt->execute([$_GET['uid']]);
                $applications = $stmt->fetchAll();
                sendResponse(200, $applications);
            } else {
                sendResponse(400, ["error" => "uid is required for applications"]);
            }
        }
        break;

    case 'POST':
        $data = getJsonInput();
        if ($action === 'users') {
            $stmt = $pdo->prepare("INSERT INTO users (uid, name, email, phone, bio, skills, education, social, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['uid'] ?? '',
                $data['name'] ?? '',
                $data['email'] ?? '',
                $data['phone'] ?? '',
                $data['bio'] ?? '',
                json_encode($data['skills'] ?? []),
                $data['education'] ?? '',
                json_encode($data['social'] ?? ['linkedin' => '', 'github' => '', 'twitter' => '']),
                $data['role'] ?? 'student',
                $data['status'] ?? 'Active'
            ]);
            sendResponse(201, ["success" => true]);
        } elseif ($action === 'enrollments') {
            $id = uniqid('enroll_');
            $stmt = $pdo->prepare("INSERT INTO enrollments (id, userId, slug, title, instructor, thumbnail, progress, nextLesson, totalLessons, completedLessons, completedLessonIndices) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $id,
                $data['userId'] ?? '',
                $data['slug'] ?? '',
                $data['title'] ?? '',
                $data['instructor'] ?? '',
                $data['thumbnail'] ?? '📚',
                $data['progress'] ?? 0,
                $data['nextLesson'] ?? '',
                $data['totalLessons'] ?? 0,
                $data['completedLessons'] ?? 0,
                json_encode($data['completedLessonIndices'] ?? [])
            ]);
            sendResponse(201, ["id" => $id]);
        } elseif ($action === 'applications') {
            $id = uniqid('app_');
            $stmt = $pdo->prepare("INSERT INTO applications (id, userId, internshipId, role, company, status, appliedOn, location, stipend) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $id,
                $data['userId'] ?? '',
                $data['internshipId'] ?? '',
                $data['role'] ?? '',
                $data['company'] ?? '',
                $data['status'] ?? 'Applied',
                $data['appliedOn'] ?? date('M j, Y'),
                $data['location'] ?? '',
                $data['stipend'] ?? ''
            ]);
            sendResponse(201, ["id" => $id]);
        }
        break;

    case 'PUT':
        if ($action === 'users' && isset($_GET['uid'])) {
            $data = getJsonInput();
            $uid = $_GET['uid'];
            
            $updates = [];
            $params = [];
            
            $allowedFields = ['name', 'phone', 'bio', 'skills', 'education', 'social', 'role', 'status'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updates[] = "$field = ?";
                    $params[] = in_array($field, ['skills', 'social']) ? json_encode($data[$field]) : $data[$field];
                }
            }
            
            if (!empty($updates)) {
                $params[] = $uid;
                $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE uid = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }
            
            sendResponse(200, ["success" => true]);
        } elseif ($action === 'enrollments' && isset($_GET['uid']) && isset($_GET['slug'])) {
            $data = getJsonInput();
            $uid = $_GET['uid'];
            $slug = $_GET['slug'];
            
            $updates = [];
            $params = [];
            
            $allowedFields = ['progress', 'nextLesson', 'totalLessons', 'completedLessons', 'completedLessonIndices'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updates[] = "$field = ?";
                    $params[] = $field === 'completedLessonIndices' ? json_encode($data[$field]) : $data[$field];
                }
            }
            
            if (!empty($updates)) {
                $params[] = $uid;
                $params[] = $slug;
                $sql = "UPDATE enrollments SET " . implode(', ', $updates) . " WHERE userId = ? AND slug = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }
            
            sendResponse(200, ["success" => true]);
        } else {
            sendResponse(400, ["error" => "Invalid action or missing parameters"]);
        }
        break;

    case 'DELETE':
        if ($action === 'users' && isset($_GET['uid'])) {
            $stmt = $pdo->prepare("DELETE FROM users WHERE uid = ?");
            $stmt->execute([$_GET['uid']]);
            sendResponse(200, ["success" => true]);
        } else {
            sendResponse(400, ["error" => "Invalid action or missing uid"]);
        }
        break;

    default:
        sendResponse(405, ["error" => "Method not allowed"]);
        break;
}
?>
