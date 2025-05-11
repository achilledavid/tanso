"use client"

import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyLink({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);
    const url = (typeof window !== 'undefined' ? window.location.origin : '') + value

    const copy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true)
    };


    return (
        <div className="flex items-center gap-2 w-full">
            <Input
                value={url}
                readOnly
            />
            <Button onClick={copy} size="iconMd" variant="ghost">
                {copied ? <Check /> : <Copy />}
            </Button>
        </div>
    )
}