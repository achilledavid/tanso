"use client";

import { Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { Howl } from 'howler';
import { Fragment, useMemo, useState } from 'react';
import { Input } from "./ui/input";
import { useMutation } from '@tanstack/react-query';
import { PutBlobResult } from "@vercel/blob";
import { uploadFile } from "@/lib/files";

export default function Pad() {
    const [file, setFile] = useState<PutBlobResult | null>(null);

    const sound = useMemo(() => new Howl({
        src: [file?.url ?? '/sound.mp3'],
        volume: 1,
    }), [file]);

    const handleSoundPlay = () => {
        sound.stop();
        sound.play();
    };

    const uploadMutation = useMutation({
        mutationFn: uploadFile,
        onSuccess: (data: PutBlobResult) => {
            setFile(data);
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (!e.target.files) {
            throw new Error("No file selected");
        }

        const file = e.target.files[0];
        uploadMutation.mutate(file);
    };

    return (
        <Fragment>
            <Input type="file" onChange={handleFileChange} accept="audio/*" />
            <Button size="icon" onClick={handleSoundPlay} disabled={uploadMutation.isPending}>
                <Volume2 />
            </Button>
        </Fragment>
    )
}