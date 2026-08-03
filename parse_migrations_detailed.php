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
                    // Update field if exists, else append
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

$output = "";
$counter = 1;
foreach ($tables as $name => $info) {
    $pk = $info['pk'];
    $fks = array_unique($info['fks']);
    $fkString = count($fks) > 0 ? implode(', ', $fks) : '-';
    
    // Capitalize properly
    $titleWords = explode('_', $name);
    $titleWords = array_map('ucfirst', $titleWords);
    $titleName = implode(' ', $titleWords);
    
    $output .= "$counter. Tabel $titleName\n";
    $output .= "   Nama Tabel : $name\n";
    $output .= "   Primary Key : $pk\n";
    $output .= "   Foreign key : $fkString\n\n";
    
    $output .= "   Tabel 3.$counter Spesifikasi Tabel $titleName\n";
    $output .= "   | No | Nama Field | Tipe Data | Keterangan |\n";
    $output .= "   |---|---|---|---|\n";
    
    $fieldCounter = 1;
    // ensure uniqueness of fields just in case
    $seenFields = [];
    foreach ($info['fields'] as $f) {
        if (in_array($f['name'], $seenFields)) continue;
        $seenFields[] = $f['name'];
        $output .= "   | $fieldCounter | {$f['name']} | {$f['type']} | {$f['keterangan']} |\n";
        $fieldCounter++;
    }
    
    $output .= "\n";
    $counter++;
}

file_put_contents('spesifikasibasisdata.txt', $output);
echo "Saved.";
