/* eslint-disable @typescript-eslint/no-explicit-any */
import { Contract, status } from "@/types/contracts";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

let contracts: Contract[] = [
  {
    id: "1",
    name: "Contract 1",
    status: status.In_Progress,
    clientName: "Client 1",
  },
  {
    id: "2",
    name: "Contract 2",
    status: status.Draft,
    clientName: "Client 2",
  },
];

export async function GET() {
  return NextResponse.json({ contracts });
}

export async function POST(req: { json: () => any }) {
  const body = await req.json();
  const newContract = { id: randomUUID(), ...body, status: status.Draft };
  contracts.push(newContract);
  return NextResponse.json(newContract, { status: 201 });
}

export async function PATCH(req: { json: () => any }) {
  const body = await req.json();
  const { id, ...updatedData } = body;

  contracts = contracts.map((contract) =>
    contract.id === id ? { ...contract, ...updatedData } : contract
  );
  return NextResponse.json({ message: "Contract updated" });
}

export async function DELETE(req: { json: () => any }) {
  const body = await req.json();
  const { id } = body;
  contracts = contracts.filter((contract) => contract.id !== id);
  return NextResponse.json({ message: "Contract deleted" });
}
