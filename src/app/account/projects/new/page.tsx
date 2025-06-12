"use client"

import { Button } from "@/components/ui/button/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/lib/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListBlobResultBlob } from "@vercel/blob";
import { ArrowLeft, ArrowRight, Eye, EyeClosed, FilePlus2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ImportSounds from "./import-sounds";

const formSchema = z.object({
  projectName: z.string().min(2, "Project name must be at least 2 characters long").max(50, "Project name must be at most 50 characters long"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
})

export default function AccountNewProject() {
  const session = useSession();
  const user = session.data?.user
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedSounds, setSelectedSounds] = useState<ListBlobResultBlob[]>([]);
  const [soundDialogOpen, setSoundDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      isPublic: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["my-projects", user?.id] });
      form.reset();
      router.push(`/projects/${project.uuid}`);
    },
  });

  function handleAddSounds(files: ListBlobResultBlob[]) {
    const newSounds = files.filter(
      file => !selectedSounds.find(s => s.url === file.url)
    );
    const merged = [...selectedSounds, ...newSounds].slice(0, 16);
    setSelectedSounds(merged);
    setSoundDialogOpen(false);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return

    const sounds: { url: string, fileName: string }[] = selectedSounds.map(sound => ({
      url: sound.url,
      fileName: sound.pathname || sound.url,
    }));

    createMutation.mutate({
      userId: user.id,
      name: values.projectName,
      description: values.description ?? "",
      isPublic: values.isPublic,
      sounds
    });
  }

  if (!user) notFound();

  return (
    <div className="space-y-2">
      <Link href="/account/projects" className="flex items-center gap-2 text-sm min-h-[2.125rem] w-fit hover:underline">
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <h1 className='text-2xl font-semibold text-gray-100 font-["Deezer"] uppercase'>Project creation</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 max-w-[40rem]">
          <div className="space-y-2 dark">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. My Awesome Project" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value === true ? "public" : "private"}
                      onValueChange={val => field.onChange(val === "public")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <EyeClosed width={16} height={16} />
                            Private
                          </div>
                        </SelectItem>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Eye width={16} height={16} />
                            Public
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <div className="space-y-2">
              <FormLabel>Import sounds</FormLabel>
              <div className="flex items-center gap-2">
                <Input className="dark" readOnly value={selectedSounds.length ? `${selectedSounds.length} sounds selected` : "No sound selected"} />
                <Button
                  type="button"
                  size="iconMd"
                  className="w-fit"
                  onClick={() => setSoundDialogOpen(true)}
                  disabled={selectedSounds.length >= 16}
                >
                  <FilePlus2 size={18} />
                </Button>
              </div>
            </div>
          </div>

          <Dialog open={soundDialogOpen} onOpenChange={setSoundDialogOpen}>
            <DialogContent>
              <DialogTitle>Import sounds</DialogTitle>
              <ImportSounds username={user.username} onSubmit={handleAddSounds} />
            </DialogContent>
          </Dialog>

          <Button type="submit" size="sm" className="w-fit mt-6 ml-auto" disabled={createMutation.isPending}>
            Create this project
            {createMutation.isPending ? <Loader2 className="animate-spin" /> : <ArrowRight />}
          </Button>
        </form>
      </Form >
    </div>
  )
}
