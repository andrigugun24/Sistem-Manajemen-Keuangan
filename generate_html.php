<?php
$dir = new DirectoryIterator('database/migrations');
$tables = [];

foreach ($dir as $fileinfo) {
    if (!$fileinfo->isDot() && $fileinfo->getExtension() === 'php') {
        $content = file_get_contents($fileinfo->getPathname());
        
        if (preg_match('/Schema::create\(\s*\'([^\']+)\',\s*function\s*\([^\)]+\)\s*\{(.+?)\}\);/s', $content, $matches)) {
            $tableName = $matches[1];
            $body = $matches[2];
            
            if (!isset($tables[$tableName])) {
                $tables[$tableName] = [
                    'pk' => '-',
                    'fks' => [],
                    'fields' => []
                ];
            }
            
            preg_match_all('/\$table->([a-zA-Z0-9_]+)\((.*?)\)(.*?);/', $body, $lines, PREG_SET_ORDER);
            
            foreach ($lines as $line) {
                $method = $line[1];
                $argsStr = trim($line[2]);
                $modifiers = $line[3];
                
                $args = [];
                if ($argsStr !== '') {
                    $args = array_map('trim', explode(',', $argsStr));
                    $args = array_map(function($a) { return trim($a, "'\""); }, $args);
                }
                
                $fieldName = isset($args[0]) ? $args[0] : '';
                $type = $method;
                $keterangan = 'Not Null';
                
                if (strpos($modifiers, 'nullable()') !== false) {
                    $keterangan = 'Null';
                }
                
                if ($method === 'id' || $method === 'bigIncrements' || $method === 'increments') {
                    $fieldName = $fieldName ?: 'id';
                    $type = 'bigint(20) unsigned';
                    $keterangan = 'Primary Key';
                    $tables[$tableName]['pk'] = $fieldName;
                } elseif ($method === 'uuid' && strpos($modifiers, 'primary()') !== false) {
                    $type = 'char(36)';
                    $keterangan = 'Primary Key';
                    $tables[$tableName]['pk'] = $fieldName;
                } elseif ($method === 'string' && strpos($modifiers, 'primary()') !== false) {
                    $type = 'varchar(255)';
                    $keterangan = 'Primary Key';
                    $tables[$tableName]['pk'] = $fieldName;
                } elseif ($method === 'timestamps') {
                    $tables[$tableName]['fields'][] = ['name' => 'created_at', 'type' => 'timestamp', 'keterangan' => 'Null'];
                    $tables[$tableName]['fields'][] = ['name' => 'updated_at', 'type' => 'timestamp', 'keterangan' => 'Null'];
                    continue;
                } elseif ($method === 'softDeletes') {
                    $tables[$tableName]['fields'][] = ['name' => 'deleted_at', 'type' => 'timestamp', 'keterangan' => 'Null'];
                    continue;
                } elseif ($method === 'rememberToken') {
                    $tables[$tableName]['fields'][] = ['name' => 'remember_token', 'type' => 'varchar(100)', 'keterangan' => 'Null'];
                    continue;
                } elseif ($method === 'foreignId') {
                    $type = 'bigint(20) unsigned';
                    $keterangan = 'Foreign Key';
                    if (preg_match('/constrained\(\s*\'([^\']+)\'/', $modifiers, $constMatch)) {
                        $tables[$tableName]['fks'][] = $fieldName;
                    } elseif (strpos($modifiers, 'constrained()') !== false) {
                        $tables[$tableName]['fks'][] = $fieldName;
                    }
                } elseif ($method === 'foreign') {
                    if (preg_match('/references\(\s*\'([^\']+)\'\s*\)->on\(\s*\'([^\']+)\'\s*\)/', $modifiers, $fMatch)) {
                        $tables[$tableName]['fks'][] = $fieldName;
                        foreach ($tables[$tableName]['fields'] as &$f) {
                            if ($f['name'] === $fieldName) {
                                $f['keterangan'] = 'Foreign Key';
                            }
                        }
                    }
                    continue;
                }
                
                $sqlType = $type;
                if ($type === 'string') $sqlType = 'varchar(255)';
                if ($type === 'text' || $type === 'longText') $sqlType = 'text';
                if ($type === 'integer') $sqlType = 'int(11)';
                if ($type === 'bigInteger' || $type === 'unsignedBigInteger') $sqlType = 'bigint(20)';
                if ($type === 'boolean') $sqlType = 'tinyint(1)';
                if ($type === 'date') $sqlType = 'date';
                if ($type === 'datetime') $sqlType = 'datetime';
                if ($type === 'enum') {
                    $sqlType = 'enum(...)';
                    if (preg_match('/\[(.*?)\]/', $argsStr, $enumMatches)) {
                        $sqlType = 'enum(' . $enumMatches[1] . ')';
                    }
                }
                if ($type === 'decimal') {
                    $sqlType = 'decimal(8,2)';
                }
                
                if ($fieldName) {
                    $tables[$tableName]['fields'][] = [
                        'name' => $fieldName,
                        'type' => $sqlType,
                        'keterangan' => $keterangan
                    ];
                }
            }
        } elseif (preg_match('/Schema::table\(\s*\'([^\']+)\',\s*function\s*\([^\)]+\)\s*\{(.+?)\}\);/s', $content, $matches)) {
            $tableName = $matches[1];
            if (!isset($tables[$tableName])) continue;
            
            $body = $matches[2];
            preg_match_all('/\$table->([a-zA-Z0-9_]+)\((.*?)\)(.*?);/', $body, $lines, PREG_SET_ORDER);
            
            foreach ($lines as $line) {
                $method = $line[1];
                $argsStr = trim($line[2]);
                $modifiers = $line[3];
                
                if ($method === 'dropColumn' || $method === 'dropForeign') continue;
                
                $args = [];
                if ($argsStr !== '') {
                    $args = array_map('trim', explode(',', $argsStr));
                    $args = array_map(function($a) { return trim($a, "'\""); }, $args);
                }
                
                if ($method === 'foreign') {
                    $fieldName = isset($args[0]) ? $args[0] : '';
                    if (preg_match('/references\(\s*\'([^\']+)\'\s*\)->on\(\s*\'([^\']+)\'\s*\)/', $modifiers, $fMatch)) {
                        $tables[$tableName]['fks'][] = $fieldName;
                        foreach ($tables[$tableName]['fields'] as &$f) {
                            if ($f['name'] === $fieldName) {
                                $f['keterangan'] = 'Foreign Key';
                            }
                        }
                    }
                    continue;
                }
                
                if ($method === 'softDeletes') {
                    $tables[$tableName]['fields'][] = ['name' => 'deleted_at', 'type' => 'timestamp', 'keterangan' => 'Null'];
                    continue;
                }
                
                $fieldName = isset($args[0]) ? $args[0] : '';
                $keterangan = 'Not Null';
                if (strpos($modifiers, 'nullable()') !== false) {
                    $keterangan = 'Null';
                }
                
                $sqlType = $method;
                if ($method === 'string') $sqlType = 'varchar(255)';
                if ($method === 'text') $sqlType = 'text';
                if ($method === 'integer') $sqlType = 'int(11)';
                if ($method === 'enum') {
                    $sqlType = 'enum(...)';
                    if (preg_match('/\[(.*?)\]/', $argsStr, $enumMatches)) {
                        $sqlType = 'enum(' . $enumMatches[1] . ')';
                    }
                }
                
                if ($fieldName && $method !== 'foreignId' && $method !== 'unsignedBigInteger') {
                    $found = false;
                    foreach ($tables[$tableName]['fields'] as &$f) {
                        if ($f['name'] === $fieldName) {
                            $f['type'] = $sqlType;
                            $f['keterangan'] = $keterangan;
                            $found = true;
                            break;
                        }
                    }
                    if (!$found) {
                        $tables[$tableName]['fields'][] = [
                            'name' => $fieldName,
                            'type' => $sqlType,
                            'keterangan' => $keterangan
                        ];
                    }
                } elseif ($fieldName && ($method === 'foreignId' || $method === 'unsignedBigInteger')) {
                    $type = 'bigint(20) unsigned';
                    if ($method === 'foreignId') {
                       $keterangan = 'Foreign Key';
                       $tables[$tableName]['fks'][] = $fieldName;
                    }
                    $tables[$tableName]['fields'][] = [
                        'name' => $fieldName,
                        'type' => $type,
                        'keterangan' => $keterangan
                    ];
                }
            }
        }
    }
}

