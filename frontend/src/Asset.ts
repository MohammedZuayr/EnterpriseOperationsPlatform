export interface Asset {
  assetID: number;
  assetName: string;
  serialNumber: string;
  categoryID: number;
  status: string;
  purchaseDate: string;
  locationID: number | null;
  employeeID: number | null;
}