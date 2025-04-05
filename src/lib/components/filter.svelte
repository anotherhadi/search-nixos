<script lang="ts">
  import { CirclePlus, Check } from "@lucide/svelte";
  import { cn } from "$lib/utils.js";
  import * as Popover from "$lib/components/ui/popover";
  import * as Command from "$lib/components/ui/command";
  import Button from "$lib/components/ui/button/button.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  type Props = {
    title: string;
    selectedValues: string[];
    options: {
      label: string;
      value: string;
      // This should be `Component` after lucide-svelte updates types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon?: any;
    }[];
    onSend: () => void;
  };

  let {
    title,
    options,
    selectedValues = $bindable<string[]>([]),
    onSend,
  }: Props = $props();
</script>

<Popover.Root
  onOpenChange={(o) => {
    if (!o) {
      onSend();
    }
  }}
>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="sm" class="h-6 border-dashed">
        <CirclePlus />
        {title}
        {#if selectedValues.length > 0}
          <Separator orientation="vertical" class="mx-2 h-4" />
          {#each selectedValues as selectedValue}
            {#each options as option}
              {#if option.value === selectedValue}
                <Badge class="rounded-sm h-5 px-1 font-normal">
                  {option.label}
                </Badge>
              {/if}
            {/each}
          {/each}
        {/if}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0" align="start">
    <Command.Root>
      <Command.Input placeholder={title} />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group>
          {#each options as option}
            {@const isSelected = selectedValues.includes(option.value)}
            <Command.Item
              onSelect={() => {
                if (isSelected) {
                  selectedValues = selectedValues.filter(
                    (value) => value !== option.value,
                  );
                } else {
                  selectedValues = [...selectedValues, option.value];
                }
              }}
            >
              <div
                class={cn(
                  "border-primary mr-2 flex size-4 items-center justify-center rounded-sm border",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible",
                )}
              >
                <Check class="size-4" />
              </div>
              {#if option.icon}
                {@const Icon = option.icon}
                <Icon class="text-muted-foreground" />
              {/if}

              <span>{option.label}</span>
            </Command.Item>
          {/each}
        </Command.Group>
        {#if selectedValues.length > 0}
          <Command.Separator />
          <Command.Group>
            <Command.Item
              class="justify-center text-center"
              onSelect={() => {
                selectedValues = [];
              }}
            >
              Clear filters
            </Command.Item>
          </Command.Group>
        {/if}
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
