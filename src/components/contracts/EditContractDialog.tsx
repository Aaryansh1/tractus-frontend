"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { contractSchema } from "@/util/schema/contract";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contract } from "@/types/contracts";
import EditStatus from "./EditStatus";

const EditContractDialog = ({
  contract,
  updateContract,
}: {
  contract: Contract;
  updateContract: (
    updateContract: Partial<Contract>,
    id?: string
  ) => Promise<void> | void;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
    defaultValues: contract,
  });

  //Since the status is a dropdown, we need to handle the update status separately
  //And since it is being updated in a edit dialog, we need to update the status
  //in the form and emit the update to the server once the form is submitted

  const handleUpdateStatus = (updateContract: Partial<Contract>) => {
    if (updateContract.status) {
      form.setValue("status", updateContract.status);
    }
  };

  const handleSubmit = () => {
    setIsOpen(false);
    updateContract(form.getValues() as Contract, form.getValues("id"));
    console.log("submitting");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-muted">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit contract</DialogTitle>
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="status">Status</FormLabel>
                  <FormControl>
                    <EditStatus
                      id={form.getValues("id")}
                      status={field.value}
                      updateStatus={handleUpdateStatus}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="ml-auto mt-4">
              <Button type="submit">Update contract</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContractDialog;
