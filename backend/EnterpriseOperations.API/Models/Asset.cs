using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace EnterpriseOperations.API.Models;

public class Asset
{
    public int AssetID {get; set;}
     public string AssetName {get; set;} = string.Empty;
     public string SerialNumber {get; set;} = string.Empty;
     public int CategoryID {get; set;}
     public string Status {get; set;} = string.Empty;
     public DateTime? PurchaseDate {get; set;}
     public int? LocationID {get; set;}
     public int? EmployeeID {get; set;}
}