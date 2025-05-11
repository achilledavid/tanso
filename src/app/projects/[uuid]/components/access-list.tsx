import { Button } from "@/components/ui/button/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addProjectAccess, getProjectAccess, removeProjectAccess } from "@/lib/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { Loader2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email("Email is invalid"),
})

export default function AccessList({ project }: { project: Project }) {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        },
    })

    const { data, isLoading } = useQuery({
        queryKey: ["project-access", project.uuid],
        queryFn: () => getProjectAccess(project.uuid),
    });

    const addMutation = useMutation({
        mutationFn: (email: string) => addProjectAccess(project.uuid, email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-access", project.uuid] })
            form.reset()
        },
        onError: () => {
            form.setError("email", { message: "An error has occured" })
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        addMutation.mutate(values.email);
    }

    return (
        <div className="flex flex-col gap-2">
            <Label>Members</Label>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 ">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input {...field} placeholder="email@domain.com" disabled={addMutation.isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" size="iconMd" disabled={addMutation.isPending}>
                        {addMutation.isPending ? <Loader2 className="animate-spin" /> : <UserPlus />}
                    </Button>
                </form>
            </Form>
            {(data && !isEmpty(data) && !isLoading) && (
                <ul className="flex flex-col gap-2 mt-2">
                    {data.map((access) => (
                        <Member key={access.userEmail} project={project} access={access} />
                    ))}
                </ul>
            )}
        </div>
    )
}

function Member({ project, access }: { project: Project, access: AccessAuthorized }) {
    const queryClient = useQueryClient();

    const removeMutation = useMutation({
        mutationFn: (email: string) => removeProjectAccess(project.uuid, email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-access", project.uuid] });
        },
    });

    const handleRemove = (email: string) => {
        removeMutation.mutate(email);
    };

    return (
        <li className="flex items-center justify-between">
            <span className="text-sm">{access.userEmail}</span>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemove(access.userEmail)}
                disabled={removeMutation.isPending}
            >
                {removeMutation.isPending ? <Loader2 className="animate-spin" /> : "Remove"}
            </Button>
        </li>
    )
}