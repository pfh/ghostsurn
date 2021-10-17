
let examples = [
    ["Bursts","rotation=90&width=30&height=60&effort=1000&scale=10&pattern=10%7C10%7C_______________________1211_____112111____222000____110200____110011_____1001_______________________&mask0=5%7C5%7C0000000100011100010000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["Curls","rotation=90&width=30&height=60&effort=1000&scale=10&pattern=10%7C10%7C___________100102____111100____001210____020111____210000____221210_________________________________&mask0=5%7C5%7C0000000100011100010000000&pal0=%23eeffff&pal1=%23204a87&pal2=%2373d216"],

    //["Loops","rotation=90&width=20&height=40&effort=1000&scale=10&pattern=10%7C10%7C_______________________1211_____112111____222111____111000____111011_____1101_______________________&mask0=5%7C5%7C0000000100011100010000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["Triangles","rotation=&width=30&height=60&effort=1000&scale=10&pattern=10%7C10%7C______________________00_______0202______0022_______________________________________________________&mask0=5%7C5%7C0000000100011000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["Dissolve","rotation=&width=30&height=60&effort=1000&scale=10&pattern=10%7C10%7C_____________________220220____000222_____0002_______22_____________________________________________&mask0=5%7C5%7C0000001110001000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["Lines","rotation=&width=30&height=60&effort=1000&scale=10&pattern=10%7C10%7C_____________________2001______1102______2100______2210_____________________________________________&mask0=5%7C5%7C0000000100011000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    //["Blocks","rotation=90&width=20&height=40&effort=1000&scale=10&pattern=10%7C10%7C___________121000____211022____211022____210002____210201____200110_________________________________&mask0=5%7C5%7C0000000100011100010000000&pal0=%23eeffff&pal1=%23204a87&pal2=%2373d216"],
    
    ["Maze", "rotation=180&width=30&height=60&effort=1000&scale=10&pattern=10%7C10%7C______________________2211______1012______1222______1121____________________________________________&mask0=5%7C5%7C0000001100011000000000000&pal0=%23eeffff&pal1=%23204a87&pal2=%2373d216"],
    
    ["Clouds", "rotation=&width=30&height=60&effort=1000&scale=10&pattern=10%7C10%7C00220_____22202_____00222_____02000_____20000_______________________________________________________&mask0=5%7C5%7C0000000100011100000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    
    ["Big purple", "rotation=&width=30&height=60&effort=1000&scale=10&pattern=10%7C10%7C____0________12_______22_1_____20_01____02_00_0_____12_01____20_22_______11_______11________________&mask0=5%7C5%7C0000000100011000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["Hex", "rotation=90&width=30&height=60&effort=1000&scale=10&pattern=10%7C10%7C1111101111111110111111111011111111101111000000111111111121111111111211111111112111111111121111111111&mask0=5%7C5%7C0000001110011100111000000&mask1=5%7C5%7C0000000000000000000000000&mask2=5%7C5%7C0000000000000000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["Hash", "rotation=90&width=30&height=60&effort=5000&scale=10&pattern=20%7C10%7C_2_2_0_1_1_2________0212221121102________1_2_0_2_0_2________0201202120112________2_1_0_1_0_2________0100022212022________2_0_1_1_1_0________0022200112212________0_0_1_1_0_2____________________________&mask0=5%7C5%7C0000000100011100010000000&mask1=5%7C5%7C0000000000000000000000000&mask2=5%7C5%7C0000000000000000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["Multiverse clouds", "rotation=&width=20&height=40&effort=10000&scale=10&pattern=10%7C10%7C________________________________________22222222__22202222__22000222__20000022__21100122__22222222__&mask0=5%7C5%7C0000001100011000000000000&mask1=5%7C5%7C0000000000000000000000000&mask2=5%7C5%7C0000000000000000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["Multiverse triangles", "rotation=&width=40&height=40&effort=1000&scale=10&pattern=20%7C10%7C02222222122222222222200110022000100002222001002220011000222220010222200110022222211122222111002222222002022221000222222220222222210022222222222222222002222222222222222220222222222222222222222222222222&mask0=5%7C5%7C0000001100011000000000000&mask1=5%7C5%7C0000000000000000000000000&mask2=5%7C5%7C0000000000000000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["Multiverse triangles 2", "rotation=&width=80&height=80&effort=100000&scale=8&pattern=20%7C10%7C________0222222222__________2010011002__________2110010022__________2000110202__________2111112222__________2100020222__________2000222222__________2002222222__________2022222222__________2222222222__&mask0=5%7C5%7C0000001100011000000000000&mask1=5%7C5%7C0000000000000000000000000&mask2=5%7C5%7C0000000000000000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9"],
    
    ["One loop", "rotation=90&width=60&height=60&effort=1000&scale=10&pattern=9%7C14%7C222222222222222222222222222222201222222201222222201222000001222111110222222210222222210222222210222222222222222222222222222222&mask0=5%7C5%7C1111011110111101111000000&mask1=5%7C5%7C0000000000000000000000000&mask2=5%7C5%7C0000000000000000000000000&pal0=%23e2d810&pal1=%23d9138a&pal2=%2312a4d9&pal3=%23000000&pal4=%23ffffff"],
];
