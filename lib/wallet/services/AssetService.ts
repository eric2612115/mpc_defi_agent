/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssetListResponse } from '../models/AssetListResponse';
import type { AssetsAndPricesResponse } from '../models/AssetsAndPricesResponse';
import type { PriceListResponse } from '../models/PriceListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AssetService {
  /**
   * Get a list of supported assets
   * @returns AssetListResponse List of assets
   * @throws ApiError
   */
  public static assetControllerGetAssetsList({
    chainId,
    tokenAddresses,
  }: {
    /**
     * The chain ID
     */
    chainId: string,
    /**
     * The token address
     */
    tokenAddresses?: Array<string>,
  }): CancelablePromise<AssetListResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/asset/info/list',
      query: {
        'chainId': chainId,
        'tokenAddresses': tokenAddresses,
      },
      errors: {
        400: `Invalid chain ID`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Get the price of an asset
   * @returns PriceListResponse Price of the asset
   * @throws ApiError
   */
  public static assetControllerGetAssetsPriceList({
    chainId,
    tokenAddresses,
  }: {
    /**
     * The chain ID
     */
    chainId: string,
    /**
     * The token address
     */
    tokenAddresses?: Array<string>,
  }): CancelablePromise<PriceListResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/asset/price/list',
      query: {
        'chainId': chainId,
        'tokenAddresses': tokenAddresses,
      },
      errors: {
        400: `Invalid chain ID`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Get a list of supported assets with their prices
   * @returns AssetsAndPricesResponse List of assets with prices
   * @throws ApiError
   */
  public static assetControllerGetAssetsAndPriceList({
    chainId,
  }: {
    /**
     * The chain ID
     */
    chainId: string,
  }): CancelablePromise<AssetsAndPricesResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/asset/info-price/list',
      query: {
        'chainId': chainId,
      },
      errors: {
        400: `Invalid chain ID`,
        404: `Chain ID not supported or no assets found`,
        500: `Internal server error`,
      },
    });
  }
}
