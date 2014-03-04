<!-- #include file ="sagecrm.js" -->
<%
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

var file=Request.QueryString("file")+".asp";
var FileName=Server.mappath(file);
var dispaction=Request.QueryString("dispaction");

var fs=Server.CreateObject("Scripting.FileSystemObject")
if (fs.FileExists(FileName)==true)
{
  Server.Execute(file); 
}else{
  Response.Write("file not defined:"+file);
}

%>







