$(document).ready(function() {

    hideAllFilterType()
    setBtnLutActive()

    $('#btn-upload').change(function() {
        clearBodyEditor()
        imagesLoaded = 0
        resetValueRange()
        changeFilter()
        if (this.files && this.files[0]) {
            let reader = new FileReader();
            reader.onload = function(e) {
                $("#main-image").attr("src", e.target.result)
                // $("#main-image").show()
                URLToCanvas(e.target.result, "imageCanvas");
                URLToCanvas("luts/default.png", "lutCanvas");
                $("#btnDownload").show();
            }
            reader.readAsDataURL(this.files[0])
        }
    })
})

function hideAllFilterType() {
    $('#brightness').hide();
    $('#contrast').hide();
    $('#opacity').hide();
    $('#saturate').hide();
    $('#sepia').hide();
    $('#lut').hide();
    resetClassBtnFilterType();
}

function resetClassBtnFilterType() {
    $('#btn-filter-brightness').attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 nonactive-btn-filter-type");
    $('#btn-filter-contrast').attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 nonactive-btn-filter-type");
    $('#btn-filter-opacity').attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 nonactive-btn-filter-type");
    $('#btn-filter-saturate').attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 nonactive-btn-filter-type");
    $('#btn-filter-sepia').attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 nonactive-btn-filter-type");
    $('#btn-filter-lut').attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 nonactive-btn-filter-type");
}

function setActiveFilterType(type) {
    hideAllFilterType();
    $(`#${type}`).show();
    $(`#btn-filter-${type}`).attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 active-btn-filter-type");
}

function resetValueRange() {
    $("#brightness input").val(100)
    $("#contrast input").val(100)
    $("#opacity input").val(100)
    $("#saturate input").val(100)
    $("#sepia input").val(0)
}

let filter = ``

function changeFilter() {
    
    let brightness = $("#brightness input").val()
    let contrast = $("#contrast input").val()
    let opacity = $("#opacity input").val()
    let saturate = $("#saturate input").val()
    let sepia = $("#sepia input").val()
    
    $("#brightness span").html(brightness+"%")
    $("#contrast span").html(contrast+"%")
    $("#opacity span").html(opacity+"%")
    $("#saturate span").html(saturate+"%")
    $("#sepia span").html(sepia+"%")

    filter = `brightness(${brightness}%)
                    contrast(${contrast}%)
                    opacity(${opacity}%)
                    saturate(${saturate}%)
                    sepia(${sepia}%)`

    $("#main-image").css("filter", filter);
    $("#main-image").css("-webkit-filter", filter);
    $("#resultCanvas").css("filter", filter);
    $("#resultCanvas").css("-webkit-filter", filter);

}

$("input[type=range]").change(changeFilter).mousemove(changeFilter)

function commingSoon() {
    swal("Opsss...", "This function is not yet available", "danger");
}

var imagesLoaded = 0;
 
function URLToCanvas(url, id){
    var theCanvas = document.getElementById(id);
    var context = theCanvas.getContext("2d");                
    var img = new Image;
    img.src = url;
    img.onload = function(){
        // get the scale
        var scale = Math.min(theCanvas.width / img.width, theCanvas.height / img.height);
        theCanvas.width = img.width * scale;
        theCanvas.height = img.height * scale;        
        // get the top left position of the image
        var x = (theCanvas.width / 2) - (img.width / 2) * scale;
        var y = (theCanvas.height / 2) - (img.height / 2) * scale;        
        context.drawImage(img, x, y, img.width * scale, img.height * scale);  
        if (id == "imageCanvas") {
            size = {
                width: theCanvas.width,
                height: theCanvas.height,
            }   
        }           
        imagesLoaded ++;
        if(imagesLoaded == 2){
            applyLUT("imageCanvas", "lutCanvas", "resultCanvas", size);
        }
    }
}

function applyLUT(imageID, lutID, resultID, size) {
    var imageContext = document.getElementById(imageID).getContext("2d");
    var lutContext = document.getElementById(lutID).getContext("2d");
    var imageData = imageContext.getImageData(0, 0, size.width, size.height);
    var lutData = lutContext.getImageData(0, 0, 512, 512);
    for (var i = 0; i < imageData.data.length; i += 4) {
        var r = Math.floor(imageData.data[i] / 4);
        var g = Math.floor(imageData.data[i + 1] / 4);
        var b = Math.floor(imageData.data[i + 2] / 4);
        var lutX = (b % 8) * 64 + r;
        var lutY = Math.floor(b / 8) * 64 + g;
        var lutIndex = (lutY * 512 + lutX) * 4;
        imageData.data[i] = lutData.data[lutIndex];
        imageData.data[i + 1] = lutData.data[lutIndex + 1];;
        imageData.data[i + 2] = lutData.data[lutIndex + 2];;
    }
    let resultCanvas = document.getElementById(resultID)
    resultCanvas.width = imageData.width
    resultCanvas.height = imageData.height
    resultCanvas.getContext("2d").putImageData(imageData, 0, 0);
}

function selectLut(name) {    
    setBtnLutActive(name)
    let image = $("#main-image").attr('src')
    if (!image) return
    imagesLoaded = 0
    URLToCanvas(image, "imageCanvas");
    URLToCanvas("luts/"+name+".png", "lutCanvas");
}

function setDownloadCanvas() {
    var canvas = document.getElementById('downloadCanvas');
    var resCanvas = document.getElementById('resultCanvas');
    var ctx = canvas.getContext('2d');
    ctx.filter = filter;
    var img = new Image()
    img.src = resCanvas.toDataURL();
    ctx.drawImage(img,0,0, resCanvas.width, resCanvas.height);
}

function downloadImage() {
    console.log('downloaded');
    setDownloadCanvas()    
    setTimeout(() => {
        setDownloadCanvas()
        var link = document.createElement('a');
        link.download = 'angga-photo-editor.png';
        link.href = document.getElementById('downloadCanvas').toDataURL()
        link.click();
    }, 200);
    
}

function setBtnLutActive(name) {
    for (let i = 1; i <= 2; i++) {
        $("#lut"+i).attr("class", "btn mx-2 btn-lut-nonactive")
    }
    $("#"+name).attr("class", "btn mx-2 btn-lut-active")
}

function clearBodyEditor() {
    $("#container-body-editor div").remove()
    $("#container-body-editor").html(`
        <div class="d-flex justify-content-center align-items-center" style="height: 90vh; width: 100%;">
            <img id="main-image" src="" style="width: 70%; height: 65vh; object-fit: scale-down; display: none;">
            <div style = "text-align:center; display: none;">
                <canvas id = "imageCanvas" width="700" height="512" style = "border:2px solid black;object-fit: scale-down;"></canvas>
            </div>
            <br>
            <div style = "text-align:center; display: none;">
                <canvas id="lutCanvas" width="700" height="512" style = "border:2px solid black"></canvas>
            </div>
            <br>
            <div id="container-result-canvas" style = "text-align:center">
                <canvas id="resultCanvas" width="700" height="512"></canvas>
            </div>
            <div id="container-download-canvas" style = "text-align:center; display: none;">
                <canvas id="downloadCanvas" width="700" height="512"></canvas>
            </div>
        </div>
    `)
}