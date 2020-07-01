//地圖設定
var mapsize;
var boommap = [],
    randmap = [];
var boomi, boomj, boomnum;
var map = document.getElementsByClassName("map");
var clock = document.getElementById("clock");
var showTime;
mapsize = +$('#mapsize').text()
boomnum = +$('#bombnum').text()
clock.innerHTML = +$('#clock').text();
document.oncontextmenu = function (e) {
    return false;
}
// x = $("[style='background-color: rgb(216, 154, 40)']")

//計時器
function now() {
    clock.innerHTML = parseInt(clock.innerHTML) - 1;
    Time()
}
var showTime = setInterval(now, 1000);
//change mapsize
function change(size) {
    var st = "";
    mapsize = size;
    boomnum = size - 1;
    map[0].style.setProperty("--colNum", mapsize);
    clock.innerHTML = 0;
    init();
    mapOk();

}
init();
mapOk();

//製作地圖&放置地雷
function init() {
    //地圖初始化
    map[0].innerText = "";
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

        //遊戲地圖
        btnMain.setAttribute('value', boommap[row][col]);
        btnMain.setAttribute('class', "unknow");
        btnMain.setAttribute('onclick', "game(this)");
        btnMain.setAttribute('style', "background-color:#c6c3c6")
        btnMain.setAttribute('position-x', row);
        btnMain.setAttribute('position-y', col);
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



$(".map>button").contextmenu(function (event) {
    // 取消系統預設右鍵功能
    event.preventDefault();
    if ($(this).css("background-color") == "rgb(198, 195, 198)") {
        $(this).css("background-color", "#be3c47")
    } else if ($(this).css("background-color") == "rgb(190, 60, 71)") {
        $(this).css("background-color", "#c6c3c6")
    }
})

function game(me) {
    me.innerText = me.value;
    me.setAttribute('class', switchMap(me.value));
    all = $(".map>button")
    //boom
    if (me.value == "*") {
        alert("踩到地雷爆炸了！！！");
        ShowAll(all)
        for (let i = 0; i < btnAll.length; i++) {
            btnAll[i].setAttribute("disabled", false);
            clearInterval(showTime);
        }

    }
    un = $("[class='unknow']")
    if (CheckBoard(un) == 1) {
        alert("You WIN!!!")
        clock.innerHTML = "X"
        ShowAll(all)
    } else un = []
    Time()
    if (me.value == "0") {
        breakblock(me)
    }
}


//顯示棋盤內所有button的value
function ShowAll(a) {
    for (let i = 0; i < all.length; i++) {
        a[i].innerText = a[i].value
    }
}
//確認遊戲是否結束
function CheckBoard(a) {
    for (let i = 0; i < a.length; i++) {
        if (a[i].className == "unknow" & a[i].value != "*") {
            return 0
            break
        }

    }
    return 1;
}
//確認是否時間到
function Time() {
    time = +$('#clock').text()
    if (time <= 0) {
        alert("時間到!!炸彈爆炸了!!!")
        clock.innerHTML = "X"
        all = $(".map>button")
        ShowAll(all)
    }
}

// 7/1新增:炸掉周圍的0
function breakblock(me) {
    x = $(me).attr("position-x")
    y = $(me).attr("position-y")
    all = $(".map>button")
    for (let i = 0; i < mapsize ** 2; i++) {
        nowx = $(all[i]).attr("position-x")
        nowy = $(all[i]).attr("position-y")
        //計算距離絕對值
        xx = nowx - x
        if (xx < 0) {
            xx = -(xx)
        }
        yy = nowy - y
        if (yy < 0) {
            yy = -(yy)
        }
        dis = (xx ** 2) + (yy ** 2)
        //判定是否為九宮格內的格子,如果是而且不是炸彈的話,就顯示他的值
        if ((xx < 2) & (yy < 2) & (all[i].value != "*")) {
            all[i].innerText = all[i].value
            $(all[i]).addClass("know")

        }
    }
    un = $("[class='unknow']")
    if (CheckBoard(un) == 1) {
        alert("You WIN!!!")
        clock.innerHTML = "X"
    } else un = []
}