import { MerkleProofArtifacts, MerkleProof } from "./merkle";

export interface ZkInputs {
  merkleStorageAddress?: string;
  merkleProofArtifacts?: MerkleProofArtifacts;
  merkleProof?: MerkleProof;
}

export interface ZKProofPayload {
  externalNullifier: string;
  signal: string;
  merkleStorageAddress?: string;
  circuitFilePath: string;
  verificationKey: string;
  zkeyFilePath: string;
  origin: string;
}

export enum ZkProofType {
  SEMAPHORE,
  RLN,
}
