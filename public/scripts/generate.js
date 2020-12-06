console.log("Linked generate script")
console.log($("#add"))
$("#add").text('happy')
let op=0;
let alpha="ABCDEFGHIJKLMNOP"



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
// slect.append(`
//                 <tr style="height: 12px;font-size: 16px;"><td style="padding: 0px;height: 12px;width: 24%;">TID ${dis.tid }</td>
//                 <td style="padding: 0px;height: 12px;width: 40%;">${dis.NameMatch[0].fname}</td>
//                 <td style="padding: 0px;height: 12px;">
//                 <i class="fa fa-rupee" style="color: rgb(25,119,187);border-color: rgb(13,67,171);margin-left: 0px;">
//                 </i> ${dis.amount} <i class="fa fa-question-circle float-right" data-target="#transmodel" data-toggle="modal" onclick='getTransInfo(${dis.tid},this)' style="color: rgb(208,37,37);padding-top: 2px;margin-top: 2px; cursor: pointer;"></i>
//                 </td></tr>`)