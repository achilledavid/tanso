import { Fragment } from "react";
import KeyBinding from "./key-binding";
import LinkedFile from "./linked-file";

export default function SelectedPad({ projectUuid }: { projectUuid: string }) {

  return (
    <Fragment>
      <LinkedFile projectUuid={projectUuid} />
      <KeyBinding projectUuid={projectUuid} />
    </Fragment >
  );
}
