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
 *Requires IO for Sage CRM
 *  
*******/

function waitForCRMIO(fieldName){
    if(typeof CRMIO !== "undefined"){
			CRMTogetherIO(); // we wrap this to prevent IE from causing issues
    }
    else{   
        setTimeout(function(){
            waitForCRMIO(fieldName);
        },250);
    }
}

$(document).ready(function() {
  waitForCRMIO();//call our load function
});

function CRMTogetherIO()
{
  if(CRMIO.getScreenMode("comp_name")==0)
  {
  	//CRMIO.highLightStructure();
  	CRMIO.infoMsg("Customised Company System Page");
  		
  //	CRMIO.hideBox(CRMIO.personboxlong);
  	CRMIO.insertData("Loading data...",0);
  	//file is the file that contains the dispatcher actions to use
  	//dispaction is the action in the server file
  	//var url=CRMIO.buildUrl("ioforsagecrm/dispatcher.asp")+"&1=1&file=crmtogether&dispaction=person";
  	//CRMIO.getData(url,CRMIO.insertData,0, "person");
  	//show financial data
  	var url2=CRMIO.buildUrl("ioforsagecrm/dispatcher.asp")+"&1=1&file=crmtogether&dispaction=companysummary";
  	CRMIO.insertData("Loading data...",0);
  	CRMIO.getData(url2,CRMIO.insertData,0, "piechart");
  	
  	//add linked in to the page
  	CRMIO.addLinkedIn("comp_name","bofa");
  	
  //	var url=CRMIO.buildUrl("ioforsagecrm/dispatcher.asp")+"&1=1&file=crmtogether&dispaction=company_status";
  	//CRMIO.getData(url,CRMIO.insertInfo,1, "person");
  	  	
  }
}