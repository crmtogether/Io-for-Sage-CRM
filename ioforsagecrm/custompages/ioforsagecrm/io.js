
console.log('Loading js/io.js');
var CRMIO = null;
//examples
crm.ready(function()
{


  CRMIO = new CRMObject(); 
  //CRMIO.infoMsg("IO loaded");
  //CRMIO.highLightStructure();
  //CRMIO.insertData("Hello world",0); //under Company summary
  //CRMIO.insertData("Hello world",1);//under address etc
  //var _url=CRMIO.buildUrl('ioserver/dispatcher.asp');
  //alert(_url);
  //CRMIO.insertData("Loading...",0)
  //CRMIO.getData(_url, CRMIO.insertData,0, '','getperson');
  
  //hide system contact box
  //CRMIO.hideBox(CRMIO.personboxlong);
  
  //pie chart demo
  //CRMIO.getData(_url, CRMIO.insertData,0, '','piechart');
  
});

function __GetKeys() {
    var res = "";
    try {
        res = GetKeys();
    } catch (e) { }

    return res;
}

CRMObject.prototype.getData = function (__url, callback, _row, postdata, action) {
	if (action)
	{
		__url+="&dispaction="+action;
	}
    $.ajax({
        type: "post",
        url: __url,
        dataType: "text",
        data: postdata,
        async: true,
        crossDomain: true,
        beforeSend: function () {
        },
        timeout: 100000,
        error: function (request, error, status) {
            console.log('Request Data:' + postdata);
            console.log("ERROR: " + error + "\nStatus:" + status + "\nData:" + request.responseText);
        },
        success: function (requestresult) {
            callback(requestresult,_row, action);
        } // End success
    }); // End ajax method
}


function CRMObject() {
	this.mainTable=$(".ROWGap").parent().parent().parent();
	this.companyboxlong=this.getBox("Company", false);
	this.personboxlong=this.getBox("Contact", false);

	this.addressboxlong=this.getBox("Address", true);
	this.phoneemailbox=this.getBox("Phone/E-mail", true); 
}
//returns an array with pointer to header, body and footer
CRMObject.prototype.getBox = function (boxName,split) {
    var res=new Array(2);
    var elm_col=document.getElementsByTagName("A");
	for(var i=0;i<elm_col.length;i++)
	{
     	 var elm=elm_col[i];
 	     var boxText=new String($(elm).text());
		 if (boxText.indexOf(boxName)==0)  
		 {		   
		   if (!split)
		   {
			   res[0]=$(elm).parent().parent().parent().parent().parent().parent();
			   res[1]=res[0].next();
			   res[2]=res[1].next();
		   }else{
			   res[0]=$(elm).parent().parent();			  
			   var tbl_col=res[0].get(0).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("TABLE");
			   res[1]=$(tbl_col[2].parentNode);
			   res[2]=$(tbl_col[2].parentNode.previousSibling);			   
		   }
		   return res;
		   break;
		 }   
    }
}

CRMObject.prototype.hideBox = function (obj) {
  obj[0].hide();
  obj[1].hide();
  obj[2].hide();
}

CRMObject.prototype.insertInfo = function (htmlData, rowIndex, action) {
  CRMIO.infoMsg(htmlData);
}
CRMObject.prototype.infoMsg= function (msg) {
  crm.infoMessage(msg);
}

CRMObject.prototype.highLightStructure = function () {
  //$(".ROWGap").css("border","3px solid red"); 
  $("table tr td").css("border","1px solid red"); 
}

CRMObject.prototype.insertData = function (htmlData, rowIndex, action) {
	if (!rowIndex)
		rowIndex=0;
  $($(".ROWGap").get()[rowIndex]).append(htmlData);
  if ($("#"+action+"Container").get(0)+""!="undefined"){
    var Container=$("#"+action+"Container").get(0);
   // $(Container.childNodes[0].childNodes[0].childNodes[0].cells[1]).hide();
  }
}


CRMObject.prototype.buildUrl = function (PagePath) {
  return crm.url(PagePath);
}

CRMObject.prototype.getButtonGroup = function () {
	return $(".ButtonGroup");
}

CRMObject.prototype.addToButtonGroup = function (data) {
  $('.ButtonGroup tr:last').after("<tr><td>"+data+"</td></tr>");
}

CRMObject.prototype.getScreenMode = function (fieldToCheck) {
	var form_action=new String($(document.forms[0]).attr("action"));
	if(document.getElementById(fieldToCheck)==null)
	{
	  return 0;
	}else{
	  return 1;
	}
}

CRMObject.prototype.smartLookup = function (fieldName) {
    if(CRMIO.getScreenMode("comp_name")==1)
    {
		//clear the options
		$("#"+fieldName).html("");
		var url=CRMIO.buildUrl("ioforsagecrm/dispatcher.asp")+"&1=1&file=crmtogether&dispaction="+fieldName;
		$.get(url, function(data) {
			CRMIO.smartLookupCallBack(data,fieldName);
		});
	}else{
	    var currentValue="";
	    $.each($("input[type='hidden']"), function (index, value) {
			//compare name attribute to get the required element
			if ($(value).attr("name")==("_HIDDEN"+fieldName))
			{
			  currentValue=($(value).val());
			}
		});		
		var url=CRMIO.buildUrl("ioforsagecrm/dispatcher.asp")+"&1=1&file=crmtogether&dispaction="+fieldName+"&fieldvalue="+currentValue;
		$.get(url, function(data) {
			CRMIO.smartLookupCallBack(data,fieldName);
		});	
	}
}

CRMObject.prototype.smartLookupCallBack = function (htmlData, fieldName) {
  if(CRMIO.getScreenMode("comp_name")==0)
    {
	$("#_Data"+fieldName).text(htmlData);
	return;
	}
  $("#"+fieldName).html(htmlData);
  //crm stores the current value in _HIDDENfieldname EG_HIDDENcomp_source
  //these _HIDDEN fields do not have their ID attribute set which causes a problem with using jquery
  var currentValue="";
  //loop through all inputs that are hidden
  $.each($("input[type='hidden']"), function (index, value) {
    //compare name attribute to get the required element
    if ($(value).attr("name")==("_HIDDEN"+fieldName))
	{
      currentValue=($(value).val());
	}
  });
  $("#"+fieldName).val(currentValue);
}
