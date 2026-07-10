<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM blogs WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $blog = $stmt->fetch();
            if ($blog) {
                $blog['tags'] = json_decode($blog['tags'], true);
                sendResponse(200, $blog);
            } else {
                sendResponse(404, ["error" => "Blog not found"]);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM blogs ORDER BY createdAt DESC");
            $blogs = $stmt->fetchAll();
            foreach ($blogs as &$blog) {
                $blog['tags'] = json_decode($blog['tags'], true) ?: [];
            }
            sendResponse(200, $blogs);
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $id = uniqid('blog_');
        $stmt = $pdo->prepare("INSERT INTO blogs (id, title, slug, description, content, category, readTime, tags, image, authorName, authorImage, metaTitle, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $data['title'] ?? '',
            $data['slug'] ?? '',
            $data['description'] ?? '',
            $data['content'] ?? '',
            $data['category'] ?? 'General',
            $data['readTime'] ?? '5 min read',
            json_encode($data['tags'] ?? []),
            $data['image'] ?? '',
            $data['authorName'] ?? 'BharatSkillz Editor',
            $data['authorImage'] ?? 'https://ui-avatars.com/api/?name=Admin&background=random',
            $data['metaTitle'] ?? $data['title'] ?? '',
            $data['date'] ?? date('M j, Y')
        ]);
        sendResponse(201, ["id" => $id]);
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $data = getJsonInput();
            $id = $_GET['id'];
            
            $updates = [];
            $params = [];
            
            $allowedFields = ['title', 'slug', 'description', 'content', 'category', 'readTime', 'tags', 'image', 'authorName', 'authorImage', 'metaTitle', 'date'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updates[] = "$field = ?";
                    $params[] = $field === 'tags' ? json_encode($data[$field]) : $data[$field];
                }
            }
            
            if (empty($updates)) {
                sendResponse(400, ["error" => "No fields to update"]);
            }
            
            $params[] = $id;
            $sql = "UPDATE blogs SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            sendResponse(200, ["success" => true]);
        } else {
            sendResponse(400, ["error" => "ID is required"]);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
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
