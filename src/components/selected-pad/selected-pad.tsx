import { Fragment } from "react";
import KeyBinding from "./key-binding";
import LinkedFile from "./linked-file";

export default function SelectedPad({ projectId }: { projectId: number }) {

  return (
    <Fragment>
      <LinkedFile projectId={projectId} />
      <KeyBinding projectId={projectId} />
    </Fragment >
  );
}