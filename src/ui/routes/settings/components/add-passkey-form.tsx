import type { ComponentProps } from "react";

import { Button } from "@src/ui/components/button";
import { Input } from "@src/ui/components/input";

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
    <form
      className="mt-7 flex flex-col gap-3 sm:flex-row"
      onSubmit={handleSubmit}
    >
      <label className="block min-w-0 flex-1">
        <span className="mb-2 block text-sm font-semibold text-white/82">
          New passkey name
        </span>
        <Input
          autoComplete="off"
          name="name"
          placeholder="MacBook Touch ID"
          type="text"
        />
      </label>
      <Button
        disabled={isAddingPasskey}
        loading={isAddingPasskey}
        type="submit"
      >
        {isAddingPasskey ? "Adding..." : "Add passkey"}
      </Button>
    </form>
  );
}
