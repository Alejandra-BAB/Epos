        //set up API
        var token = "WldIVkRRSVkxODFBTTI0WlMwUEhLSEdLUkhUQU1YSDU6U1ZaWUNaMDgzODJCMTBCSUVBUlVCSTY1M0RVRUpaVDA=";
        EposnowAPI.setAccessToken(token);
        // required for the data to be send to the Till
        
        window.onmessage = function (event) {
        event.source.postMessage(JSON.stringify(tillData), event.origin);
        };
        
        
        //Get Transaction Info
        var deviceId = EposnowAPI.getDeviceID();
        var locationId = EposnowAPI.getLocationID();
        var staffId = EposnowAPI.getStaffID();
        var customerId = EposnowAPI.getCustomerID();
        var transactionTotalValue = EposnowAPI.getTransactionTotalValue();
        var transactionRemainingBalance = EposnowAPI.getTransactionRemainingBalance();
        var transactionProducts = EposnowAPI.getTransactionProducts();
        
        
        //Add function to initialize TillData object.
        var tillData = new EposnowAPI.TillData();
        
        //Add Tender to the current transaction
        var tenderTypeId = 7932;
        var tenderAmount = 0.10;
        var change = 0;
        var tender = new EposnowAPI.Tender(null,tenderTypeId,tenderAmount,change,null,null);
        tillData.Tenders.push(tender);
        
        //Add TransactionDetail to the current transaction
        var detailName = "xChargeData";
        var value = [];
        var transactionDetail = new EposnowAPI.TransactionDetail(detailName, value);
        tillData.TransactionDetails.push(transactionDetail);
        var detailName = "xPrechargeData";
        var value = [];
        var transactionDetail = new EposnowAPI.TransactionDetail(detailName, value);
        tillData.TransactionDetails.push(transactionDetail);
        
        //or you can add Discount to the current transaction by adding a percetage
        tillData.Discount = {reasonId: 1,percentage: 10};
        
        var allProducts = EposnowAPI.Products.getAll();
        
        document.getElementById("deviceID").innerHTML = JSON.stringify(deviceId);
        document.getElementById("locationID").innerHTML = JSON.stringify(locationId);
        document.getElementById("staffID").innerHTML = JSON.stringify(staffId);
        document.getElementById("customerID").innerHTML = JSON.stringify(customerId);
        document.getElementById("transTotal").innerHTML = JSON.stringify(transactionTotalValue);
        document.getElementById("transRemaining").innerHTML = JSON.stringify(transactionRemainingBalance);
        document.getElementById("transProducts").innerHTML = JSON.stringify(transactionProducts);
        document.getElementById("tillData").innerHTML = JSON.stringify(tillData);
        document.getElementById("tender").innerHTML = JSON.stringify(tender);
        document.getElementById("transDetail").innerHTML = JSON.stringify(transactionDetail);
        document.getElementById("discount").innerHTML = JSON.stringify(allProducts[2]);
        
        
        function input(e) {
            var tbInput = document.getElementById("tbInput");
            var inputStr = tbInput.value;
            var period = inputStr.indexOf('.');
            var length = inputStr.length;
            if(length<8)
            {
                if(period>=0)
                {
                    if(length<=period+2 && e!='.')
                    {
                        tbInput.value = tbInput.value + e;
                    }
                }
                else
                {
                    tbInput.value = tbInput.value + e;
                }
            }
        }
         
        function del() {
            var tbInput = document.getElementById("tbInput");
            if(tbInput.value.length>1)
            {
                tbInput.value = tbInput.value.substr(0, tbInput.value.length - 1);
            }
        }
        
        function charge(type,amt) {
            var newcharge;
            var amtString = amt.substring(1,amt.length);
            var chargeStr = parseFloat(amtString);
            if(chargeStr)
            {
                chargeStr = chargeStr.toFixed(2);
            if(type == 1)
            {
                newcharge = "<br><br><br><li class='cardUsed'>DEBIT ... 8108</li><li class='amtCharged'>$"+chargeStr+"</li>";
            }
            else {
                newcharge = "<br><br><br><li class='cardUsed'>CREDIT ... 8018</li><li class='amtCharged'>$"+chargeStr+"</li>";
            }
            $('#list').append(newcharge);
        
            var newTender = new EposnowAPI.Tender(null,7932,chargeStr,0,null,null);
            tillData.Tenders.push(newTender);
            document.getElementById("tillData").innerHTML = JSON.stringify(tillData);
            //JSON.parse(tillData);
            var xChargeData = tillData.TransactionDetails[0].Details.push({"amt": parseFloat(chargeStr), "card": 8976, "tip": 3.79});
            var xPrechargeData = tillData.TransactionDetails[1].Details.push({"amt": parseFloat(chargeStr), "card": 8976});
        
           document.getElementById("tillData").innerHTML = JSON.stringify(tillData);
        
            }
        }