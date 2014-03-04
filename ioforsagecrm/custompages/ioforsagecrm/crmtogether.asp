<!-- #include file ="sagecrm.js" -->
<%


var dispaction=Request.QueryString("dispaction");
if (dispaction=="company_status")
{
  var comp_companyid=CRM.GetContextInfo("company","comp_companyid");
  var oppo_sql="select count (*) as 'count' from vOpportunity where oppo_status='In Progress' and oppo_primarycompanyid="+comp_companyid;
  var rec=CRM.CreateQueryObj(oppo_sql);
  rec.SelectSQL();
  if(!rec.eof)
  {
    if (rec('count')!="0")
	{
      Response.Write("Current Opportunities in progress:"+rec('count'));
	}	
  }
  Response.End();
}else

if (dispaction=="company")
{
  var comp_companyid=CRM.GetContextInfo("company","comp_companyid");
  var compRec=CRM.FindRecord("company","comp_companyid="+comp_companyid);
  var PersonContainer=CRM.GetBlock("companyboxlong");
  block.DisplayButton(1)=false;
  block.DisplayForm=false;
  block.Title="Company";
  Response.Write("<br /><div id=\""+dispaction+"Container\" >"+block.Execute(compRec)+"</div><br />");
  Response.End();
}else
if (dispaction=="person")
{
  var pers_personid=CRM.GetContextInfo("company","comp_primarypersonid");
  var comp_companyid=CRM.GetContextInfo("company","comp_companyid");
//Response.Write("==="+pers_personid);

  if ((pers_personid=="")||(pers_personid=="undefined"))
  {
    var RecentValue=new String(Request.QueryString("RecentValue"));
	var RecentValue_Arr=RecentValue.split("X");
    var comp_companyid=RecentValue_Arr[2];
	var prec=CRM.FindRecord("company","comp_companyid="+comp_companyid);
	if (!prec.eof)
	{
	  pers_personid=prec("comp_primarypersonid");
	}
  }
  var persRec=CRM.FindRecord("person,vpersonpe","pers_personid="+pers_personid);
  var block=CRM.GetBlock("personboxshort");
  block.DisplayButton(1)=false;
  block.DisplayForm=false;
  block.Title="Contact";
  Response.Write("<br /><div id=\""+dispaction+"Container\" >"+block.Execute(persRec)+"</div><br />");
  Response.End();    
}else
if (dispaction=="financial")
{
  var pers_personid=CRM.GetContextInfo("person","pers_personid");
  var persRec=CRM.FindRecord("person,vpersonpe","pers_personid="+pers_personid);
  var block=CRM.GetBlock("personboxshort");
  block.DisplayButton(1)=false;
  block.DisplayForm=false;
  block.Title="Contact";
  Response.Write("<br /><div id=\""+dispaction+"Container\" >"+block.Execute(persRec)+"</div><br />");
  Response.End();
}else
if (dispaction=="companysummary")
{
	Response.Write("<table><tr>");
	Response.Write("<td>Cases by source</td><td>Opportunities quotes by stage</td>");
	Response.Write("</tr><tr>");

	var strSQL = "select case_source as Source, count(case_source) as CountOfSource from cases group by  case_source"; 
	var chartblock=CRM.GetBlock("chart");
	chartblock.DisplayForm=false;
	with(chartblock)
	{
		SQLText= strSQL;
		Stylename("Pie");
		xlprop="Source";
		yprop="CountOfSource";
		ImageWidth=400;
	}
	Response.Write("<td>"+chartblock.Execute()+"</td>");

	var strSQL2 = "select oppo_stage as stage, sum(ISNULL(oppo_totalQuotes,0)) as totalQuotes from opportunity group by oppo_stage"; 
	var chartblock2=CRM.GetBlock("chart");
	chartblock2.DisplayForm=false;
	with(chartblock2)
	{
		SQLText= strSQL2;
		Stylename("Pie");
		xlprop="stage";
		yprop="totalQuotes";
		ImageWidth=400;
	}
	Response.Write("<td>"+chartblock2.Execute()+"</td>");
  
  Response.Write("</tr></table>");		
}else
if (dispaction=="piechart")
{
	var strSQL = "SELECT [FirstName] + ' ' + [LastNAme] AS Employee, "+
				"         Count(ord.OrderID) AS CountOfOrderID "+
				" FROM northwind.dbo.Employees Employees INNER JOIN northwind.dbo.Orders ord "+
				"     ON Employees.EmployeeID = ord.EmployeeID "+
				" GROUP BY [FirstName] + ' ' + [LastNAme]"; 
	var chartblock=CRM.GetBlock("chart");
	chartblock.DisplayForm=false;
	with(chartblock)
	{
		SQLText= strSQL;
		Stylename("Pie");
		xlprop="Employee";
		yprop="CountOfOrderID";
		ImageWidth=900;
	}
	Response.Write(chartblock.Execute());
}else
if (dispaction=="comp_source")
{
  var sql="SELECT [CategoryID],[CategoryName],[Description],[Picture] FROM [Northwind].[dbo].[Categories]";
  if (Request.QueryString("fieldvalue")+""!=="undefined")
  {
      sql+=" where CategoryName='"+Request.QueryString("fieldvalue")+"'";
	  var queryobj=CRM.CreateQueryObj(sql);
	  queryobj.SelectSQL();
	  if (!queryobj.eof){
	    Response.Write(queryobj("Description"));
		Response.End();
	  }
  }
  var queryobj=CRM.CreateQueryObj(sql);
  queryobj.SelectSQL();
  var res="";
  while (!queryobj.eof)
  {
    res+="<option value=\""+queryobj("CategoryName")+"\">"+queryobj("Description")+"</option>"
    queryobj.NextRecord();
  }
  res+="<option value=\"\">--None--</option>";
  Response.Write(res);
}
else{

Response.Write("dispaction not defined:"+dispaction);

}


%>