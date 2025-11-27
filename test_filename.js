const genre = "靈魂樂 (Soul Music)";
const match = genre.match(/\(([^)]+)\)/);
if (match && match[1]) {
    let rawName = match[1].toLowerCase();

    // 1. 特殊字元替換
    rawName = rawName.replace(/&/g, 'n');
    rawName = rawName.replace(/\+/g, 'plus');

    // 2. 分隔符號處理 (斜線、連字號、空格 -> 底線)
    rawName = rawName.replace(/[\/\-\s]+/g, '_');

    // 3. 清理雜訊 (移除所有非英文字母、數字和底線)
    rawName = rawName.replace(/[^a-z0-9_]/g, '');

    // 4. 合併連續底線並去除頭尾底線
    const filename = rawName.replace(/_+/g, '_').replace(/^_|_$/g, '');

    console.log(`Genre: ${genre}`);
    console.log(`Match: ${match[1]}`);
    console.log(`Filename: ${filename}`);
} else {
    console.log("No match found");
}
