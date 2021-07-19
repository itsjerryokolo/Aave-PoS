import { BigInt } from "@graphprotocol/graph-ts";
import {
  Aave,
  Approval,
  MetaTransactionExecuted,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer,
} from "../generated/Aave/Aave";
import { Contract, TransferEvent } from "../generated/schema";

export function handleApproval(event: Approval): void {}

export function handleMetaTransactionExecuted(
  event: MetaTransactionExecuted
): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {
  let aave = Aave.bind(event.address);
  let contract = new Contract(event.address.toHexString());
  let transferEvent = TransferEvent.load(event.params.to.toHexString());

  if (transferEvent == null) {
    transferEvent = new TransferEvent(event.params.to.toHexString());
  }

  let nameCall = aave.try_name();
  if (!nameCall.reverted) {
    contract.name = nameCall.value;
  }

  let totalSupplyCall = aave.try_totalSupply();
  if (!totalSupplyCall.reverted) {
    contract.totalSupply = totalSupplyCall.value;
  }

  contract.blockNumber = event.block.number
  contract.timeStamp = event.block.timestamp
  contract.blockHash = event.block.hash

  transferEvent.from = event.params.from;
  transferEvent.to = event.params.to;
  transferEvent.value = event.params.value;
  transferEvent.contract = contract.id;
  transferEvent.blockHash = event.block.hash;
  transferEvent.blockNumber = event.block.number;
  transferEvent.timeStamp = event.block.timestamp;
  transferEvent.txHash = event.transaction.hash;

  transferEvent.save();
  contract.save();
}
