var MainColors = ["#000000"
    , "#7f7f7f", "#880015", "#ed1c24", "#ff7f27"
    , "#fff200", "#22b14c", "#00a2e8", "#3f48cc"
    , "#a349a4", "#ffffff", "#c3c3c3", "#b97a57"
    , "#ffaec9", "#ffc90e", "#efe4b0", "#b5e61d"
    , "#99d9ea", "#7092be", "#c8bfe7"];
var brush;
var tool;
var shape;
var size;
var color1;
var color2;
var choseColor;
var Color1VsColor2;
var Canvas;
var ctx;
var is_down = false;
var cursor;

var x = 0;
var y = 0;
var imgData;
var currentX;
var currentY;
function FunOnload() {
    Color1VsColor2 = document.querySelectorAll('.Color1VsColor2');
    var ColorOPtions = document.getElementsByClassName('colorItem');
    var SizeRange = document.getElementById('SizeRange');
    var Tools = document.getElementsByClassName('tool');
    Canvas = document.getElementById('Canvas');
    ctx = Canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x, y, Canvas.width, Canvas.height);
    Canvas.addEventListener('mousemove', Draw);
    Canvas.addEventListener('mousedown', Mousedown);
    document.addEventListener('mouseup', Mouseup);

    SizeRange.value = 5;
    SizeRange.addEventListener('change', ChangeSize);
    for (var i = 0; i < MainColors.length; i++) {
        ColorOPtions[i].style.backgroundColor = MainColors[i];
        ColorOPtions[i].addEventListener('click', ClickChangeColor);
    }
    for (var i = 0; i < Color1VsColor2.length; i++)
        Color1VsColor2[i].parentElement.addEventListener('click', SelectColor1VsColor2);

    for (var i = 0; i < Tools.length; i++)
        Tools[i].addEventListener('click', changeTool);

    tool = document.getElementById('brush');
    tool.style.backgroundColor = 'rgba(128, 168, 255, 0.589)';

    choseColor = Color1VsColor2[0].parentElement;
    choseColor.style.backgroundColor = 'rgba(128, 168, 255, 0.589)';

    Color1VsColor2[0].style.backgroundColor = '#000000';
    Color1VsColor2[1].style.backgroundColor = "#ffffff";
    color1 = '#000000';
    color2 = "#ffffff";
    size = 5;
    document.getElementsByClassName('allTools')[0].addEventListener('mousemove', OutDraw);
    cursor = document.getElementById('cursor')
    cursor.addEventListener('mousemove', Draw);
    cursor.addEventListener('mousedown', Mousedown);

}
function ShowList(id_to_display) {
    var element = document.getElementById(id_to_display);
    if (element.style.display == 'none') {
        element.style.display = 'block';
    }
    else {
        element.style.display = 'none';
    }
}
function GetColor(x, y) {
    var StartPoint = GetStartPoint(Math.floor(x), Math.floor(y));
    var t = {
        r: Number(imgData.data[StartPoint]),
        g: Number(imgData.data[StartPoint + 1]),
        b: Number(imgData.data[StartPoint + 2]),
    };
    return t;
}
function SetColor(x, y, Color) {
    var StartPoint = GetStartPoint(x, y);
    imgData.data[StartPoint] = Color.r;
    imgData.data[StartPoint + 1] = Color.g;
    imgData.data[StartPoint + 2] = Color.b;
    imgData.data[StartPoint + 3] = 255;
}

