/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import EditContractDialog from "@/components/contracts/EditContractDialog";
import EditStatus from "@/components/contracts/EditStatus";
import NewContractDialog from "@/components/contracts/NewContractDialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Contract } from "@/types/contracts";
import { socket } from "@/util/socket";
import {
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

const getTableColumns = ({
  updateContract,
  setContracts,
}: {
  updateContract: (Contract: Partial<Contract>, id?: string) => Promise<void>;
  setContracts: Dispatch<SetStateAction<Contract[]>>;
}) => {
  const columns: ColumnDef<Contract>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "clientName",
      header: () => <div className="text-right">Client name</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue("clientName")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <EditStatus
          id={row.original.id}
          status={row.getValue("status")}
          updateStatus={updateContract}
        />
      ),
    },
    {
      accessorKey: "id",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-4">
          <EditContractDialog
            contract={row.original}
            updateContract={updateContract}
          />
          <Button
            variant="destructive"
            onClick={() => {
              const deleteContract = async (deleteContract: Contract) => {
                const res = await fetch("/api/contracts", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(deleteContract),
                });
                if (res.ok) {
                  socket.emit("contract", {
                    updatedContract: deleteContract,
                    type: "delete",
                  });
                  setContracts((prevContracts: Contract[]) =>
                    prevContracts.filter(
                      (contract: Contract) => contract.id !== deleteContract.id
                    )
                  );
                }
              };
              deleteContract(row.original);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return columns;
};

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);

  const updateContract = async (
    updateContract: Partial<Contract>,
    id?: string
  ) => {
    const updatedContract = {
      ...contracts.find((contract) => contract.id === id),
      ...updateContract,
    } as Contract;

    await fetch("/api/contracts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContract),
    });
    setContracts((prevContracts: Contract[]) =>
      prevContracts.map((contract: Contract) =>
        contract.id === id ? updatedContract : contract
      )
    );
    socket.emit("contract", {
      updatedContract: updatedContract,
      type: "update",
    });
  };

  const fetchContracts = async () => {
    const res = await fetch("/api/contracts");
    const data = await res.json();
    setContracts(data.contracts);
  };

  useEffect(() => {
    fetchContracts();

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    function onContractUpdated(payload: any) {
      const { type, updatedContract } = payload;
      if (type === "add") {
        setContracts((prevContracts: Contract[]) => {
          if (
            !prevContracts.find(
              (contract: Contract) => contract.id === updatedContract.id
            )
          )
            return [...prevContracts, { ...updatedContract }];
          return prevContracts;
        });
      }
      if (type === "update") {
        setContracts((prevContracts: Contract[]) =>
          prevContracts.map((contract: Contract) =>
            contract.id === updatedContract?.id ? updatedContract : contract
          )
        );
      }
      if (type === "delete") {
        setContracts((prevContracts: Contract[]) =>
          prevContracts.filter(
            (contract: Contract) => contract.id !== updatedContract.id
          )
        );
      }
    }

    socket.on("connect", onConnect);
    socket.on("contract", onContractUpdated);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("contract", onContractUpdated);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const [isConnected, setIsConnected] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    setFilteredContracts(contracts);
  }, [contracts]);

  useEffect(() => {
    if (columnFilters.length > 0) {
      const filtered = contracts.filter((contract) => {
        return columnFilters.every((filter) => {
          const value = contract[filter.id as keyof Contract];
          return value === filter.value;
        });
      });
      setFilteredContracts(filtered);
    } else {
      setFilteredContracts(contracts);
    }
  }, [columnFilters, contracts]);

  return (
    <div className="flex flex-col gap-4 p-12 w-full">
      <div className="flex justify-between items-center">
        <h1>Contracts</h1>
        <NewContractDialog setContracts={setContracts} />
      </div>
      <DataTable
        columns={getTableColumns({ updateContract, setContracts })}
        data={filteredContracts}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
    </div>
  );
}
