
let examples = [
    ["Bursts","rotation=90&pattern=6%7C6%7C_1211_112111222000110200110011_1001_&mask=5%7C5%7C0000000100011100010000000&pal0=%23fce94f&pal1=%23d9138a&pal2=%2312a4d9&pal3=%23000000&pal4=%23ffffff"],
    
    ["Curls","rotation=90&pattern=6%7C6%7C100102111100001210020111210000221210&mask=5%7C5%7C0000000100011100010000000&pal0=%23eeffff&pal1=%23204a87&pal2=%2373d216&pal3=%23000000&pal4=%23ffffff"],

    //["Loops","rotation=90&width=20&height=40&effort=1000&scale=10&pattern=10%7C10%7C_______________________1211_____112111____222111____111000____111011_____1101_______________________&mask=5%7C5%7C0000000100011100010000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["Triangles","rotation=&pattern=4%7C3%7C_00_02020022&mask=5%7C5%7C0000000100011000000000000&pal0=%23fce94f&pal1=%23d9138a&pal2=%2312a4d9&pal3=%23000000&pal4=%23ffffff"],
    
    ["Dissolve","rotation=&pattern=6%7C4%7C334334444333_4443___33__&mask=5%7C5%7C0000001110001000000000000&pal0=%23fce94f&pal1=%23d9138a&pal2=%2312a4d9&pal3=%23000000&pal4=%23ffffff"],
    
    ["Lines","rotation=&pattern=4%7C4%7C2001110221002210&mask=5%7C5%7C0000000100011000000000000&pal0=%23fde4e3&pal1=%23f282b4&pal2=%23ef415e&pal3=%23000000&pal4=%23ffffff"],
    
    //["Blocks","rotation=90&width=20&height=40&effort=1000&scale=10&pattern=10%7C10%7C___________121000____211022____211022____210002____210201____200110_________________________________&mask=5%7C5%7C0000000100011100010000000&pal0=%23eeffff&pal1=%23204a87&pal2=%2373d216"],
    
    ["Maze", "rotation=180&pattern=4%7C4%7C2211101212221121&mask=5%7C5%7C0000001100011000000000000&pal0=%23eeffff&pal1=%23204a87&pal2=%2373d216&pal3=%23000000&pal4=%23ffffff"],
    
    ["Clouds", "rotation=&pattern=5%7C5%7C4422422242442224244424444&mask=5%7C5%7C0000000100011100000000000&pal0=%23fce94f&pal1=%23d9138a&pal2=%2312a4d9&pal3=%23000000&pal4=%23ffffff"],
    
    
    ["Big purple", "rotation=&pattern=7%7C9%7C____0_____12____22_1__20_01_02_00_0__12_01_20_22____11____11___&mask=5%7C5%7C0000000100011000000000000&pal0=%23fce94f&pal1=%23d9138a&pal2=%2312a4d9&pal3=%23000000&pal4=%23ffffff"],
    
    ["Hex", "rotation=90&pattern=10|10|1111101111111110111111111011111111101111000000111111111121111111111211111111112111111111121111111111&mask=5|5|0000001110011100111000000&pal0=%234197eb&pal1=%23eb4197&pal2=%2397eb41&pal3=%23000000&pal4=%23ffffff"],
    
    //["Hash", "rotation=90&pattern=13%7C9%7C_2_2_0_1_1_2_0212221121102_1_2_0_2_0_2_0201202120112_2_1_0_1_0_2_0100022212022_2_0_1_1_1_0_0022200112212_0_0_1_1_0_2_&mask=5%7C5%7C0000000100011100010000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9&pal3=%23000000&pal4=%23ffffff"],
    
    ["Hash", "rotation=90&pattern=13%7C11%7C_0_0_2_1_1_2_2110110020022_0_0_1_0_0_0_1220012012222_2_0_1_0_2_0_1020201211212_2_0_2_0_2_0_1122212102122_0_1_0_1_1_1_2120222022021_0_1_2_1_0_1_&mask=5%7C5%7C0000000100011100010000000&pal0=%23fce94f&pal1=%23d9138a&pal2=%2312a4d9&pal3=%23000000&pal4=%23ffffff"],
    
    //["Multiverse clouds", "rotation=&width=20&height=40&effort=10000&scale=10&pattern=10%7C10%7C________________________________________22222222__22202222__22000222__20000022__21100122__22222222__&mask=5%7C5%7C0000001100011000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    //["Multiverse triangles", "rotation=&width=40&height=40&effort=1000&scale=10&pattern=20%7C10%7C02222222122222222222200110022000100002222001002220011000222220010222200110022222211122222111002222222002022221000222222220222222210022222222222222222002222222222222222220222222222222222222222222222222&mask=5%7C5%7C0000001100011000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["Multiverse", "rotation=&pattern=10%7C10%7C0222222222201001100221100100222000110202211111222221000202222000222222200222222220222222222222222222&mask=5%7C5%7C0000001100011000000000000&pal0=%23fce94f&pal1=%23d9138a&pal2=%2312a4d9&pal3=%23000000&pal4=%23ffffff"],
    
    ["One loop", "rotation=90&pattern=9%7C11%7C222222222222222222222222222222201222222201222222201222000001222111110222222210222222210222222210222&mask=5%7C5%7C0111001110011100111000000&pal0=%23ee9711&pal1=%238f29d6&pal2=%2329d68f&pal3=%23000000&pal4=%23ffffff"],
    
    ["Groid", "rotation=90&pattern=8%7C8%7C002022200202220220_02_20000200022222200020_02_222220002002220020&mask=5%7C5%7C0000001110011100000000000&pal0=%23fce94f&pal1=%23d9138a&pal2=%2312a4d9&pal3=%23000000&pal4=%23ffffff"],
];


