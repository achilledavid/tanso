"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_EFFECTS, reverseAudioBuffer, processAudioWithEffects, bufferToWave } from "@/lib/sound-editor";
import { Play, Save } from "lucide-react";

export function SoundEdit({ file, onSave }: SoundEditProps) {
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [fileName, setFileName] = useState(() => {
        const name = file.name.split('.')[0];
        return `${name}_edited`;
    });

    const [effects, setEffects] = useState<AudioEffects>(DEFAULT_EFFECTS);
    const playerRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        const ctx = new AudioContext();
        setAudioContext(ctx);

        const loadAudio = async () => {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const decoded = await ctx.decodeAudioData(arrayBuffer);
                setAudioBuffer(decoded);
            } catch (error) {
                console.error("Error decoding audio:", error);
            }
        };

        loadAudio();

        return () => {
            playerRef.current?.stop();
            ctx.close();
        };
    }, [file]);

    const updateEffect = (name: keyof AudioEffects, value: AudioEffects[keyof AudioEffects]) => {
        setEffects((prev: AudioEffects) => ({ ...prev, [name]: value }));
    };

    const updateNestedEffect = (parent: keyof AudioEffects, name: string, value: AudioEffects[keyof AudioEffects]) => {
        setEffects((prev: AudioEffects) => ({
            ...prev,
            [parent]: {
                ...(typeof prev[parent] === 'object' && prev[parent] !== null ? prev[parent] : {}),
                [name]: value
            }
        }));
    };

    const playSound = async () => {
        if (!audioContext || !audioBuffer) return;

        playerRef.current?.stop();

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();

        const processedBuffer = effects.reversed
            ? reverseAudioBuffer(audioContext, audioBuffer)
            : audioBuffer;

        source.buffer = processedBuffer;
        source.playbackRate.value = effects.speed;
        gainNode.gain.value = effects.volume;

        const lastNode: AudioNode = source;

        if (effects.echo.enabled) {
            const delay = audioContext.createDelay(2.0);
            delay.delayTime.value = effects.echo.delay;

            const feedback = audioContext.createGain();
            feedback.gain.value = effects.echo.feedback;

            lastNode.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);

            lastNode.connect(gainNode);
            delay.connect(gainNode);
        } else {
            lastNode.connect(gainNode);
        }

        gainNode.connect(audioContext.destination);

        source.start();
        playerRef.current = source;
    };

    const exportAudio = async () => {
        if (!audioBuffer || !audioContext) return;

        try {
            const renderedBuffer = await processAudioWithEffects(audioBuffer, effects);
            const wavBlob = bufferToWave(renderedBuffer);

            onSave(wavBlob, fileName);
        } catch (error) {
            console.error("Error export audio:", error);
        }
    };

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="filename">File name</Label>
                <Input
                    id="filename"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Filename"
                />
            </div>

            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Volume</Label>
                        <Slider
                            value={[effects.volume]}
                            min={0}
                            max={2}
                            step={0.01}
                            onValueChange={([v]) => updateEffect("volume", v)}
                        />
                        <div className="text-xs text-right">{effects.volume.toFixed(2)}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Speed</Label>
                        <Slider
                            value={[effects.speed]}
                            min={0.5}
                            max={2}
                            step={0.01}
                            onValueChange={([v]) => updateEffect("speed", v)}
                        />
                        <div className="text-xs text-right">{effects.speed.toFixed(2)}x</div>
                    </div>

                    <div className="flex items-center space-x-2 hover:bg-slate-50 rounded-sm p-2">
                        <Checkbox
                            id="reversed"
                            checked={effects.reversed}
                            onCheckedChange={(checked) => updateEffect("reversed", checked === true)}
                        />
                        <Label htmlFor="reversed" className="hover:cursor-pointer">Reverse sound</Label>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="echo-enabled"
                            checked={effects.echo.enabled}
                            onCheckedChange={(checked) => updateNestedEffect("echo", "enabled", checked)}
                        />
                        <Label htmlFor="echo-enabled">Reverb</Label>
                    </div>

                    {effects.echo.enabled && (
                        <>
                            <div className="space-y-2">
                                <Label>Delay</Label>
                                <Slider
                                    value={[effects.echo.delay]}
                                    min={0.1}
                                    max={1}
                                    step={0.01}
                                    onValueChange={([v]) => updateNestedEffect("echo", "delay", v)}
                                />
                                <div className="text-xs text-right">{effects.echo.delay.toFixed(2)}s</div>
                            </div>

                            <div className="space-y-2">
                                <Label>Intensity</Label>
                                <Slider
                                    value={[effects.echo.feedback]}
                                    min={0.1}
                                    max={0.9}
                                    step={0.01}
                                    onValueChange={([v]) => updateNestedEffect("echo", "feedback", v)}
                                />
                                <div className="text-xs text-right">{effects.echo.feedback.toFixed(2)}</div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-2 justify-end mt-6">
                <Button variant="default" size="icon" onClick={playSound}><Play /></Button>
                <Button variant="outline" size="icon" onClick={exportAudio}><Save /></Button>
            </div>
        </div>
    );
}