$output = '<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Spesifikasi Basis Data</title>
<style>
    body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.5; padding: 20px; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 30px; margin-top: 10px; }
    th, td { border: 1px solid black; padding: 5px 10px; text-align: left; }
    th { background-color: #f2f2f2; text-align: center; font-weight: bold; }
    .table-caption { text-align: center; margin-bottom: 5px; font-weight: normal; }
    .table-info { margin-bottom: 5px; }
    .table-info div { display: flex; }
    .table-info div span:first-child { width: 120px; }
    ol { padding-left: 20px; }
</style>
</head>
<body>
<ol>
';

$counter = 1;
foreach ($tables as $name => $info) {
    $pk = $info['pk'];
    $fks = array_unique($info['fks']);
    $fkString = count($fks) > 0 ? implode(', ', $fks) : '-';
    
    $titleWords = explode('_', $name);
    $titleWords = array_map('ucfirst', $titleWords);
    $titleName = implode(' ', $titleWords);
    
    $output .= "<li>Tabel $titleName\n";
    $output .= "<div class=\"table-info\">\n";
    $output .= "<div><span>Nama Tabel</span><span>: $name</span></div>\n";
    $output .= "<div><span>Primary Key</span><span>: $pk</span></div>\n";
    $output .= "<div><span>Foreign Key</span><span>: $fkString</span></div>\n";
    $output .= "</div>\n";
    
    $output .= "<div class=\"table-caption\">Tabel 3.$counter Spesifikasi Tabel $titleName</div>\n";
    $output .= "<table>\n";
    $output .= "<thead><tr><th style=\"width: 50px;\">No</th><th>Nama Field</th><th>Tipe Data</th><th>Keterangan</th></tr></thead>\n";
    $output .= "<tbody>\n";
    
    $fieldCounter = 1;
    $seenFields = [];
    foreach ($info['fields'] as $f) {
        if (in_array($f['name'], $seenFields)) continue;
        $seenFields[] = $f['name'];
        $output .= "<tr><td style=\"text-align: center;\">$fieldCounter</td><td>{$f['name']}</td><td>{$f['type']}</td><td>{$f['keterangan']}</td></tr>\n";
        $fieldCounter++;
    }
    
    $output .= "</tbody>\n</table>\n</li>\n";
    $counter++;
}

$output .= "</ol>\n</body>\n</html>";

file_put_contents('spesifikasibasisdata.html', $output);
echo "Saved to HTML.";
