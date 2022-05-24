import { Send } from "../apiService";
import { AxiosInstance, AxiosResponse } from "axios";

export default class FormIO {
  private _apiInstance: AxiosInstance;
  private _adminInstance: AxiosInstance;

  constructor(_apiInstance: AxiosInstance, _adminInstance: AxiosInstance) {
    this._apiInstance = _apiInstance;
    this._adminInstance = _adminInstance;
  }

  public getSchema = (endpoint: string, objectId?: string): Promise<AxiosResponse> => {
    if (objectId) return Send(this._apiInstance, "GET", `/${endpoint}/${objectId}`);

    return Send(this._apiInstance, "GET", `/${endpoint}`);
  };

  public getEntityCrudEndpoint = (entityId: string): Promise<AxiosResponse> => {
    return Send(this._adminInstance, "GET", `/entity-crud-endpoint/${entityId}`);
  };
}
