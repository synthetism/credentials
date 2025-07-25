
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

export interface IdentitySubject extends BaseCredentialSubject { 
  issuedBy: SynetHolder 
  scope?: string[];  // optional: claim purpose or restriction
}

export interface RootIdentitySubject extends IdentitySubject {
  networkId: string;
  poolCidr: string;   // The IP range operated by root
  url?: string;  // Optional URL for more info
}

export interface GatewayIdentitySubject extends IdentitySubject {
  networkId: string;
  regionId?: string
  cidr?: string
  ip?: string
  ipPoolId?: string
  publicKeyHex?: string // optional, for rotation
}

export interface MarketIdentitySubject extends GovernanceSubject {
  marketId: string;             // Unique market ID
  title: string;                // Human-readable name
  description?: string;         // Optional, markdown or plain
  ipfsUri?: string;             // Content or schema of the market
  tags?: string[];              // For discovery
  regionId?: string;            // Optional for geo/routing reasons
  version?: string;             // Schema version, market rules, etc.
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
 
export interface AssetSubject extends BaseCredentialSubject {
  issuedBy: SynetHolder;
  delegated?: CredentialDelegation;
  parentAssetId?: string; 
  schemaUri?: string;
  metadata?: Record<string, unknown>;
  verifiableResource?: VerifiableResource;
}

export interface FungibleAssetSubject extends AssetSubject {
  quantity: number;
  totalSupply: number; // Total supply of the fungible asset
}

export interface NonFungibleAssetSubject extends AssetSubject {
  uniqueIdentifier?: string; // Optional: Unique identifier for the non-fungible asset

}

export interface DataAssetSubject extends AssetSubject {
  
  licensedBy?: SynetHolder
  scope?: string[]; // Purpose of the data (e.g. "analytics", "storage", "training")

}

export interface IpPoolAssetSubject extends AssetSubject {
  networkId: string;
  cidr: string
  regionId?: string // Enforcing region for the IP pool
}

export interface IpAssetSubject extends AssetSubject {
  networkId: string;
  ip: string;
}

/** IIdeas for IP Allocation Delegation
 *  IpAllocationDelegation
 *  
 */
// 

// Governance

export interface GovernanceSubject extends BaseCredentialSubject {
  issuedBy: SynetHolder; // Who issued the governance credential
  metadata?: Record<string, unknown>;
  schemaUri?: string;
  verifiableResource?: VerifiableResource;
}

export interface PolicySubject extends GovernanceSubject {
  issuedBy: SynetHolder;      
}

export interface RootPolicySubject extends GovernanceSubject {
  networkId: string;
  policyId: string
  version: string
}

export interface DeclarationSubject extends BaseCredentialSubject {
  issuedBy: SynetHolder; // Who issued the declaration
  metadata?: Record<string, unknown>;
  schemaUri?: string;
  verifiableResource?: VerifiableResource;
}

export interface NetworkDeclarationSubject extends DeclarationSubject {
  networkId: string
  policyId: string
  ipv4?: string
  ipv6?: string
  cidr?: string
  networkType?: string
  topology?: string 
  rootUrl?: string      
}



export interface RoutingSubject extends BaseCredentialSubject {
  ip: string // Synet IP
  publicKey: string // WireGuard public key
  endpoint: string // IP:port (or gateway relay ID)
  networkId: string
  issuedBy: SynetHolder // A trusted gateway or root
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
  IntelligenceAuthorization = "IntelligenceAuthorizationCredential",
  
  // Assets
  DataAsset = "DataAssetCredential",
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