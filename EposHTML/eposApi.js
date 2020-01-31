var EposnowAPI = function() {
    "use strict";
    var e, t, i, l = {},
        p = {},
        s = "2";
    return p.getAccessToken = function() {
        return e
    }, p.getVersion = function() {
        return s
    }, p.getParameterByName = function(t) {
        t = t.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var e = new RegExp("[\\?&]" + t + "=([^&#]*)").exec(location.search);
        return null === e ? "" : decodeURIComponent(e[1].replace(/\+/g, " "))
    }, l.getDeviceID = function() {
        return p.getParameterByName("deviceID")
    }, l.getLocationID = function() {
        return p.getParameterByName("locationID")
    }, l.getStaffID = function() {
        return p.getParameterByName("staffID")
    }, l.getUsername = function() {
        return p.getParameterByName("username")
    }, l.getLocationAreaID = function() {
        return p.getParameterByName("locationAreaID")
    }, l.getFromDate = function() {
        return p.getParameterByName("fromDate")
    }, l.getToDate = function() {
        return p.getParameterByName("toDate")
    }, l.getSearchParameter = function() {
        return p.getParameterByName("searchParameter")
    }, l.getSource = function() {
        return p.getParameterByName("source")
    }, l.getCustomerID = function() {
        return p.getParameterByName("customerId")
    }, l.getTransactionTotalValue = function() {
        return p.getParameterByName("transactionTotal")
    }, l.getTransactionRemainingBalance = function() {
        return p.getParameterByName("remainingBalance")
    }, l.getTransactionProducts = function() {
        return p.getParameterByName("productIds").split(",")
    }, l.getTransactionItems = function() {
        var t = p.getParameterByName("products");
        return t ? JSON.parse(t) : []
    }, l.getTransactionMiscItems = function() {
        var t = p.getParameterByName("miscProducts");
        return t ? JSON.parse(t) : []
    }, l.TillData = function() {
        this.MiscItems = new Array, this.Products = new Array, this.Tenders = new Array, this.TransactionDetails = new Array
    }, p.ApiFunctions = function(t) {
        var n = "GET",
            o = t;
        this.getAllSearch = function(t, i, e) {
            if (t instanceof Array && i instanceof Array && t.length == i.length) {
                var s = "?";
                return t.forEach(function(t, e) {
                    s += t + "=" + i[e] + "&"
                }), s = s.substring(0, s.length - 1), p.validateRequest(o, s, n, null, e)
            }
            return p.validateRequest(o, "?" + encodeURIComponent(t) + "=" + encodeURIComponent(i), n, null, e)
        }, this.getAllWhere = function(t, e, i, s) {
            return p.validateRequest(o, "?search=(" + encodeURIComponent(t + "|" + e + "|" + i) + ")", n, null, s)
        }, this.getAllOrderBy = function(t, e) {
            return p.validateRequest(o, "?OrderBy=" + encodeURIComponent(t), n, null, e)
        }, this.getAllOrderByDesc = function(t, e) {
            return p.validateRequest(o, "?OrderByDesc=" + encodeURIComponent(t), n, null, e)
        }, this.getAll = function(t) {
            return p.validateRequest(o, null, n, null, t)
        }, this.get = function(t) {
            return p.validateRequest(o, "/" + t, n, null, null)
        }, this.create = function(t) {
            return p.validateRequest(o, null, "POST", t, null)
        }, this.update = function(t, e) {
            return p.validateRequest(o, "/" + t, "PUT", e, null)
        }, this.delete = function(t) {
            return p.validateRequest(o, "/" + t, "DELETE", null, null)
        }
    }, p.uri = "https://api.eposnowhq.com/api/", p.validateRequest = function(t, e, i, s, n) {
        var o = p.getAccessToken(),
            r = p.getVersion(),
            a = !0,
            c = p.uri,
            u = !1,
            h = null;
        if (o || (l.setAccessToken(p.getParameterByName("appToken")), o = p.getAccessToken()), o) {
            if ("1" === r) switch (t) {
                case "Transaction":
                case "TransactionItem":
                case "BaseItem":
                case "Tender":
                case "CompleteTransaction":
                case "DiscountReason":
                case "Device":
                    a = !1, console.log("You must use version 2 of the API to access this feature.")
            }
            if (a) return c += "integration/appsettings" === t ? t : "V" + r + "/" + t, e && (u = !0, c += e), n && (c += u ? "&" : "?", c += "page=" + n), p.sendRequest(c, i, s, o).done(function(t) {
                h = t
            }), h
        }
    }, p.sendRequest = function(t, e, i, s) {
        var n = {
            url: t,
            type: e,
            contentType: "application/json",
            accepts: "application/json",
            dataType: "json",
            crossDomain: !0,
            async: !1,
            beforeSend: function(t) {
                t.setRequestHeader("Authorization", "Basic " + s)
            },
            error: function(t) {
                throw console.log("Error code: " + t.status), console.log(t.responseText), "Error when sending request to EposNow API, Error Code:" + t.status + ", Error Message:" + t.responseText
            }
        };
        return "GET" !== e && (n.data = JSON.stringify(i)), $.ajax(n)
    }, p.getAsyncRequest = function(t, e, i, s) {
        var n = {
            url: t,
            type: e,
            contentType: "application/json",
            accepts: "application/json",
            dataType: "json",
            crossDomain: !0,
            async: !0,
            beforeSend: function(t) {
                t.setRequestHeader("Authorization", "Basic " + s)
            },
            error: function(t) {
                console.log("Error when sending request to EposNow API, Error Code:" + t.status + ", Error Message:" + t.responseText)
            }
        };
        return "GET" !== e && (n.data = JSON.stringify(i)), $.ajax(n)
    }, l.setAccessToken = function(t) {
        t ? 88 === (t = t.replace(/ /g, "")).length ? e = t : console.log("Please check your API access token is correct.") : console.log("Please set your API access token.")
    }, l.setVersion = function(t) {
        if (t) switch (t = t.toString()) {
            case "1":
            case "2":
                s = t;
                break;
            default:
                console.log("Please select a valid API version number.")
        } else console.log("Please enter a valid API version number.")
    }, l.Category = function(t, e, i, s, n, o, r, a, c, u) {
        this.CategoryID = t, this.Name = e, this.Description = i, this.ParentID = s, this.ShowOnTill = n, this.Wet = o, this.ButtonColourID = r, this.SortPosition = a, this.ReportingCategoryID = c, this.NominalCode = u
    }, l.Categories = new p.ApiFunctions("Category"), l.Product = function(t, e, i, s, n, o, r, a, c, u, h, l, p, D, m, I, d, f, T, g, A, P, C, S, y, k, N, R, B, v, w) {
        this.ProductID = t, this.Name = e, this.Description = i, this.CostPrice = s, this.SalePrice = n, this.EatOutPrice = o, this.CategoryID = r, this.Barcode = a, this.TaxRateID = c, this.EatOutTaxRateID = u, this.BrandID = h, this.SupplierID = l, this.PopupNoteID = p, this.UnitOfSale = D, this.VolumeOfSale = m, this.MultiChoiceID = I, this.ColourID = d, this.VariantGroupID = f, this.Size = T, this.Sku = g, this.SellOnWeb = A, this.SellOnTill = P, this.OrderCode = C, this.ButtonColourID = S, this.SortPosition = y, this.MagentoAttributeSetID = k, this.CostPriceTaxRateID = R, this.RRPrice = N, this.ProductType = B, this.TareWeight = v, this.ArticleCode = w
    }, l.Products = new p.ApiFunctions("Product"), l.ProductComposition = function(t, e, i, s) {
        this.ProductCompositionID = t, this.PurchasedProductID = e, this.MasterProductID = i, this.Amount = s
    }, l.ProductCompositions = new p.ApiFunctions("ProductComposition"), l.Brand = function(t, e, i) {
        this.BrandID = t, this.Name = e, this.Description = i
    }, l.Brands = new p.ApiFunctions("Brand"), l.PopupNote = function(t, e, i) {
        this.PopupNoteID = t, this.ShortDesc = e, this.Description = i
    }, l.PopupNotes = new p.ApiFunctions("PopupNote"), l.TaxRate = function(t, e, i, s, n) {
        this.TaxRateID = t, this.Percentage = e, this.Name = i, this.Description = s, this.TaxCode = n
    }, l.TaxRates = new p.ApiFunctions("TaxRate"), l.MiscItem = function(t, e, i, s, n) {
        this.Name = t, this.Value = e, this.Price = e, this.TaxRateID = i, this.TaxGroupID = n, this.MiscProductID = s
    }, l.MiscItems = new p.ApiFunctions("MiscProductItem"), l.MultipleChoiceNote = function(t, e, i) {
        this.MultipleChoiceNoteID = t, this.Name = e, this.PopupByDefault = i
    }, l.MultipleChoiceNotes = new p.ApiFunctions("MultipleChoiceNote"), l.MultipleChoiceOption = function(t, e, i) {
        this.MultipleChoiceOptionID = t, this.Message = e, this.NoteID = i
    }, l.MultipleChoiceOptions = new p.ApiFunctions("MultipleChoiceOption"), l.MultipleChoiceProduct = function(t, e, i, s, n) {
        this.MultipleChoiceProductID = t, this.ProductID = e, this.MultipleChoiceProductGroupID = i, this.SalePrice = s, this.EatOutPrice = n
    }, l.MultipleChoiceProducts = new p.ApiFunctions("MultipleChoiceProduct"), l.MultipleChoiceProductGroup = function(t, e, i) {
        this.MultipleChoiceProductGroupID = t, this.Name = e, this.Description = i
    }, l.MultipleChoiceProductGroups = new p.ApiFunctions("MultipleChoiceProductGroup"), l.MultipleChoiceProductGroupItem = function(t, e, i, s) {
        this.MultipleChoiceProductGroupItemID = t, this.ProductID = e, this.MultipleChoiceProductGroupID = i, this.TillOrder = s
    }, l.MultipleChoiceProductGroupItems = new p.ApiFunctions("MultipleChoiceProductGroupItem"), l.Customer = function(t, e, i, s, n, o, r, a, c, u, h, l, p, D, m, I, d) {
        this.CustomerID = t, this.Title = e, this.Forename = i, this.Surname = s, this.BusinessName = n, this.DateOfBirth = o, this.ContactNumber = r, this.ContactNumber2 = a, this.EmailAddress = c, this.Type = u, this.MaxCredit = h, this.CurrentBalance = l, this.ExpiryDate = p, this.CardNumber = D, this.CurrentPoints = m, this.SignUpDate = I, this.Notes = d
    }, l.Customers = new p.ApiFunctions("Customer"), l.CustomerAddress = function(t, e, i, s, n, o, r, a, c) {
        this.CustomerAddressID = t, this.CustomerID = e, this.IsMainAddress = i, this.Name = s, this.AddressLine1 = n, this.AddressLine2 = o, this.Town = r, this.County = a, this.PostCode = c
    }, l.CustomerAddresses = new p.ApiFunctions("CustomerAddress"), l.CustomerType = function(t, e, i, s, n, o) {
        this.CustomerTypeID = t, this.Name = e, this.Discount = i, this.Description = s, this.DefaultExpiryLength = n, this.DefaultMaxCredit = o
    }, l.CustomerTypes = new p.ApiFunctions("CustomerType"), l.CustomerRating = function(t, e, i, s, n, o, r) {
        this.CustomerRatingID = t, this.CustomerID = e, this.TransactionID = i, this.DateTime = s, this.Ratings = n, this.Comment = o, this.Source = r
    }, l.CustomerRatings = new p.ApiFunctions("CustomerRating"), l.CustomerCredit = function(t, e, i, s) {
        this.CustomerID = t, this.CreditToAdd = e, this.StaffID = i, this.TenderTypeID = s
    }, l.CustomerCredits = new p.ApiFunctions("CustomerCredit"), l.CustomerPoint = function(t, e, i) {
        this.CustomerID = t, this.PointsToAdd = e, this.StaffID = i
    }, l.CustomerPoints = new p.ApiFunctions("CustomerPoints"), l.Booking = function(t, e, i, s, n, o, r, a, c, u, h, l) {
        this.BookingID = t, this.BookingItemID = e, this.CustomerID = o, this.BookingStatusID = i, this.StaffID = n, this.StartDateTime = c, this.Duration = r, this.Notes = a, this.CreatedStaffID = u, this.CreatedDateTime = s, this.UpdatedStaffID = l, this.UpdatedDateTime = h
    }, l.Bookings = new p.ApiFunctions("Booking"), l.BookingCustomer = function(t, e, i, s, n) {
        this.BookingCustomerID = t, this.BookingID = e, this.CustomerID = i, this.GroupSize = s, this.Notes = n
    }, l.BookingCustomers = new p.ApiFunctions("BookingCustomer"), l.BookingItem = function(t, e, i, s, n, o, r) {
        this.BookingItemID = t, this.BookingItemTypeID = e, this.Description = i, this.LocationID = s, this.MaxOccupancy = n, this.Name = o, this.Notes = r
    }, l.BookingItems = new p.ApiFunctions("BookingItem"), l.ProductStock = function(t, e, i, s, n, o, r, a, c) {
        this.StockID = t, this.LocationID = e, this.ProductID = i, this.CurrentStock = s, this.MinStock = n, this.MaxStock = o, this.CurrentVolume = r, this.Alerts = c, this.OnOrder = a
    }, l.ProductStocks = new p.ApiFunctions("ProductStock"), l.StockTransfer = function(t, e, i, s, n, o, r, a, c, u, h) {
        this.StockTransferID = t, this.TransNo = e, this.FromLocation = i, this.ToLocation = s, this.StaffSent = n, this.StaffReceived = o, this.ReasonID = u, this.Note = h, this.DateSent = r, this.DateReceived = a, this.Status = c
    }, l.StockTransfers = new p.ApiFunctions("StockTransfer"), l.StockTransferItem = function(t, e, i, s, n, o, r, a) {
        this.StockTransferItemID = t, this.StockTransferID = e, this.ProductID = i, this.QtySent = s, this.QtyReceived = n, this.ItemReasonID = o, this.QtyNewFrom = r, this.QtyNewTo = a
    }, l.StockTransferItems = new p.ApiFunctions("StockTransferItem"), l.StockTransferReason = function(t, e) {
        this.StockTransferReasonID = t, this.Description = e
    }, l.StockTransferReasons = new p.ApiFunctions("StockTransferReason"), l.PurchaseOrder = function(t, e, i, s, n, o, r, a, c) {
        this.PurchaseOrderID = t, this.OrderRef = e, this.DateOrdered = i, this.Note = s, this.SupplierID = n, this.LocationID = o, this.Status = r, this.ExpectedDeliveryDate = c, this.DateCompleted = a
    }, l.PurchaseOrders = new p.ApiFunctions("PurchaseOrder"), l.PurchaseOrderItem = function(t, e, i, s, n, o) {
        this.PurchaseOrderItemID = t, this.PurchaseOrderID = e, this.ProductID = i, this.QtyOrdered = s, this.QtyReceived = n, this.CostPrice = o
    }, l.PurchaseOrderItems = new p.ApiFunctions("PurchaseOrderItem"), l.Supplier = function(t, e, i, s, n, o, r, a, c, u, h, l) {
        this.SupplierID = t, this.SupplierName = e, this.SupplierDescription = i, this.SupplierType = s, this.AddressLine1 = n, this.AddressLine2 = o, this.Town = r, this.County = a, this.PostCode = c, this.ContactNumber = u, this.ContactNumber2 = h, this.EmailAddress = l
    }, l.Suppliers = new p.ApiFunctions("Supplier"), l.Location = function(t, e, i, s, n, o, r, a, c, u) {
        this.LocationID = t, u && (this.LocationAreaID = u), this.Name = e, this.Description = i, this.Address1 = s, this.Address2 = n, this.Town = o, this.County = r, this.PostCode = a, this.EmailAddress = c
    }, l.Locations = new p.ApiFunctions("Location"), l.Transaction = function(t, e, i, s, n, o, r, a, c, u, h, l, p, D) {
        this.TransactionID = t, this.CustomerID = e, this.StaffID = i, this.TableID = s, this.DateTime = o, this.EatOut = l, this.DeviceID = n, this.PaymentStatus = r, this.DiscountValue = a, this.Total = c, this.ChargeTendered = u, this.Barcode = h, this.NonDiscountable = p, this.NonVAT = D
    }, l.Transactions = new p.ApiFunctions("Transaction"), l.TransactionItem = function(t, e, i, s, n, o, r, a, c, u, h) {
        this.TransactionItemID = t, this.TransactionID = e, this.ProductID = i, this.Price = s, this.Discount = n, this.Quantity = o, this.Notes = r, this.ClientID = a, this.VATAmount = c, this.ParentTransactionItemID = u, this.MultipleChoiceProductID = h
    }, l.TransactionItems = new p.ApiFunctions("TransactionItem"), l.TransactionDetail = function(t, e) {
        this.Name = t, this.Details = e
    }, l.TransactionDetails = new p.ApiFunctions("TransactionDetails"), l.Tender = function(t, e, i, s, n, o) {
        this.TenderID = n, this.TransactionID = t, this.TypeID = e, this.Amount = i, this.Change = s, this.ClientID = o
    }, l.Tenders = new p.ApiFunctions("Tender"), l.TenderType = function(t, e, i) {
        this.TypeID = t, this.Name = e, this.Description = i
    }, l.TenderTypes = new p.ApiFunctions("TenderType"), l.BaseItem = function(t, e, i, s) {
        this.BaseItemID = t, this.TransactionID = e, this.ItemTypeID = i, this.Amount = s
    }, l.BaseItems = new p.ApiFunctions("BaseItem"), l.PreparationStatus = function(t, e, i, s, n, o, r) {
        this.PreparationStatusID = t, this.TransactionID = e, this.State = s, this.StaffID = o, this.Barcode = i, this.CreatedTime = n, this.DeviceID = r
    }, l.PreparationStatuses = new p.ApiFunctions("PreparationStatus"), l.DiscountReason = function(t, e, i) {
        this.DiscountReasonID = t, this.Reason = e, this.DefaultVal = i
    }, l.DiscountReasons = new p.ApiFunctions("DiscountReason"), l.CompleteTransaction = function(t, e, i, s, n) {
        this.DateTime = t, this.EatOut = e, this.PaymentStatus = i, this.StaffID = s, this.CustomerID = n, this.TransactionItems = [], this.Tenders = [], this.BaseItems = []
    }, l.CompleteTransactionItem = function(t, e, i, s, n) {
        this.ProductID = t, this.Price = e, this.Discount = i, this.Notes = s, this.Quantity = n, this.MultipleChoiceItems = []
    }, l.CompleteMultipleChoiceItem = function(t, e, i, s, n) {
        this.ProductID = t, this.Price = e, this.Notes = i, this.Quantity = s, this.MultipleChoiceProductID = n
    }, l.CompleteTransactions = new p.ApiFunctions("CompleteTransaction"), l.SeatingArea = function(t, e, i, s) {
        this.SeatingAreaID = t, this.Name = e, this.Description = i, this.LocationID = s
    }, l.SeatingAreas = new p.ApiFunctions("SeatingArea"), l.SeatingTable = function(t, e, i, s, n, o) {
        this.TableID = t, this.Name = e, this.Seats = i, this.SeatingAreaID = s, this.PosX = n, this.PosY = o
    }, l.SeatingTables = new p.ApiFunctions("SeatingTable"), l.Staff = function(t, e, i, s, n, o) {
        this.StaffID = t, this.Name = e, this.Password = i, this.SwipeLogin = s, this.AccessRightID = n, this.HourlyRate = o
    }, l.Staffs = new p.ApiFunctions("Staff"), l.AccessRight = function(t, e, i, s, n, o, r, a, c, u, h, l, p, D, m, I, d, f, T, g, A, P, C, S, y, k, N, R, B, v, w, F) {
        this.AccessRightID = t, this.Name = e, this.Description = i, this.Till = s, this.TillAdmin = n, this.BackOffice = o, this.Reports = r, this.Refunds = a, this.TablePlanning = c, this.BasketDiscount = u, this.ItemDiscount = h, this.StockSend = l, this.StockReceive = p, this.StockTake = D, this.Payouts = m, this.DisableServiceCharge = I, this.NoSale = d, this.PettyCash = f, this.FloatAdjust = T, this.AdminOptions = g, this.CloseTill = A, this.VoidLine = P, this.Clear = C, this.Hold = S, this.CustomerSelect = y, this.BlindEod = k, this.SetMaxCreditLimit = N, this.ItemDiscountLimit = R, this.ItemDiscountLimitPerc = B, this.BasketDiscountLimit = v, this.BasketDiscountLimitPerc = w, this.RefundLimit = F
    }, l.AccessRights = new p.ApiFunctions("AccessRight"), l.Clocking = function(t, e, i, s, n, o, r) {
        this.ClockingID = t, this.StaffID = e, this.InTime = i, this.OutTime = s, this.HoursWorked = n, this.Notes = o, this.ClockingTypeID = r
    }, l.Clockings = new p.ApiFunctions("Clocking"), l.LocationArea = function(t, e, i, s) {
        this.LocationAreaID = t, this.Name = e, this.Description = i, this.EmailAddress = s
    }, l.LocationAreas = new p.ApiFunctions("LocationArea"), l.ClockingType = function(t, e, i) {
        this.ClockingTypeID = t, this.Name = e, this.PayrateMultiplier = i
    }, l.ClockingTypes = new p.ApiFunctions("ClockingType"), l.Device = function(t, e, i, s, n) {
        this.DeviceID = t, this.Name = e, this.Description = i, this.LocationID = s, this.Enabled = n
    }, l.Devices = new p.ApiFunctions("Device"), l.EndOfDay = function(t, e, i, s, n, o, r) {
        var a = p.getAccessToken(),
            c = p.uri;
        if (a || (l.setAccessToken(p.getParameterByName("appToken")), a = p.getAccessToken()), a) return c += "reports/EndOfDay", c += "?FromDate=" + t + "&ToDate=" + e, c += null == i ? "" : "&LocationAreaID=" + i, c += null == s ? "" : "&LocationID=" + s, c += null == n ? "" : "&DeviceID=" + n, c += null == o ? "" : "&DeviceGroupID=" + o, c += null == r ? "" : "&StaffID=" + r, p.getAsyncRequest(c, "GET", null, a)
    }, l.BookkeepingReport = function(t, e, i, s, n, o, r) {
        var a = p.getAccessToken(),
            c = p.uri;
        if (a || (l.setAccessToken(p.getParameterByName("appToken")), a = p.getAccessToken()), a) return c += "reports/BookkeepingReport", c += "?FromDate=" + t + "&ToDate=" + e, c += null == i ? "" : "&LocationAreaID=" + i, c += null == s ? "" : "&LocationID=" + s, c += null == n ? "" : "&DeviceID=" + n, c += null == o ? "" : "&DeviceGroupID=" + o, c += null == r ? "" : "&StaffID=" + r, p.getAsyncRequest(c, "GET", null, a)
    }, l.DailySales = function(t, e, i, s, n, o, r, a, c) {
        var u = p.getAccessToken(),
            h = p.uri;
        if (u || (l.setAccessToken(p.getParameterByName("appToken")), u = p.getAccessToken()), u) return h += "V2/DailySales", h += "?FromDate=" + t + "&ToDate=" + e, h += null == i ? "" : "&LocationAreaID=" + i, h += null == s ? "" : "&LocationID=" + s, h += null == n ? "" : "&DeviceID=" + n, h += null == c ? "" : "&DeviceGroupID=" + c, h += null == o ? "" : "&StaffID=" + o, h += null == r ? "" : "&ProductID=" + r, h += null == a ? "" : "&Search=" + a, p.getAsyncRequest(h, "GET", null, u)
    }, l.SalesByEmployee = function(t, e, i, s, n, o, r) {
        var a = p.getAccessToken(),
            c = p.uri;
        if (a || (l.setAccessToken(p.getParameterByName("appToken")), a = p.getAccessToken()), a) return c += "reports/SalesByEmployee", c += "?FromDate=" + t + "&ToDate=" + e, c += null == i ? "" : "&LocationAreaID=" + i, c += null == s ? "" : "&LocationID=" + s, c += null == n ? "" : "&DeviceID=" + n, c += null == o ? "" : "&DeviceGroupID=" + o, c += null == r ? "" : "&StaffID=" + r, p.getAsyncRequest(c, "GET", null, a)
    }, l.StaffPayrollReport = function(t, e, i, s, n) {
        var o = p.getAccessToken(),
            r = p.uri;
        if (o || (l.setAccessToken(p.getParameterByName("appToken")), o = p.getAccessToken()), o) return r += "reports/StaffPayrollReport", r += "?FromDate=" + t + "&ToDate=" + e, r += null == i ? "" : "&LocationAreaID=" + i, r += null == s ? "" : "&LocationID=" + s, r += null == n ? "" : "&DeviceID=" + n, p.getAsyncRequest(r, "GET", null, o)
    }, l.PromotionReport = function(t, e, i, s, n, o) {
        var r = p.getAccessToken(),
            a = p.uri;
        if (r || (l.setAccessToken(p.getParameterByName("appToken")), r = p.getAccessToken()), r) return a += "reports/PromotionReport", a += "?FromDate=" + t + "&ToDate=" + e, a += null == i ? "" : "&LocationAreaID=" + i, a += null == s ? "" : "&LocationID=" + s, a += null == n ? "" : "&DeviceID=" + n, a += null == o ? "" : "&DeviceGroupID=" + o, p.getAsyncRequest(a, "GET", null, r)
    }, l.AppSetting = function(t) {
        if (t) {
            if ("string" != typeof t) return t;
            try {
                return JSON.parse(t)
            } catch (t) {
                console.log("The entered JSON is invalid.")
            }
        }
    }, l.AppSettings = (i = "integration/appsettings", (t = {}).load = function() {
        var t = p.validateRequest(i, null, "GET", null, null);
        if (t) try {
            t = JSON.parse(t)
        } catch (t) {
            console.log("Your app settings do not appear to be valid JSON.")
        }
        return t
    }, t.save = function(t) {
        if (t) {
            if ("string" == typeof t) try {
                JSON.parse(t)
            } catch (t) {
                return void console.log("The entered JSON is invalid. Settings not saved.")
            }
            return p.validateRequest(i, null, "POST", t, null)
        }
        console.log("Please supply your AppSettings as a JSON string, or an object.")
    }, t), l
}();