function Draw(event) {
    x = event.clientX - Canvas.getBoundingClientRect().x;
    y = event.clientY - Canvas.getBoundingClientRect().y;

    // style cursor 
    if (tool.id == 'brush' || tool.id == 'eraser' || tool.id == 'pencil') {
        document.body.style.cursor = 'none';
        cursor.style.display = 'block';
    }
    if (tool.id == 'shape' || tool.id == 'select') {
        document.body.style.cursor = 'initial';
        cursor.style.display = 'none';
    }
    if (tool.id == 'brush' || tool.id == 'eraser') {
        cursor.style.left = event.pageX - (size / 2) + 'px';
        cursor.style.top = event.pageY - (size / 2) + 'px';
        cursor.style.width = size + 'px';
        cursor.style.height = size + 'px';
    }
    if (tool.id == 'pencil') {
        cursor.style.width = 5 + 'px';
        cursor.style.height = 5 + 'px';
        cursor.style.left = event.pageX - (1) + 'px';
        cursor.style.top = event.pageY - (1) + 'px';
    }
    if (tool.id == 'pickColor' || tool.id == 'paint') {
        document.body.style.cursor = 'initial';
        cursor.style.display = 'block';
        cursor.style.width = 70 + 'px';
        cursor.style.height = 70 + 'px';
        cursor.style.left = event.pageX + (50) + 'px';
        cursor.style.top = event.pageY + (50) + 'px';
        var Color = GetColor(x, y);
        cursor.style.backgroundColor = (RgbToHex(Color));
    }
    // end style cursor 
    if (is_down) {
        if (tool.id == 'brush' && !event.ctrlKey) {
            cursor.style.backgroundColor = color1;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.lineJoin = "round";
            ctx.strokeStyle = color1;
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        else if (tool.id == 'pencil') {
            cursor.style.backgroundColor = color1;
            ctx.lineWidth = 2;
            ctx.strokeStyle = color1;
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        else if (tool.id == 'eraser') {
            cursor.style.backgroundColor = color2;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.lineJoin = "round";
            ctx.strokeStyle = color2;
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
}

function OutDraw() {
    document.body.style.cursor = 'initial';
    cursor.style.display = 'none';
    is_down = false ; 
}

function Mousedown(event) {
    is_down = true;
    ctx.beginPath();
    Draw(event);
    if (tool.id == 'paint') {
        FillShape(Math.floor(x), Math.floor(y), color1);
    }
    if (tool.id == 'pickColor') {
        imgData = ctx.getImageData(0, 0, Canvas.width, Canvas.height);
        var Color = GetColor(x, y);
        ChangeColor(RgbToHex(Color));
    }
}

function Mouseup(event) {
    is_down = false;
}


function ClickChangeColor() {
    var Color = this.style.backgroundColor;
    ChangeColor(Color);
}
function ChangeColor(Color) {
    choseColor.children[0].style.backgroundColor = Color;
    color1 = Color1VsColor2[0].style.backgroundColor;
    color2 = Color1VsColor2[1].style.backgroundColor;
}
function SelectColor1VsColor2() {
    choseColor.style.backgroundColor = 'initial'
    this.style.backgroundColor = 'rgba(128, 168, 255, 0.589)';
    choseColor = this;
}
function ChangeSize() {
    size = Number(this.value);
}
function changeTool() {
    tool.style.backgroundColor = 'initial'
    this.style.backgroundColor = 'rgba(128, 168, 255, 0.589)';
    tool = this;
    if (tool.id == 'pickColor' || tool.id == 'paint') {
        imgData = ctx.getImageData(0, 0, Canvas.width, Canvas.height);
    }
}


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function StringRgbToRgb(rgb) {
    var a = rgb.split("(")[1].split(")")[0];
    a = a.split(",");
    return {
        r: Number(a[0]),
        g: Number(a[1]),
        b: Number(a[2])
    };
}

function RgbToHex(rgb) {
    var xColor = '#' + (rgb.r.toString(16).length == 1 ? '0' + rgb.r.toString(16) : rgb.r.toString(16)) +
        (rgb.g.toString(16).length == 1 ? '0' + rgb.g.toString(16) : rgb.g.toString(16)) +
        (rgb.b.toString(16).length == 1 ? '0' + rgb.b.toString(16) : rgb.b.toString(16));
    return xColor;
}


function GetStartPoint(x, y) {
    return (x + y + (y * (Canvas.width - 1))) * 4;
}


function SetColor_OldColor(x, y, Oldcolor, Newcolor) {
    var Color = GetColor(x, y);
    if (((Color.r == Oldcolor.r) && (Color.g == Oldcolor.g) && (Color.b == Oldcolor.b))) {
        if (!((Color.r == Newcolor.r) && (Color.g == Newcolor.g) && (Color.b == Newcolor.b))) {
            SetColor(x, y, Newcolor);
            return ({ x: x, y: y });
        }
    }
    return false;
}


function FillShape(x, y, NewColor) {
    var Newcolor;
    if (NewColor[0] == '#') {
        Newcolor = hexToRgb(NewColor);
    }
    else {
        Newcolor = StringRgbToRgb(NewColor);
    }
    Oldcolor = GetColor(x, y);
    var arr = [], NewArr = [];
    arr.push({ x: x, y: y });
    NewArr = arr;
    while (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            var pos = arr[i];
            if ((pos.x >= 0 && pos.x <= Canvas.width && pos.y >= 0 && pos.y <= Canvas.height)) {
                var D = SetColor_OldColor(pos.x + 1, pos.y, Oldcolor, Newcolor);
                if (D != false) NewArr.push(D);
                var D = SetColor_OldColor(pos.x - 1, pos.y, Oldcolor, Newcolor);
                if (D != false) NewArr.push(D);
                var D = SetColor_OldColor(pos.x, pos.y + 1, Oldcolor, Newcolor);
                if (D != false) NewArr.push(D);
                var D = SetColor_OldColor(pos.x, pos.y - 1, Oldcolor, Newcolor);
                if (D != false) NewArr.push(D);
            }
        }
        arr = [];
        arr = NewArr;
        NewArr = [];
    }
    ctx.putImageData(imgData, 0, 0);
}
