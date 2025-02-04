import { FullProof } from "@semaphore-protocol/proof";
import { MerkleProof } from "@zk-kit/incremental-merkle-tree";

import { MerkleProofArtifacts } from "./merkle";

export interface SemaphoreProof {
  fullProof: FullProof;
}

export interface SemaphoreProofRequest {
  externalNullifier: string;
  signal: string;
  merkleStorageAddress?: string;
  circuitFilePath: string;
  verificationKey: string;
  zkeyFilePath: string;
  merkleProofArtifacts?: MerkleProofArtifacts;
  merkleProof?: MerkleProof;
}

export interface ISemaphoreGenerateArgs {
  identity: string;
  payload: SemaphoreProofRequest;
}