let ghost_diagrams_raw = [
    "' a A a', '    A '",
    "'CcCc  '",
    "'  33Aa', ' 33 Aa'",
    "'ab A  ', 'B  C  ', 'B  c  ', 'B  D  ', 'B  d  '",
    "'d D 4 ', 'd  D  ', '44    '",
    "'a  A 4', 'aA    ', '4     ', '4 4   '",
    "'a  A 4', 'aA    ', '4     '",
    "'3-3-2-', '3--2--', '1-----'",
    "'   bB ', 'bAaB  ', 'aAaA  '",    
    "'B Aa  ', 'b  Aa '",
    "'44    ', '11  4 '",
    "' a  4 ', ' 4 4  ', '  A441'",
    "'1 1 1 ', '2  12 '",
    "' AAaa ', 'a  A  '",
    "' a A  ', 'Aaa  A'",
    "'a  a  ', ' aAA A'",
    "'  AA A', 'a a a '",
    "'a  aa ', '    AA'",
    "'A A a ', 'a a   '",
    "'A A a ', 'a  a  '",
    "' a   4', 'a4 44A', '4A    '",
    "'a 2a2 ', ' A   A', '     2'",
    "'141   ', '4  4  ', '1 1   '",
    "' Aaa  ', 'A1A   ', 'a 1AAa'",
    "'  bB1 ', ' b  B '",
    "'BbB 1 ', '     b'",
    "'b  b b', '  BbB '",
    "'aA1   ', '   AA ', 'a  2  '",
    "'212111', ' 1 2  '",
    "'22222a', '22 A22'",
    "'2 222 ', '2   B2', '  b  2'",
    "' a a a', '   A A'",
    "' Dd cA', '   d D', '   a C'",
    "'  CCCc', ' 3Ca A', '  3  c', '     c'",
    "' C dDc', '  CC C', '   ccC'",
    "' Aa Cc', '     c', '     C'",
    "' CcDdC', '  cC c', '     C'",
    "'A 1 1 ','a1   B','b  1  '",
    "' 44B4D', ' dbB4b', ' 44D d', '    44'",
    "'  d3 3', '   D D'",
    "'  cc c', ' C C c'",
    "'AaAaaa', '  1 Aa', '     A'",
    "'d D 3 ', 'dD    ', '3     '",
    "'a 1 A ', 'a  A  '",
    "'cCCcCC', 'cccC  ', 'c C  C'",
    "'A44444', 'a4   4', '4 4   '",
    "'acaACA', 'acbBCB', 'bcaBCB', 'bcbACA'",
    "'A  ab ', 'B ab  ', 'A  a  ', 'B  b  ', 'ABd  D'",
    "'bBbBBB', 'bb    ', 'b   B '",
    "'a AA A', 'a a   '",
    "'cC a A', 'a A   '",
    "'bbB  B', 'b BBB ', 'bb    '",
    "'cCc C ', 'cC c C'",
    "'d4 Dd ', 'd D   ', 'DD    '",
    "'aaAA11', '1 1   ', 'a  A  ', 'a    A'",
    "'cCcC  ', 'c  C  '",
    "'C22222', 'cC  22', 'cc  2C', '2 2   '",
    "'b-B-BB', 'b-----'",
    "'cCc--C', 'cC----', 'c-C---'",
    "'b 4   ', '3     ', 'B   44', '4  3  '",
    "'aa A  ', 'c A   ', 'a     ', 'C3    '",
    "'bBBb  ', 'b BBBB', 'bbbbbB'",
    "'B B   ', 'bb4 B ', 'B 4   '",
    "'cCc   ', 'c CC  '",
    "'b C B ', 'c bC b', 'c  B  '",
    "'aaAA  ', 'aA a A'",
    "'bBbB B', 'bB b  '",
    "'bB 3B ', 'b33   '",
    "'bbb-b-', 'b-B---', 'B-b---', 'B-----'",
    
    "'3 3 ', 'b B3', '3   '",
    "' 111'",
    "'abA ', 'B C ', 'B c ', 'B D ', 'B d '",
    "'4A4a', '  a4', ' A B', '  Ab'",
    "'acAC', 'adBD', 'bcBD', 'bdAC'",
    "'1111', '   1'",
    "' bbb', '  BB'",
    "'1B1B', 'a A ', ' bA ', 'ab B'",
    "'cC C', 'cc C'",
    "'c-C-', 'cC--'",
    "'dd11', 'D-3-', '11--'",
    "'3333', '3 1 ', '33  '" 
];

function ghost_diagrams_examples() {
    let result = [ ];
    for(let i of range(ghost_diagrams_raw.length)) {
        let item = eval("["+ghost_diagrams_raw[i]+"]");
        let has_space = item.join("").indexOf(" ") >= 0;
        item = item.map(tile => tile.replace(/ /g,"-"));
        
        if (has_space) {
            if (item[0].length == 4)
                item.push("----");
            else
                item.push("------");
        }
        
        let name = i+1 + ". "+item.join(",");
        let url = "?" + Array.from(range(item.length)).map(i => `tile${i}=${item[i]}`).join("&");
        result.push([name,url]);
    }
    
    return result;
}