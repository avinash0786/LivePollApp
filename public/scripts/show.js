$(()=>{
    console.log("jqu init")
    let inputs=$("input[type=radio]");
    console.log(inputs.length)
    inputs.each((key,val)=>{
        $(val).attr("value",key)
    })
})

$(() => { 
    var $temp = $("<input>");
var $url = $(location).attr("href");

$("#copyLink").on("click", function () {
  $("body").append($temp);
  $temp.val($url).select();
  document.execCommand("copy");
    $temp.remove();
    $("#copyLink").text(" Link Copied.!!");
    $("#copyLink").removeClass('btn btn-outline-danger').addClass('btn btn-outline-success disabled');
  
});

})