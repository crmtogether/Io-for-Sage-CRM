<!-- #include file ="sagecrm.js" -->
<%
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







