$(document).ready(function() {

    hideAllFilterType()

    $('#btn-upload').change(function() {
        resetValueRange()
        changeFilter()
        if (this.files && this.files[0]) {
            let reader = new FileReader();
            reader.onload = function(e) {
                $("#main-image").attr("src", e.target.result)
                $("#main-image").show()
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
    resetClassBtnFilterType();
}

function resetClassBtnFilterType() {
    $('#btn-filter-brightness').attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 nonactive-btn-filter-type");
    $('#btn-filter-contrast').attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 nonactive-btn-filter-type");
    $('#btn-filter-opacity').attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 nonactive-btn-filter-type");
    $('#btn-filter-saturate').attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 nonactive-btn-filter-type");
    $('#btn-filter-sepia').attr("class", "d-flex justify-content-center align-items-center btn text-white mx-2 nonactive-btn-filter-type");
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

    let filter = `brightness(${brightness}%)
                    contrast(${contrast}%)
                    opacity(${opacity}%)
                    saturate(${saturate}%)
                    sepia(${sepia}%)`

    $("#main-image").css("filter", filter);
    $("#main-image").css("-webkit-filter", filter);

}

$("input[type=range]").change(changeFilter).mousemove(changeFilter)

function commingSoon() {
    swal("Opsss...", "This function is not yet available", "danger");
}