/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { newContractSchema } from "@/util/schema/contract";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contract } from "@/types/contracts";
import { socket } from "@/util/socket";

const NewContractDialog = ({
  setContracts,
}: {
  setContracts: Dispatch<SetStateAction<Contract[]>>;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const createNewContract = async (newContract: Contract) => {
    const res = await fetch("/api/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContract),
    });
    const data = await res.json();
    setContracts((prevContracts: Contract[]) => [...prevContracts, data]);
    socket.emit("contract", { updatedContract: data, type: "add" });
    form.reset();
  };

  const form = useForm<z.infer<typeof newContractSchema>>({
    resolver: zodResolver(newContractSchema),
    defaultValues: {
      name: "",
      clientName: "",
    },
  });

  const handleSubmit = (e: any) => {
    setIsOpen(false);
    createNewContract(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-muted">New contract</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>New contract</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Contract name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="clientName">Client name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="ml-auto mt-4">
              <Button type="submit">Create contract</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewContractDialog;
