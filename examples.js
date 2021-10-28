
let examples = [    
    ["Knots", "rotation=90&pattern=20%7C16%7C22222222222222222222222222222222222222222222222222222000022222200000222201111022220111110222012210222201222102220122102222012221022233221022220111310300011110222220003013111000022222222220122233222222222222201222102222222222222012221022222222222220111110222222222222220000022222222222222222222222222222222222222222222222&mask=5%7C5%7C0000001110011100000000000&pal0=%23fce94f&pal1=%23edd400&pal2=%23005130&pal3=%23000000&pal4=%23729fcf&weight0=1&weight1=1&weight2=1&weight3=1.8&weight4=1"],
    
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

    ["Seaweed", "rotation=&pattern=10%7C6%7C222222222222422224222244224422222444422222224422222222442222&mask=5%7C5%7C0000001110011100000000000&pal0=%23fce94f&pal1=%23d9138a&pal2=%232f8b6e&pal3=%23486490&pal4=%2372fa78"],

    ["Suspicious", "rotation=&pattern=5%7C7%7C11111100211002112221122211212111111&mask=5%7C5%7C0000001100011000000000000&pal0=%23eeffff&pal1=%23204a87&pal2=%2373d216&pal3=%23000000&pal4=%23ffffff"],
    
    ["Swirls", "rotation=180&pattern=10%7C11%7C11111111111111111111000000011111111101111100010111110101011111010001111101111111110000000011111111111111111111&mask=5%7C5%7C0000001110011100111000000&pal0=%23eeffff&pal1=%23204a87&pal2=%2373d216&pal3=%23000000&pal4=%23ffffff"],
];


let ghost_diagrams_raw = [
    //"' a A a', '    A '",
    //"'CcCc  '",
    //"'  33Aa', ' 33 Aa'",
    //"'ab A  ', 'B  C  ', 'B  c  ', 'B  D  ', 'B  d  '",
    //"'d D 4 ', 'd  D  ', '44    '",
    //"'3-3-2-', '3--2--', '1-----'",
    //"'   bB ', 'bAaB  ', 'aAaA  '",    
    "'B Aa  ', 'b  Aa '",
    //"'44    ', '11  4 '",
    //"' a  4 ', ' 4 4  ', '  A441'",
    "'1 1 1 ', '2  12 '",
    //"' a A  ', 'Aaa  A'",
    "'a  a  ', ' aAA A'",
    "'  AA A', 'a a a '",
    "'a  aa ', '    AA'",
    "'A A a ', 'a a   '",
    "'A A a ', 'a  a  '",
    //"' a   4', 'a4 44A', '4A    '",
    //"'141   ', '4  4  ', '1 1   '",
    "' Aaa  ', 'A1A   ', 'a 1AAa'",
    //"'  bB1 ', ' b  B '",
    "'BbB 1 ', '     b'",
    "'b  b b', '  BbB '",
    //"'aA1   ', '   AA ', 'a  2  '",
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
    //"' 44B4D', ' dbB4b', ' 44D d', '    44'",
    "'  d3 3', '   D D'",
    "'  cc c', ' C C c'",
    //"'AaAaaa', '  1 Aa', '     A'",
    "'d D 3 ', 'dD    ', '3     '",
    //"'a 1 A ', 'a  A  '",
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
    //"'C22222', 'cC  22', 'cc  2C', '2 2   '",
    "'b-B-BB', 'b-----'",
    "'cCc--C', 'cC----', 'c-C---'",
    //"'b 4   ', '3     ', 'B   44', '4  3  '",
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
    //"' 111'",
    "'abA ', 'B C ', 'B c ', 'B D ', 'B d '",
    "'4A4a', '  a4', ' A B', '  Ab'",
    "'acAC', 'adBD', 'bcBD', 'bdAC'",
    //"'1111', '   1'",
    "' bbb', '  BB'",
    //"'1B1B', 'a A ', ' bA ', 'ab B'",
    "'cC C', 'cc C'",
    "'c-C-', 'cC--'",
    //"'dd11', 'D-3-', '11--'",
    "'3333', '3 1 ', '33  '",
    
    
    //Hard cases:
    "'a  A 4', 'aA    ', '4     ', '4 4   '",
    "'a  A 4', 'aA    ', '4     '",
    "' AAaa ', 'a  A  '",
    "'a 2a2 ', ' A   A', '     2'",
];

