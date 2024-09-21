import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";

import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import { privateKeyToAccount } from "viem/accounts";

const privateKey =
  "0xe945ad416f4f3776a4aa66b0d7c62553729979cbdedb99e1956dc865463b4781";

const attesterWallet = new ethers.Wallet(privateKey); // Platform's wallet

console.log(attesterWallet.address);
//@ts-ignore
const signer = privateKeyToAccount(attesterWallet.privateKey);

let schemaId = "0x76"; // Schema ID

const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.gnosisChiado,

  account: signer,
});

console.log("Client Created", client);

async function createNotaryAttestation(
  senderAddress: string,
  sourceChain: string,
  destinationChain: string,
  amount: string,
  message: string
) {
  console.log("Creating Attestation");
  const res = await client.createAttestation({
    schemaId: schemaId,
    data: {
      senderAddress: senderAddress,
      sourceChain: sourceChain,
      destinationChain: destinationChain,
      amount: amount,
      message: message,
    },
    indexingValue: senderAddress.toLowerCase(),
    recipients: [senderAddress.toLowerCase()],
  });

  console.log("Attestation Created", res);

  return res;
}

export async function POST(request: NextRequest) {
  try {
    const { senderAddress, sourceChain, destinationChain, amount, message } =
      await request.json();

    const attestation = await createNotaryAttestation(
      senderAddress,
      sourceChain,
      destinationChain,
      amount,
      message
    );

    return NextResponse.json({ attestation }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
