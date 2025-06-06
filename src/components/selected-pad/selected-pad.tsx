import { Fragment } from "react";
import KeyBinding from "./key-binding/key-binding";
import LinkedFile from "./linked-file/linked-file";
import Loop from "./loop";
import Volume from "./volume";
import Reverb from "./reverb";
import Speed from "./speed";

export default function SelectedPad({ projectUuid }: { projectUuid: string }) {
  return (
    <Fragment>
      <LinkedFile projectUuid={projectUuid} />
      <KeyBinding projectUuid={projectUuid} />
      <Loop projectUuid={projectUuid} />
      <div className="space-y-6">
        <Volume projectUuid={projectUuid} />
        <Speed projectUuid={projectUuid} />
        <Reverb projectUuid={projectUuid} />
      </div>
    </Fragment>
  );
}
