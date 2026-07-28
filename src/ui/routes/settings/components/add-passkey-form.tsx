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
      <Input
        autoComplete="off"
        className="min-w-0 flex-1"
        label="New passkey name"
        name="name"
        placeholder="MacBook Touch ID"
        type="text"
      />
      <Button className="self-end" loading={isAddingPasskey} type="submit">
        Add passkey
      </Button>
    </form>
  );
}
