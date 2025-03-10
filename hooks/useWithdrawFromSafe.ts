import Safe from '@safe-global/protocol-kit';
import { MetaTransactionData } from '@safe-global/types-kit';
import { useCallback } from 'react';
import { encodeFunctionData, parseUnits } from 'viem';
import { useAccount, useChainId, useChains, useWalletClient } from 'wagmi';

// ERC20 ABI (minimal for token transfer)
const erc20Abi = [
  {
    constant: false,
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  }
];

const safeAbi = [{
  inputs: [
    {
      internalType: "address",
      name: "to",
      type: "address",
    },
    {
      internalType: "uint256",
      name: "value",
      type: "uint256",
    },
    {
      internalType: "bytes",
      name: "data",
      type: "bytes",
    },
    {
      internalType: "enum Enum.Operation",
      name: "operation",
      type: "uint8",
    },
    {
      internalType: "uint256",
      name: "safeTxGas",
      type: "uint256",
    },
    {
      internalType: "uint256",
      name: "baseGas",
      type: "uint256",
    },
    {
      internalType: "uint256",
      name: "gasPrice",
      type: "uint256",
    },
    {
      internalType: "address",
      name: "gasToken",
      type: "address",
    },
    {
      internalType: "address payable",
      name: "refundReceiver",
      type: "address",
    },
    {
      internalType: "bytes",
      name: "signatures",
      type: "bytes",
    },
  ],
  name: "execTransaction",
  outputs: [
    {
      internalType: "bool",
      name: "success",
      type: "bool",
    },
  ],
  stateMutability: "payable",
  type: "function",
}];
const EIP712_SAFE_TX_TYPE = {
  // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
  SafeTx: [
    { type: "address", name: "to" },
    { type: "uint256", name: "value" },
    { type: "bytes", name: "data" },
    { type: "uint8", name: "operation" },
    { type: "uint256", name: "safeTxGas" },
    { type: "uint256", name: "baseGas" },
    { type: "uint256", name: "gasPrice" },
    { type: "address", name: "gasToken" },
    { type: "address", name: "refundReceiver" },
    { type: "uint256", name: "nonce" },
  ],
};
/**
 * Withdraws tokens from a Safe to a recipient address
 *
 * @param safeAddress The address of the Safe
 * @param tokenAddress The address of the token to withdraw (use null for native ETH)
 * @param amount The amount to withdraw (in token units)
 * @param recipientAddress The address to send tokens to
 * @param rpcUrl The RPC URL for the network
 * @param privateKey The private key of the signer (must be a Safe owner)
 * @param decimals Token decimals (default: 18)
 * @returns The transaction hash
 */
export async function createWithdrawFromSafe(
  safeAddress: string,
  tokenAddress: string | null,
  amount: string,
  recipientAddress: string,
  rpcUrl: string,
  decimals: number = 18
) {
  try {
    console.log(`Initiating withdrawal from Safe ${safeAddress}`);

    const safeSdk = await Safe.init({
      provider: rpcUrl,
      safeAddress: safeAddress as `0x${string}`
    });

    // Prepare transaction data
    let txData: MetaTransactionData;

    if (tokenAddress === null) {
      // Native ETH transfer
      txData = {
        to: recipientAddress as `0x${string}`,
        value: parseUnits(amount, decimals).toString(),
        data: '0x',
        operation: 0 // Call operation
      };
    } else {
      // ERC20 token transfer
      const parsedAmount = parseUnits(amount, decimals);
      const transferData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, parsedAmount]
      });

      txData = {
        to: tokenAddress as `0x${string}`,
        value: '0',
        data: transferData,
        operation: 0
      };
    }

    // Create Safe transaction
    console.log('Creating Safe transaction for withdrawal...');
    const safeTransaction = await safeSdk.createTransaction({
      transactions: [txData],
      options: {
        nonce: await safeSdk.getNonce(),
      }
    });



    return {
      txData,
      safeTransaction,
    };
  } catch (error) {
    console.error('Error withdrawing from Safe:', error);
    throw error;
  }
}

// React hook for use with Wagmi
export function useWithdrawFromSafe() {
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const { address } = useAccount();
  const chains = useChains();

  return useCallback(async (
    safeAddress: string,
    tokenAddress: string | null,
    amount: string,
    recipientAddress: string = address || '',
    decimals: number,
  ) => {
    if(!walletClient || !chainId || !address) {
      throw new Error('Wallet not connected');
    }
    const chain = chains.find((chain) => chain.id === chainId);
    if (!chain) {
      throw new Error('Chain not found');
    }
    const {safeTransaction} = await createWithdrawFromSafe(
      safeAddress,
      tokenAddress,
      amount,
      recipientAddress,
      chain.rpcUrls.default.http[0],
      decimals
    );

    const data = safeTransaction.data;
    const signature = await walletClient.signTypedData({
      types: EIP712_SAFE_TX_TYPE,
      primaryType: 'SafeTx',
      message: {
        to: data.to,
        value: data.value,
        data: data.data,
        operation: data.operation,
        safeTxGas: data.safeTxGas,
        baseGas: data.baseGas,
        gasPrice: data.gasPrice,
        gasToken: data.gasToken,
        refundReceiver: data.refundReceiver,
        nonce: data.nonce,
      },
    });

    const txHash = await walletClient.writeContract({
      address: safeAddress,
      abi: safeAbi,
      functionName: 'execTransaction',
      args: [
        data.to,
        data.value,
        data.data,
        data.operation,
        data.safeTxGas,
        data.baseGas,
        data.gasPrice,
        data.gasToken,
        data.refundReceiver,
        signature,
      ]
    })

    return txHash;
  }, [address, walletClient, chainId, chains]);
}

