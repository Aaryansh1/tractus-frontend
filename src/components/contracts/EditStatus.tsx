import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ContractStatusDropdown } from "@/util/contract";
import { Contract, DropdownMenuItem } from "@/types/contracts";

const EditStatus = ({
  id,
  status,
  updateStatus,
}: {
  id: string;
  status: string;
  updateStatus: (
    updateContract: Partial<Contract>,
    id?: string
  ) => Promise<void> | void;
}) => {
  function findItem(value: string) {
    return ContractStatusDropdown.find((item) => item.value === value);
  }
  return (
    <Select
      onValueChange={(e) => {
        updateStatus({ status: e as Contract["status"] }, id);
      }}
      value={status}
    >
      <SelectTrigger className={""}>
        <SelectValue placeholder="Select an option">
          {findItem(status)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="overflow-visible">
        {ContractStatusDropdown.map(
          (status: DropdownMenuItem, index: number) => (
            <SelectItem
              value={status.value}
              key={status.value + index}
              className="overflow-visible flex gap-2"
            >
              {status.label}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
};

export default EditStatus;
