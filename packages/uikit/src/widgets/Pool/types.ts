import BigNumber from "bignumber.js";

export interface Address {
  [chainId: number]: string;
}

export enum PoolCategory {
  "COMMUNITY" = "Community",
  "CORE" = "Core",
  "BINANCE" = "Binance", // Pools using native BNB behave differently than pools using a token
  "AUTO" = "Auto",
}

export interface PoolConfigBaseProps {
  sousId: number;
  contractAddress: Address;
  poolCategory: PoolCategory;
  tokenPerBlock: string;
  isFinished?: boolean;
  enableEmergencyWithdraw?: boolean;
  version?: number;
}

interface GenericToken {
  decimals: number;
  symbol: string;
  address: string;
}

export interface SerializedPoolConfig<T> extends PoolConfigBaseProps {
  earningToken: T & GenericToken;
  stakingToken: T & GenericToken;
}

export interface DeserializedPoolConfig<T> extends PoolConfigBaseProps {
  earningToken: T & GenericToken;
  stakingToken: T & GenericToken;
}

export interface DeserializedPool<T> extends DeserializedPoolConfig<T>, CorePoolProps {
  totalStaked?: BigNumber;
  stakingLimit?: BigNumber;
  stakingLimitEndBlock?: number;
  profileRequirement?: {
    required: boolean;
    thresholdPoints: BigNumber;
  };
  userDataLoaded?: boolean;
  userData?: {
    allowance: BigNumber;
    stakingTokenBalance: BigNumber;
    stakedBalance: BigNumber;
    pendingReward: BigNumber;
  };
  userInfo?: {
    amount: BigNumber;
    rewardDebt: BigNumber;
    lastDepositedTime: BigNumber;
  };
  withdrawFee?: string;
  withdrawFeePeriod?: string;
  depositFee?: string;
  isBoosted?: boolean;
}

export type DeserializedPoolVault<T> = DeserializedPool<T> & DeserializedRebusVault;
export type DeserializedPoolLockedVault<T> = DeserializedPool<T> & DeserializedLockedRebusVault;

export interface DeserializedLockedVaultUser extends DeserializedVaultUser {
  lastDepositedTime: string;
  lastUserActionTime: string;
  lockStartTime: string;
  lockEndTime: string;
  burnStartTime: string;
  userBoostedShare: BigNumber;
  locked: boolean;
  lockedAmount: BigNumber;
  currentPerformanceFee: BigNumber;
  currentOverdueFee: BigNumber;
}

export interface DeserializedLockedRebusVault extends Omit<DeserializedRebusVault, "userData"> {
  totalLockedAmount?: BigNumber;
  userData?: DeserializedLockedVaultUser;
}

export interface SerializedVaultFees {
  performanceFee: number;
  withdrawalFee: number;
  withdrawalFeePeriod: number;
}

export interface DeserializedVaultFees extends SerializedVaultFees {
  performanceFeeAsDecimal: number;
}

export interface DeserializedVaultUser {
  isLoading: boolean;
  userShares: BigNumber;
  cakeAtLastUserAction: BigNumber;
  lastDepositedTime: string;
  lastUserActionTime: string;
  balance: {
    cakeAsNumberBalance: number;
    cakeAsBigNumber: BigNumber;
    cakeAsDisplayBalance: string;
  };
}

export interface DeserializedRebusVault {
  totalShares?: BigNumber;
  totalLockedAmount?: BigNumber;
  pricePerFullShare: BigNumber;
  totalCakeInVault?: BigNumber;
  fees?: DeserializedVaultFees;
  userData?: DeserializedVaultUser;
}

export enum VaultKey {
  RebusVaultV1 = "rebusVaultV1",
  RebusVault = "rebusVault",
  RebusFlexibleSideVault = "rebusFlexibleSideVault",
  IfoPool = "ifoPool",
}

interface CorePoolProps {
  startBlock?: number;
  endBlock?: number;
  apr?: number;
  rawApr?: number;
  stakingTokenPrice?: number;
  earningTokenPrice?: number;
  vaultKey?: VaultKey;
}

export interface HarvestActionsProps {
  earnings: BigNumber;
  isLoading?: boolean;
  onPresentCollect: any;
  earningTokenPrice: number;
  earningTokenBalance: number;
  earningTokenDollarBalance: number;
}
