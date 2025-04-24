type Library = {
  id: string;
  name: string;
};

type LibrarySelectorProps = {
  selectedLibrary: string;
  onLibraryChange: (value: string) => void;
  libraries: Library[];
};
