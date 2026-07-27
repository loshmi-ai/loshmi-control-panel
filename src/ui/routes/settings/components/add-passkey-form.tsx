import type { ComponentProps } from "react";

import { Button } from "@src/ui/components/designSystem/button";

type AddPasskeyFormProps = {
  isAddingPasskey: boolean;
  onAddPasskey: (name: string) => Promise<boolean>;
};

export function AddPasskeyForm({
  isAddingPasskey,
  onAddPasskey,
}: AddPasskeyFormProps) {
  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();

    if (await onAddPasskey(name)) {
      form.reset();
    }
  };

  return (
    <form className="mt-7 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <label className="min-w-0 flex-1">
        <span className="text-sm font-semibold">New passkey name</span>
        <input
          autoComplete="off"
          className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-gray-950"
          name="name"
          placeholder="MacBook Touch ID"
          type="text"
        />
      </label>
      <Button className="self-end" disabled={isAddingPasskey} type="submit">
        {isAddingPasskey ? "Adding..." : "Add passkey"}
      </Button>
    </form>
  );
}
