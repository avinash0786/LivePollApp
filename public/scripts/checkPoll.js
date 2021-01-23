console.log("Check poll avail functionality")
let op=0;
let alpha="ABCDEFGHIJKLMNOP"
let show=1;
$(function (){
    $('#add').click(function (){
        let main=$('#parent');
        console.log(main)
        if(op>15){
            alert("Enough option")
            return
        }
        console.log("Add option clicked")
        op++;
        main.append(`
    <div id="optionBar" class="d-flex"s style="height: 46px;background: rgba(190,245,242,0);margin-top: 10px;margin-left: 10%;width: 80%;">
            <div style="width: 10%;height: 100%;background: rgba(219,188,188,0);">
                <h1 style="margin-left: 21px;">${alpha.charAt(op)}</h1>
            </div>
            <div style="width: 85%;height: 100%;background: rgba(219,188,188,0);margin-left: 7px;">
                <input type="text" name="option" style="margin: 0px;margin-left: 40px;width: 100%;height: 100%;margin-top: 0px; font-size: 20px" placeholder="Option">
            </div>
        </div>`)
        $('#parent > div input:last-child').focus()
    })
    $('#remove').click(()=>{
        if(op<2){
            alert("Min option reached op: "+op)
            return
        }
        console.log("Remove option clicked")
        op--;
        $('#parent > div:last-child').remove();
    })
})


//////////end here------------------------------------------------------------------------------

async function checkPoll() {
    console.log("Checking name of poll")
    var pollName=document.getElementById('pollName').value.replace(/\s/g, "");
    console.log(pollName)
    if(!pollName) {
        document.getElementById("ok").style.display="none";
        document.getElementById("cross").style.display="none";
        return;
    }

    if(pollName.length<2){
        document.getElementById("ok").style.display="none";
        document.getElementById("cross").style.display="none";
        document.getElementById("sub").disabled = true;

        return;
    }
    var returned=await fetch("/checkPoll?name="+pollName)
    returned.json()
        .then(d=>{
            if(d.exist)
            {
                document.getElementById("ok").style.display="inline";
                document.getElementById("cross").style.display="none";
                document.getElementById("sub").disabled = false;
            }
            else {
                document.getElementById("cross").style.display="inline";
                document.getElementById("ok").style.display="none";
                document.getElementById("sub").disabled = true;
            }
        })
}