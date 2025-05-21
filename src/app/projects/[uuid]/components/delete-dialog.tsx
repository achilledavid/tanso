"use cleint"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button/button";
import { deleteProject } from "@/lib/project";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteDialog({ project }: { project: Project }) {
    const router = useRouter();

    const deleteMutation = useMutation({
        mutationFn: () => deleteProject(project.uuid),
        onSuccess: () => {
            router.push("/account/projects");
        },
    });

    function handleClick() {
        deleteMutation.mutate();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-fit ml-auto">Delete project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. this will permanently delete your project and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button size="sm" variant="ghost">Cancel</Button></AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button size="sm" variant="destructive" onClick={handleClick}>
                            {deleteMutation.isPending ? <Loader2 className="animate-spin" /> : "continue"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}