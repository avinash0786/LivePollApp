////////////////starthere--------------------------------------------------------------
console.log("Dashboard js connected")
$(function()
{
    $('#searchBar').autocomplete({
        source:function(req,res){
            $.ajax({
                url:"/search",
                dataType:"jsonp",
                type:"GET",
                data:req,
                success:function(data){
                    res(data)
                    // console.log(data);
                },
                error:(error)=>{
                    alert("error occured in autocomplete function !")
                }
            });
        },
        minLength:1,
        select:function(event,ui)
        {
            if(ui.item)
                $('#searchBar').text(ui.item.label);
            var pollId=ui.item.name;

            // //test
            var url = "pollfor?name="+pollId ;
            $(location).attr('href',url);
        }
      
    });
});

