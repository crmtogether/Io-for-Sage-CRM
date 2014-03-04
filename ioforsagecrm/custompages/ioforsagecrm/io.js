/******

Copyright 2013 'CRM Together' - www.crmtogether.com

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.


*******/

/******
 *
 *Requires JQuery
 *  
*******/     

var G_CRMNative=false;
try{
  if (crm+""!="undefined")
  {
    G_CRMNative=true;
  }         
}catch(e){
  //do nothing yet
}

if (!G_CRMNative)
{

  function CRMObject() {
    this.mainTable=$(".ROWGap").parent().parent().parent();
    this.companyboxlong=this.getBox("Company", false);
    this.personboxlong=this.getBox("Contact", false);
  
    this.addressboxlong=this.getBox("Address", true);
    this.phoneemailbox=this.getBox("Phone/E-mail", true);
    
  }
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

CRMObject.prototype.addLinkedIn = function (fieldName,div) {
	this.addToButtonGroup("<span id=\"bofa\"></span><span id=\"bofacc\"></span>");
	$.getScript("http://www.linkedin.com/companyInsider?script&useBorder=no")
		.done(function(script, textStatus) {
				waitForLinkedIn(fieldName);
		})
		.fail(function(jqxhr, settings, exception) {
		  //alert(exception);//IE may fail as Linkedin does not support it fully
	});
}

function waitForLinkedIn(fieldName){
    if(typeof LinkedIn !== "undefined"){
				var dval = document.getElementById("_Data"+fieldName).innerHTML;
				new LinkedIn.CompanyInsiderBox(div,dval);//div should be "bofa"
    }
    else{   
        setTimeout(function(){
            waitForLinkedIn(fieldName);
        },1000);
    }
}

CRMObject.prototype.insertInfo = function (htmlData, rowIndex, action) {
  CRMIO.infoMsg(htmlData);
}
CRMObject.prototype.infoMsg= function (msg) {
  $('#WkRl').html('<span class="InfoContent"  >'+msg+'</span>');
  $('#WkRl').show();
}

CRMObject.prototype.highLightStructure = function () {
  //$(".ROWGap").css("border","3px solid red"); 
  $("table tr td").css("border","1px solid red"); 
}

CRMObject.prototype.insertData = function (htmlData, rowIndex, action) {
  $(".ROWGap").get()[rowIndex].innerHTML=htmlData;
  if ($("#"+action+"Container").get(0)+""!="undefined"){
    var Container=$("#"+action+"Container").get(0);
    $(Container.childNodes[0].childNodes[0].childNodes[0].cells[1]).hide();
  }
}


CRMObject.prototype.buildUrl = function (PagePath) {
  var strFileName = PagePath;
  var strPath = document.URL;
  if (strPath.indexOf("eware.dll")!=-1)
  {
    var arrayApp = strPath.split("eware.dll");  
    PagePath="CustomPages/"+PagePath;
  }else{
    var arrayApp = strPath.split("CustomPages");
    arrayApp[0]+="CustomPages/";
  }
  var arrayContext = strPath.split("?");
  var strAppPath = arrayApp[0];
  var strContextInfo = arrayContext[1];
  strAddr= strAppPath + PagePath+"?"+strContextInfo+"&";
  return strAddr; 
}

CRMObject.prototype.getData = function (url, callback, params, action) {
	$.get(url, function(data) {
		callback(data,params, action);
	}).error(function(xhr, statusText) {
    alert('Error:'+xhr.responseText); // or whatever
});
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
  
var CRMIO = new CRMObject();



