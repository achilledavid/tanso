"use client"

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setProjectPublic } from "@/lib/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeClosed, Loader2 } from "lucide-react";

export default function ProjectVisibility({ project }: { project: Project }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (isPublic: boolean) => setProjectPublic(project.uuid, isPublic),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project", project.uuid] });
        },
    });


    const handleValueChange = (visibility: string) => {
        const isPublic = visibility === 'public';
        mutation.mutate(isPublic);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="visibility">Visibility</Label>
            <div className="relative">
                <Select
                    disabled={mutation.isPending}
                    value={typeof project.isPublic === 'boolean' ? (project.isPublic ? 'public' : 'private') : 'private'}
                    onValueChange={handleValueChange}
                >
                    <SelectTrigger id="visibility" className="w-full">
                        <SelectValue placeholder="select visibility" />
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
                {mutation.isPending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>
        </div>
    )
}