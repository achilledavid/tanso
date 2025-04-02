import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button/button";
import { Label } from "../ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePadSprite } from "@/lib/pad";
import { useSelectedPad } from "@/contexts/selected-pad";
import { useState } from "react";

const formSchema = z.object({
  startAt: z.string(),
  duration: z.string(),
})

export default function Sprite({ pad, projectUuid }: { pad: Pad, projectUuid: string }) {
  const queryClient = useQueryClient();
  const { selectPad } = useSelectedPad();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startAt: pad.startAt.toString(),
      duration: pad.duration.toString(),
    },
  })

  const updatePadMutation = useMutation({
    mutationFn: (values: { startAt: number; duration: number }) =>
      updatePadSprite(pad, values.startAt, values.duration, projectUuid),
    onSuccess: (updatedPad) => {
      queryClient.invalidateQueries({ queryKey: ['project-pads', projectUuid] }).then(() => {
        selectPad(updatedPad);
      });
      setOpen(false);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updatePadMutation.mutate({ startAt: parseInt(values.startAt), duration: parseInt(values.duration) });
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>sprite</Label>
      <div className="flex gap-2 items-center">
        {(pad.startAt !== 0 || pad.duration !== 0) ? <span>{pad.startAt} - {pad.duration}</span> : <span>default</span>}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary" className="w-fit ml-auto">manage</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>manage sprite</DialogTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="startAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>start at</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>duration</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">save</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
