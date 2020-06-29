//地圖設定
var mapsize;
var boommap = [],
    randmap = [];
var boomi, boomj, boomnum;
var map = document.getElementsByClassName("map");
var clock = document.getElementById("clock");
var showTime;
mapsize = 6; //地圖尺寸
boomnum = 2; //地雷數量
clock.innerHTML = 0;

//計時器
function now() {
    clock.innerHTML = parseInt(clock.innerHTML) + 1;
}
var showTime = setInterval(now, 1000);
//change mapsize
function change(size) {
    var st = "";
    mapsize = size;
    boomnum = size - 1;
    map[0].style.setProperty("--colNum", mapsize);
    map[1].style.setProperty("--colNum", mapsize);
    clock.innerHTML = 0;
    init();
    mapOk();

}
init();
mapOk();
//選擇easy模式
$(() => {
    $('#easy').on('click', () => {
        change(6)
    })
})
//選擇normal模式
$(() => {
    $('#normal').on('click', () => {
        change(9)
    })
})
//選擇hard模式
$(() => {
    $('#normal').on('click', () => {
        change(12)
    })
})

//製作地圖&放置地雷
function init() {
    //地圖初始化
    map[0].innerText = "";
    // map[1].innerText = "";
    boommap.splice(0, boommap.length);
    randmap.splice(0, randmap.length);

    console.log("---------------------------------");
    console.log("9:unknow 0:empty 1~8:number *:boom");
    console.log(boommap);

    for (let bi = 0; bi < mapsize ** 2; bi++) {
        randmap.push(0); //預設為空地(empty)
        if (bi < boomnum) randmap[bi] = "*"; //*=地雷
    }

    //打亂地雷位置
    for (let numi = mapsize ** 2 - 1; numi > 0; numi--) {
        let j = Math.floor(Math.random() * (numi + 1));
        [randmap[numi], randmap[j]] = [randmap[j], randmap[numi]];
    }


    //randmap 1d轉2d boommap
    for (let i = 0; i < mapsize; i++) {
        boommap.push(randmap.splice(0, mapsize));
    }

    //更新地雷周圍數字
    for (var newrow = 0; newrow < mapsize; newrow++) {
        boommap[newrow].forEach(function (item, index, array) {
            if (item == "*") {
                console.log(newrow, index, array);
                trynum(newrow, index);
            }
        });
    }
    //將九宮格範圍數字+1
    function trynum(row, col) {
        console.log("boom:", row, col) //地雷位置
        var rowi, coli;

        for (var rgnine = 0; rgnine < 9; rgnine++) {
            rowi = row + Math.floor(rgnine / 3) - 1;
            coli = col + (rgnine % 3) - 1;

            if ((-1 < rowi) && (rowi < mapsize) //列沒超出範圍
                &&
                (-1 < coli) && (coli < mapsize) //欄沒超出範圍
                &&
                (boommap[rowi][coli] !== "*")) {
                console.log("add:", rowi, coli);
                boommap[rowi][coli] += 1;
            }
        }
    }
}
//地圖完成
function mapOk() {

    for (let wd = 0; wd < mapsize ** 2; wd++) {
        let row = Math.floor(wd / mapsize);
        let col = wd % mapsize;
        var btnGod = document.createElement("button");
        var btnMain = document.createElement("button");

        // //上帝視角
        // btnGod.setAttribute('value', boommap[row][col]);
        // btnGod.setAttribute('class', switchMap(boommap[row][col]));
        // btnGod.innerText = boommap[row][col];
        // map[0].appendChild(btnGod);

        //遊戲地圖
        btnMain.setAttribute('value', boommap[row][col]);
        btnMain.setAttribute('class', "unknow");
        btnMain.setAttribute('onclick', "game(this)");
        map[0].appendChild(btnMain);
    }
}
//判斷地圖狀態
function switchMap(ifmap) {
    if (ifmap == "*") return "boom";
    if (ifmap == 0) return "empty";
    return "number";
}
//遊戲
var btnAll = map[0].getElementsByTagName("button");

function game(me) {
    me.innerText = me.value;
    me.setAttribute('class', switchMap(me.value));

    //boom
    if (me.value == "*") {
        alert("boom");
        for (let i = 0; i < btnAll.length; i++) {
            btnAll[i].setAttribute("disabled", false);
            clearInterval(showTime);
        }
    }
}