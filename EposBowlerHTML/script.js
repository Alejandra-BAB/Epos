
// Function to search for customers 
var searchCustomers = function(){
    var customers, response, data ;
    //var customers = EposnowAPI.Customers.getAll();
    var xhttp = new XMLHttpRequest();
    var txt = "";
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText);
            data = JSON.stringify(response, function(key, value) {
                return (value == null) ? "" : value
              });
            response = JSON.parse(data);
            customers = response.data;
            
            data = { target: customers };
            var template = _.template($("#tpl-customers").text());
            $("#searchResult").html(template(data));

         }
    };
    var url = "https://ws2.backalleybowling.com/zohocrm/searchForBucks?word="+$('#search').val();
    xhttp.open("Get", url);
    xhttp.send();
    
}
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}


