// globals
var canvas, canvasimg, backgroundImage, finalImg;
var mouseClicked = false;
var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;
var fillStyle = "black";
var globalCompositeOperation = "source-over";
var lineWidth = 7;
drawing = [];
points = [];

function init() {
  var imageSrc = "https://via.placeholder.com/150";
  backgroundImage = new Image();
  backgroundImage.src = imageSrc;
  canvas = document.getElementById("can");
  finalImg = document.getElementById("finalImg");
  canvasimg = document.getElementById("canvasimg");
  canvas.style.backgroundImage = "url('" + imageSrc + "')";
  canvas.addEventListener("mousemove", handleMouseEvent);
  canvas.addEventListener("mousedown", handleMouseEvent);
  canvas.addEventListener("mouseup", handleMouseEvent);
  canvas.addEventListener("mouseout", handleMouseEvent);
}

function setColor(btn) {
  globalCompositeOperation = "source-over";
  if (btn.getAttribute("data-color") == "eraser") {
    globalCompositeOperation = "destination-out";
    fillStyle = "rgba(0,0,0,1)";
  }
}

function setBrushSize(btn) {
  const newLineWidth = btn.getAttribute("data-lineWidth");
  if (newLineWidth) {
    lineWidth = newLineWidth;
  }
}

function drawCircle(x, y) {
  var ctx = canvas.getContext("2d");
  ctx.beginPath;
  ctx.arc(x, y, lineWidth / 2, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
}

function draw(dot) {
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.globalCompositeOperation = globalCompositeOperation;
  if (dot) {
    ctx.fillStyle = fillStyle;
    drawCircle(currX, currY);
  } else {
    ctx.beginPath();
    ctx.lineJoin = ctx.lineCap = "round";
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = fillStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.closePath();
}

function erase() {
  if (confirm("Want to clear")) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("canvasimg").style.display = "none";
  }
}

// Redraw everything from points
function trace() {
  globalCompositeOperation = "source-over";
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.globalCompositeOperation = globalCompositeOperation;

  for (var i = 0; i < drawing.length; i++) {
    let points = drawing[i];
    if (points.length) {
      ctx.moveTo(points[0].x, points[0].y);
      for (var j = 0; j < points.length; j++) {
        ctx.lineTo(points[j].x, points[j].y);
      }
      ctx.stroke();
    }
  }
  ctx.closePath();
}

function handleMouseEvent(e) {
  if (e.type === "mousedown") {
    prevX = currX;
    prevY = currY;
    currX = e.offsetX;
    currY = e.offsetY;

    // Log points and append to total only if mode isnt the eraser
    if (globalCompositeOperation === "source-over") {
      let newPoint = { x: currX, y: currY };
      points.push(newPoint);
    }
    mouseClicked = true;
    draw(true);
  }
  if (e.type === "mouseup") {
    mouseClicked = false;
    // Add the drawn points to total drawing
    drawing.push(clone(points));

    // ------- Move below to testfile ----------
    let drawingLength = 0;
    for (var i = 0; i < drawing.length; i++) {
      drawingLength = drawingLength + drawing[i].length;
    }
    const totalLength = points.length + drawingLength;
    console.assert(totalLength === points.length + drawingLength);
    // ------------------------------------------

    points.length = 0;
  }
  if (e.type === "mousemove") {
    if (mouseClicked) {
      // Handle mouse changes
      prevX = currX;
      prevY = currY;
      currX = e.offsetX;
      currY = e.offsetY;

      // Log points and append to total
      if (globalCompositeOperation === "source-over") {
        let newPoint = { x: currX, y: currY };
        points.push(newPoint);
      }
      draw();
    }
  }
}
