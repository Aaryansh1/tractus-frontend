/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { FilterIcon } from "lucide-react";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { ContractStatusDropdown } from "@/util/contract";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ColumnFiltersState } from "@tanstack/react-table";

const filterCategories = [
  {
    label: "Status",
    value: "status",
    options: ContractStatusDropdown,
  },
];

const Filter = ({
  columnFilters,
  defaultOpenedFilter = "status",
  setColumnFilters,
}: {
  columnFilters?: ColumnFiltersState;
  defaultOpenedFilter?: string;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
}) => {
  const [openedFilter, setOpenedFilter] = useState<string>(defaultOpenedFilter);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 gap-2 px-2 flex items-center w-fit">
          <span className="-mb-1">
            <FilterIcon />
          </span>
          {columnFilters && columnFilters.length > 0 ? (
            <span>Filter applied</span>
          ) : (
            <span>Filter</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-md:h-screen max-md:w-screen md:h-full md:w-max md:mt-0 p-0 rounded-lg translate-y-0"
      >
        <div className="justify-between p-4 gap-4 items-center flex">
          <h6>Filters</h6>
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="flex flex-col md:flex-row md:h-full h-fit xs:mb-12 md:mb-0 overflow-scroll md:overflow-visible">
          <div className="flex flex-col gap-1 h-auto text-left md:border-r bg-[#FCFCFD] px-4 py-2">
            <Fragment>
              {filterCategories.map((category, index) => {
                return (
                  <Button
                    variant={"ghost"}
                    key={index}
                    onClick={() => {
                      setOpenedFilter(category?.value);
                    }}
                    className={`${
                      openedFilter === category?.value
                        ? "text-primary bg-muted"
                        : " text-label hover:text-label"
                    } justify-between min-w-36 gap-4`}
                  >
                    <div className="flex gap-2">{category?.label}</div>
                  </Button>
                );
              })}
            </Fragment>
          </div>
          <div className="flex flex-col gap-2 mb-5 mt-2 h-60 min-w-40 max-w-screen-sm mx-4">
            <RadioGroup
              onValueChange={(value) => {
                if (setColumnFilters) {
                  setColumnFilters([{ id: "status", value }]);
                  if (value === "all") {
                    setColumnFilters([]);
                  }
                }
              }}
            >
              {ContractStatusDropdown.map((option, index) => {
                return (
                  <div
                    key={`${option.value}_${index}`}
                    className="flex gap-3 items-center text-[#535461] text-[15px] leading-[24px] font-[400]"
                  >
                    <RadioGroupItem value={option.value} />
                    <span className="font-normal">{option.label}</span>
                  </div>
                );
              })}
              <div className="flex gap-3 items-center text-[#535461] text-[15px] leading-[24px] font-[400]">
                <RadioGroupItem value={"all"} />
                <span className="font-normal">{"All"}</span>
              </div>
            </RadioGroup>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
