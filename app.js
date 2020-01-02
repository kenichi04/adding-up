'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

// rl.on('line', (lineString) => {
    // 一行を出力
//     console.log(lineString);
// });

// イベント「line」検知時に、無形関数{}内を実行
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
// 全ての行を読み込み終わった際に'close'イベントが呼び出される
// => 'close'イベント時に以下の無名関数が処理される
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    // 連想配列を普通の配列に変換（Array.from(~)）
    // sort関数を呼び出し、引数に無名関数を渡す
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    })
    console.log(rankingStrings);
});