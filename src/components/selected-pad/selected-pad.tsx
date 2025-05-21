import { Fragment } from "react";
import KeyBinding from "./key-binding/key-binding";
import LinkedFile from "./linked-file/linked-file";
import Loop from "./loop";

export default function SelectedPad({ projectUuid }: { projectUuid: string }) {

  return (
    <Fragment>
      <LinkedFile projectUuid={projectUuid} />
      <KeyBinding projectUuid={projectUuid} />
      <Loop projectUuid={projectUuid} />
    </Fragment>
  );
}
