import { Button } from "@/components/ui/button/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { UpdateName } from "./update-name";
import DeleteDialog from "./delete-dialog";

export default function SettingsDialog({ project }: { project: Project }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="w-full">
                    <Settings />
                    Settings
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Project settings</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <UpdateName project={project} />
                    <DeleteDialog project={project} />
                </div>
            </DialogContent>
        </Dialog >
    )
}