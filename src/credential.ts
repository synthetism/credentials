
export interface ProofType {
  type: string
  proofValue?: string
  created?: string
  verificationMethod?: string
  proofPurpose?: string
  [x: string]: unknown
}

export interface SynetVerifiableCredential<S extends BaseCredentialSubject = BaseCredentialSubject> {
  '@context': string[]
  id: string
  type: string[]
  issuer: { id: string }
  issuanceDate: string
  expirationDate?: string
  credentialSubject: S
  proof: ProofType
  meta?: {
    version?: string  // e.g. "1.0.0"
    schema?: string   // e.g. "https://synthetism.org/schemas/IpAsset/1.0.0"
  }
}
// Common
export interface SynetHolder {
  id: string  
  name?: string     
  [key: string]: unknown
}



export interface VerifiableResource {
  ipfsUri: string; // Required
  hash: string;   // SHA-256 or multihash

  /**
   * Optional content mirrors for redundancy and faster resolution.
   * @use ar://, ipns://, dat://, sia://, don't use web2 if absolutely necessery  
   * Avoid using Web2 (http:// or https://) unless absolutely necessary.
   * Verifiers must always validate mirror content against the declared hash.
   */
   mirrors?: string[] 
}

export interface CredentialDelegation {

  id: string;    
  delegatedBy: SynetHolder; // Who delegated the asset
  delegatedTo: SynetHolder; // Who the asset is delegated to
  validFrom: string;       // Start date of delegation
  validUntil: string;      // End date of delegation
  [key: string]: unknown;   // Additional properties can be added as needed

}


export interface BaseCredentialSubject {
  holder: SynetHolder;
  [key: string]: unknown;
}

// Identity types

export interface BaseIdentitySubject extends BaseCredentialSubject { 
  issuedBy: SynetHolder 
  scope?: string[];  // optional: claim purpose or restriction
}


export interface IdentitySubject extends BaseIdentitySubject { 

}

export interface RootIdentitySubject extends BaseIdentitySubject {
  networkId: string;
  poolCidr: string;   // The IP range operated by root
  url?: string;  // Optional URL for more info
}

export interface GatewayIdentitySubject extends BaseIdentitySubject {
  networkId: string;
  regionId?: string
  cidr?: string
  ip?: string
  ipPoolId?: string
  publicKeyHex?: string // optional, for rotation
}

// Authorization

export interface AuthorizationSubject extends BaseCredentialSubject { 
  authorizedBy: SynetHolder // Who authorized the entity
  scope?: string;
  metadata?: Record<string, unknown>;
  schemaUri?: string;
  verifiableResource?: VerifiableResource;
}

export interface IntelligenceAuthorizationSubject extends AuthorizationSubject {
  intelligence: Intelligence; // The intelligence that is authorized
  witnesses?: SynetHolder[]; // Optional witnesses to the authorization
  certifications?: string[];
}

export interface GatewayAuthorizationSubject extends AuthorizationSubject {
  networkId: string;
  regionId: string;
  ip: string;
  cidr: string;
  ipPoolId: string;
  validUntil?: string;
}

// Assets
 
interface BaseAssetSubject extends BaseCredentialSubject {
  issuedBy: SynetHolder;
  delegated?: CredentialDelegation;
  parentAssetId?: string; 
  schemaUri?: string;
  metadata?: Record<string, unknown>;
  verifiableResource?: VerifiableResource;
}

export interface FungibleAssetSubject extends BaseAssetSubject {
  quantity: number;
  totalSupply: number; // Total supply of the fungible asset
}

export interface NonFungibleAssetSubject extends BaseAssetSubject {
  uniqueIdentifier?: string; // Optional: Unique identifier for the non-fungible asset

}

export interface DataAssetSubject extends BaseAssetSubject {
 
  scope?: string[]; // Purpose of the data (e.g. "analytics", "storage", "training")
  licensedBy?: SynetHolder | string; // Who owns or grants the license (optional)

}

export interface IpPoolAssetSubject extends BaseAssetSubject {
  networkId: string;
  cidr: string
  regionId?: string // Enforcing region for the IP pool
}

export interface IpAssetSubject extends BaseAssetSubject {
  networkId: string;
  ip: string;
}

// Governance

export interface BaseGovernanceSubject extends BaseCredentialSubject {
  issuedBy: SynetHolder; // Who issued the governance credential
  metadata?: Record<string, unknown>;
  schemaUri?: string;
  verifiableResource?: VerifiableResource;
}

export interface PolicySubject extends BaseGovernanceSubject {
  issuedBy: SynetHolder;      
}

export interface RootPolicySubject extends BaseGovernanceSubject {
  networkId: string;
  policyId: string
  version: string
}

export interface NetworkDeclarationSubject extends BaseGovernanceSubject {
  networkId: string
  policyId: string
  ipv4?: string
  ipv6?: string
  cidr?: string
  networkType?: string
  topology?: string 
  rootUrl?: string      
}

// Logic types

// Credential = Identity, "I AM"
// Authorization = Contract - "I CAN"
// Policy = Rules  - "I MUST"
// Asset = Resource - "I HAVE / USE / OWN"
// Declaration = Statement - "I DECLARE TO BE TRUE"

// Credential types
export enum CredentialType {
  // Identity
  Identity = "IdentityCredential",
  RootIdentity = "RootIdentityCredential",
  GatewayIdentity = "GatewayIdentityCredential",

  // Authorization
  Authorization = "AuthorizationCredential",
  GatewayAuthorization = "GatewayAuthorizationCredential",

  // Assets
  IpPool = "IpPoolAssetCredential",
  Ip = "IpAssetCredential",

  // Governance
  RootPolicy = "RootPolicyCredential",
  NetworkDeclaration = "NetworkDeclarationCredential"
}

export enum Intelligence {

  human = "Human",
  ai = "AI",
  hybrid = "Hybrid",
  swarm = "Swarm",
  superintelligent = "Superintelligent",

}