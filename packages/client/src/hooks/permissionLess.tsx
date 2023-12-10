"use client"

import { useUserSession } from "@/providers/user-context"
import { signerToSafeSmartAccount } from "permissionless/accounts"
import {
  LocalAccount,
  TypedDataDefinition,
  WalletClient,
  createPublicClient,
  http,
  parseEther,
} from "viem"
import { createSmartAccountClient } from "permissionless"
import {
  createPimlicoPaymasterClient,
  createPimlicoBundlerClient,
} from "permissionless/clients/pimlico"
import { VIEM_CHAIN } from "@/config/env"

//Bundler
const PIMLICO_V1 =
  "https://api.pimlico.io/v1/mumbai/rpc?apikey=71bd066c-e557-4642-a2c8-b4c729e4d5e2"
//Paymaster
const PIMLICO_V2 =
  "https://api.pimlico.io/v2/mumbai/rpc?apikey=71bd066c-e557-4642-a2c8-b4c729e4d5e2"

export const bundlerClient = createPimlicoBundlerClient({
  transport: http(PIMLICO_V1),
})
export const paymasterClient = createPimlicoPaymasterClient({
  transport: http(PIMLICO_V2),
})

const usePermissionlessHook = () => {
  const {
    login,
    logout,
    safeAuthPack,
    publicClient,
    isAuthenticated,
    safeAuthSignInResponse,
    walletClient,
    provider,
  } = useUserSession()
  // const [isPermissionlessInitiated, setPermissionlessInitiated] = useState(false);

  const getSafeSmartAccountClientForEOA = async (address: string) => {
    console.log(
      "nothing? values needed here",
      publicClient,
      address,
      !safeAuthPack?.isAuthenticated,
      safeAuthSignInResponse
    )
    if (
      publicClient == null ||
      address == null ||
      !safeAuthPack?.isAuthenticated ||
      safeAuthSignInResponse == null
    )
      return ""

    const customSigner: Omit<LocalAccount<"custom">, "signTransaction"> = {
      address: address as `0x${string}`,
      publicKey: "0x00",
      source: "custom",
      type: "local",
      signMessage: async ({ message }: { message: any }) => {
        return "0x.."
      },
      signTypedData: async (typeData: any) => {
        const _typeData = typeData as TypedDataDefinition
        let signedMessage

        const params = {
          domain: _typeData.domain,
          types: {
            [_typeData.primaryType]: _typeData.types[_typeData.primaryType],
          },
          message: _typeData.message,
          primaryType: _typeData.primaryType,
        }

        signedMessage = await (
          await provider?.getSigner()
        )?.signTypedData(params.domain, params.types, params.message)

        return signedMessage != undefined ? signedMessage : "0x"
      },
    }
    console.log("here 1")

    const account = await signerToSafeSmartAccount(publicClient, {
      signer: customSigner,
      safeVersion: "1.4.1",
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    })

    console.log("here 2")

    const smartWalletClient = createSmartAccountClient({
      account,
      chain: VIEM_CHAIN,
      transport: http(PIMLICO_V1),
      sponsorUserOperation: paymasterClient.sponsorUserOperation,
    })

    console.log("here 3")

    return smartWalletClient
  }

  const getSafeSmartAddressForEOA = async (address: string) => {
    const smartWalletClient = await getSafeSmartAccountClientForEOA(address)

    if (smartWalletClient == "") return ""

    const safeAccountAddress = smartWalletClient.account.address
    console.log("safeAccountAddress", safeAccountAddress)
    return safeAccountAddress
  }

  const deploySafeSmartAccount = async (address: string) => {
    const smartWalletClient = await getSafeSmartAccountClientForEOA(address)

    if (smartWalletClient == "") return ""

    const gasPrices = await bundlerClient.getUserOperationGasPrice()
    const txHash = await smartWalletClient.sendTransaction({
      to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      value: parseEther("0.0"),
      maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
      maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
    })

    console.log("txHash", txHash)
  }

  const sendTransaction = async (
    address: string,
    to: `0x${string}`,
    value: string,
    data: `0x${string}`
  ) => {
    const smartWalletClient = await getSafeSmartAccountClientForEOA(address)

    if (smartWalletClient == "") return ""

    const gasPrices = await bundlerClient.getUserOperationGasPrice()

    const txHash = await smartWalletClient.sendTransaction({
      to: to,
      data: data,
      value: parseEther(value),
      maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
      maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
    })

    console.log("txHash", txHash)

    return txHash
  }

  return { getSafeSmartAddressForEOA, deploySafeSmartAccount, sendTransaction }
}

export default usePermissionlessHook
