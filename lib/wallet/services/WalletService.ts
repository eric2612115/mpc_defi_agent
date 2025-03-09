/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AiInfoResponse } from '../models/AiInfoResponse';
import type { BalanceResponse } from '../models/BalanceResponse';
import type { CreateAiDto } from '../models/CreateAiDto';
import type { CreateWalletDto } from '../models/CreateWalletDto';
import type { CreateWalletResponse } from '../models/CreateWalletResponse';
import type { ListWalletResponse } from '../models/ListWalletResponse';
import type { SwapEstimateResponse } from '../models/SwapEstimateResponse';
import type { SwapEstimateWalletDto } from '../models/SwapEstimateWalletDto';
import type { SwapHistoryResponse } from '../models/SwapHistoryResponse';
import type { SwapWalletDto } from '../models/SwapWalletDto';
import type { SwapWalletResponse } from '../models/SwapWalletResponse';
import type { WhitelistAddDto } from '../models/WhitelistAddDto';
import type { WhitelistAddResponse } from '../models/WhitelistAddResponse';
import type { WhitelistListResponse } from '../models/WhitelistListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WalletService {
  /**
   * @returns any Health check
   * @throws ApiError
   */
  public static appControllerIndex(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/',
    });
  }
  /**
   * @returns any Health check
   * @throws ApiError
   */
  public static appControllerGetHealth(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/health',
    });
  }
  /**
   * @returns void
   * @throws ApiError
   */
  public static appControllerGetError(): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/error',
      errors: {
        500: `The error`,
      },
    });
  }
  /**
   * Create AI address for owner
   * @returns AiInfoResponse AI address created successfully
   * @throws ApiError
   */
  public static walletControllerCreateAi({
    requestBody,
  }: {
    requestBody: CreateAiDto,
  }): CancelablePromise<AiInfoResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/wallet/create-ai',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        409: `Owner already has an AI address`,
      },
    });
  }
  /**
   * Get AI address for owner
   * @returns AiInfoResponse AI address retrieved successfully
   * @throws ApiError
   */
  public static walletControllerGetAi({
    ownerAddress,
  }: {
    /**
     * Ethereum address of the owner
     */
    ownerAddress: string,
  }): CancelablePromise<AiInfoResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/wallet/ai/{ownerAddress}',
      path: {
        'ownerAddress': ownerAddress,
      },
      errors: {
        400: `Bad request`,
        404: `AI address not found`,
      },
    });
  }
  /**
   * @returns CreateWalletResponse Create a wallet
   * @throws ApiError
   */
  public static walletControllerCreateWallet({
    requestBody,
  }: {
    requestBody: CreateWalletDto,
  }): CancelablePromise<CreateWalletResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/wallet/create-wallet',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns ListWalletResponse List wallets
   * @throws ApiError
   */
  public static walletControllerListWallets({
    ownerAddress,
    chain,
  }: {
    ownerAddress: string,
    chain?: string | number,
  }): CancelablePromise<ListWalletResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/wallet/list',
      query: {
        'chain': chain,
        'ownerAddress': ownerAddress,
      },
    });
  }
  /**
   * @returns WhitelistAddResponse Add tokens to whitelist
   * @throws ApiError
   */
  public static walletControllerWhitelistAdd({
    requestBody,
  }: {
    requestBody: WhitelistAddDto,
  }): CancelablePromise<WhitelistAddResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/wallet/whitelist/add',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns WhitelistListResponse List whitelisted tokens
   * @throws ApiError
   */
  public static walletControllerWhitelistList({
    chain,
    safeWalletAddress,
  }: {
    chain: string,
    safeWalletAddress: string,
  }): CancelablePromise<WhitelistListResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/wallet/whitelist/list',
      query: {
        'chain': chain,
        'safeWalletAddress': safeWalletAddress,
      },
    });
  }
  /**
   * @returns WhitelistAddResponse Remove tokens from whitelist
   * @throws ApiError
   */
  public static walletControllerWhitelistRemove({
    requestBody,
  }: {
    requestBody: WhitelistAddDto,
  }): CancelablePromise<WhitelistAddResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/wallet/whitelist/remove',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Estimate swap details
   * @returns SwapEstimateResponse Swap estimate retrieved successfully
   * @throws ApiError
   */
  public static walletControllerSwapEstimate({
    requestBody,
  }: {
    requestBody: SwapEstimateWalletDto,
  }): CancelablePromise<SwapEstimateResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/wallet/swap/estimate',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
      },
    });
  }
  /**
   * Execute a token swap
   * @returns SwapWalletResponse Swap tokens
   * @throws ApiError
   */
  public static walletControllerSwap({
    requestBody,
  }: {
    requestBody: SwapWalletDto,
  }): CancelablePromise<SwapWalletResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/wallet/swap',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
      },
    });
  }
  /**
   * Get swap transaction history
   * @returns SwapHistoryResponse Swap history retrieved successfully
   * @throws ApiError
   */
  public static walletControllerSwapHistory({
    chain,
    safeWalletAddress,
  }: {
    chain: string,
    safeWalletAddress: string,
  }): CancelablePromise<SwapHistoryResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/wallet/swap/history',
      query: {
        'chain': chain,
        'safeWalletAddress': safeWalletAddress,
      },
      errors: {
        400: `Bad request`,
        404: `Wallet not found`,
      },
    });
  }
  /**
   * Get wallet balance
   * @returns BalanceResponse Balance retrieved successfully
   * @throws ApiError
   */
  public static walletControllerBalance({
    owner,
  }: {
    /**
     * Owner address
     */
    owner: string,
  }): CancelablePromise<BalanceResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/wallet/sonic/balance',
      query: {
        'owner': owner,
      },
      errors: {
        400: `Bad request`,
        404: `Wallet not found`,
      },
    });
  }
}
