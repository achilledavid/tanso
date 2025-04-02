"use client"

import { Fragment } from "react";
import KeyBinding from "./key-binding";
import LinkedFile from "./linked-file";
import Loop from "./loop";
import { useSelectedPad } from "@/contexts/selected-pad";
import Sprite from "./sprite";

export default function SelectedPad({ projectUuid }: { projectUuid: string }) {
  const { selectedPad } = useSelectedPad();

  if (!selectedPad) return;

  return (
    <Fragment>
      <LinkedFile pad={selectedPad} projectUuid={projectUuid} />
      <KeyBinding pad={selectedPad} projectUuid={projectUuid} />
      <Loop pad={selectedPad} projectUuid={projectUuid} />
      <Sprite pad={selectedPad} projectUuid={projectUuid} />
    </Fragment >
  );
}
