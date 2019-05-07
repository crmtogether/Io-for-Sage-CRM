# Io-for-Sage-CRM
Io for Sage CRM

Created by CRM Together (crmtogether.com) "Io for Sage CRM" is a library of client and 
server side code that is used to customize Sage CRM system pages.

Supported Sage CRM 2018 and 2019

To include it in a screen just add the following code

<script>

$(document).ready(function () {

    $.getScript("../custompages/ioforsagecrm/io.js");

    $.getScript("../custompages/ioforsagecrm/crmtogether.js");

});

</script>

OR

<script src="../custompages/pathtofile/commlist.js" type="text/javascript" language="JavaScript"></script>

OR

Add the file "io.js" to the CRM folder

  CRM\WWWRoot\js\custom

The code downloads and packages up as a Sage CRM component installing into 

  /custompages/ioforsagecrm/

crmtogether.js is an example file showing how to use Io

