console.log("Linked generate script")
let op=0;
let alpha="ABCDEFGHIJKLMNOP"
let show=1;

$(()=>{
    let progress=$("#par > div >div:first-child >div>div")
    let votes=$("#par > div >div:last-child >div>p")
    let pollName=$("#pollNaam").text()
    console.log(pollName)
    setInterval(updatePoll, 1000);

    // updatePoll()
    async function updatePoll(){
        let values;
        let total=0;
        var returned=await fetch("/getPollVal?name="+pollName)
        returned.json()
            .then(d=>{

                console.log(d[0].value)
                values=d[0].value;
                if (d[0].totalPolls===0){
                    total=0;
                }
                else {
                    total=100/d[0].totalPolls;
                }
                // console.log("total: "+total)
                progress.each((key,ele)=>{
                    let percent=Math.round(values[key]*total);
                    // console.log(key+" %: "+percent+" val: "+values[key])
                    $(ele).text(percent+" %")
                    $(ele).css("width",percent+"%")
                })
                votes.each((key,ele)=>{
                    $(ele).text("Votes: "+values[key])
                })
                if (show%2===0){
                    $("#live").show()
                    show++;
                }
                else {
                    $("#live").hide()
                    show++;
                }
                console.log("Calling rep")
            })

    }
    console.log("Start jquery")
})

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


async function checkPoll() {
    console.log("Checking name of poll")
    var pollName=document.getElementById('pollName').value;
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