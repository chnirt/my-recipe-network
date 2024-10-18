"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export default function NumberInput({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 0.1,
}: NumberInputProps) {
  const handleIncrease = () => {
    const newValue = Math.min(parseFloat((value + step).toFixed(2)), max);
    onChange(newValue);
  };

  const handleDecrease = () => {
    const newValue = Math.max(parseFloat((value - step).toFixed(2)), min);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Remove leading zeros
    newValue = newValue.replace(/^0+/, "");
    console.log("🚀 ~ handleInputChange ~ newValue:", newValue);

    // If the newValue is an empty string, set it to 0
    if (newValue === "") {
      onChange(0);
      return;
    }

    // Convert the cleaned string to a number
    const numericValue = parseFloat(newValue);
    console.log("🚀 ~ handleInputChange ~ numericValue:", numericValue);
    console.log(
      "🚀 ~ handleInputChange ~ !isNaN(numericValue):",
      !isNaN(numericValue),
    );
    console.log(
      "🚀 ~ handleInputChange ~  numericValue >= min:",
      numericValue >= min,
    );
    console.log(
      "🚀 ~ handleInputChange ~ numericValue <= max:",
      numericValue <= max,
    );
    if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
      console.log("🚀 ~ handleInputChange ~ numericValue:", numericValue);
      onChange(numericValue);
    }
  };

  return (
    <div className="flex">
      <Input
        id="number-input"
        type="number"
        value={value}
        onChange={handleInputChange}
        className="min-w-12 rounded-r-none border-r-0 text-center"
        min={min}
        max={max}
        step={step}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={value <= min}
        className="rounded-none px-2"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={value >= max}
        className="rounded-l-none px-2"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