let tile_examples = [
    ["Thesis", "bg=%23204a87&outlines=3&grid=1&tile0=---aA-&pal0=%238ae234&weight0=1&tile1=abBA--&pal1=%238ae234&weight1=3&tile2=BbBb--&pal2=%23fce94f&weight2=2&tile3=------&pal3=%23000000&weight3=1"],

    ["Triangles", "bg=%23fce94f&tile0=AaAa--&pal0=%23ffffff&weight0=1&tile1=------&pal1=%23d9138a&weight1=1"],
    
    ["Feynman's van", "outlines=0&tile0=d-D-4-&pal0=%23fce94f&weight0=2&tile1=d--D--&pal1=%23d9138a&weight1=1&tile2=44----&pal2=%2312a4d9&weight2=1"],
    
    ["DNA", "max_memory=1000000&effort=250&tile0=ab-A--&pal0=%239af4fa&weight0=1&tile1=B--C--&pal1=%2373d216&weight1=1&tile2=B--c--&pal2=%23cc0000&weight2=1&tile3=B--D--&pal3=%23000000&weight3=1&tile4=B--d--&pal4=%234453ff&weight4=1"],
    
    ["Cells", "grid=1&tile0=3-3-2-&pal0=%23fce94f&weight0=2.5&tile1=3--2--&pal1=%23d9138a&weight1=1.5&tile2=1-----&pal2=%2312a4d9&weight2=1"],
    
    ["Knot", "bg=%23fce94f&outlines=3&tile0=BbBb&pal0=%23ffffff&weight0=1&tile1=B-b-&pal1=%23d9138a&weight1=1&tile2=Bb--&pal2=%2312a4d9&weight2=1"],
    
    ["Helix", "bg=%23fce94f&outlines=3&tile0=Bb-Bb-&pal0=%23ffffff&weight0=2&tile1=B--b--&pal1=%23d9138a&weight1=1&tile2=bB----&pal2=%2312a4d9&weight2=1"],
    
    ["Rectangles", "bg=%23c4a000&tile0=1444&pal0=%23fce94f&weight0=1&tile1=1111&pal1=%2375507b&weight1=1.5"],

    ["Eastern windows", "tile0=dd22&pal0=%23fce94f&weight0=2&tile1=D-4-&pal1=%23d9138a&weight1=1&tile2=22--&pal2=%2312a4d9&weight2=1"],
    
    ["Binary counter", "bg=%23d3d7cf&outlines=1&grid=1&tile0=4B4B&pal0=%23888a85&weight0=2&tile1=c-C-&pal1=%23d9138a&weight1=1&tile2=-bC-&pal2=%2312a4d9&weight2=1&tile3=cb-B&pal3=%23fce94f&weight3=1&tile4=----&pal4=%23ffffff&weight4=1"],
    
    ["Society", "tile0=-a--4-&pal0=%23fce94f&weight0=1&tile1=-4-4--&pal1=%23d9138a&weight1=1&tile2=--A441&pal2=%2312a4d9&weight2=2&tile3=------&pal3=%23000000&weight3=1"],
    
    ["Batons", "tile0=b-4---&pal0=%23fce94f&weight0=1&tile1=3-----&pal1=%23d9138a&weight1=0.5&tile2=B---44&pal2=%2312a4d9&weight2=1&tile3=4--3--&pal3=%23000000&weight3=1&tile4=------&pal4=%23ffffff&weight4=0.5"],
    
    ["Triangles in the sea", "bg=%23204a87&outlines=0&grid=1&tile0=44----&pal0=%23fce94f&weight0=1&tile1=11--4-&pal1=%23d9138a&weight1=1.5"],

    ["Two houses", "bg=%23555753&outlines=3&tile0=C22222&pal0=%23fce94f&weight0=1.5&tile1=cC--22&pal1=%23d9138a&weight1=1&tile2=cc--2C&pal2=%2312a4d9&weight2=1&tile3=2-2---&pal3=%23ffffff&weight3=0.5&tile4=------&pal4=%23000000&weight4=0.5"],
    
    ["Snake puppets", "outlines=0&tile0=141---&pal0=%23fce94f&weight0=1&tile1=4--4--&pal1=%23d9138a&weight1=1.5&tile2=1-1---&pal2=%2312a4d9&weight2=1&tile3=------&pal3=%23000000&weight3=1"],
    
    //["Constellation", "tile0=---eE-&pal0=%23fce94f&weight0=1&tile1=efFE--&pal1=%23d9138a&weight1=2&tile2=FfFf--&pal2=%2312a4d9&weight2=2&tile3=------&pal3=%23000000&weight3=1"],
    
    ["Grab a handle", "tile0=-a-A--&pal0=%23fce94f&weight0=1&tile1=Aaa--A&pal1=%23d9138a&weight1=2&tile2=------&pal2=%2312a4d9&weight2=1"],
    
    ["Flowers", "tile0=-a---4&pal0=%23fce94f&weight0=1&tile1=a4-44A&pal1=%23d9138a&weight1=2.5&tile2=4A----&pal2=%2312a4d9&weight2=1&tile3=------&pal3=%23000000&weight3=1"],
    
    ["Triangle net", "tile0=--bB1-&pal0=%23fce94f&weight0=1.5&tile1=-b--B-&pal1=%23d9138a&weight1=1&tile2=------&pal2=%2312a4d9&weight2=1"],

    ["Crooked triangles", "tile0=aA1---&pal0=%23fce94f&weight0=2&tile1=---AA-&pal1=%23d9138a&weight1=1&tile2=a--2--&pal2=%2312a4d9&weight2=1&tile3=------&pal3=%23000000&weight3=1"],
    
    ["Overgrown", "bg=%23c8f8ff&outlines=0&tile0=AaAaaa&pal0=%23fce94f&weight0=1&tile1=--1-Aa&pal1=%23d9138a&weight1=1&tile2=-----A&pal2=%2312a4d9&weight2=1&tile3=------&pal3=%23000000&weight3=1"],
    
    ["Rings", "bg=%23ffffff&outlines=1&grid=1&tile0=-44B4D&pal0=%23fce94f&weight0=10&tile1=-dbB4b&pal1=%23d9138a&weight1=10&tile2=-44D-d&pal2=%2312a4d9&weight2=5&tile3=----44&pal3=%23000000&weight3=1&tile4=------&pal4=%23ffffff&weight4=1"],
    
    ["One loop", "bg=%2329d68f&tile0=-a-A-a&pal0=%23ee9711&weight0=1&tile1=----A-&pal1=%238f29d6&weight1=1&tile2=------&pal2=%2312a4d9&weight2=3"],
    
    ["Isoforms", "tile0=--33Aa&pal0=%23fce94f&weight0=1&tile1=-33-Aa&pal1=%23d9138a&weight1=1&tile2=------&pal2=%2312a4d9&weight2=1"],
    
    ["Spokes", "bg=%23ffffff&outlines=1&grid=1&tile0=e-2-E-&pal0=%23babdb6&weight0=2&tile1=e--E--&pal1=%23555753&weight1=1&tile2=------&pal2=%2312a4d9&weight2=1"],
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
        
        let name = item.join(",");
        let url = Array.from(range(item.length)).map(i => `tile${i}=${item[i]}`).join("&");
        result.push([name,url]);
    }
    
    return result;
}
