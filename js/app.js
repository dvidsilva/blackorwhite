$(document).ready(function() {
  //This reads the file from the guy's computer and displays it
  $(".file").change(function(e) {
    var cbReader = function() {
      img.src = reader.result;
    };
    for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
      var file = e.originalEvent.srcElement.files[i];
      var img = document.createElement("img");
      img.className = "original img-polaroid";
      var reader = new FileReader();
      reader.onloadend = cbReader;
      reader.readAsDataURL(file);
      $(".org").html(img);
      $(".pg").show('slow');
      $(".original").show();
    }
  });

  $(".depth li").click(function(){
    $(".gray").show();
    var destX   = 0;
    var destY   = 0;
    var canvas  = $(".gray");
    var context = canvas[0].getContext('2d');
    var img = $(".original");
    canvas[0].width = img[0].width;
    canvas[0].height = img[0].height;
    context.drawImage( img[0] , destX, destY, img[0].width, img[0].height);
    if($(this).data('depth')==='mv'){
      getMicroView(context, canvas[0]);
    } else if ($(this).data('depth') === 'pride') {
      getPride(context, canvas[0]);
    } else {
      grayScale(context, canvas[0], $(this).data('depth') );
    }
  });
});

function getPride (context, canvas) {
  var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  var rowSize = Math.ceil(canvas.height / 6);
  var colSize = canvas.width;
  var pixels = imgData.data;
  var row = 0;
  var section = 0;
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    if(i % colSize === 0) {
      row++;
    }
    if (row === rowSize ) {
      row = 0;
      section++;
    }
    pixels = changeColor(pixels, i, section);
  }
  context.putImageData(imgData, 0, 0);
}

function changeColor (pixels, i , section ) {
  switch (section) {
  case 0:
    pixels[i] = pixels[i];
    pixels[i + 1] = 0;
    pixels[i + 2] = 0;
    break;
  case 1:
    pixels[i] = pixels[i] <= 200 ? pixels[i] + 55 : pixels[i];
    pixels[i + 1] = pixels[i + 1] <= 100 ? pixels[i + 1] + 55 : 140;
    pixels[i + 2] = 0;
    break;
  case 2:
    pixels[i] = pixels[i] <= 200 ? pixels[i] + 55 : pixels[i];
    pixels[i + 1] = pixels[i + 1] <= 190 ? pixels[i + 1] + 55 : pixels[i + 1];
    pixels[i + 2] = 0;
    break;
  case 3:
    pixels[i] = 0;
    pixels[i + 1] = pixels[i + 1] ;
    pixels[i + 2] =  0;
    break;
  case 4:
    pixels[i] = 0;
    pixels[i + 1] = 0;
    pixels[i + 2] = pixels[i + 2];
    break;
  case 5:
    pixels[i] = pixels[i] - 40;
    pixels[i + 1] = 0;
    pixels[i + 2] = pixels[i + 2] - 20;
    break;
  }
  return pixels;
}

// 136 = (10,2)
function getMicroView(context, canvas) {
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    var pixels  = imgData.data;
    var x = [];
    var y = [];
    var row = 0;
    var depth = 1;
    ConversionFactor = 255 / (Math.pow(2, depth) - 1);
    for (var i = 0, n = pixels.length; i < n; i += 4) {
      if(i%63===0&&i>0){
        row++;
      }
        var grayscale = pixels[i] * 0.3 + pixels[i+1] * 0.59 + pixels[i+2] * 0.11;
        grayscale = parseInt((grayscale / ConversionFactor) + 0.5) * ConversionFactor;
        if(grayscale<100){
          x.push( ( i / 4) - (row * 63) );
          y.push(row);
        }
        pixels[i  ] = grayscale;        // red
        pixels[i+1] = grayscale;        // green
        pixels[i+2] = grayscale;        // blue
    }
    console.log(x);
    console.log(y);
    var result = "x = [" + x.toString() + "];";
    result += "\n y = [" + y.toString() + "];";
    $('#pixels').val(result);
    context.putImageData(imgData, 0, 0);
}


function grayScale(context, canvas, depth) {
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    var pixels  = imgData.data;
    ConversionFactor = 255 / (Math.pow(2,depth) - 1);
    for (var i = 0, n = pixels.length; i < n; i += 4) {
        var grayscale = pixels[i] * .3 + pixels[i+1] * .59 + pixels[i+2] * .11;
        grayscale = parseInt((grayscale / ConversionFactor) + 0.5) * ConversionFactor
        //not necesarily sure still how this works
        pixels[i  ] = grayscale;        // red
        pixels[i+1] = grayscale;        // green
        pixels[i+2] = grayscale;        // blue
    }
    //redraw the image in black & white
    context.putImageData(imgData, 0, 0);
}


